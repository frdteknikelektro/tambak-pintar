import React, {useContext, useState} from 'react'

import {
    SimpleGrid,
    Heading,
    Stat,
    Box,
    Text,
    Divider,
    Icon,
    IconButton,
    Select,
    Tag,
    TagLabel,
    HStack,
    useColorMode,
    Drawer,
    DrawerOverlay,
    DrawerHeader,
    DrawerBody,
    DrawerContent,
    useDisclosure,
    Spinner,
    Center
} from '@chakra-ui/react';
import {ArrowBackIcon} from '@chakra-ui/icons'

import _ from 'lodash';

import {DiseaseContext} from '../pages/app'
// import format from 'date-fns/format'
import PositiveTable from '../components/PositiveTable'
import SampleTable from '../components/SampleTable'
import ChartLine from '../components/Chart'

export default function DiseaseTracker({statistics, region, chart, disease, persebaran}) {

    const {regionId, diseaseId, setDiseaseId} = useContext(DiseaseContext);

    let kec = "";
    let kab = "";
    let prov = "";

    // console.log('statistik', statistics);

    const stats = statistics;
    const regionName = region;
    const persebaranData = persebaran;

    // console.log('persebaran', persebaranData);

    // console.log('region', regionName); console.log('statistik', stats);

    if (regionName) {
        kec = regionName.district_name;
        kab = regionName.regency_name;
        prov = regionName.province_name;
    }

    const {colorMode} = useColorMode();

    // console.log('total positif', stats.total_positive) console.log('stat',
    // stats);

    const {isOpen, onOpen, onClose} = useDisclosure();
    const [drawerData,
        setDrawerData] = useState('')

    const handleClick = (pos) => {
        setDrawerData(pos)
        onOpen()
    }

    return (
        <div >
            <SimpleGrid mt={{
                xl: 1
            }} pt={1}>
                {region && stats.total
                    ? <div>
                            <Box
                                m={{
                                md: 5,
                                sm: 5,
                                lg: 3,
                                base: 3
                            }}
                                p={{
                                sm: 0,
                                base: 1
                            }}>
                                {/* {console.log('total positive', stats.total_positive)} */}

                                <Box>
                                    <Heading as="h3" size="xl" mb={0}>{(regionId === "")
                                            ? "Indonesia"
                                            : `${kec !== null && kec !== undefined
                                                ? _.startCase(kec.toLowerCase()) + `, `
                                                : ""}` + `${kab !== null && kab !== undefined
                                                    ? _.startCase(kab.toLowerCase())
                                                    : prov !== undefined
                                                        ? _.startCase(prov.toLowerCase())
                                                        : 'memuat...'}`}</Heading>
                                    <Heading as="h4" size="md" mb={2}>{(regionId === "")
                                            ? ""
                                            : `${kab !== null && kab !== undefined
                                                ? _.startCase(prov.toLowerCase())
                                                : ""}`}</Heading>
                                </Box>

                                <Box
                                    display={{
                                    lg: "none"
                                }}>
                                    <Divider mb={4}/>
                                </Box>
                                <SimpleGrid columns={2} spacing={3}>
                                    <Box>
                                        <Text fontSize="md" color="gray.500" fontWeight={700}>Total Positif
                                        </Text>
                                        <Heading
                                            as="h3"
                                            size="xl"
                                            color="blue.400"
                                            onClick={() => handleClick('positif')}
                                            className="heading-button">
                                            <strong>{stats.total_positive}</strong>
                                        </Heading>

                                        <Text fontSize="sm" color="gray.500">
                                            {(stats.total_positive === 0)
                                                ? 0
                                                : ((stats.total_positive / stats.total) * 100).toFixed()}% Positif
                                        </Text>
                                    </Box>

                                    <Box>
                                        <Text fontSize="md" color="gray.500" fontWeight={700}>Total Sampel
                                        </Text>
                                        <Heading
                                            as="h3"
                                            size="xl"
                                            color="blue.400"
                                            onClick={() => handleClick('sampel')}
                                            className="heading-button">
                                            <strong>{stats.total}</strong>
                                        </Heading>
                                        <Text fontSize="sm" color="gray.500">
                                            dari {stats.total_ponds}{' '}
                                            kolam
                                        </Text>
                                    </Box>
                                </SimpleGrid>
                            </Box>

                            <Box
                                h="40px"
                                mr={0}
                                ml={0}
                                mb={2}
                                bg={colorMode === 'light'
                                ? "gray.100"
                                : "gray.700"}>
                                <Text fontSize="md" p={2} fontWeight={700} m={2}>Penyakit</Text>
                            </Box>
                            <Box className="overflow-tracker">
                                <SimpleGrid
                                    columns={2}
                                    spacing={3}
                                    m={{
                                    sm: 5,
                                    md: 5,
                                    lg: 3,
                                    base: 3
                                }}
                                    p={{
                                    sm: 0,
                                    base: 1
                                }}
                                    className="tracker-panel">
                                    <Box>
                                        <Stat>
                                            <Text fontSize="md" color="gray.500">AHPND
                                                <a
                                                    href="https://app.jala.tech/diseases/acute-hepatopancreatic-necrosis-disease"
                                                    target="_blank" rel="noreferrer">
                                                    {` `}<Icon focusable="true" name="question" size="14px" color="blue.400"/></a>
                                            </Text>
                                            <HStack>
                                                <Heading as="h3" size="xl">
                                                    <strong>{stats.total_disease_id_1_positive}</strong>
                                                </Heading>
                                                <Tag
                                                    size="md"
                                                    borderRadius="full"
                                                    variant="solid"
                                                    colorScheme={stats.last_week_total_disease_id_1_positive === 0
                                                    ? "gray"
                                                    : "red"}>
                                                    <TagLabel>+{stats.last_week_total_disease_id_1_positive}</TagLabel>
                                                </Tag>
                                            </HStack>
                                            <Text fontSize="sm" color="gray.500">
                                                {stats.total_disease_id_1}{' '}
                                                sampel
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {(stats.total_disease_id_1_positive === 0)
                                                    ? 0
                                                    : ((stats.total_disease_id_1_positive / stats.total_disease_id_1) * 100).toFixed()}% Positif
                                            </Text>
                                        </Stat>
                                    </Box>
                                    <Box>
                                        <Stat>
                                            <Text fontSize="md" color="gray.500">EHP
                                                <a
                                                    href="https://app.jala.tech/diseases/hepatopancreatic%20-microsporidiosis"
                                                    target="_blank" rel="noreferrer">
                                                    {` `}<Icon focusable="true" name="question" size="16px" color="blue.400"/></a>
                                            </Text>
                                            <HStack>
                                                <Heading as="h3" size="xl">
                                                    <strong>{stats.total_disease_id_6_positive}</strong>
                                                </Heading>
                                                <Tag
                                                    size="md"
                                                    borderRadius="full"
                                                    variant="solid"
                                                    colorScheme={stats.last_week_total_disease_id_6_positive === 0
                                                    ? "gray"
                                                    : "red"}>
                                                    <TagLabel>+{stats.last_week_total_disease_id_6_positive}</TagLabel>
                                                </Tag>
                                            </HStack>

                                            <Text fontSize="sm" color="gray.500">
                                                {stats.total_disease_id_6}{' '}
                                                sampel
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {(stats.total_disease_id_6_positive === 0)
                                                    ? 0
                                                    : ((stats.total_disease_id_6_positive / stats.total_disease_id_6) * 100).toFixed()}% Positif
                                            </Text>
                                        </Stat>
                                    </Box>
                                    <Box>
                                        <Stat>
                                            <Text fontSize="md" color="gray.500">IMNV/Myo
                                                <a
                                                    href="https://app.jala.tech/diseases/infectious-myonecrosis-virus"
                                                    target="_blank" rel="noreferrer">
                                                    {` `}<Icon focusable="true" name="question" size="16px" color="blue.400"/></a>
                                            </Text>
                                            <HStack>
                                                <Heading as="h3" size="xl">
                                                    <strong>{stats.total_disease_id_8_positive}</strong>
                                                </Heading>
                                                <Tag
                                                    size="md"
                                                    borderRadius="full"
                                                    variant="solid"
                                                    colorScheme={stats.last_week_total_disease_id_8_positive === 0
                                                    ? "gray"
                                                    : "red"}>
                                                    <TagLabel>+{stats.last_week_total_disease_id_8_positive}</TagLabel>
                                                </Tag>
                                            </HStack>
                                            <Text fontSize="sm" color="gray.500">
                                                {stats.total_disease_id_8}{' '}
                                                sampel
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {(stats.total_disease_id_8_positive === 0)
                                                    ? 0
                                                    : ((stats.total_disease_id_8_positive / stats.total_disease_id_8) * 100).toFixed()}% Positif
                                            </Text>
                                        </Stat>
                                    </Box>
                                    <Box>
                                        <Stat pr={1}>
                                            <Text fontSize="md" color="gray.500">WSSV/Bintik Putih
                                                <a href="https://app.jala.tech/diseases/white-spot-syndrome" target="_blank" rel="noreferrer">
                                                    {` `}<Icon focusable="true" name="question" size="16px" color="blue.400"/></a>
                                            </Text>
                                            <HStack>
                                                <Heading as="h3" size="xl">
                                                    <strong>{stats.total_disease_id_11_positive}</strong>
                                                </Heading>
                                                <Tag
                                                    size="md"
                                                    borderRadius="full"
                                                    variant="solid"
                                                    colorScheme={stats.last_week_total_disease_id_11_positive === 0
                                                    ? "gray"
                                                    : "red"}>
                                                    <TagLabel>+{stats.last_week_total_disease_id_11_positive}</TagLabel>
                                                </Tag>
                                            </HStack>
                                            <Text fontSize="sm" color="gray.500">
                                                {stats.total_disease_id_11}{' '}
                                                sampel
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {(stats.total_disease_id_11_positive === 0)
                                                    ? 0
                                                    : ((stats.total_disease_id_11_positive / stats.total_disease_id_11) * 100).toFixed()}% Positif
                                            </Text>
                                        </Stat>
                                    </Box>
                                </SimpleGrid>
                                <Box
                                    h="40px"
                                    mr={0}
                                    ml={0}
                                    mb={2}
                                    bg={colorMode === 'light'
                                    ? "gray.100"
                                    : "gray.700"}>
                                    <Text fontSize="md" p={2} fontWeight={700} m={2}>Trend Penyakit</Text>
                                </Box>
                                <Box
                                    m={{
                                    sm: 5,
                                    md: 5,
                                    lg: 3
                                }}
                                    p={{
                                    sm: 0,
                                    base: 1
                                }}>
                                    <Box mb={2} w="100%" mr={4}>
                                        <Select
                                            size="md"
                                            value={diseaseId}
                                            onChange={(e) => {
                                            setDiseaseId(e.target.value)
                                        }}>
                                            <option value=''>Semua Positif</option>
                                            <option value='1'>AHPND</option>
                                            <option value='6'>EHP</option>
                                            <option value='8'>IMNV/Myo</option>
                                            <option value='11'>WSSV/Bintik Putih</option>
                                        </Select>
                                    </Box>

                                    {/* <ChartData chart={chart}/> */}
                                    <ChartLine chart={chart}/>

                                </Box>
                            </Box>
                        </div>
                    : <Center w="100%" h={500}>
                        <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="blue.500"
                            size="xl"/>

                    </Center>}
            </SimpleGrid>

            {drawerData === "positif"
                ? <Drawer placement={"left"} onClose={onClose} isOpen={isOpen} size={"sm"}>
                        <DrawerOverlay>
                            <DrawerContent>
                                <DrawerHeader borderBottomWidth="1px">
                                    <Heading as="h2" size="4xl" fontSize={["2xl", "3xl", "3xl", "4xl"]}>
                                        <IconButton
                                        variant="unstyled"
                                        icon={< ArrowBackIcon w = {7} h = {7}
                    color = "blue.500" />} onClick={onClose}/>{' '}Persebaran Penyakit</Heading>
                                </DrawerHeader>
                                <DrawerBody>
                                    <Box mb={6}>
                                        <SimpleGrid columns={2} spacing={3}>
                                            <Box>
                                                <Text fontSize="md" color="gray.500" fontWeight={700}>Total Positif
                                                </Text>
                                                <Heading
                                                    as="h3"
                                                    size="xl">
                                                    <strong>{persebaranData.total_positive}</strong>
                                                </Heading>
                                            </Box>
                                            <Box>
                                                <Text fontSize="md" color="gray.500" fontWeight={700}>Presentase Positif
                                                </Text>
                                                <Heading
                                                    as="h3"
                                                    size="xl">
                                                    <strong>{(persebaranData.total_positive === 0)
                                                            ? 0
                                                            : ((persebaranData.total_positive / persebaranData.total) * 100).toFixed()}%</strong>
                                                </Heading>
                                            </Box>
                                        </SimpleGrid>
                                    </Box>
                                    <PositiveTable chart={chart} statistics={statistics} disease={disease} persebaran={persebaran} />
                                </DrawerBody>
                            </DrawerContent>
                        </DrawerOverlay>
                    </Drawer>
                : (persebaranData && <Drawer placement={"left"} onClose={onClose} isOpen={isOpen} size={"sm"}>
                    <DrawerOverlay>
                        <DrawerContent>
                            <DrawerHeader borderBottomWidth="1px"><Heading as="h2" size="4xl" fontSize={["2xl", "3xl", "3xl", "4xl"]}>
                                        <IconButton
                                        variant="unstyled"
                                        icon={< ArrowBackIcon w = {7} h = {7}
                    color = "blue.500" />} onClick={onClose}/>{' '}Persebaran Sampel</Heading></DrawerHeader>
                            <DrawerBody>
                            <Box mb={6}>
                                        <SimpleGrid columns={2} spacing={3}>
                                            <Box>
                                                <Text fontSize="md" color="gray.500" fontWeight={700}>Total Sampel
                                                </Text>
                                                <Heading
                                                    as="h3"
                                                    size="xl">
                                                    <strong>{persebaranData.total}</strong>
                                                </Heading>
                                            </Box>
                                            <Box>
                                                <Text fontSize="md" color="gray.500" fontWeight={700}>Kolam Sampel
                                                </Text>
                                                <Heading
                                                    as="h3"
                                                    size="xl">
                                                    <strong>{persebaranData.total_ponds}</strong>
                                                </Heading>
                                            </Box>
                                        </SimpleGrid>
                                    </Box>
                                    <SampleTable chart={chart} statistics={statistics} disease={disease} persebaran={persebaran} />
                            </DrawerBody>
                        </DrawerContent>
                    </DrawerOverlay> 
                </Drawer> )
}
        </div>
    );
}


