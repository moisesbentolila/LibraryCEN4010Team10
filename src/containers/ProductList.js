import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import {
    Button, Container, Icon, Item, Label, Message, Segment, Accordion, Header, Pagination,
    Grid, Divider, Popup, Form, Card, Modal, Image, Rating, Dropdown
} from 'semantic-ui-react'
import { ProductListURL, addToCartURL } from '../constants'
import { authAxios } from '../utils'
import { fetchCart } from '../store/actions/cart'


class ProductList extends React.Component {
    state = {
        loading: false,
        error: null,
        data: [], //note, value stored from response is res.data.results
        submittedItemsPerPage: 10,
        activePage: 1,
        totalPages: 1,
        defaultActivePage: 1,  //default activate page is #1
        itemsPerPage: 1,
        itemTotalCount: 1,

    }

    handleTotalPageCount = (totalProductsCount, itemsPerPage) => {
        //if item count divided by items per page has NO remainder



        if (totalProductsCount % itemsPerPage === 0) {

            const newPageCount = totalProductsCount / itemsPerPage
            this.setState({ totalPages: newPageCount })

        }
        //else, if item count divided by items per page has remainder, add 1
        else {
            const newPageCount = Math.floor(totalProductsCount / itemsPerPage) + 1
            this.setState({ totalPages: newPageCount })

        }
    }

    handlePaginationChange = (e, { activePage }) => {
        this.setState({ activePage })
        this.handleFetchProductList(activePage)
    }


    componentDidMount() {
        const { defaultActivePage } = this.state
        this.handleFetchProductList(defaultActivePage)
        this.hadleFetchItemsPerPage()
        this.hadleFetchItemTotalCount()
    }

    hadleFetchItemsPerPage = () => {
        this.setState({ loading: true })
        axios.get(ProductListURL(1))
            .then(res => {
                this.setState({ itemsPerPage: res.data.results.length, loading: false })
            })
            .catch(err => {
                this.setState({ error: err, loading: false })
            })
    }

    hadleFetchItemTotalCount = () => {
        this.setState({ loading: true })
        axios.get(ProductListURL(1))
            .then(res => {
                this.setState({ itemTotalCount: res.data.count, loading: false })
            })
            .catch(err => {
                this.setState({ error: err, loading: false })
            })
    }

    handleFetchProductList = pageNumber => {
        this.setState({ loading: true })
        const { itemsPerPage } = this.state

        axios.get(ProductListURL(pageNumber))
            .then(res => {
                this.handleTotalPageCount(res.data.count, itemsPerPage)
                this.setState({ data: res.data.results, loading: false })

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
                this.props.fetchCart()
                this.setState({ loading: false })
            })
            .catch(err => {
                this.setState({ error: err, loading: false })
            })
    }


