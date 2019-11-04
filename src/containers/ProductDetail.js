import React from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'
import {
    Button, Container, Card, Rating, Icon, Image, Item, Label,
    Modal, Message, Segment, Header, Grid, Popup,
} from 'semantic-ui-react'
import { ProductDetailURL, addToCartURL } from '../constants'
import { authAxios } from '../utils'
import { fetchCart } from '../store/actions/cart'


class ProductDetail extends React.Component {
    state = {
        loading: false,
        error: null,
        data: [],
        activeIndex: 0
    }




    componentDidMount() {
        this.handleFetchItem()
    }

    handleFetchItem = () => {
        const { match: { params } } = this.props
        this.setState({ loading: true })
        axios.get(ProductDetailURL(params.productID))
            .then(res => {
                console.log(res.data)
                this.setState({ data: res.data, loading: false })
            })
            .catch(err => {
                this.setState({ error: err, loading: false })
            })
    }

    handleAddToCart = slug => {
        this.setState({ loading: true })
        authAxios
            .post(addToCartURL, { slug })
            .then(res => {
                console.log(res.data)
                this.props.fetchCart()
                this.setState({ loading: false })
            })
            .catch(err => {
                this.setState({ error: err, loading: false })
            })
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }



    render() {
        const { data, error, loading } = this.state
        const item = data

        return (
            <Container>
                {/*segment padding for better page visibility*/}
                <Segment style={{ padding: "1em 0em" }} vertical>
                    <Header as='h1'>
                        Product Details
                    </Header>
                </Segment>

                {error && (
                    <Message
                        error
                        header='There were some errors with your submission'
                        content={JSON.stringify(error)}
                    />
                )}

                <Segment loading={loading}>
                    <Item key={item.id}>
                        <Grid stackable columns={2}>
                            <Grid.Row >
                                <Grid.Column width={5}>
                                    <Card centered>
                                        <Modal trigger={<Image src={item.image} />}>
                                            <Segment>
                                                <Image centered size='huge' src={item.image} />
                                            </Segment>
                                        </Modal>
                                        <Card.Content>
                                            <Card.Header>{item.title} </Card.Header>
                                            <Card.Meta>
                                                <span className='cinema'>{item.genre}</span>
                                                <Label color={item.label === 'Fiction' ? "blue" : "red"} >
                                                    {item.label}
                                                </Label>
                                            </Card.Meta>
                                            <Card.Description>
                                                Written by John Doe
                                            </Card.Description>
                                        </Card.Content>
                                        <Card.Content extra>
                                            <a>
                                                <Rating icon='star' defaultRating={0} maxRating={10} />
                                                <br></br>Customer Reviews
                                            </a>
                                        </Card.Content>
                                        <Popup
                                            content='Item added!'
                                            on='click'
                                            hideOnScroll
                                            position='bottom center'
                                            trigger={
                                                <Button primary floated='right' icon labelPosition='right' onClick={() => this.handleAddToCart(item.slug)}>
                                                    {/* convert number from string to float, fix to 2 decimal places*/}
                                                    $ {Number.parseFloat(item.price).toFixed(2)}
                                                    <Icon name='plus cart' />
                                                </Button>}
                                        />
                                    </Card>
                                </Grid.Column>

                                <Grid.Column width={10}>
                                    <Item.Content>
                                        <Header as='h1' color='blue'>Description</Header>
                                        <Item.Description>
                                            {item.description}
                                        </Item.Description>

                                        <Header as='h1' color='blue'>Publisher</Header>
                                        <Item.Description>
                                            {item.description}
                                        </Item.Description>
                                    </Item.Content>
                                </Grid.Column>

                            </Grid.Row>
                        </Grid>

                    </Item>
                </Segment>


            </Container>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchCart: () => dispatch(fetchCart())
    }

}

export default withRouter(connect(null, mapDispatchToProps)(ProductDetail))