import React from 'react'
import {graphql, useStaticQuery} from 'gatsby';
import Img from 'gatsby-image';
import {Box, Divider, Flex, Heading, Text, IconButton, useColorMode} from '@chakra-ui/react';
import DiseaseTracker from './DiseaseTracker';
import {SunIcon, MoonIcon} from '@chakra-ui/icons';


export default function Sidepanel({statistics, region, chart, disease, persebaran}) {
    const logo = useStaticQuery(graphql`
  query LogoSidepanel {
    logo: file(relativePath: {eq: "assets/tambakpintar.png"}) {
      id
      childImageSharp {
        fluid(maxWidth: 80) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
  `);

  

  const {colorMode, toggleColorMode} = useColorMode();

  
    return (
        <div>
            <Flex columns={3}>
            <Box p={4} m={5} mt={0} mb={0} mr={0} pb={0} w="100px">
          <Img fluid={logo.logo.childImageSharp.fluid} />
        </Box>
        <Box m={2} p={3} pb={0} flex="1">
        <Heading as="h3" size="md" mb={0}>Peta Persebaran</Heading>
                    <Heading as="h4" size="md" mb={2}>Penyakit Udang</Heading>
                    <Text>versi 0.0.6</Text>
        </Box>
        <Box mt={2} mr={2}>
        <IconButton aria-label="dark side" variant="ghost" icon={colorMode === 'light'? <MoonIcon/>:<SunIcon/>} onClick={toggleColorMode} size="sm"/>
        </Box>
            </Flex>
            
        
        <Divider orientation="horizontal" />
        
        <Box >
        <DiseaseTracker statistics={statistics} region={region} chart={chart} disease={disease} persebaran={persebaran} />
        </Box>
      </div>
    )

    
    
}