    render() {
        const { data, error, loading, activePage,
            itemsPerPage, submittedItemsPerPage, totalPages } = this.state

        console.log(data)

        return (
            <Container>
                {/*segment padding for better page visibility*/}
                <Segment style={{ padding: "1em 0em" }} vertical>
                    <Header as='h1'>
                        Product List
                    </Header>
                </Segment>



                <Segment>
                    <h2>Browse books by:</h2>
                    <Button onClick={() => this.props.history.push(`/author-list/`)}>Author</Button>
                    <Button onClick={() => this.props.history.push(`/title-list/`)}>Title</Button>
                    <Button onClick={() => this.props.history.push(`/price-list/`)}>Price</Button>
                    <Button onClick={() => this.props.history.push(`/date-list/`)}>Release Date</Button>
                    <Button onClick={() => this.props.history.push(`/seller-list/`)} >
                        Bestsellers
                    </Button>
                    &emsp;&emsp;
                    <Dropdown text='Fiction'>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Action and adventure`)} text='Action and adventure ' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Alternate history`)} text='Alternate history' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Anthology`)} text='Anthology' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Childrens`)} text='Childrens' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Comic book`)} text='Comic book' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Crime`)} text='Crime' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Drama`)} text='Fairytale' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Fantasy`)} text='Fantasy' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Graphic novel`)} text='Graphic novel' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Historical fiction`)} text='Historical fiction' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Horror`)} text='Horror' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Mystery`)} text='Mystery' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Poetry`)} text='Poetry' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Political thriller`)} text='Political thriller' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Romance`)} text='Romance' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Science fiction`)} text='Science fiction' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Short story`)} text='Short story' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Suspense`)} text='Suspense' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Thriller`)} text='Thriller' />
                        </Dropdown.Menu>
                    </Dropdown>
                    &emsp;&emsp;
                    <Dropdown text='Non-Fiction'>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Art`)} text='Art' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Autobiography`)} text='Autobiography' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Biography`)} text='Biography' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Book review`)} text='Book review' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Cookbook`)} text='Cookbook' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Diary`)} text='Diary' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Encyclopedia`)} text='Encyclopedia' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Guide`)} text='Guide' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Health`)} text='Health' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/History`)} text='History' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Journal`)} text='Journal' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Math`)} text='Math' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Memoir`)} text='Memoir' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Religion, spirituality, and new age`)} text='Religion, spirituality, and new age' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Textbook`)} text='Textbook' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Review`)} text='Review' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Science`)} text='Science' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Self help`)} text='Self help' />
                            <Dropdown.Item onClick={() => this.props.history.push(`/genre-list/Travel`)} text='Travel' />
                        </Dropdown.Menu>
                    </Dropdown>
                    &emsp;&emsp;


                </Segment>



                {error && (
                    <Message
                        error
                        header='There were some errors with your submission'
                        content={JSON.stringify(error)}
                    />
                )}

                <Segment loading={loading}>
                    <Card.Group itemsPerRow={3}>
                        {data.map((item, i) => {

                            return (
                                < React.Fragment >
                                    <Card centered>

                                        <Image
                                            centered size='medium' src={item.image}
                                            onClick={() => this.props.history.push(`/products/${item.id}`)}
                                        />

                                        <Label attached='top right' color={item.label === 'Fiction' ? "blue" : "red"} >
                                            {item.label}
                                        </Label>
                                        <Card.Content>
                                            <Card.Header
                                                onClick={() => this.props.history.push(`/products/${item.id}`)}>
                                                {item.title}
                                            </Card.Header>
                                            <Card.Meta>
                                                <span className='cinema'>{item.genre}</span>
                                            </Card.Meta>
                                            <Card.Description>
                                                Written by {item.author_name}
                                            </Card.Description>
                                        </Card.Content>
                                        <Card.Content extra>
                                            <a>
                                                <Rating icon='star'
                                                    rating={item.avg_rating.rating__avg}
                                                    maxRating={10}
                                                    disabled />

                                                {/* With this notation, you’ll never run into Cannot read property ‘.rating__avg’ or '.avg_rating' of undefined. 
                                                    You basically check if object exists, if not, you create an empty object on the fly. This way, the next level key 
                                                    will always be accessed from an object that exists or an empty object, but never from undefined. */}

                                                {/* Show ratings if not null or NaN */}
                                                {((item || {}).avg_rating || {}).rating__avg && <Label color='white'>
                                                    {Number.parseFloat(((item || {}).avg_rating || {}).rating__avg).toFixed(2)}
                                                </Label>}
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
                                </React.Fragment>
                            )
                        })}
                    </Card.Group>
                </Segment>

                <Pagination
                    activePage={activePage}
                    onPageChange={this.handlePaginationChange}
                    totalPages={totalPages}
                />

                <Segment compact>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Input
                            label='Items per page'
                            name='submittedItemsPerPage'
                            onChange={this.handleChange}
                            value={submittedItemsPerPage}
                        />
                        <Form.Button content='Submit' />
                    </Form>
                </Segment>

            </Container >
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchCart: () => dispatch(fetchCart())
    }

}

export default connect(null, mapDispatchToProps)(ProductList)