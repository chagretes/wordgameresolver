using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace forca
{ //a - i - e - o r s
    class Program
    {
        private static List<string> palavras;

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
            foreach (var palavra in palavras)
            {
                var meanSteps = palavras.Average(x => solveForAll(x));
                if (meanSteps < minMean)
                {
                    bestWord = palavra;
                    minMean = meanSteps;
                }
            }
            return bestWord;
        }

        private static decimal solveForAll(string palavra)
        {
            return new[] { "termo", "teste" }.Average(x => solve(x, palavra));
        }

        private static decimal solve(string enigma, string palavra)
        {
            var posiblesWords = palavras;
            for (var step = 1; step <= 6; step++)
            {
                var guessResult = guess(enigma, palavra);
                if(guessResult.Sum() == 10)
                {
                    Console.WriteLine("Enigma: {0} - Step: {1}", palavra, step);
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
                Console.WriteLine(palavra);
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
