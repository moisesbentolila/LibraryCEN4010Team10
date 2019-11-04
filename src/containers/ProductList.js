import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import {
    Button, Container, Icon, Item, Label, Message, Segment, Accordion, Header, Pagination,
    Grid, Divider, Popup
} from 'semantic-ui-react'
import { ProductListURL, addToCartURL } from '../constants'
import { authAxios } from '../utils'
import { fetchCart } from '../store/actions/cart'


class ProductList extends React.Component {
    state = {
        loading: false,
        error: null,
        data: [],
        activeIndex: 0,
        itemsPerPage: 10,
        activePage: 1,
        totalPages: 10,
    }

    handlePaginationChange = (e, { activePage }) => this.setState({ activePage })

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
        const { data, error, loading, activeIndex, activePage, itemsPerPage } = this.state

        //if item count divided by items per page has NO remainder
        if (data.length % itemsPerPage === 0) {
            this.totalPages = data.length / itemsPerPage
        }
        //else, if item count divided by items per page has remainder, add 1
        else {
            this.totalPages = Math.floor(data.length / itemsPerPage) + 1
        }

        // slice the data into 2 halfs, one for each columnm, example, 
        //page 2 is 10-20, page 3 is 20-30
        const items = data.slice(
            (activePage - 1) * itemsPerPage,
            (activePage - 1) * itemsPerPage + itemsPerPage
        )

        return (
            <Container>
                {/*segment padding for better page visibility*/}
                <Segment style={{ padding: "1em 0em" }} vertical>
                    <Header as='h1'>
                        Product List
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
                    <Grid columns={2} relaxed='very'>
                        <Grid.Column>
                            <Item.Group divided>
                                {items.map((item, i) => {
                                    // sort by odd index; odd items are placed inside left column
                                    if ((i % 2) === 0) {
                                        return (<Item key={item.id}>
                                            <Item.Image src={item.image} />
                                            <Item.Content>
                                                <Item.Header as='a'
                                                    onClick={() => this.props.history.push(`/products/${item.id}`)}>
                                                    {item.title}
                                                </Item.Header>
                                                <Item.Meta>
                                                    <span className='cinema'>{item.genre}</span>
                                                </Item.Meta>
                                                <Label color={item.label === 'Fiction' ? "blue" : "red"} >
                                                    {item.label}
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
                                                    <Popup
                                                        content='Item added!'
                                                        on='click'
                                                        hideOnScroll
                                                        position='top center'
                                                        trigger={
                                                            <Button primary floated='right' icon labelPosition='right' onClick={() => this.handleAddToCart(item.slug)}>
                                                                $ {item.price.toFixed(2)}
                                                                <Icon name='plus cart' />
                                                            </Button>}
                                                    />
                                                </Item.Extra>
                                            </Item.Content>
                                        </Item>)
                                    }
                                })}
                            </Item.Group>
                        </Grid.Column>

                        <Grid.Column>
                            <Item.Group divided>
                                {items.map((item, i) => {
                                    // sort by even index; even items are placed inside right column
                                    if ((i % 2) > 0) {
                                        return (<Item key={item.id}>
                                            <Item.Image src={item.image} />
                                            <Item.Content>
                                                <Item.Header as='a'
                                                    onClick={() => this.props.history.push(`/products/${item.id}`)}>
                                                    {item.title}
                                                </Item.Header>
                                                <Item.Meta>
                                                    <span className='cinema'>{item.genre}</span>
                                                </Item.Meta>
                                                <Label color={item.label === 'Fiction' ? "blue" : "red"} >
                                                    {item.label}
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
                                                    <Popup
                                                        content='Item added!'
                                                        on='click'
                                                        hideOnScroll
                                                        position='top center'
                                                        trigger={
                                                            <Button primary floated='right' icon labelPosition='right' onClick={() => this.handleAddToCart(item.slug)}>
                                                                $ {item.price.toFixed(2)}
                                                                <Icon name='plus cart' />
                                                            </Button>}
                                                    />
                                                </Item.Extra>
                                            </Item.Content>
                                        </Item>)
                                    }

                                })}
                            </Item.Group>
                        </Grid.Column>
                    </Grid>

                    <Divider vertical>And</Divider>
                </Segment>

                <Pagination
                    activePage={activePage}
                    onPageChange={this.handlePaginationChange}
                    totalPages={this.totalPages}
                />
            </Container>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchCart: () => dispatch(fetchCart())
    }

}

export default connect(null, mapDispatchToProps)(ProductList)