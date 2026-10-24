'use client';

import { AlgoliaButton } from 'pliny/search/AlgoliaButton';
import { KBarButton } from 'pliny/search/KBarButton';
import { SearchProvider, type SearchConfig } from 'pliny/search';
import { useParams } from 'next/navigation';

import siteMetadata from '@/data/siteMetadata';
import { DEFAULT_LOCALE, Locale } from '@/locales/config';

const SearchButtonWrapper = ({ children, assetPrefix }) => {
  const { locale = DEFAULT_LOCALE } = useParams<{ locale: Locale }>();
  if (
    siteMetadata.search &&
    (siteMetadata.search.provider === 'algolia' || siteMetadata.search.provider === 'kbar')
  ) {
    const SearchButtonWrapper =
      siteMetadata.search.provider === 'algolia' ? AlgoliaButton : KBarButton;

    const searchConfig = {
      ...siteMetadata.search,
      ...(siteMetadata.search.provider === 'kbar' && {
        kbarConfig: {
          ...siteMetadata.search.kbarConfig,
          searchDocumentsPath:
            locale === DEFAULT_LOCALE
              ? `${assetPrefix}/search.json`
              : `${assetPrefix}/search-${locale}.json`,
        },
      }),
    } as SearchConfig;

    return (
      <SearchProvider key={locale} searchConfig={searchConfig}>
        <SearchButtonWrapper aria-label="Search">{children}</SearchButtonWrapper>
      </SearchProvider>
    );
  }
  return null;
};

export default SearchButtonWrapper;
