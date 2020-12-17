import React, {useRef, useState, useContext} from 'react';
import ReactMapGL, {Layer, Source, NavigationControl, FlyToInterpolator, Marker} from 'react-map-gl';
import {
    SimpleGrid,
    Box,
    Select,
    Heading,
    Flex,
    Text,
    Grid,
    useColorMode,
    Input,
    IconButton,
    ColorModeProvider
} from '@chakra-ui/core';
import useSupercluster from "use-supercluster";
import {clusterLayer, clusterCountLayer, unclusteredPointLayer, unclusterCountLayer} from '../layers/layers';
import '../styles/app.css';
import {graphql, useStaticQuery} from 'gatsby';
import DatePicker from "react-datepicker";
import {DiseaseContext} from '../pages/app';
import Img from 'gatsby-image';
import "react-datepicker/dist/react-datepicker.css";
import "mapbox-gl/dist/mapbox-gl.css"
import _ from "lodash";
import chroma from "chroma-js";

export default function Peta({points, samples, samplesData}) {
    const query = useStaticQuery(graphql `
  query mapbox {
    site {
        siteMetadata {
          airtableApi
          airtableBase
          mapboxApi
        }
      }
  logo: file(relativePath: {eq: "assets/tp-logo-landscape.png"}) {
      id
      childImageSharp {
        fixed(width: 85, height: 35) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    jala: file(relativePath: {eq: "assets/jala-white.png"}) {
        id
        childImageSharp {
          fixed(width: 75, height: 20) {
            ...GatsbyImageSharpFixed
          }
        }
      }
  }`);

    let districtLat = -7.650510;
    let districtLong = 109.375827;
    let mapZoom = 5;

    

    // const titik = Array.from(points.features);
    // console.log('titik terpilih', points);
    // const titiks = points.features;

    const [viewport,
        setViewport] = useState({
        latitude: -7.650510,
        longitude: 109.375827,
        zoom: 6,
        height: "100vh",
        bearing: 0,
        pitch: 0
    });

    const {setDistrict} = useContext(DiseaseContext);

    // console.log(`data sampel`, samplesData);

    const sourceRef = useRef();

    function _onViewportChange(viewport) {
        setViewport(viewport);
        // console.log(`goto = `, viewport);
    }

    const _goToViewport = (kec) => {
        // console.log('event', kec);
        if (!kec) {
            console.log('tidak ada data pada daerah tersebut');
            districtLong = 109.375827;
            districtLat = -7.650510;
            mapZoom = 6;
        } else {
            districtLong = kec.Longitude;
            districtLat = kec.Latitude;
            mapZoom = 11;
        }
        _onViewportChange({
            longitude: districtLong,
            latitude: districtLat,
            zoom: mapZoom,
            transitionInterpolator: new FlyToInterpolator({speed: 3}),
            transitionDuration: 'auto'
        });
        // console.log(`goto = `, latitude, longitude);
    };

    function _getZoom(clusterId){
        // console.log('feature event', e);
            const leaves = supercluster.getLeaves(clusterId);
        console.log('leaves', leaves);
        // const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(clusterId),12);
        _onViewportChange({
            ...viewport,
            latitude: leaves[0].geometry.coordinates[1],
            longitude: leaves[0].geometry.coordinates[0],
            zoom: 11,
            transitionInterpolator: new FlyToInterpolator({speed: 3}),
            transitionDuration: 'auto'
        });
        setDistrict(leaves[0].properties.fields.Kecamatan);
        // const klaster = clusters;
        
    }

    function _getZoomNonCluster(cluster){
        _onViewportChange({
            ...viewport,
            latitude: cluster.geometry.coordinates[1],
            longitude: cluster.geometry.coordinates[0],
            zoom: 11,
            transitionInterpolator: new FlyToInterpolator({speed: 3}),
            transitionDuration: 'auto'
        });
        setDistrict(cluster.properties.fields.Kecamatan);
    }

    function _getClusterLeaves(e) {
        // console.log('event', e.target.className)
        if (e.target.className === "overlays") {
            const feature = e.features[0];
            if (feature === undefined) {
                console.log('e ', e);
                // const fields = feature.properties.fields;
                console.log("not a cluster ");
            } else {
                const clusterId = feature.properties.cluster_id;
                const mapboxSource = sourceRef
                    .current
                    .getSource();
                mapboxSource.getClusterLeaves(clusterId, 100, 0, (error, features) => {
                    if (error) {
                        console.log('error', error);
                        return;
                    }
                    console.log('feature', features);
                    // _renderPopup(feature.geometry.coordinates[1],feature.geometry.coordinates[0],
                    // );
                });
                mapboxSource.getClusterExpansionZoom(clusterId, (error, zoom) => {
                    if (error) {
                        return;
                    }
                    console.log('zoom expand ', zoom);
                    _onViewportChange({
                        ...viewport,
                        longitude: feature.geometry.coordinates[0],
                        latitude: feature.geometry.coordinates[1],
                        zoom,
                        transitionDuration: 500
                    })
                });
            }
        }
    }

    function _getHover(e) {
        console.log('event hover', e.target.className)
        if (e.target.className === "overlays") {
            const feature = e.features[0];
            if (feature === undefined) {
                console.log('e ', e);
                // const fields = feature.properties.fields;
                console.log("not a cluster ");
            } else {
                const clusterId = feature.properties.cluster_id;
                const mapboxSource = sourceRef
                    .current
                    .getSource();
                mapboxSource.getClusterLeaves(clusterId, 100, 0, (error, features) => {
                    if (error) {
                        console.log('error', error);
                        return;
                    }
                    console.log('feature', features);
                    // _renderPopup(feature.geometry.coordinates[1],feature.geometry.coordinates[0],
                    // );
                });
            }
        }
    }

    function _getInterpolation(p){
        const color = chroma.scale(['78d271','ff9d0b','ff5b7e']).domain([0,5,10]);
        let per = 0;
        if(p >= 10){
            per = 10;
        }
        else{
            per = p;
        }

        return color(per);

    }



    //get map bounds
    const bounds = sourceRef.current ? sourceRef.current.getMap().getBounds().toArray().flat() : null;

    //get cluster
    const {clusters, supercluster} = useSupercluster({
        points,
        zoom: viewport.zoom,
        bounds,
        options: {radius: 20, maxZoom: 20}
    });

    // console.log('klaster',clusters);

    const {colorMode, toggleColorMode} = useColorMode();

    return (
        <Box>
            <Box display={{
                lg: "none"
            }}>
                
                <Flex align="center" justify="center">
                    <Box p={2} m={0} w="100px">
                        <Img fixed={query.logo.childImageSharp.fixed}/>
                    </Box>

                </Flex>
            </Box>
            <Box
                id="map"
                height={{
                lg: "100vh",
                md: "75vh",
                sm: "70vh",
                xs: "70vh"
            }}>
                <ReactMapGL
                    {...viewport}
                    maxZoom={20}
                    width="100%"
                    height="100%"
                    mapboxApiAccessToken={query.site.siteMetadata.mapboxApi}
                    onViewportChange={(viewport) => {
                    setViewport(viewport)}}
                    ref={sourceRef}
                    >
                         

{clusters.map(cluster => {
                        const [longitude, latitude] = cluster.geometry.coordinates;
                        const { cluster: isCluster, point_count : pointCount} = cluster.properties;

                        if(isCluster) {
                            return(
                                <Marker key={cluster.id} latitude={latitude} longitude={longitude}>
                                    <div className="cluster-marker" style={{background: `${_getInterpolation(pointCount)}`}}
                                onClick={() =>{ _getZoom(cluster.id);}}
                                >
                                        {pointCount}
                                    </div>
                                </Marker>
                            );
                        }

                        return(
                            <Marker key={cluster.properties.id} 
                        latitude={latitude} 
                        longitude={longitude}
                        >
                            <button className="icon-marker" onClick={() =>{_getZoomNonCluster(cluster)}} style={{background: `${_getInterpolation(1)}`}}>
                            1
                            </button>
                        </Marker>
                        )
                    })}


                    <div
                        style={{
                        position: 'absolute',
                        right: 0,
                        top: 100,
                        padding: '10px'
                    }}>
                        <NavigationControl/>
                    </div>

                    <Box m={2} style={{position: 'absolute',
                        left: 0,
                        top: 100
                    }}
                    display={{
                        lg: "none"
                    }}
                    className="basic-panel"
                        bg={colorMode === 'dark'
                        ? 'gray.800'
                        : 'white'}
                        p={1}>
                <IconButton aria-label="dark side" variant="ghost" icon={colorMode === 'light'? "moon":"sun"} onClick={toggleColorMode} size="md"/>
                </Box>

                    
                    <Box
                    
                        style={{
                        position: "absolute",
                        bottom: "0",
                        left: "100px"
                    }}
                        p={0}
                        mb={1}
                        ml={1}>
                        <a href="https://jala.tech" target="_blank" rel="noreferrer">
                            <Text color="white" fontSize="xs">powered by</Text>
                            <Img fixed={query.jala.childImageSharp.fixed}/>
                        </a>
                    </Box>

                    <DiseasePicker 
                        kecamatan={_.uniqBy(samples.map(s => ({Kecamatan: s.fields.Kecamatan, Latitude: s.fields.Lat, Longitude: s.fields.Long})), 'Kecamatan')}
                        onViewportChange={_goToViewport}/>

                   

                </ReactMapGL>

            </Box>
        </Box>

    )
}

