import { Jaccard, calcularCoeficientesObservacao } from '../src/background/background.ts';

describe('Função Jaccard', () => {
  it('calcula corretamente a similaridade', () => {
    const result = Jaccard('pesquisa de exemplo', 'pesquisa exemplo');
    expect(result).toBeCloseTo(0.666, 2); // Intersecção 2, união 3
  });

  it('retorna 0 para strings vazias', () => {
    const result = Jaccard('', '');
    expect(result).toBe(0);
  });

  it('retorna 1 para strings idênticas', () => {
    const result = Jaccard('machine learning', 'machine learning');
    expect(result).toBe(1);
  });
});

describe('Função calcularCoeficientesObservacao', () => {
  it('calcula corretamente com duas queries', () => {
    const queries = ['pesquisa exemplo', 'pesquisa teste'];
    const result = calcularCoeficientesObservacao(queries);
    expect(result).toBeGreaterThan(0);
  });

  it('retorna valor mínimo para menos de duas queries', () => {
    const result = calcularCoeficientesObservacao(['única']);
    expect(result).toBe(0.0001);
  });
});