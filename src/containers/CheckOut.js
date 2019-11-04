import React, { Component } from 'react';
import { CardElement, injectStripe, Elements, StripeProvider } from 'react-stripe-elements';
import { Container, Button, Segment, Header, Step, Icon, Message, Placeholder, Item, Divider, Loader, Dimmer, Image, Form, Label } from 'semantic-ui-react'
import { authAxios } from '../utils';
import { orderSummaryURL, checkOutURL, addCouponURL } from '../constants'


const OrderPreview = (props) => {

    const { data } = props

    return (
        <React.Fragment>
            {data && (
                <React.Fragment>
                    <Item.Group relaxed>
                        {data.order_items.map((orderItem, i) => {
                            return (<Item key={orderItem.id}>
                                <Image size="tiny" src={`http://127.0.0.1:8000${orderItem.item_obj.image}`} />
                                <Item.Content>
                                    <Item.Header as='a'>{orderItem.item_obj.title}</Item.Header>
                                    <Item.Meta>
                                        Final Price: $ <span className='cinema'>{orderItem.final_price.toFixed(2)}</span>
                                        <br></br>
                                        Quantity: <span className='cinema'>{orderItem.quantity}</span>
                                    </Item.Meta>

                                    <Item.Description>

                                    </Item.Description>
                                    <Item.Extra>

                                    </Item.Extra>
                                </Item.Content>
                            </Item>)

                        })}
                    </Item.Group>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Label style={{ fontSize: "1.33em" }}>
                                    Order Total:
                                    $ {data.total.toFixed(2)}
                                </Label>
                                {data.coupon && <Label color='green' style={{ fontSize: "1.33em" }}>
                                    - ${data.coupon.amount}
                                </Label>}
                                {data.coupon &&
                                    <Message positive>
                                        <Message.Header>Your coupon is valid!</Message.Header>
                                    </Message>
                                }

                            </Item.Content>
                        </Item>
                    </Item.Group>
                </React.Fragment>)}
        </React.Fragment>


    )

}

class CouponForm extends Component {

    state = {
        code: ''
    }

    handleChange = e => {
        this.setState({
            code: e.target.value
        })
    }

    handleSubmit = (e) => {
        const { code } = this.state
        this.props.handleAddCoupon(e, code)
        this.setState({ code: '' })
    }

    render() {
        const { code } = this.state

        return (
            <React.Fragment>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field width={4}>
                        <label>Coupon code:</label>
                        <input placeholder='Enter a coupon code' value={code} onChange={this.handleChange} />
                    </Form.Field>
                    <Button type='submit'>Submit</Button>
                </Form >

            </React.Fragment>
        )
    }
}

class CheckoutForm extends Component {
    state = {
        data: null,
        loading: false,
        error: null,
        couponError: null,
        success: false,
        shipStep: true,
        billStep: false,
        confirmStep: false,
        couponValid: null,
    }

    componentDidMount() {
        this.handleFetchOrder()
    }

    handleFetchOrder = () => {
        this.setState({ loading: true })
        authAxios
            .get(orderSummaryURL)
            .then(res => {
                this.setState({ data: res.data, loading: false })
            })
            .catch(err => {
                if (err.response.status === 404) {
                    this.setState({
                        error: "You currently do not have an order",
                        loading: false
                    })
                }
                else {
                    this.setState({ error: err, loading: false })
                }
            })
    }

    handleAddCoupon = (e, code) => {
        e.preventDefault()
        this.setState({ loading: true })
        authAxios
            .post(addCouponURL, { code })
            .then(res => {
                this.setState({ loading: false, couponValid: null })
                this.handleFetchOrder()
            })
            .catch(err => {
                this.setState({ error: err, loading: false, couponValid: false })
            })
    }

    submit = ev => {
        ev.preventDefault()
        this.setState({ loading: true })
        if (this.props.stripe) {
            this.props.stripe.createToken().then(result => {
                if (result.error) {
                    this.setState({ error: result.error.message, loading: false })
                } else {
                    this.setState({ error: null })
                    authAxios
                        .post(checkOutURL, {
                            stripeToken: result.token.id
                        })
                        .then(res => {
                            this.setState({ loading: false, success: true })
                            // redirect the user
                        })
                        .catch(err => {
                            this.setState({ loading: false, error: err })
                        })
                }
            })
        } else {
            console.log("Stripe is not loaded");
        }
    }


    stepForward = () => {
        const { shipStep } = this.state
        const { billStep } = this.state

        if (shipStep === true) {
            this.setState({ shipStep: false })
            this.setState({ billStep: true })
        } else if (billStep === true) {
            this.setState({ billStep: false })
            this.setState({ confirmStep: true })
        }
    }

