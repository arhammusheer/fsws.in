import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  useColorMode,
} from "@chakra-ui/react";
import { content } from "../content/content";

function getLgColumns(count: number) {
  if (count === 3) return 3;
  if (count === 4) return 4;
  if (count === 5) return 3;
  if (count === 6) return 3;
  if (count === 7) return 4;
  if (count === 8) return 4;
  if (count === 9) return 3;
  if (count === 10) return 4;
  return 4; // default fallback
}

export const ClientsSection = ({ id }: { id: string }) => {
  const { clientsSection } = content;
  const headingColor = "brand.600";
  const clientCount = clientsSection.clients.length;
  const lgColumns = getLgColumns(clientCount);

  return (
    <Box as="section" py={16} px={8} id={id} w="full">
      <Container maxW="container.xl" w="full">
        <Heading as="h2" size="xl" mb={8} color={headingColor}>
          {clientsSection.title}
        </Heading>
        <Grid
          templateColumns={{
            base: "repeat(2, 1fr)",
            lg: `repeat(${lgColumns}, 1fr)`,
          }}
          gap={8}
          justifyContent="space-evenly"
          alignItems="center"
        >
          {clientsSection.clients.map((client) => (
            <GridItem key={client.name}>
              <SingleClient
                name={client.name}
                image={client.image}
                darkImage={client.darkImage}
              />
            </GridItem>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const SingleClient = ({
  name,
  image,
  darkImage,
}: {
  name: string;
  image: string;
  darkImage?: string;
}) => {
  const { colorMode } = useColorMode();
  return (
    <Flex justify="center">
      {colorMode === "light" ? (
        <Image src={image} alt={name} boxSize="120px" objectFit="contain" />
      ) : (
        <Image
          src={darkImage ?? image}
          alt={name}
          boxSize="120px"
          objectFit="contain"
        />
      )}
    </Flex>
  );
};
