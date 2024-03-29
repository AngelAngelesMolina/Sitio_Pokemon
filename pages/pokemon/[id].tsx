import { useEffect, useState } from 'react'

import { GetStaticProps, NextPage, GetStaticPaths } from 'next';
import { Button, Card, Container, Grid, Text } from '@nextui-org/react';
import Image from 'next/image';

import confetti from 'canvas-confetti';

import { Layout } from '../../components/layouts'
import { pokeApi } from '../../api';
import { Pokemon } from '../../interfaces';
import { localFavorites } from '../../utils';

interface Props {
  pokemon: Pokemon;
  //   id: string;
  //   name: string;
}

const PokemonPage: NextPage<Props> = ({ pokemon }) => {

  // const [isInFavorites, setIsInFavorites] = useState(localFavorites.existInFavorites(pokemon.id));
  const [isInFavorites, setIsInFavorites] = useState(false);

  useEffect(() => {
    setIsInFavorites(localFavorites.existInFavorites(pokemon.id));
  }, [pokemon.id]);

  // console.log(!isInFavorites)
  const onToggleFavorite = () => {
    localFavorites.toggleFavorites(pokemon.id);
    setIsInFavorites(!isInFavorites);
    if (!isInFavorites) return;
    confetti({
      zIndex: 999,
      particleCount: 100,
      spread: 160,
      angle: -100,
      origin: {
        x: 1,
        y: 0,
      }
    })
  }
  // console.log(localStorage.getItem('favorites')); TAMBIEN SE CORRE EN LA PARTE DEL BACKEND 
  // console.log({existeWindow: typeof window});

  return (
    <Layout title={pokemon.name}>
      <Grid.Container css={{ marginTop: '5px' }} gap={2}>
        <Grid xs={12} sm={4}>
          <Card isHoverable css={{ padding: '30px' }}>
            <Card.Body>
              <Card.Image
                src={pokemon.sprites.other?.dream_world.front_default || '/no-image.png'}
                alt={pokemon.name}
                width="100"
                height={200}
              />
            </Card.Body>
          </Card>
        </Grid>
        <Grid xs={12} sm={8} >
          <Card>
            <Card.Header css={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text h1 transform='capitalize'>{pokemon.name}</Text>
              <Button
                color='gradient'
                bordered={!isInFavorites}
                onClick={onToggleFavorite}
              >
                {isInFavorites ? 'En favoritos' : 'Guardar en Favoritos'}
              </Button>
            </Card.Header>
            <Card.Body>
              <Text size={30}>Sprites: </Text>
              <Container direction='row' display='flex' gap={0} justify='space-between'>
                <Image
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
                <Image
                  src={pokemon.sprites.back_default}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
                <Image
                  src={pokemon.sprites.front_shiny}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
                <Image
                  src={pokemon.sprites.back_shiny}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
              </Container>
            </Card.Body>
          </Card>
        </Grid>
      </Grid.Container>
    </Layout >
  )
};

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const pokemons151 = [...Array(151)].map((value, index) => `${index + 1}`);
  // console.table(pokemons151);
  //Siven para pre- renderizar las paginas que usas rutas dinámicas [id].tsx
  return {
    paths: pokemons151.map(id => ({
      params: { id: id }
    })),
    fallback: false //Deja entrar aunque no exista la ruta, "blocking", false - será de manera estricta
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // params se destructura del contexto (ctx)
  const { id } = params as { id: string };
  const { data } = await pokeApi.get<Pokemon>(`pokemon/${id}`);
  const pokemon = {
    id: data.id,
    name: data.name,
    sprites: data.sprites
}
  return {
    props: {
      pokemon: pokemon
    }
  }
}



export default PokemonPage; 