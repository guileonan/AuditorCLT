import React, { memo, useState } from 'react';
import { ASSETS } from '@/constants/appConstants';

/**
 * Logo servido de `public/`, com o espelho no imgbb como rede de segurança.
 * Se o arquivo local não carregar (deploy incompleto, cache ruim, 404), troca
 * para o remoto. Se o remoto também falhar, o onError só repete o mesmo estado
 * e a troca para por aí — sem laço infinito.
 */
const BrandLogo = ({ brand, alt, className, loading = 'lazy' }) => {
  const [useFallback, setUseFallback] = useState(false);
  const source = useFallback ? ASSETS.LOGOS_FALLBACK[brand] : ASSETS.LOGOS[brand];

  return (
    <img
      src={source}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setUseFallback(true)}
    />
  );
};

export default memo(BrandLogo);
