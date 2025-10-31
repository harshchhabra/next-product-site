import { Metadata } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Providers } from '../providers';
import ProductsSearch from '@/src/components/organisms/ProductSearch';
import { getProducts, getRecommendedProducts } from '@/src/services/product';
import { Product } from '@/src/type/products';

interface ProductsSearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ searchParams }: ProductsSearchPageProps): Promise<Metadata> {
  const params = await Promise.resolve(searchParams);
  const query = Array.isArray(params.q) ? params.q[0] : params.q || '';
  const title = query ? `Search results for "${query}"` : 'Recommended Products';

  return {
    title,
    description: `Browse products ${query ? `matching "${query}"` : ''}`,
    openGraph: {
      title,
      description: `Browse products ${query ? `matching "${query}"` : ''}`,
    },
  };
}

export default async function ProductsSearchPage({ searchParams }: ProductsSearchPageProps) {
  const params = await Promise.resolve(searchParams);
  const query = Array.isArray(params.q) ? params.q[0] : params.q || '';

  const serverQueryClient = new QueryClient();

  await serverQueryClient.prefetchQuery<Product[], Error>({
    queryKey: ['products', 'search', query],
    queryFn: () => (query === '' ? getRecommendedProducts() : getProducts(query)),
    staleTime: 60 * 1000,
  });

  const dehydratedState = dehydrate(serverQueryClient);

  return (
    <Providers dehydratedState={dehydratedState}>
      <ProductsSearch initialQuery={query} />
    </Providers>
  );
}
