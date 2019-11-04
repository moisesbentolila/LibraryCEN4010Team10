import React from 'react'
import { Divider, Header, Grid, Menu, Container, Segment, Message, Select, Form } from 'semantic-ui-react'
import { addressListURL, addressCreateURL, countryListURL, userIDURL } from '../constants'
import { authAxios } from '../utils'
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class Profile extends React.Component {

    state = {
        activeItem: 'Billing Info',
        error: null,
        loading: false,
        addresses: [],
        countries: [],
        formData: { default: false },
        saving: false,
        success: false,
        userID: null
    }

    componentDidMount() {
        this.handleFetchAddresses()
        this.handleFetchCountries()
        this.handleFetchUserID()
    }

    // set success back to false when switching activeItem, resets messages displayed
    handleItemClick = (e, { name }) => this.setState({ activeItem: name, success: false })

    handleFormatCountries = countries => {
        const keys = Object.keys(countries)
        // map for each key
        return keys.map(k => {
            return {
                key: k,
                //what the user actually sees, the country name
                text: countries[k],
                //the country code k, the value we want to use when submitting data
                value: k
            }
        })
    }

    handleFetchUserID = () => {
        authAxios
            .get(userIDURL)
            .then(res => {
                this.setState({ userID: res.data.userID })
            })
            .catch(err => {
                this.setState({ error: err })
            })
    }

    handleFetchCountries = () => {
        authAxios
            .get(countryListURL)
            .then(res => {
                this.setState({ countries: this.handleFormatCountries(res.data) })
            })
            .catch(err => {
                this.setState({ error: err })
            })
    }

    handleFetchAddresses = () => {
        this.setState({ loading: true })
        authAxios
            .get(addressListURL)
            .then(res => {
                this.setState({ addresses: res.data, loading: false })
            })
            .catch(err => {
                this.setState({ error: err })
            })
    }

    handleSelectChange = (e, { name, value }) => {
        const { formData } = this.state
        const updatedFormData = {
            ...formData,
            [name]: value
        }
        this.setState({
            formData: updatedFormData
        })
    }

    handleToggleDefault = () => {
        const { formData } = this.state
        const updatedFormData = {
            ...formData,
            default: !formData.default
        }
        this.setState({
            formData: updatedFormData
        })
    }

    handleChange = e => {
        const { formData } = this.state
        const updatedFormData = {
            ...formData,
            [e.target.name]: e.target.value
        }
        this.setState({
            formData: updatedFormData
        })
    }

    handleCreateAddress = e => {
        this.setState({ saving: true })
        e.preventDefault()
        const { activeItem, formData, userID } = this.state
        authAxios
            .post(addressCreateURL, {
                ...formData,
                user: userID,
                address_type: activeItem === 'Billing Info' ? 'B' : 'S'
            })
            .then(res => {
                this.setState({ saving: false, success: true })
            })
            .catch(err => {
                this.setState({ error: err })
            })
        console.log(formData)
    }

    render() {
        const { activeItem, error, loading, addresses, countries, saving, success, formData } = this.state

        const { isAuthenticated } = this.props;
        if (!isAuthenticated) {
            return <Redirect to="/login" />;
        }

        return (
            <Container>
                {/*segment padding for better page visibility*/}
                <Segment style={{ padding: "1em 0em" }} vertical>
                    <Header as='h1'>
                        User Information
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

                    {/*                  <Grid.Row columns={1}>
                        <Grid.Column>
                            {addresses.map(a => {
                                return (
                                    <div>{a.street_address}</div>
                                )
                            })}

                        </Grid.Column>
                    </Grid.Row> */}

                    <Grid container columns={2} divided>
                        <Grid.Row>
                            <Grid.Column width={6}>
                                <Menu pointing vertical fluid>
                                    <Menu.Item
                                        name='User Credentials'
                                        active={activeItem === 'User Credentials'}
                                        onClick={this.handleItemClick}
                                    />
                                    <Menu.Item
                                        name='Personal Info'
                                        active={activeItem === 'Personal Info'}
                                        onClick={this.handleItemClick}
                                    />
                                    <Menu.Item
                                        name='Billing Info'
                                        active={activeItem === 'Billing Info'}
                                        onClick={this.handleItemClick}
                                    />
                                    <Menu.Item
                                        name='Shipping Info'
                                        active={activeItem === 'Shipping Info'}
                                        onClick={this.handleItemClick}
                                    />
                                </Menu>
                            </Grid.Column>

                            <Grid.Column width={10}>
                                <Header>{`Update your ${activeItem}`}</Header>
                                <Divider />
                                {
                                    activeItem === 'User Credentials' ?
                                        <Form>
                                            <Form.Input name='username'
                                                required
                                                placeholder='Username'
                                                onChange={this.handleChange} />
                                            <Form.Input name='password'
                                                required
                                                placeholder='Password'
                                                onChange={this.handleChange} />
                                        </Form>
                                        :
                                        activeItem === 'Personal Info' ?
                                            <Form>
                                                <Form.Input name='name'
                                                    required
                                                    placeholder='First and Last Name'
                                                    onChange={this.handleChange} />
                                                <Form.Input name='nickname'
                                                    required
                                                    placeholder='Nickname'
                                                    onChange={this.handleChange} />
                                                <Form.Input name='email'
                                                    required
                                                    placeholder='Email Address'
                                                    onChange={this.handleChange} />
                                                <Form.Input name='home_address'
                                                    required
                                                    placeholder='Home Address'
                                                    onChange={this.handleChange} />
                                            </Form>
                                            :
                                            activeItem === 'Billing Info' ?
                                                (
                                                    <Form
                                                        onSubmit={this.handleCreateAddress}
                                                        success={success}>
                                                        <Form.Input name='street_address'
                                                            required
                                                            placeholder='Street Address'
                                                            onChange={this.handleChange} />
                                                        <Form.Input name='apartment_address'
                                                            required
                                                            placeholder='Apartment Address'
                                                            onChange={this.handleChange}
                                                            value={formData.apartment_address} />
                                                        <Form.Input name='zip'
                                                            required
                                                            placeholder='Zip code'
                                                            onChange={this.handleChange} />

                                                        <Form.Field required>
                                                            {/* country select field */}
                                                            <Select name='country'
                                                                loading={countries.length < 1}
                                                                required
                                                                clearable
                                                                search
                                                                options={countries}
                                                                placeholder='Country'
                                                                //method specific to country change
                                                                onChange={this.handleSelectChange} />
                                                        </Form.Field>

                                                        <Form.Checkbox name='default'
                                                            label='Make default address'
                                                            onChange={this.handleToggleDefault} />

                                                        {success &&
                                                            <Message positive>
                                                                <Message.Header>Your billing information has been updated!</Message.Header>
                                                            </Message>}

                                                        <Form.Button
                                                            disabled={saving}
                                                            loading={saving}
                                                            primary>Save</Form.Button>

                                                    </Form>
                                                )
                                                :
                                                activeItem === 'Shipping Info' ?
                                                    (
                                                        <Form
                                                            onSubmit={this.handleCreateAddress}
                                                            success={success}>
                                                            <Form.Input name='street_address'
                                                                required
                                                                placeholder='Street Address'
                                                                onChange={this.handleChange} />
                                                            <Form.Input name='apartment_address'
                                                                required
                                                                placeholder='Apartment Address'
                                                                onChange={this.handleChange}
                                                                value={formData.apartment_address} />
                                                            <Form.Input name='zip'
                                                                required
                                                                placeholder='Zip code'
                                                                onChange={this.handleChange} />

                                                            <Form.Field required>
                                                                {/* country select field */}
                                                                <Select name='country'
                                                                    loading={countries.length < 1}
                                                                    required
                                                                    clearable
                                                                    search
                                                                    options={countries}
                                                                    placeholder='Country'
                                                                    //method specific to country change
                                                                    onChange={this.handleSelectChange} />
                                                            </Form.Field>

                                                            <Form.Checkbox name='default'
                                                                label='Make default address'
                                                                onChange={this.handleToggleDefault} />

                                                            {success &&
                                                                <Message positive>
                                                                    <Message.Header>Your shipping information has been updated!</Message.Header>
                                                                </Message>}

                                                            <Form.Button
                                                                disabled={saving}
                                                                loading={saving}
                                                                primary>Save</Form.Button>
                                                        </Form>
                                                    )
                                                    : null
                                }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    };
};

export default connect(mapStateToProps)(Profile);
