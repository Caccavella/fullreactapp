import React, { Component } from 'react'
import './Private.css';
import {connect} from 'react-redux';
import {getUserInfo} from '../../ducks/user_reducer'

class Private extends Component{
    render() {
        console.log(this.props.user);
        return(
            <div>
                <h1>Private</h1>
                <h2>This is a test</h2>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        user: state.user
    }
}
let outputActions = {
    getUserInfo: getUserInfo
}

export default connect(mapStateToProps, outputActions)(Private);