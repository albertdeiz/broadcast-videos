import React, { Component } from 'react'
import Proptypes from 'prop-types'
import classnames from 'classnames'

class CreateForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: ''
    }
  }

  handleChange = e => {
    this.setState({inputValue: e.target.value})
  }

  handleSubmit = e => {
    e.preventDefault()
    this.setState({inputValue: ''})
    this.props.onSubmit(this.state.inputValue)
  }

  render() {
    return (
      <form>
        <div className={classnames('form-row', 'align-items-center', {'justify-content-end': this.props.pullRight})}>
          <div className="col">
            <label className="sr-only" htmlFor="name">{this.props.label}</label>
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text">{this.props.prependLabel}</div>
              </div>
              <input onChange={this.handleChange} type="text" className="form-control" id="name" placeholder={this.props.label} value={this.state.inputValue}/>
            </div>
          </div>
          <div className="col-auto">
            <button onClick={this.handleSubmit} type="submit" className="btn btn-primary mb-2">{this.props.buttonLabel}</button>
          </div>
        </div>
      </form>
    )
  }
}

CreateForm.proptypes = {
  onSubmit: Proptypes.func.isRequired,
  label: Proptypes.string.isRequired,
  prependLabel: Proptypes.string.isRequired,
  buttonLabel: Proptypes.string.isRequired,
  pullRight: Proptypes.bool.isRequired
}

CreateForm.defaultProps = {
  pullRight: false
}

export default CreateForm