    stepBack = () => {
        const { billStep } = this.state
        const { confirmStep } = this.state

        if (billStep === true) {
            this.setState({ billStep: false })
            this.setState({ shipStep: true })
        } else if (confirmStep === true) {
            this.setState({ confirmStep: false })
            this.setState({ billStep: true })
        }
    }


    render() {
        const { data, error, loading, success, shipStep, billStep, confirmStep, couponValid } = this.state
        return (
            <div>
                {error && (
                    <Message
                        error
                        header="There was some errors with your submission"
                        content={JSON.stringify(error)}
                    />
                )}
                {loading && (
                    <Segment>
                        <Dimmer active inverted>
                            <Loader inverted>Loading</Loader>
                        </Dimmer>
                    </Segment>
                )}

                <Step.Group attached='top'>
                    <Step active={shipStep} disabled={!shipStep}>
                        <Icon name='truck' />
                        <Step.Content>
                            <Step.Title>Shipping</Step.Title>
                            <Step.Description>Choose your shipping options</Step.Description>
                        </Step.Content>
                    </Step>

                    <Step active={billStep} disabled={!billStep}>
                        <Icon name='payment' />
                        <Step.Content>
                            <Step.Title>Billing</Step.Title>
                            <Step.Description>Enter billing information</Step.Description>
                        </Step.Content>
                    </Step>

                    <Step active={confirmStep} disabled={!confirmStep}>
                        <Icon name='info' />
                        <Step.Content>
                            <Step.Title>Confirm Order</Step.Title>
                        </Step.Content>
                    </Step>
                </Step.Group>


                {shipStep ? (
                    <React.Fragment>
                        <Segment attached>
                            <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Header>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Paragraph>
                            </Placeholder>
                        </Segment>
                    </React.Fragment>

                ) : billStep ? (
                    <React.Fragment>
                        <Segment attached>
                            <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Header>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Paragraph>
                            </Placeholder>
                        </Segment>
                    </React.Fragment>

                ) : confirmStep ? (
                    <React.Fragment>
                        <Segment attached>

                            {/* IMPORTANT: This renders the order preview. Class located above*/}
                            <OrderPreview data={data} />

                            <CouponForm handleAddCoupon={(e, code) => this.handleAddCoupon(e, code)} />
                            {!couponValid && couponValid != null &&
                                <Message negative>
                                    <Message.Header>Your last entered coupon is invalid!</Message.Header>
                                </Message>
                            }

                            <Divider />

                            <Header>
                                Enter Card Information to Complete Purchase:
                            </Header>

                            <CardElement />
                            {error &&
                                <Message negative>
                                    <Message.Header>Your payment was unsuccessful!</Message.Header>
                                    <p>{JSON.stringify(error)}</p>
                                </Message>
                            }
                            {success &&
                                <Message positive>
                                    <Message.Header>Your payment was successful!</Message.Header>
                                    <p>
                                        Go to your <b>profile</b> to see the order delivery status.
                                    </p>
                                </Message>
                            }

                        </Segment>
                    </React.Fragment>) : null}

                <Segment Segment style={{ padding: "2em 0em" }} vertical >
                    {shipStep ? (
                        <React.Fragment>
                            <Button>Back</Button>
                            <Button onClick={this.stepForward}>Continue</Button>
                        </React.Fragment>
                    ) : billStep ? (
                        <React.Fragment>
                            <Button onClick={this.stepBack}>Back</Button>
                            <Button onClick={this.stepForward}>Continue</Button>
                        </React.Fragment>
                    ) : confirmStep ? (
                        <React.Fragment>
                            <Button onClick={this.stepBack}>Back</Button>
                            {/* disabled={loading} to prevent submitting payment twice */}
                            <Button color='yellow' loading={loading} disabled={loading} onClick={this.submit} style={{ marginTop: '10px' }} >
                                Submit Order
                            </Button>
                        </React.Fragment>) : null}
                </Segment>

            </div>
        )
    }
}

const InjectedForm = injectStripe(CheckoutForm)

const WarappedForm = () => (
    <Container >
        {/*segment padding for better page visibility*/}
        <Segment style={{ padding: "1em 0em" }} vertical>
            <Header as='h1'>
                Complete Your Order
            </Header>
        </Segment>

        <StripeProvider apiKey="pk_test_MipcN5hmhAUD39m6gsC8QB6h001DTO0Ajv">
            <div>
                <Elements>
                    <InjectedForm />
                </Elements>
            </div>
        </StripeProvider>

    </Container>
)
export default WarappedForm





