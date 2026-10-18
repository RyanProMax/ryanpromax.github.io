import Pre from 'pliny/ui/Pre';
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm';
import type { MDXComponents } from 'mdx/types';
import Image from './Image';
import CustomLink from './Link';
import TableWrapper from './TableWrapper';

export const components: MDXComponents = {
  Image,
  // PostLayout supplies the responsive contents navigation for every article.
  TOCInline: () => null,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
};
