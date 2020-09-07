/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/static-property-placement */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ApiContext from '../ApiContext';
import config from '../config';

import './AddFolder.css';

class AddFolder extends Component {
  static contextType = ApiContext;

  constructor(props) {
    super(props);
    this.state = {
      name: { value: '', touched: false }
    };
  }

  updateName(name) {
    this.setState({ name: { value: name, touched: true } });
  }

  validateName() {
    const { value, touched } = this.state.name;
    const { folders } = this.context;
    return (
      typeof value === 'string' &&
      value.length > 0 &&
      touched &&
      !folders.find(
        (folder) =>
          folder.name && folder.name.toLowerCase() === value.toLowerCase()
      )
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    const newFolder = JSON.stringify({ name: this.state.name.value });
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: newFolder
    };
    fetch(`${config.API_ENDPOINT}/folder`, options)
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      .then((res) => {
        this.context.addFolder(res);
        this.props.history.push('/');
      })
      .catch((error) => {
        console.error({ error });
      });
  }

  render() {
    return (
      <form className="add-folder-form" onSubmit={(e) => this.handleSubmit(e)}>
        <h2>Add New Folder</h2>
        <div className="add-folder-inputs">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            className="add-folder-name-input"
            name="name"
            id="name"
            onChange={(e) => this.updateName(e.target.value)}
          />
          <button
            disabled={!this.validateName()}
            type="submit"
            className="submit-new-folder"
          >
            Add
          </button>
        </div>
      </form>
    );
  }
}

export default withRouter(AddFolder);
