using System;
using System.IO;
using System.Linq;

namespace forca
{ //a - i - e - o r s
    class Program
    {
        static void Main(string[] args)
        {
            var palavras = File.ReadAllText("dicionario5.txt").Split('\n').ToList();
            var letras = new char[]{'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'};
            palavras = palavras.Select(x => Util.ObterStringSemAcentosECaracteresEspeciais(x)).ToList();
            foreach(var letra in letras) {
                var count = palavras.Aggregate(0,(x,y)=>x+y.Count(l => l.Equals(letra)));
                Console.WriteLine("{0}:{1}", letra, count);
            }
        }

        
    }
}
