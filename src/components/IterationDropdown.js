import React, { useState } from 'react';
import axios from 'axios';

const wsapiUrl = 'https://rally1.rallydev.com/slm/webservice/v2.0';
const workspace = 41529001;
const project = 332322441800;
const type = 'iteration';
const fetch = 'ObjectID'
const pagesize = 16;

const apiKey = process.env.REACT_APP_APIKEY;
const params = { workspace: `workspace/${workspace}`, 
                           query: `(((Project.ObjectID = ${project})AND(StartDate > 2019-12-31))AND(EndDate < 2021-02-08))`,
                           fetch: fetch,
                           pagesize: pagesize,
                           order: 'StartDate DESC'
                         };
const url = `${wsapiUrl}/${type}`;

function IterationDropdown({selectIteration}){
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [value, setValue] = useState("select iteration below")
    React.useEffect(() => {
        let unmounted = false;
        async function getIterations(){
            const headers = {
                'zsessionid': apiKey, 
                'Content-Type': 'application/json'
            }
            try {
                const response = await axios.get(url, {headers, params});
                const results = response.data['QueryResult']['Results'];
              if(!unmounted){
                setItems(
                  results.map(( item ) => ({ label: item._refObjectName, value: item.ObjectID}))
                );
                setLoading(false);
              }
            }catch(error){
              console.log(error);
            }
        }
        getIterations();
        return () => {
            unmounted = true;
        }
    }, []);
    return (
        <div>
          <select
            disabled={loading}
            value={value}
            onChange={e => {setValue(e.currentTarget.value); selectIteration(e.currentTarget.value)}}
          >
            {items.map(({label, value}) => (
                <option key={value} value={value}>
                {label}
                </option>
            ))}
          </select>
        </div>
    );
}

export default IterationDropdown;

