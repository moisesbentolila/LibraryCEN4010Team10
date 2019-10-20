import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Button, Container, Dimmer, Icon, Image, Item, Label, Loader, Message, Segment, Accordion } from 'semantic-ui-react'
import { ProductListURL, addToCartURL } from '../constants'
import { authAxios } from '../utils'
import { fetchCart } from '../store/actions/cart'


class ProductList extends React.Component {
    state = {
        loading: false,
        error: null,
        data: [],
        activeIndex: 0
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }

    componentDidMount() {
        this.setState({ loading: true })
        axios.get(ProductListURL)
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

    render() {
        const { data, error, loading, activeIndex } = this.state
        return (
            <Container>
                {error && (
                    <Message
                        error
                        header='There were some errors with your submission'
                        content={JSON.stringify(error)}
                    />
                )}
                {loading && (
                    <Segment>
                        <Dimmer active inverted>
                            <Loader inverted>Loading</Loader>
                        </Dimmer>

                        <Image src='/images/wireframe/short-paragraph.png' />
                    </Segment>
                )}

                <Item.Group divided>
                    {data.map(item => {
                        return (<Item key={item.id}>
                            <Item.Image src={item.image} />
                            <Item.Content>
                                <Item.Header as='a'>{item.title}</Item.Header>
                                <Item.Meta>
                                    <span className='cinema'>{item.genre}</span>
                                </Item.Meta>
                                <Label color=
                                    {item.label === 'Fiction' ? "blue" : item.label === 'Non-Fiction' ?
                                        "red" : "olive"} >{item.label}
                                </Label>
                                {item.discount_price && (<Label color=
                                    {"green"} >DISCOUNTED</Label>)}
                                <Item.Description>
                                    <Accordion>
                                        <Accordion.Title
                                            active={activeIndex === item.id}
                                            index={item.id}
                                            onClick={this.handleClick}>
                                            <Icon name='dropdown' />
                                            Description
                                    </Accordion.Title>
                                        <Accordion.Content active={activeIndex === item.id}>
                                            <p>
                                                {item.description}
                                            </p>
                                        </Accordion.Content>
                                    </Accordion>

                                </Item.Description>
                                <Item.Extra>
                                    <Button primary floated='right' icon labelPosition='right' onClick={() => this.handleAddToCart(item.slug)}>
                                        ${item.price}
                                        <Icon name='plus cart' />
                                    </Button>
                                </Item.Extra>
                            </Item.Content>
                        </Item>)
                    })}
                </Item.Group>
            </Container>
        );
    }
}
// redirects to login page if session times out
const mapDispatchToProps = dispatch => {
    return {
        fetchCart: () => dispatch(fetchCart())
    }

}

export default connect(null, mapDispatchToProps)(ProductList)