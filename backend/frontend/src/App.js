import React, { Component } from 'react';
import './App.css';
import AcronymList from './AcronymList';
import Datatable from './Datatable.js';
import '@elastic/eui/dist/eui_theme_light.css';


class App extends Component {


    render() {
        if (1) {
            return <Datatable />
        } else {
            return <AcronymList/>
        }
        
    }


}

export default App;

