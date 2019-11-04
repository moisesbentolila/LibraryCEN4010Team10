import React from 'react'
import { Button, Container, Header, Icon, Label, Table, Image, Segment, Message } from 'semantic-ui-react'
import { authAxios } from '../utils'
import { orderSummaryURL, orderItemDeleteURL, addToCartURL, orderItemUpdateQuantityURL } from '../constants'
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { fetchCart } from '../store/actions/cart'


class OrderSummary extends React.Component {

    state = {
        data: null,
        error: null,
        loading: false
    }

    componentDidMount() {
        this.handleFetchOrder()
        this.props.fetchCart()
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

    handleAddToCart = slug => {
        this.setState({ loading: true })
        authAxios
            .post(addToCartURL, { slug })
            .then(res => {
                console.log(res.data)
                this.handleFetchOrder()
                this.setState({ loading: false })
            })
            .catch(err => {
                this.setState({ error: err, loading: false })
            })
    }


    handleRemoveQuantityFromCart = slug => {
        this.setState({ loading: true })
        authAxios
            .post(orderItemUpdateQuantityURL, { slug })
            .then(res => {
                //callback
                this.handleFetchOrder()
                this.props.fetchCart()
                this.setState({ loading: false })
            })
            .catch(err => {
                this.setState({ error: err })
            })

    }

    handleRemoveItem = itemID => {
        this.setState({ loading: true })
        authAxios.delete(orderItemDeleteURL(itemID))
            .then(res => {
                //callback
                this.handleFetchOrder()
                this.props.fetchCart()
                this.setState({ loading: false })
            })
            .catch(err => {
                this.setState({ error: err })
            })
    }

    render() {
        const { data, error, loading } = this.state
        const { isAuthenticated } = this.props
        if (!isAuthenticated) {
            return <Redirect to="/login" />;
        }
        console.log(data)



        return (
            <Container>
                {/*segment padding for better page visibility*/}
                <Segment style={{ padding: "1em 0em" }} vertical>
                    <Header as='h1'>
                        Order Summary
                   </Header>
                </Segment>

                {error && (
                    <Message
                        error
                        header="There was an error"
                        content={JSON.stringify(error)}
                    />
                )}

                <Segment loading={loading}>
                    {data && <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Item #</Table.HeaderCell>
                                <Table.HeaderCell>Item name</Table.HeaderCell>
                                <Table.HeaderCell>Item price</Table.HeaderCell>
                                <Table.HeaderCell>Item quantity</Table.HeaderCell>
                                <Table.HeaderCell>Total item price</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {data.order_items.map((orderItem, i) => {
                                return (
                                    <Table.Row key={orderItem.id}>
                                        <Table.Cell>
                                            {i + 1}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {orderItem.item_obj.title}
                                            <Image size="tiny" src={`http://127.0.0.1:8000${orderItem.item_obj.image}`} />
                                        </Table.Cell>
                                        <Table.Cell>
                                            {orderItem.item_obj.discount_price && <Label color='green' ribbon>DISCOUNT<br />PRICE<br />$ {orderItem.item_obj.discount_price.toFixed(2)}</Label>}<br />
                                            $ {orderItem.item_obj.price.toFixed(2)}
                                        </Table.Cell>
                                        <Table.Cell textAlign='center'>
                                            <Icon name='minus' color='red' style={{ float: 'left', cursor: 'pointer' }} onClick={() => this.handleRemoveQuantityFromCart(orderItem.item_obj.slug)} ></Icon>
                                            {orderItem.quantity}
                                            <Icon name='plus' color='green' style={{ float: 'right', cursor: 'pointer' }} onClick={() => this.handleAddToCart(orderItem.item_obj.slug)}></Icon>
                                        </Table.Cell>
                                        <Table.Cell>
                                            $ {orderItem.final_price.toFixed(2)}
                                            <Icon name='trash' color='red' style={{ float: 'right', cursor: 'pointer' }} onClick={() => this.handleRemoveItem(orderItem.id)}></Icon>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })}
                            <Table.Row>
                                <Table.Cell />
                                <Table.Cell />
                                <Table.Cell />
                                <Table.Cell colSpan='2' textAlign='center'>
                                    <Label style={{ fontSize: "1.33em" }}>
                                        Order Total: <br></br>
                                        {/* if there's no coupon applied, show regular price*/}
                                        $ {data.coupon == null && (data.total).toFixed(2)}
                                        {/* if there is a coupon applied, also show regular price*/}
                                        {data.coupon && (data.total + data.coupon.amount).toFixed(2)}
                                    </Label>
                                </Table.Cell>
                            </Table.Row>

                        </Table.Body>

                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan='5' textAlign='right'>
                                    <Link to='/checkout'>
                                        <Button color='yellow'>
                                            Checkout
                                    </Button>
                                    </Link>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>}
                </Segment>
            </Container >
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchCart: () => dispatch(fetchCart())
    }

}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderSummary);