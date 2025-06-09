

interface constributor {
  name: string;
  image: string;
  roles: string[]
  links: {
    github?:      string;
    website?:     string;
    x?:           string;
  }
}

const finbyte_constributors: constributor[] = [
  {
    name: 'JJD3V',
    image: 'https://pbs.twimg.com/profile_images/1930159445956333568/nLaNaFXJ_400x400.jpg',
    roles: ['Founder', 'Contributor'],
    links: {
      github: 'https://github.com/JJD3V',
      x: 'https://x.com/JJD3V'
    },
  },
];

export default finbyte_constributors;