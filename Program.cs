using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace forca
{ //a - i - e - o r s
    class Program
    {
        private static List<string> palavras;
        private static int palavrasFeitas = 0;

        static void Main(string[] args)
        {
            palavras = File.ReadAllText("dicionario5.txt").Split('\n').ToList();
            var letras = new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' };
            palavras = palavras.Select(x => Util.ObterStringSemAcentosECaracteresEspeciais(x)).ToList();
            var palavraIdeal = findBestWord(palavras);
        }

        private static string findBestWord(List<string> palavras)
        {
            var minMean = decimal.MaxValue;
            var bestWord = "";
            palavras.AsParallel().ForAll( palavra =>
            {
                Console.WriteLine("Porcentagem: " + palavrasFeitas + "/" + palavras.Count);
                var meanSteps = solveForAll(palavra);
                if (meanSteps < minMean)
                {
                    bestWord = palavra;
                    minMean = meanSteps;
                }
                palavrasFeitas++;
            });
            return bestWord;
        }

        private static decimal solveForAll(string palavra)
        {
            return palavras.AsParallel().Average(x => solve(x, palavra));
        }

        private static decimal solve(string enigma, string palavra)
        {
            var posiblesWords = palavras;
            for (var step = 1; step <= 100; step++)
            {
                var guessResult = guess(enigma, palavra);
                if(guessResult.Sum() == 10)
                {
                    return step;
                }
                posiblesWords = posiblesWords.Where(x => !x.Equals(palavra)).ToList();
                for(int i = 0; i<guessResult.Count; i++)
                {
                    int result = guessResult[i];
                    switch(result) {
                        case 2:
                            posiblesWords = posiblesWords.Where(y => y[i] == palavra[i]).ToList();
                            break;
                        case 1:
                            posiblesWords = posiblesWords.Where(y => y.Contains(palavra[i])).ToList();
                            break;
                        case 0:
                            posiblesWords = posiblesWords.Where(y => !y.Contains(palavra[i])).ToList();
                            break;
                        default:
                            break;
                    }
                };
                palavra = posiblesWords.First();
            }
            return  -1;
        }

        private static List<int> guess(string enigma, string palavra)
        {   
            // 0 = não encontrado
            // 1 = ta na palavra
            // 2 = posição certa
            return palavra.Select((x,i)=> {
                if (x == enigma[i])
                {
                    return 2;
                }
                else if (enigma.Contains(palavra[i]))
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }).ToList();
        }
    }
}
