import React, { Component } from 'react'
import Proptypes from 'prop-types'
import classnames from 'classnames'

class CreateForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputs: []
    }
  }

  componentWillMount() {
    let { labels } = this.props
    let { inputs } = this.state
    inputs = labels.map((label, index) => ({
      id: index,
      name: label.name,
      description: label.description,
      prenpend: label.prepend || null,
      value: label.value || '',
      type: label.type || 'text'
    }))
    this.setState({inputs})
  }

  handleChange = id => e => {
    let { inputs } = this.state
    inputs[id].value = e.target.value
    this.setState({inputs})
  }

  handleSubmit = e => {
    e.preventDefault()
    let { inputs } = this.state
    let output = {}
    inputs.forEach(input => {
      output[input.name] = input.value
    })
    this.props.onSubmit(output)
  }

  renderInput = input => {
    return (
      <div className="col" key={input.id}>
        <label className="sr-only" htmlFor={input.name}>{input.description}</label>
        <div className="input-group mb-2">
          {input.prepend && <div className="input-group-prepend">
            <div className="input-group-text">{input.prepend}</div>
          </div>}
          <input id={input.name} className="form-control" type={input.type} onChange={this.handleChange(input.id)} placeholder={input.description} value={input.value}/>
        </div>
      </div>
    )
  }

  render() {
    const { inputs } = this.state
    return (
      <form>
        <div className={classnames('form-row', 'align-items-center', {'justify-content-end': this.props.pullRight})}>
          {inputs.map(input => this.renderInput(input))}
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
  labels: Proptypes.array.isRequired,
  buttonLabel: Proptypes.string.isRequired,
  pullRight: Proptypes.bool.isRequired
}

CreateForm.defaultProps = {
  pullRight: false
}

export default CreateForm