function DiseasePicker({kecamatan, onViewportChange}) {
    const {
        disease,
        setDisease,
        district,
        setDistrict,
        startDate,
        setStartDate,
        endDate,
        setEndDate
    } = useContext(DiseaseContext);

    const {colorMode} = useColorMode();
    const CustomInput = React.forwardRef(({
        value,
        onClick
    }, ref) => {
        return (<Input sz="md" value={value} onClick={onClick} readOnly={true} ref={ref}/>)
    });

    // console.log('kecamatan',kecamatan);

    return (
        <Box style={{
            position: "relative",
            top: 0,
            left: 0
        }}>
            <Box
                display={{
                sm: "none",
                xs: "none",
                lg: "block"
            }}>
                <Flex
                    className="control-panel"
                    bg={colorMode === 'dark'
                    ? 'gray.800'
                    : 'white'}>
                    <Box mb={2} w="200px" mr={4}>
                        <Heading as="h4" size="xs" fontWeight={500} mb={2}>Pilih Daerah</Heading>
                        <Select
                            size="md"
                            value={district}
                            onChange={(e) => {
                            setDistrict(e.target.value)
                            onViewportChange(kecamatan.find(kec => e.target.value === kec.Kecamatan))}}>
                            <option value='Semua'>Semua Daerah</option>
                            {kecamatan.map(d => <option value={d.Kecamatan} key={d.Kecamatan}>{d.Kecamatan}</option>)}
                        </Select>
                    </Box>
                    <Box mb={2} w="200px" mr={4}>
                        <Heading as="h4" size="xs" fontWeight={500} mb={2}>Pilih Penyakit</Heading>
                        <Select
                            size="md"
                            value={disease}
                            onChange={(e) => {
                            setDisease(e.target.value)
                        }}>
                            {/* <option value='Semua Sampel'>Semua Sampel</option> */}
                            <option value='Semua Positif'>Semua Positif</option>
                            <option value='AHPND'>AHPND</option>
                            <option value='EHP'>EHP</option>
                            <option value='IMNV'>IMNV/Myo</option>
                            <option value='WSSV'>WSSV/Bintik Putih</option>
                        </Select>
                    </Box>

                    <Box mb={2} w="150px" mr={2}>
                        <Heading as="h4" size="xs" fontWeight={500} mb={2}>Tanggal Awal</Heading>
                        <DatePicker
                            closeOnScroll={true}
                            dateFormat="dd/MM/yyyy"
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            customInput={< CustomInput />}/>
                    </Box>

                    <Box mb={2} w="150px">
                        <Heading as="h4" size="xs" fontWeight={500} mb={2}>Tanggal Akhir</Heading>
                        <DatePicker
                            closeOnScroll={true}
                            dateFormat="dd/MM/yyyy"
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            customInput={< CustomInput />}/>
                    </Box>
                </Flex>
            </Box>
            <Box display={{
                lg: "none"
            }}>
                <SimpleGrid
                    columns={2}
                    spacing={2}
                    pr={{
                    xs: 4
                }}
                    pl={{
                    xs: 4
                }}
                    pt={{
                    xs: 0
                }}
                    pb={{
                    xs: 2
                }}
                    className="disease-filter-res"
                    bg={colorMode === 'dark'
                    ? 'gray.800'
                    : 'white'}>

                    <Box mb={2} w="100%">
                        <Heading as="h6" size="xs" mb={1}>Daerah</Heading>
                        <Select
                            p={1}
                            size="sm"
                            value={district}
                            onChange={(e) => {
                            setDistrict(e.target.value);
                            onViewportChange(kecamatan.find(kec => e.target.value === kec.Kecamatan))
                        }}>
                            <option value='Semua'>Semua Daerah</option>
                            {kecamatan.map(d => <option value={d.Kecamatan} key={d.Kecamatan}>{d.Kecamatan}</option>)}
                        </Select>
                    </Box>
                    <Box mb={2} w="100%">
                        <Heading as="h6" size="xs" mb={1}>Penyakit</Heading>
                        <Select
                            p={1}
                            size="sm"
                            value={disease}
                            onChange={(e) => {
                            setDisease(e.target.value)
                        }}>
                            {/* <option value='Semua Sampel'>Semua Sampel</option> */}
                            <option value='Semua Positif'>Semua Positif</option>
                            <option value='AHPND'>AHPND</option>
                            <option value='EHP'>EHP</option>
                            <option value='IMNV'>IMNV/Myo</option>
                            <option value='WSSV'>WSSV/Bintik Putih</option>
                        </Select>
                    </Box>
                </SimpleGrid>
            </Box>
        </Box>

    )

}