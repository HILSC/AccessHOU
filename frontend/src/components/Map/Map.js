import React, { Component, useState, useEffect } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import { mapPoints } from 'api';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import styles from './MapStyles';

import {
  BrowserView,
  MobileView,
  isMobile
} from "react-device-detect";

const useStyles = makeStyles(styles);

const mapStyles = {
  width: '100%',
  height: '100%'
};

function AgencyInfo(props) {

    var response = []

    const classes = useStyles();

    var verified = props.place.verified && !isMobile ?
        <span className={classes.verified}>HILSC Network Partner</span> : '';

    response.push(<h4 className={classes.title}><a className={classes.titleLink} href={'/agency/' + props.place.slug}>{props.place.name}</a> {verified}</h4>)

    if ( props.place.phone )
        response.push(<p className={classes.default}>{props.place.phone}</p>)

    if ( props.place.street && props.place.city && props.place.state && props.place.zip_code ) {
        var state = props.place.state.charAt(0).toUpperCase() + props.place.state.slice(1)
        response.push(<p className={classes.default}>{props.place.street} {props.place.city}, {state} {props.place.zip_code}</p>)
    }

    if ( props.place.website )
        response.push(<p className={classes.default}><a className={classes.link} href={props.place.website}>{props.place.website}</a></p>)

    if ( props.place.languages && !isMobile  ) {
        // console.log(props.place.languages);
        // var languages = JSON.parse(props.place.languages)
        for (const language of props.place.languages ) {
            response.push( <span className={classes.language}>{language}</span> )
        }
    }

    if ( props.place.programs && !isMobile  ) {
        response.push( <hr className={classes.break} /> )
        var programs = JSON.parse(props.place.programs)
        for (const program of programs ) {
            response.push( <p className={classes.default}><strong>{program.name}</strong></p> )
            response.push( <p className={classes.default2}>{program.description}</p> )
        }
    }

    return response

}

export class MapContainer extends Component {

    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
        markers: [],
    };

    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
    });

    onMouseOver = (props,marker,e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    };

    onMouseExit = (props,marker,e)  => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };

    onClose = props => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };

    componentDidMount() {
        mapPoints().then( map => {
            const markers = [];
            map.data.results.forEach((point) => {
                if ( point.geocode )
                    markers.push(point)
            });
            this.setState(state => ({ ...state, markers }))
          }).catch((err) => {
            console.log('Error loading map', err)
        })
    }

    render() {

        return (
            <Map
                google={this.props.google}
                zoom={10}
                style={mapStyles}
                initialCenter={
                  {
                    lat: 29.7768824,
                    lng: -95.3814799
                  }
              } >
              { this.state.markers.map( point =>
                  <Marker
                      // label={point.name}
                      // onMouseover={this.onMouseOver}
                      // onMouseout={this.onMouseExit}
                      onClick={this.onMarkerClick}
                      name={point.name}
                      website={point.website}
                      phone={point.phone}
                      street={point.street}
                      city={point.city}
                      state={point.state}
                      zip_code={point.zip_code}
                      slug={point.slug}
                      verified={point.verified}
                      languages={point.languages}
                      key={point.slug}
                      programs={JSON.stringify(point.programs)}
                      position={{ lat: point.geocode.latitude, lng: point.geocode.longitude }}
                  />
              )}
                  <InfoWindow
                      marker={this.state.activeMarker}
                      visible={this.state.showingInfoWindow}
                      onClose={this.onClose}
                  >
                    <AgencyInfo place={this.state.selectedPlace} />
                  </InfoWindow>
          </Map>
        )
    }

}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDDTrn0G_Q1l_MQTtAlpGSYo4_dZMkHz78'
})(MapContainer);
