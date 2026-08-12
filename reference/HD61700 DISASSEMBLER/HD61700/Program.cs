using CommandLine;
using CommandLine.Text;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

/* Disassembler modified from source posted here:
 * http://www.emmanuel.hp41.eu/ti/ti-74/pc/pgm2b74/programs.htm
 * which referenced the source hosted here:
 * http://www.pisi.com.pl/piotr433/pb1000ee.htm
 * http://www.pisi.com.pl/piotr433/index.htm#pb1000
 * 
Usage: HD61700.exe -i infile.bin [-a address] [-w] -o outfile.txt 

Example: HD61700.exe -i infile.bin -a 0x8000 -o outfile.txt 

The optional switch -a starting address can be specified as a hexadecimal number without any prefixes. If omitted, a default value 0000 is assumed.
The optional switch -w selects the 16-bit (word-size) memory access (applicaple for the microprocessor internal 16-bit ROM). If omitted, a default 8-bit (byte-size) memory access is assumed.

 */

namespace HD61700
{
    class Program
    {
        private static Options _opts;

        static int Main(string[] args)
        {
            ParserResult<Options> pResult = Parser.Default.ParseArguments<Options>(args).WithParsed(RunOptions).WithNotParsed(HandleParseError);           

            if( _opts == null || pResult.Tag == ParserResultType.NotParsed)
            {
                HelpText hText = HelpText.AutoBuild(pResult);

                Console.Write(hText.ToString());

                return 1;
            }

            if (!File.Exists(_opts.InputFile))
            {
                Console.WriteLine($"Input file {_opts.InputFile} was not found.");

                return 2;
            }

            uint address = 0;

            try
            {
                address = UInt32.Parse(_opts.Address.Replace("0x",string.Empty).Replace("0X",string.Empty), System.Globalization.NumberStyles.HexNumber);
            }
            catch
            {
                Console.WriteLine($"Address {_opts.Address} was not in hex or integer format.");

                return 3;
            }

            Disassembler d;

            using (FileStream fs = new FileStream(_opts.InputFile, FileMode.Open))
            {
                MemoryStream ms = new MemoryStream();

                fs.CopyTo(ms);

                d = new Disassembler(_opts.WordSize == true ? Disassembler.BitSize.bits16 : Disassembler.BitSize.bits8, ms, address);

                d.mneumonicUpper = _opts.MneumonicsUpper;
                d.outputBytes = _opts.OutputBytes;

                d.Disassemble();
            }

            File.WriteAllText(_opts.OutputFile, d.GetOutput());
 
            return 0;
        }

        class Options
        {
            [Option('i', "input", Required = true, HelpText = "Input file to be disassembled.")]
            public string InputFile { get; set; }

            [Option('o', "output", Required = true, HelpText = "Output file for disassembly.")]
            public string OutputFile { get; set; }

            [Option('a', "address", Default="0000", Required = false, HelpText = "The optional starting address can be specified as a hexadecimal number without any prefixes. If omitted, a default value 0000 is assumed.")]
            public string Address { get; set; }

            [Option('w', "word", Default=false, Required = false, HelpText = "Selects the 16-bit (word-size) memory access (applicaple for the microprocessor internal 16-bit ROM). If omitted, a default 8-bit (byte-size) memory access is assumed.")]
            public bool WordSize { get; set; }

            [Option('u', "uppercase", Default = true, Required = false, HelpText = "If true, outputs all mneumonics in upper case.")]
            public bool MneumonicsUpper { get; set; }

            [Option('b', "output bytes", Default = true, Required = false, HelpText = "If true, outputs the bytes for the current line.")]
            public bool OutputBytes { get; set; }
        }

        static void RunOptions(Options opts)
        {
            //handle options
            _opts = opts;
        }

        static void HandleParseError(IEnumerable<Error> errs)
        {
            //handle errors
        }
    }
 }
