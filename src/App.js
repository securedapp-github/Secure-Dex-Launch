import React, { useReducer, useState } from 'react';
import './App.css';

const formReducer = (state, event) => {
  if(event.reset) {
    return {
      token1Name: '',
      token1Address: '',
      token1Type: '',
      token2Name: '',
      token2Address: '',
      token2Type: '',
      uniswapV2Address: '',
      liquidityRatio: ''
    }
  }
 return {
   ...state,
   [event.name]: event.value
 }
}

function App() {
  const [formData, setFormData] = useReducer(formReducer, {});
  const [submitting, setSubmitting] = useState(false);
  const [entries, setEntries] = useState([]);

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitting(true);

    setEntries(entries => [...entries, formData]);

    setFormData({
      reset: true
    });

    setSubmitting(false);
  }

  const handleChange = event => {
   setFormData({
     name: event.target.name,
     value: event.target.value,
   })
 }

 return(
  <div className="wrapper">
    <h1>Token Information Form</h1>
    <div className="form-container">
      {entries && 
        <div className="entries-container">
        <h2>Submitted Entries:</h2>
        <ul>
          {entries.map((entry, index) => (
            <li key={index}>
              <ul>
                {Object.entries(entry).map(([name, value]) => (
                  <li key={name}><strong>{name}</strong>: {value.toString()}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      }

      <form onSubmit={handleSubmit}>
          <fieldset disabled={submitting}>
            <label>
              <p>Token 1 Name</p>
              <input name="token1Name" onChange={handleChange} value={formData.token1Name || ''}/>
            </label>
            <label>
              <p>Token 1 Contract Address</p>
              <input name="token1Address" onChange={handleChange} value={formData.token1Address || ''}/>
            </label>
            <label>
              <p>Token 1 Type</p>
              <select name="token1Type" onChange={handleChange} value={formData.token1Type || ''}>
                  <option value="">--Please choose an option--</option>
                  <option value="erc20">ERC20</option>
                  <option value="erc721">ERC721</option>
              </select>
            </label>
          </fieldset>

          <fieldset disabled={submitting}>
            <label>
              <p>Token 2 Name</p>
              <input name="token2Name" onChange={handleChange} value={formData.token2Name || ''}/>
            </label>
            <label>
              <p>Token 2 Contract Address</p>
              <input name="token2Address" onChange={handleChange} value={formData.token2Address || ''}/>
            </label>
            <label>
              <p>Token 2 Type</p>
              <select name="token2Type" onChange={handleChange} value={formData.token2Type || ''}>
                  <option value="">--Please choose an option--</option>
                  <option value="erc20">ERC20</option>
                  <option value="erc721">ERC721</option>
            </select>
          </label>

          <label>
            <p>Uniswap V2 Liquidity Provider Address</p>
            <input name="uniswapV2Address" onChange={handleChange} value={formData.uniswapV2Address || ''}/>
          </label>

          <label>
            <p>Liquidity Ratio</p>
            <input name="liquidityRatio" onChange={handleChange} value={formData.liquidityRatio || ''}/>
          </label>

        </fieldset>

        <button type="submit" disabled={submitting}>Submit</button>
      </form>
  </div>
</div>
  )
}

export default App;
