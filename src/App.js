import React, { useState, useEffect } from 'react'
import axios from 'axios'
import logo from './logo.svg';
import './App.css';
import Country from './components/Country'
import Note from './components/Note'
import Moi from './components/Moi'
import { render } from '@testing-library/react';

/* tehtävät 2.11-2.13
Lipun leveydeksi määritelty 200px. Lisäksi lipun ympärillä pieni kehikko.
Muutokset tehty tiedostossa App.js.
Hookeja on käytetty maiden talletamisess ja maiden nimien selaamisessa. 
Maat on tallennettu muuttujaan countries ja muuttujassa searchTerm maiden selauslyhenteet.
Komponentissa Country.js oli suuria ongelmia. Tarkoituksena oli kutsua 
komponenttia: <Country country={countries[maanumero]}/>. Tämä olisi 
palauttanut:
        <p>{country.name}</p>
        <p>{country.flag}</p>
        <img src={country.flag} alt="Flag" />
Tämä toimi joskus, mutta toisinaan kääntäjä ei hyväksynyt koodia.
Tein sitten sellaisen ratkaisun, että suodatetut maat tallennetaan muuttujaan: numberCountry.
Jos pituus numberCountry.length === 1, tallennetaan tiedot muuttujaan maakoe.
Maakoe renderöidään aina, mutta vain kun numberCoutry.length === 1 maakokeessa on sisältöä. 
En siis saanut: if (isLoggedIn) -valintaa toimimaan, mutta ohjelma kuitenkin toimii toivotusti tällä tavoin.
Tehtävä 2.13: Lisätään button maan nimeen perään. Buttoniin kirjoitetaan maan nimi.
Buttonia painettaessa funktiokutsussa välitetään maan nimi. Haetaan nimeä vastaava
countries-objekti ja vallennetaan muuttujaan maakoe. Päivitetään lisäkis setSearchTerm ja setSearchResults.
*/ 

function FilterShowName(props) {
  return(
    <div>
    filter shown with: <input
      onChange={props.handleNameSelection}
      />
  </div>
  )
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [persons, setPersons] = useState([])  
  const [countries, setCountry] = useState([])
  const [newCountry, setNewCountry] = useState('')
  const [newPerson, setNewPerson] = useState('')
  const [showAll, setShowAll] = useState(true)
  
  

  const handleNameSelection = (event) => {
    console.log('name selection')
    console.log(event.target.value)
    setSearchTerm(event.target.value);
    console.log('hakukriteeri:', searchTerm)
    console.log('lisItems:', listItems)
    const results = listItems.filter(name => name.includes(setSearchTerm)) 
    setSearchResults(results);
    console.log('result:', results)
  }

  useEffect(() => {    
    console.log('effect')    
    axios      
      .get('https://restcountries.eu/rest/v2/all')      
      .then(response => {        
        console.log('promise fulfilled')        
        setCountry(response.data)      
      }) 
  } ,[])

  
  console.log('render', countries.length, 'countries')
  const listItems = countries.map(country => country.name)
  console.log('list of countries',listItems)
  var numberCountry = listItems.filter(name => name.includes(searchTerm))
  console.log('numberCountry', numberCountry.length)
  var nimi = ''
  var maanumero = 0
  var maanimi = ''
  var maalippu = ''
  var maacapital = ''
  var isLoggedIn = false
  var maakoe = ''
  var tiedotmaasta = ''
  var maakieli = ''
  console.log("capital", countries[0])
  if (numberCountry.length === 1) {
    //alert(numberCountry[0])
    nimi = numberCountry[0]
    isLoggedIn = true
  }
  if (numberCountry.length === 1){
    let i = 0;
    let j = 0;
    var uusinimi = ''
    do {
      uusinimi = listItems[i]
      if (nimi === listItems[i]){
        maanumero = i
        maanimi = listItems[i]
        maakoe = countries[i] 
        tiedotmaasta = 'Tiedot maasta'   
          do {  
            maakieli = maakieli + " " + maakoe.languages[j].name
            j = j + 1;
          } while (j < maakoe.languages.length) 
      }  
      i = i + 1;
    } while (i < listItems.length)
  }

  const addCountry = (event) => {
    event.preventDefault()
    const countryObject = {
      content: newCountry,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
      id: countries.length + 1,
    }
    setCountry(countries.concat(countryObject))
    setNewCountry('')
  }

  const handleCountryChange = (event) => {
    console.log(event.target.value)
    setNewCountry(event.target.value)
  }

  function showCountryWithName(name) {
    let i = 0;
    let j = 0;
    var uusinimi = ''
    do {
      uusinimi = listItems[i]
      if (name === listItems[i]){
        maanumero = i
        maanimi = listItems[i]
        maakoe = countries[i] 
        tiedotmaasta = 'Tiedot maasta'   
          do {  
            maakieli = maakieli + " " + maakoe.languages[j].name
            j = j + 1;
          } while (j < maakoe.languages.length)
          numberCountry = ''
          numberCountry = maakoe
          numberCountry.length = 1
      }  
      i = i + 1;
    } while (i < listItems.length)
    //render()
    setSearchTerm(name)
    const results = listItems.filter(name => name.includes(setSearchTerm)) 
    setSearchResults(results);
  }

  const countriesToShow = showAll
    ? countries
    : countries.filter(country => country.important)

  return (
    <div>
      <h2>Number of countries: {numberCountry.length}</h2>
      <FilterShowName handleNameSelection = {handleNameSelection} />
      <div>
        {listItems.filter(name => name.includes(searchTerm)).map(filteredItem => (
          <li>
            {filteredItem}
              <button onClick={() => showCountryWithName(filteredItem)}>
                Click me {filteredItem}!
              </button>
          </li>
        ))}        
      </div>
          <p>{tiedotmaasta}</p>  
          <h1>{maakoe.name}</h1>
          <p>{maakoe.capital}</p>    
          <p>{maakoe.population}</p> 
          <p>{maakieli}</p> 
          <img src={maakoe.flag} alt="" />
    </div>
  );
}      

export default App;
