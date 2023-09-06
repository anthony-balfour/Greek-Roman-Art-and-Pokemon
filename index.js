/**
 * Name: Anthony Balfour
 * Date: 5/5/ 2023
 * Section: CSE 154 AF
 *
 * This javascript file, index.js, handles the functionality for fetching the
 * greek and roman art and a pokemon sprite/title.
 * The user presses the circle to fetch the Greek and Roman art. Handles functionality
 * for displaying an error message if there fetching either API results in an error
 */

"use strict";

(function() {

  const ART_URL = "https://collectionapi.metmuseum.org/public/collection/v1/";
  const ART = "search?q=Greek%20and%20Roman%20Art&isHighlight=true";
  const POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/";

  window.addEventListener("load", init);

  /**
   * Initializes event listeners on the Greek and Roman art button and the
   * Pokemon input field.
   * Greek/Roman Art: click event
   * Pokemon input: keypress("Enter" only)
   */
  function init() {
    let button = qs("button");
    button.addEventListener("click", fetchGreekRomanArt);
    let pokemonText = qs("input");
    pokemonText.addEventListener("keypress", processPokemonJson);
  }

  /**
   * Processes the fetch for Greek and Roman Art. Then, displays the art with the
   * title above it. Processes the functionality if there is a fetch error:
   * displays a message stating "Failed to load image. Try again"
   */
  function fetchGreekRomanArt() {
    fetch(ART_URL + ART)
      .then(statusCheck)
      .then(response => response.json())
      .then(processArtJson)
      .then(displayArtGreek)
      .catch(handleGreekError);
  }

  /**
   * Processes the fetch for the Greek and Roman Art. Randomly picks an art piece
   * from the list of returned art pieces. Displays the art piece with the title above it
   * @param {Promise} res - response object after fetching from the Greek and Roman API
   */
  function processArtJson(res) {
    clearHtml("greek-roman-art", "ga-title", "ga-error");
    let artIds = res.objectIDs; // this is an array of the ID's of the art pieces
    let artNum = Math.floor(Math.random() * artIds.length); // randomizing the artId index
    fetch(ART_URL + "objects/" + artIds[artNum])
      .then(statusCheck)
      .then(response => response.json())
      .then(displayArtGreek)
      .catch(console.error);
  }

  /**
   * Displays the Greek and Roman Art using information from the given JSON
   * @param {JSON} imageJson - JSON from the Greek and Roman Art API
   */
  function displayArtGreek(imageJson) {
    displayArt(imageJson, "ga-title", "ga-piece", "greek-roman-art");
  }

  /**
   * Displays the Greek and Roman Art using information from the given JSON
   * @param {JSON} imageJson - JSON for the loaded image
   * @param {String} primaryTitleId - title of the art piece
   * @param {String} primaryId - styling ID for the loaded art piece
   * @param {String} artContainer - art area
   */
  function displayArt(imageJson, primaryTitleId, primaryId, artContainer) {
    let art = generate("img");
    if (imageJson && (imageJson.primaryImage !== null || imageJson.primaryImage !== undefined)) {
      art.src = imageJson.primaryImage;
      art.alt = imageJson.title;
      art.id = primaryId;
      id(primaryTitleId).textContent = imageJson.title;
    }
    let artArea = id(artContainer);
    artArea.appendChild(art);
  }

  /**
   * If the Enter key is pressed, the Pokemon API is fetched.
   * @param {event} event - keypress event for input value
   */
  function processPokemonJson(event) {
    if (event.key === "Enter") {
      fetch(POKEMON_URL + this.value.toLowerCase())
        .then(statusCheck)
        .then(res => res.json())
        .then(displayPokemonPic)
        .catch(handlePokemonError);
    }
  }

  /**
   * Displays the Pokemon sprite processed from the image JSON
   * @param {Object} imageJson - JSON information for the fetched data
   * @param {String} primaryTitleId - title of the loaded image
   * @param {String} primaryId - styling id for the image
   * @param {String} artContainer - container for the art
   */
  function displaySprite(imageJson, primaryTitleId, primaryId, artContainer) {
    clearHtml("pokemon-title", "pokemon-pic", "pokemon-error");
    let art = generate("img");
    if (imageJson && (imageJson.sprites !== null || imageJson.sprites !== undefined)) {
      art.src = imageJson.sprites.front_default;
      art.alt = imageJson.name;
      art.id = primaryId;
      id(primaryTitleId).textContent = imageJson.name;
    }
    let artArea = id(artContainer);
    artArea.appendChild(art);
  }

  /**
   * Displays the Pokemon sprite
   * @param {Object} imageJson - image information from the JSON
   */
  function displayPokemonPic(imageJson) {
    displaySprite(imageJson, "pokemon-title", "ga-piece", "pokemon-pic");
  }

  /**
   * Processes the functionality for an error retrieving data from the Greek
   * and Roman API. Displays a message on the web page stating "Failed to get image. Click again"
   */
  function handleGreekError() {
    clearHtml("ga-title", "greek-roman-art", "ga-error");
    let errorMessage = generate("p");
    errorMessage.textContent = "Failed to get image. Click again";
    id("ga-error").appendChild(errorMessage);
  }

  /**
   * Processes the functionality if there is an error retrieving data from the Pokemon
   * API. Displays a message on the web page stating "That's not a Pokemon! Try again"
   */
  function handlePokemonError() {
    clearHtml("pokemon-title", "pokemon-pic", "pokemon-error");
    let errorMessage = generate("p");
    errorMessage.textContent = "That's not a Pokemon! Try again";
    id("pokemon-error").appendChild(errorMessage);
  }

  /**
   * Clears the innerHTML of the input parameters
   * @param {String} title - title container
   * @param {String} pic - pic container
   * @param {String} error - error container
   */
  function clearHtml(title, pic, error) {
    id(title).innerHTML = "";
    id(pic).innerHTML = "";
    id(error).innerHTML = "";
  }

  /**
   * Finds the element with the specified selector
   *
   * @param {String} selector - css selector
   * @returns {HTMLElement} DOM object associated with id.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Finds the element with the specified ID attribute.
   *
   * @param {string} id - element ID
   * @returns {HTMLElement} DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Generates a HTMLElement of the given type
   * @param {String} type - HTML element type
   * @return {HTMLElement} returns generated HTML element
   */
  function generate(type) {
    return document.createElement(type);
  }

  /**
   * Checks the status code of the fetched endpoint
   * @param {Promise} response - response Object from the endpoint
   * @return {Promise} -response Object from the endpoint
   * @throws API error
   */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

})();