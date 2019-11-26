import React from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'
import {
    Button, Container, Card, Rating, Icon, Image, Item, Label,
    Modal, Message, Segment, Header, Grid, Popup, Comment, Form
} from 'semantic-ui-react'
import { ProductDetailURL, addToCartURL, ItemCommentListURL } from '../constants'
import { authAxios } from '../utils'
import { fetchCart } from '../store/actions/cart'


class ProductDetail extends React.Component {
    state = {
        loading: false,
        error: null,
        data: [],
        comments: [],
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
                this.setState({ data: res.data, loading: false })
                //fetch the comments made about the item
                this.handleFetchItemComments(res.data.title)
            })
            .catch(err => {
                this.setState({ error: err, loading: false })
            })
    }

    handleFetchItemComments = bookTitle => {
        const { data } = this.state
        this.setState({ loading: true })
        axios
            //we loaded the item with handleFetchItem, now we get the title of the item from data.title
            .get(ItemCommentListURL(bookTitle))
            .then(res => {
                this.setState({ comments: res.data.results, loading: false })
            })
            .catch(err => {
                this.setState({ error: err })
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

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }



    render() {
        const { data, error, loading, comments } = this.state
        const item = data
        const userComments = comments
        const { match: { params } } = this.props
        console.log(comments)


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
                                        <Label attached='top right' color={item.label === 'Fiction' ? "blue" : "red"} >
                                            {item.label}
                                        </Label>
                                        <Card.Content>
                                            <Card.Header>{item.title} </Card.Header>
                                            <Card.Content extra
                                                onClick={() => this.props.history.push(`/genre-list/${item.genre}`)}>
                                                <a>
                                                    {item.genre}
                                                </a>
                                            </Card.Content>
                                            <Card.Description>
                                                <Card.Content extra
                                                    onClick={() => this.props.history.push(`/author-list/${item.author_name}`)}>
                                                    <a>
                                                        Written by {item.author_name}
                                                    </a>
                                                </Card.Content>
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


                                        <Card.Content extra>

                                            <font size="5">Browse more books by...</font>

                                        </Card.Content>

                                        <Card.Content extra
                                            onClick={() => this.props.history.push(`/author-list/${item.author_name}`)}>
                                            <a>
                                                <font size="4">Author</font>
                                            </a>
                                        </Card.Content>

                                        <Card.Content extra
                                            onClick={() => this.props.history.push(`/title-list/${item.title}`)}>
                                            <a>
                                                <font size="4">Title</font>
                                            </a>
                                        </Card.Content>

                                        <Card.Content extra
                                            onClick={() => this.props.history.push(`/price-list/${item.price}`)}>
                                            <a>
                                                <font size="4">Price</font>
                                            </a>
                                        </Card.Content>
                                    </Card>
                                </Grid.Column>

                                <Grid.Column width={10}>
                                    <Item.Content>
                                        <Header as='h1' color='blue'>Description</Header>
                                        <Item.Description>
                                            {item.description}
                                        </Item.Description>
                                        <Header as='h1' color='blue'>Author Biography</Header>
                                        <Item.Description>
                                            {item.author_bio}
                                        </Item.Description>
                                        <Header as='h1' color='blue'>Publisher</Header>
                                        <Item.Description>
                                            {item.publisher_info}
                                        </Item.Description>
                                    </Item.Content>
                                </Grid.Column>

                            </Grid.Row>
                        </Grid>

                    </Item>
                </Segment>
                {/* user comments */}
                <Segment>
                    <Comment.Group>
                        <Header as='h3' dividing>
                            Comments
                        </Header>

                        {userComments.map((item, i) => {
                            console.log(item.user)
                            return (
                                <Comment>
                                    <Comment.Avatar src='/images/avatar/small/matt.jpg' />
                                    <Comment.Content>
                                        <Comment.Author as='a'>{item.user}</Comment.Author>
                                        <Comment.Metadata>
                                            <div>{item.timestamp}</div>
                                        </Comment.Metadata>
                                        <Comment.Text>{item.content}</Comment.Text>
                                        <Comment.Actions>
                                            <Comment.Action>Reply</Comment.Action>
                                        </Comment.Actions>
                                    </Comment.Content>
                                </Comment>
                            )
                        })}


                        <Form reply>
                            <Form.TextArea />
                            <Button content='Add Reply' labelPosition='left' icon='edit' primary />
                        </Form>
                    </Comment.Group>
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