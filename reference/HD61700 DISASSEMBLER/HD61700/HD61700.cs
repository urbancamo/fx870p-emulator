using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HD61700
{
    /* HD61700 disassembler */
    public class Disassembler
    {
        StringBuilder _sbOutput;

        string _newLine = "\r\n";
        char _spacer = ' ';

        //holds bytes for the current "line"
        List<uint> _lstBytes = new List<uint>();

        public bool mneumonicUpper = true;
        public bool outputBytes = true;

        // location pointer 
        public uint loc;       

        const int INBUFSIZE = 8;

        uint[] inbuf = new uint[INBUFSIZE];

        //indexes to the inbuf 
        public uint head, tail;

        //1 if 8-bit memory access, 2 if 16-bit memory access 
        public uint dsize; 

        //holds the source bytes 
        MemoryStream _msSource;

        public enum BitSize { bits8, bits16 };

        public Disassembler(BitSize size, MemoryStream msSource, uint startingAddress = 0)
        {
            dsize = (uint)(size == BitSize.bits8 ? 1 : 2);

            _msSource = msSource;

            loc = startingAddress;
        }

        public string GetOutput()
        {
            return _sbOutput.ToString();
        }

        public void Disassemble()
        {
            _sbOutput = new StringBuilder();

            _msSource.Position = 0;

            head = 0;
            tail = 0;

            uint i;

            int x;

            do
            {
                /* align the "head" index */
                while (head % dsize != 0)
                {
                    FetchByte(false);
                }

                /* shift the bytes in the inbuf */
                i = 0;

                while (head < tail)
                {
                    inbuf[i++] = inbuf[head++];
                }

                tail = i;
                head = 0;

                /* fill the inbuf */
                
                while (tail < INBUFSIZE)
                {
                    x =_msSource.ReadByte();

                    if (x == -1)
                    {
                        break;
                    }

                    inbuf[tail++] = (uint)x;
                }

                //clear the buffer for byte output
                _lstBytes = new List<uint>();

                /* disassemble */
                string line = String.Format("{0:X4}:" + _spacer, loc);

                i = ScanMnemTab();

                line += doUpperConditional(mnem[i].str);

                if (mnem[i].kind != mneumonic.NONE && mnem[i].kind != mneumonic.ILLOP)
                {
                    line += _spacer;
                }

                line += Arguments(i);

                if( outputBytes )
                {
                    foreach ( uint b in _lstBytes )
                    {
                        _sbOutput.Append(String.Format("{0:X2}", b));
                    }

                    _sbOutput.Append("".PadRight(9-(_lstBytes.Count*2),_spacer));
                }

                _sbOutput.Append(line);

                _sbOutput.Append(_newLine);

            } while (tail != 0);
        }

        public enum mneumonic : uint
        {
            ILLOP,  /* illop */
            NONE,       /* nop */
            CC,     /* rtn z */
            JRCC,       /* jr z, relative_address */
            JPCC,       /* jp z, absolute_address */
            JR,     /* jr relative_address */
            JP,     /* jp absolute_address */
            REGREGJR,   /* ld reg, reg, optional_jr */
            REGDIRJR,   /* ld reg, (reg), optional_jr */
            REGJR,  /* stl reg, optional_jr */
            REGIRR, /* st reg, (IX+/-reg) */
            REGIRRIM3,  /* stm reg, (IX+/-reg), IM3 */
            REG,        /* phs reg */
            DIR,        /* jp (reg) */
            IRRREG, /* adc (IX+/-reg), reg */
            REGIM8JR,   /* adc reg, IM8, optional_jr */
            IM8,        /* stl IM8 */
            IM8A,       /* ppo IM8 */
            R8IM8,  /* pst PE,IM8 */
            REGIRI, /* st reg, (IX+/-IM8) */
            IRIREG, /* adc (IX+/-IM8), reg */
            R8REGJR,    /* gst reg_8bit, reg, optional_jr */
            R16REGJR,   /* pre reg_16bit, reg, optional_jr */
            R16IM16,    /* pre reg_16bit, IM16 */
            IM8IND, /* st IM8,($sir) */
            IM16IND,    /* stw IM16,($sir) */
            RRIM3JR,    /* adbm reg, reg, IM3, optional_jr */
            RIM5IM3JR,  /* adbm reg, IM5, IM3, optional_jr */
            REGIM8, /* ld reg,IM8 without optional jr */
            REGIM16,    /* ldw reg,IM16 */
            REGIM3, /* stlm reg,IM3 */
            SIRREGJR,   /* psr sir, reg, optional_jr */
            SIRREGIM3,  /* psr sir, reg, IM3 */
            SIRIM5  /* psr sir, IM5 */
        };

        public class tab
        {
            public string str { get; set; }
    
            private mneumonic _kind;

            public mneumonic kind
            {
                get
                {
                    return _kind;
                }
                set
                {
                    _kind = value;

                    offset = (uint)value;
                }
            }

            public uint offset { get; set; }
        };

        tab[] mnem = new tab[] {
                new tab() { str = "adc", kind = mneumonic.REGREGJR },   /* code $00 */
                new tab() { str = "sbc", kind = mneumonic.REGREGJR },   /* code $01 */
                new tab() { str = "ld", kind = mneumonic.REGREGJR },    /* code $02 */
                new tab() { str = "ldc", kind = mneumonic.REGREGJR },   /* code $03 */
                new tab() { str = "anc", kind = mneumonic.REGREGJR },   /* code $04 */
                new tab() { str = "nac", kind = mneumonic.REGREGJR },   /* code $05 */
                new tab() { str = "orc", kind = mneumonic.REGREGJR },   /* code $06 */
                new tab() { str = "xrc", kind = mneumonic.REGREGJR },   /* code $07 */
                new tab() { str = "ad", kind = mneumonic.REGREGJR },    /* code $08 */
                new tab() { str = "sb", kind = mneumonic.REGREGJR },    /* code $09 */
                new tab() { str = "adb", kind = mneumonic.REGREGJR },   /* code $0A */
                new tab() { str = "sbb", kind = mneumonic.REGREGJR },   /* code $0B */
                new tab() { str = "an", kind = mneumonic.REGREGJR },    /* code $0C */
                new tab() { str = "na", kind = mneumonic.REGREGJR },    /* code $0D */
                new tab() { str = "or", kind = mneumonic.REGREGJR },    /* code $0E */
                new tab() { str = "xr", kind = mneumonic.REGREGJR },    /* code $0F */
                new tab() { str = "st", kind = mneumonic.REGDIRJR },    /* code $10 */
                new tab() { str = "ld", kind = mneumonic.REGDIRJR },    /* code $11 */
                new tab() { str = "0", offset = 256 + 0 * 4 },    /* code $12 */
                new tab() { str = "0", offset = 256 + 18 * 4 },   /* code $13 */
                new tab() { str = "0", offset = 256 + 1 * 4 },    /* code $14 */
                new tab() { str = "psr", kind = mneumonic.SIRREGJR },   /* code $15 */
                new tab() { str = "pst", kind = mneumonic.R8REGJR },    /* code $16 */
                new tab() { str = "pst", kind = mneumonic.R8REGJR },    /* code $17 */
                new tab() { str = "0", offset = 256 + 2 * 4 },    /* code $18 */
                new tab() { str = "****", kind = mneumonic.ILLOP }, /* code $19 */
                new tab() { str = "0", offset = 256 + 3 * 4 },    /* code $1A */
                new tab() { str = "0", offset = 256 + 4 * 4 },    /* code $1B */
                new tab() { str = "0", offset = 256 + 5 * 4 },    /* code $1C */
                new tab() { str = "gsr", kind = mneumonic.SIRREGJR },   /* code $1D */
                new tab() { str = "gst", kind = mneumonic.R8REGJR },    /* code $1E */
                new tab() { str = "gst", kind = mneumonic.R8REGJR },    /* code $1F */
                new tab() { str = "st", kind = mneumonic.REGIRR },  /* code $20 */
                new tab() { str = "st", kind = mneumonic.REGIRR },  /* code $21 */
                new tab() { str = "sti", kind = mneumonic.REGIRR }, /* code $22 */
                new tab() { str = "sti", kind = mneumonic.REGIRR }, /* code $23 */
                new tab() { str = "std", kind = mneumonic.REGIRR }, /* code $24 */
                new tab() { str = "std", kind = mneumonic.REGIRR }, /* code $25 */
                new tab() { str = "phs", kind = mneumonic.REG },    /* code $26 */
                new tab() { str = "phu", kind = mneumonic.REG },    /* code $27 */
                new tab() { str = "ld", kind = mneumonic.REGIRR },  /* code $28 */
                new tab() { str = "ld", kind = mneumonic.REGIRR },  /* code $29 */
                new tab() { str = "ldi", kind = mneumonic.REGIRR }, /* code $2A */
                new tab() { str = "ldi", kind = mneumonic.REGIRR }, /* code $2B */
                new tab() { str = "ldd", kind = mneumonic.REGIRR }, /* code $2C */
                new tab() { str = "ldd", kind = mneumonic.REGIRR }, /* code $2D */
                new tab() { str = "pps", kind = mneumonic.REG },    /* code $2E */
                new tab() { str = "ppu", kind = mneumonic.REG },    /* code $2F */
                new tab() { str = "jp", kind = mneumonic.JPCC },    /* code $30 */
                new tab() { str = "jp", kind = mneumonic.JPCC },    /* code $31 */
                new tab() { str = "jp", kind = mneumonic.JPCC },    /* code $32 */
                new tab() { str = "jp", kind = mneumonic.JPCC },    /* code $33 */
                new tab() { str = "jp", kind = mneumonic.JPCC },    /* code $34 */
                new tab() { str = "jp", kind = mneumonic.JPCC },    /* code $35 */
                new tab() { str = "jp", kind = mneumonic.JPCC },    /* code $36 */
                new tab() { str = "jp", kind = mneumonic.JP },  /* code $37 */
                new tab() { str = "adc", kind = mneumonic.IRRREG }, /* code $38 */
                new tab() { str = "adc", kind = mneumonic.IRRREG }, /* code $39 */
                new tab() { str = "sbc", kind = mneumonic.IRRREG }, /* code $3A */
                new tab() { str = "sbc", kind = mneumonic.IRRREG }, /* code $3B */
                new tab() { str = "ad", kind = mneumonic.IRRREG },  /* code $3C */
                new tab() { str = "ad", kind = mneumonic.IRRREG },  /* code $3D */
                new tab() { str = "sb", kind = mneumonic.IRRREG },  /* code $3E */
                new tab() { str = "sb", kind = mneumonic.IRRREG },  /* code $3F */
                new tab() { str = "adc", kind = mneumonic.REGIM8JR },   /* code $40 */
                new tab() { str = "sbc", kind = mneumonic.REGIM8JR },   /* code $41 */
                new tab() { str = "ld", kind = mneumonic.REGIM8JR },    /* code $42 */
                new tab() { str = "ldc", kind = mneumonic.REGIM8JR },   /* code $43 */
                new tab() { str = "anc", kind = mneumonic.REGIM8JR },   /* code $44 */
                new tab() { str = "nac", kind = mneumonic.REGIM8JR },   /* code $45 */
                new tab() { str = "orc", kind = mneumonic.REGIM8JR },   /* code $46 */
                new tab() { str = "xrc", kind = mneumonic.REGIM8JR },   /* code $47 */
                new tab() { str = "ad", kind = mneumonic.REGIM8JR },    /* code $48 */
                new tab() { str = "sb", kind = mneumonic.REGIM8JR },    /* code $49 */
                new tab() { str = "adb", kind = mneumonic.REGIM8JR },   /* code $4A */
                new tab() { str = "sbb", kind = mneumonic.REGIM8JR },   /* code $4B */
                new tab() { str = "an", kind = mneumonic.REGIM8JR },    /* code $4C */
                new tab() { str = "na", kind = mneumonic.REGIM8JR },    /* code $4D */
                new tab() { str = "or", kind = mneumonic.REGIM8JR },    /* code $4E */
                new tab() { str = "xr", kind = mneumonic.REGIM8JR },    /* code $4F */
                new tab() { str = "st", kind = mneumonic.IM8IND },  /* code $50 */
                new tab() { str = "0", offset = 256 + 20 * 4 },   /* code $51 */
                new tab() { str = "stl", kind = mneumonic.IM8 },    /* code $52 */
                new tab() { str = "****", kind = mneumonic.ILLOP }, /* code $53 */
                new tab() { str = "0", offset = 256 + 6 * 4 },    /* code $54 */
                new tab() { str = "psr", kind = mneumonic.SIRIM5 }, /* code $55 */
                new tab() { str = "pst", kind = mneumonic.R8IM8 },  /* code $56 */
                new tab() { str = "pst", kind = mneumonic.R8IM8 },  /* code $57 */
                new tab() { str = "bups", kind = mneumonic.IM8 },    /* code $58 */
                new tab() { str = "bdns", kind = mneumonic.IM8 },    /* code $59 */
                new tab() { str = "****", kind = mneumonic.ILLOP }, /* code $5A */
                new tab() { str = "****", kind = mneumonic.ILLOP }, /* code $5B */
                new tab() { str = "sup", kind = mneumonic.IM8 },    /* code $5C */
                new tab() { str = "sdn", kind = mneumonic.IM8 },    /* code $5D */
                new tab() { str = "****", kind = mneumonic.ILLOP }, /* code $5E */
                new tab() { str = "****", kind = mneumonic.ILLOP }, /* code $5F */
                new tab() { str = "st", kind = mneumonic.REGIRI },  /* code $60 */
                new tab() { str = "st", kind = mneumonic.REGIRI },  /* code $61 */
                new tab() { str = "sti", kind = mneumonic.REGIRI }, /* code $62 */
                new tab() { str = "sti", kind = mneumonic.REGIRI }, /* code $63 */
                new tab() { str = "std", kind = mneumonic.REGIRI }, /* code $64 */
                new tab() { str = "std", kind = mneumonic.REGIRI }, /* code $65 */
                new tab() { str = "****", kind = mneumonic.ILLOP }, /* code $66 */
                new tab() { str = "****", kind = mneumonic.ILLOP }, /* code $67 */
                new tab() { str = "ld", kind = mneumonic.REGIRI },  /* code $68 */
                new tab() { str = "ld", kind = mneumonic.REGIRI },  /* code $69 */
                new tab() { str = "ldi", kind = mneumonic.REGIRI }, /* code $6A */
                new tab() { str = "ldi", kind = mneumonic.REGIRI }, /* code $6B */
                new tab() { str = "ldd", kind = mneumonic.REGIRI }, /* code $6C */
                new tab() { str = "ldd", kind = mneumonic.REGIRI }, /* code $6D */
                new tab() { str = "****", kind = mneumonic.ILLOP }, /* code $6E */
                new tab() { str = "****", kind = mneumonic.ILLOP }, /* code $6F */
                new tab() { str = "cal", kind = mneumonic.JPCC },   /* code $70 */
                new tab() { str = "cal", kind = mneumonic.JPCC },   /* code $71 */
                new tab() { str = "cal", kind = mneumonic.JPCC },   /* code $72 */
                new tab() { str = "cal", kind = mneumonic.JPCC },   /* code $73 */
                new tab() { str = "cal", kind = mneumonic.JPCC },   /* code $74 */
                new tab() { str = "cal", kind = mneumonic.JPCC },   /* code $75 */
                new tab() { str = "cal", kind = mneumonic.JPCC },   /* code $76 */
                new tab() { str = "cal", kind = mneumonic.JP }, /* code $77 */
                new tab() { str = "adc", kind = mneumonic.IRIREG }, /* code $78 */
                new tab() { str = "adc", kind = mneumonic.IRIREG }, /* code $79 */
                new tab() { str = "sbc", kind = mneumonic.IRIREG }, /* code $7A */
                new tab() { str = "sbc", kind = mneumonic.IRIREG }, /* code $7B */
                new tab() { str = "ad", kind = mneumonic.IRIREG },  /* code $7C */
                new tab() { str = "ad", kind = mneumonic.IRIREG },  /* code $7D */
                new tab() { str = "sb", kind = mneumonic.IRIREG },  /* code $7E */
                new tab() { str = "sb", kind = mneumonic.IRIREG },  /* code $7F */
                new tab() { str = "adcw", kind = mneumonic.REGREGJR },  /* code $80 */
                new tab() { str = "sbcw", kind = mneumonic.REGREGJR },  /* code $81 */
                new tab() { str = "ldw", kind = mneumonic.REGREGJR },   /* code $82 */
                new tab() { str = "ldcw", kind = mneumonic.REGREGJR },  /* code $83 */
                new tab() { str = "ancw", kind = mneumonic.REGREGJR },  /* code $84 */
                new tab() { str = "nacw", kind = mneumonic.REGREGJR },  /* code $85 */
                new tab() { str = "orcw", kind = mneumonic.REGREGJR },  /* code $86 */
                new tab() { str = "xrcw", kind = mneumonic.REGREGJR },  /* code $87 */
                new tab() { str = "adw", kind = mneumonic.REGREGJR },   /* code $88 */
                new tab() { str = "sbw", kind = mneumonic.REGREGJR },   /* code $89 */
                new tab() { str = "adbw", kind = mneumonic.REGREGJR },  /* code $8A */
                new tab() { str = "sbbw", kind = mneumonic.REGREGJR },  /* code $8B */
                new tab() { str = "anw", kind = mneumonic.REGREGJR },   /* code $8C */
                new tab() { str = "naw", kind = mneumonic.REGREGJR },   /* code $8D */
                new tab() { str = "orw", kind = mneumonic.REGREGJR },   /* code $8E */
                new tab() { str = "xrw", kind = mneumonic.REGREGJR },   /* code $8F */
                new tab() { str = "stw", kind = mneumonic.REGDIRJR },   /* code $90 */
                new tab() { str = "ldw", kind = mneumonic.REGDIRJR },   /* code $91 */
                new tab() { str = "0", offset = 256 + 7 * 4 },   /* code $92 */
                new tab() { str = "0", offset = 256 + 19 * 4 },  /* code $93 */
                new tab() { str = "0", offset = 256 + 8 * 4 },   /* code $94 */
                new tab() { str = "psrw", kind = mneumonic.SIRREGJR },  /* code $95 */
                new tab() { str = "pre", kind = mneumonic.R16REGJR },   /* code $96 */
                new tab() { str = "pre", kind = mneumonic.R16REGJR },   /* code $97 */
                new tab() { str = "0", offset = 256 + 9 * 4 },   /* code $98 */
                new tab() { str = "****", kind = mneumonic.ILLOP }, /* code $99 */
                new tab() { str = "0", offset = 256 + 10 * 4 },  /* code $9A */
                new tab() { str = "0", offset = 256 + 11 * 4 },  /* code $9B */
                new tab() { str = "0", offset = 256 + 12 * 4 },  /* code $9C */
                new tab() { str = "gsrw", kind = mneumonic.SIRREGJR },  /* code $9D */
                new tab() { str = "gre", kind = mneumonic.R16REGJR },   /* code $9E */
                new tab() { str = "gre", kind = mneumonic.R16REGJR },   /* code $9F */
                new tab() { str = "stw", kind = mneumonic.REGIRR }, /* code $A0 */
                new tab() { str = "stw", kind = mneumonic.REGIRR }, /* code $A1 */
                new tab() { str = "stiw", kind = mneumonic.REGIRR },    /* code $A2 */
                new tab() { str = "stiw", kind = mneumonic.REGIRR },    /* code $A3 */
                new tab() { str = "stdw", kind = mneumonic.REGIRR },    /* code $A4 */
                new tab() { str = "stdw", kind = mneumonic.REGIRR },    /* code $A5 */
                new tab() { str = "phsw", kind = mneumonic.REG },   /* code $A6 */
                new tab() { str = "phuw", kind = mneumonic.REG },   /* code $A7 */
                new tab() { str = "ldw", kind = mneumonic.REGIRR }, /* code $A8 */
                new tab() { str = "ldw", kind = mneumonic.REGIRR }, /* code $A9 */
                new tab() { str = "ldiw", kind = mneumonic.REGIRR },    /* code $AA */
                new tab() { str = "ldiw", kind = mneumonic.REGIRR },    /* code $AB */
                new tab() { str = "lddw", kind = mneumonic.REGIRR },    /* code $AC */
                new tab() { str = "lddw", kind = mneumonic.REGIRR },    /* code $AD */
                new tab() { str = "ppsw", kind = mneumonic.REG },   /* code $AE */
                new tab() { str = "ppuw", kind = mneumonic.REG },   /* code $AF */
                new tab() { str = "jr", kind = mneumonic.JRCC },    /* code $B0 */
                new tab() { str = "jr", kind = mneumonic.JRCC },    /* code $B1 */
                new tab() { str = "jr", kind = mneumonic.JRCC },    /* code $B2 */
                new tab() { str = "jr", kind = mneumonic.JRCC },    /* code $B3 */
                new tab() { str = "jr", kind = mneumonic.JRCC },    /* code $B4 */
                new tab() { str = "jr", kind = mneumonic.JRCC },    /* code $B5 */
                new tab() { str = "jr", kind = mneumonic.JRCC },    /* code $B6 */
                new tab() { str = "jr", kind = mneumonic.JR },  /* code $B7 */
                new tab() { str = "adcw", kind = mneumonic.IRRREG },    /* code $B8 */
                new tab() { str = "adcw", kind = mneumonic.IRRREG },    /* code $B9 */
                new tab() { str = "sbcw", kind = mneumonic.IRRREG },    /* code $BA */
                new tab() { str = "sbcw", kind = mneumonic.IRRREG },    /* code $BB */
                new tab() { str = "adw", kind = mneumonic.IRRREG }, /* code $BC */
                new tab() { str = "adw", kind = mneumonic.IRRREG }, /* code $BD */
                new tab() { str = "sbw", kind = mneumonic.IRRREG }, /* code $BE */
                new tab() { str = "sbw", kind = mneumonic.IRRREG }, /* code $BF */
                new tab() { str = "adbcm", kind = mneumonic.RRIM3JR },  /* code $C0 */
                new tab() { str = "sbbcm", kind = mneumonic.RRIM3JR },  /* code $C1 */
                new tab() { str = "ldm", kind = mneumonic.RRIM3JR },    /* code $C2 */
                new tab() { str = "ldcm", kind = mneumonic.RRIM3JR },   /* code $C3 */
                new tab() { str = "ancm", kind = mneumonic.RRIM3JR },   /* code $C4 */
                new tab() { str = "nacm", kind = mneumonic.RRIM3JR },   /* code $C5 */
                new tab() { str = "orcm", kind = mneumonic.RRIM3JR },   /* code $C6 */
                new tab() { str = "xrcm", kind = mneumonic.RRIM3JR },   /* code $C7 */
                new tab() { str = "adbm", kind = mneumonic.RRIM3JR },   /* code $C8 */
                new tab() { str = "sbbm", kind = mneumonic.RRIM3JR },   /* code $C9 */
                new tab() { str = "0", offset = 256 + 13 * 4 },  /* code $CA */
                new tab() { str = "0", offset = 256 + 14 * 4 },  /* code $CB */
                new tab() { str = "anm", kind = mneumonic.RRIM3JR },    /* code $CC */
                new tab() { str = "nam", kind = mneumonic.RRIM3JR },    /* code $CD */
                new tab() { str = "orm", kind = mneumonic.RRIM3JR },    /* code $CE */
                new tab() { str = "xrm", kind = mneumonic.RRIM3JR },    /* code $CF */
                new tab() { str = "stw", kind = mneumonic.IM16IND },    /* code $D0 */
                new tab() { str = "0", offset = 256 + 21 * 4 },  /* code $D1 */
                new tab() { str = "stlm", kind = mneumonic.REGIM3 },    /* code $D2 */
                new tab() { str = "0", offset = 256 + 15 * 4 },  /* code $D3 */
                new tab() { str = "ppom", kind = mneumonic.REGIM3 },    /* code $D4 */
                new tab() { str = "psrm", kind = mneumonic.SIRREGIM3 }, /* code $D5 */
                new tab() { str = "pre", kind = mneumonic.R16IM16 },    /* code $D6 */
                new tab() { str = "pre", kind = mneumonic.R16IM16 },    /* code $D7 */
                new tab() { str = "bup", kind = mneumonic.NONE },   /* code $D8 */
                new tab() { str = "bdn", kind = mneumonic.NONE },   /* code $D9 */
                new tab() { str = "0", offset = 256 + 16 * 4 },  /* code $DA */
                new tab() { str = "0", offset = 256 + 17 * 4 },  /* code $DB */
                new tab() { str = "sup", kind = mneumonic.REG },    /* code $DC */
                new tab() { str = "sdn", kind = mneumonic.REG },    /* code $DD */
                new tab() { str = "jp", kind = mneumonic.REG }, /* code $DE */
                new tab() { str = "jp", kind = mneumonic.DIR }, /* code $DF */
                new tab() { str = "stm", kind = mneumonic.REGIRRIM3 },  /* code $E0 */
                new tab() { str = "stm", kind = mneumonic.REGIRRIM3 },  /* code $E1 */
                new tab() { str = "stim", kind = mneumonic.REGIRRIM3 }, /* code $E2 */
                new tab() { str = "stim", kind = mneumonic.REGIRRIM3 }, /* code $E3 */
                new tab() { str = "stdm", kind = mneumonic.REGIRRIM3 }, /* code $E4 */
                new tab() { str = "stdm", kind = mneumonic.REGIRRIM3 }, /* code $E5 */
                new tab() { str = "phsm", kind = mneumonic.REGIM3 },    /* code $E6 */
                new tab() { str = "phum", kind = mneumonic.REGIM3 },    /* code $E7 */
                new tab() { str = "ldm", kind = mneumonic.REGIRRIM3 },  /* code $E8 */
                new tab() { str = "ldm", kind = mneumonic.REGIRRIM3 },  /* code $E9 */
                new tab() { str = "ldim", kind = mneumonic.REGIRRIM3 }, /* code $EA */
                new tab() { str = "ldim", kind = mneumonic.REGIRRIM3 }, /* code $EB */
                new tab() { str = "lddm", kind = mneumonic.REGIRRIM3 }, /* code $EC */
                new tab() { str = "lddm", kind = mneumonic.REGIRRIM3 }, /* code $ED */
                new tab() { str = "ppsm", kind = mneumonic.REGIM3 },    /* code $EE */
                new tab() { str = "ppum", kind = mneumonic.REGIM3 },    /* code $EF */
                new tab() { str = "rtn", kind = mneumonic.CC }, /* code $F0 */
                new tab() { str = "rtn", kind = mneumonic.CC }, /* code $F1 */
                new tab() { str = "rtn", kind = mneumonic.CC }, /* code $F2 */
                new tab() { str = "rtn", kind = mneumonic.CC }, /* code $F3 */
                new tab() { str = "rtn", kind = mneumonic.CC }, /* code $F4 */
                new tab() { str = "rtn", kind = mneumonic.CC }, /* code $F5 */
                new tab() { str = "rtn", kind = mneumonic.CC }, /* code $F6 */
                new tab() { str = "rtn", kind = mneumonic.NONE },   /* code $F7 */
                new tab() { str = "nop", kind = mneumonic.NONE },   /* code $F8 */
                new tab() { str = "clt", kind = mneumonic.NONE },   /* code $F9 */
                new tab() { str = "fst", kind = mneumonic.NONE },   /* code $FA */
                new tab() { str = "slw", kind = mneumonic.NONE },   /* code $FB */
                new tab() { str = "cani", kind = mneumonic.NONE },  /* code $FC */
                new tab() { str = "rtni", kind = mneumonic.NONE },  /* code $FD */
                new tab() { str = "off", kind = mneumonic.NONE },   /* code $FE */
                new tab() { str = "trp", kind = mneumonic.NONE },   /* code $FF */
                /* mnemonic variations selected by bits 6 and 5 of the second byte */
                /* code $12, index 256+0*4 */
                new tab() { str = "stl", kind = mneumonic.REGJR },  /* x00xxxxx */
                new tab() { str = "****", kind = mneumonic.ILLOP }, /* x01xxxxx */
                new tab() { str = "****", kind = mneumonic.ILLOP }, /* x10xxxxx */
                new tab() { str = "****", kind = mneumonic.ILLOP }, /* x11xxxxx */
                /* code $14, index 256+1*4 */
                new tab() { str = "ppo", kind = mneumonic.REGJR },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "pfl", kind = mneumonic.REGJR },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                /* code $18, index 256+2*4 */
                new tab() { str = "rod", kind = mneumonic.REGJR },
                new tab() { str = "rou", kind = mneumonic.REGJR },
                new tab() { str = "bid", kind = mneumonic.REGJR },
                new tab() { str = "biu", kind = mneumonic.REGJR },
                /* code $1A, index 256+3*4 */
                new tab() { str = "did", kind = mneumonic.REGJR },
                new tab() { str = "diu", kind = mneumonic.REGJR },
                new tab() { str = "byd", kind = mneumonic.REGJR },
                new tab() { str = "byu", kind = mneumonic.REGJR },
                /* code $1B, index 256+4*4 */
                new tab() { str = "cmp", kind = mneumonic.REGJR },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "inv", kind = mneumonic.REGJR },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                /* code $1C, index 256+5*4 */
                new tab() { str = "gpo", kind = mneumonic.REGJR },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "gfl", kind = mneumonic.REGJR },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                /* code $54, index 256+6*4 */
                new tab() { str = "ppo", kind = mneumonic.IM8A },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "pfl", kind = mneumonic.IM8A },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                /* code $92, index 256+7*4 */
                new tab() { str = "stlw", kind = mneumonic.REGJR },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                /* code $94, index 256+8*4 */
                new tab() { str = "ppow", kind = mneumonic.REGJR },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                /* code $98, index 256+9*4 */
                new tab() { str = "rodw", kind = mneumonic.REGJR },
                new tab() { str = "rouw", kind = mneumonic.REGJR },
                new tab() { str = "bidw", kind = mneumonic.REGJR },
                new tab() { str = "biuw", kind = mneumonic.REGJR },
                /* code $9A, index 256+10*4 */
                new tab() { str = "didw", kind = mneumonic.REGJR },
                new tab() { str = "diuw", kind = mneumonic.REGJR },
                new tab() { str = "bydw", kind = mneumonic.REGJR },
                new tab() { str = "byuw", kind = mneumonic.REGJR },
                /* code $9B, index 256+11*4 */
                new tab() { str = "cmpw", kind = mneumonic.REGJR },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "invw", kind = mneumonic.REGJR },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                /* code $9C, index 256+12*4 */
                new tab() { str = "gpow", kind = mneumonic.REGJR },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "gflw", kind = mneumonic.REGJR },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                /* code $CA, index 256+13*4 */
                new tab() { str = "adbm", kind = mneumonic.RIM5IM3JR },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                /* code $CB, index 256+14*4 */
                new tab() { str = "sbbm", kind = mneumonic.RIM5IM3JR },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                /* code $D3, index 256+15*4 */
                new tab() { str = "ldlm", kind = mneumonic.REGIM3 },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                /* code $DA, index 256+16*4 */
                new tab() { str = "didm", kind = mneumonic.REGIM3 },
                new tab() { str = "dium", kind = mneumonic.REGIM3 },
                new tab() { str = "bydm", kind = mneumonic.REGIM3 },
                new tab() { str = "byum", kind = mneumonic.REGIM3 },
                /* code $DB, index 256+17*4 */
                new tab() { str = "cmpm", kind = mneumonic.REGIM3 },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "invm", kind = mneumonic.REGIM3 },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                /* code $13, index 256+18*4 */
                new tab() { str = "ldl", kind = mneumonic.REGJR },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                /* code $93, index 256+19*4 */
                new tab() { str = "ldlw", kind = mneumonic.REGJR },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                /* code $51, index 256+20*4 */
                new tab() { str = "ld", kind = mneumonic.REGIM8 },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                /* code $D1, index 256+21*4 */
                new tab() { str = "ldw", kind = mneumonic.REGIM16 },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "****", kind = mneumonic.ILLOP },
                new tab() { str = "****", kind = mneumonic.ILLOP }
            };

        /* condition codes */
        string[] cctab = { "z", "nc", "lz", "uz", "nz", "c", "nlz" };

        /* 8-bit register names */
        string[][] r8tab = { new string[] { "pe", "pd", "ib", "ua" }, new string[] { "ia", "ie", "??", "tm" } };

        /* 16-bit register names */
        string[][] r16tab = { new string[] { "ix", "iy", "iz", "us" }, new string[]{ "ss", "ky", "ky", "ky" } };

        /* specific register names */
        string[] sirtab = { "sx", "sy", "sz", "??" };

        uint FetchByte( bool addToByteOutput=true)
        {
            uint x;

            x = head++;

            if ((head ^ x) / dsize != 0)
            {
                loc++;
            }

            //add this to the byte output
            if(addToByteOutput) _lstBytes.Add(inbuf[x]);

            return inbuf[x];
        }

        /* returns the index to the 'mnem' table */
        uint ScanMnemTab()
        {
            uint code = FetchByte();

            if (mnem[code].str[0] == '0')
            {
                code = mnem[code].offset + ((inbuf[head] >> 5) & 3);
            }

            return code;
        }

        string Imm3Arg(uint x)
        {
            //can be minimum 1 and maximum 8
            return (((x >> 5) & 7) + 1).ToString(); 
        }

        string Imm5Arg(uint x)
        {
            return String.Format("&H{0:X2}", x & 0x1F);
        }

        string Imm7Arg()
        {
            uint y, x;

            y = loc;

            sbyte offset;

            if (dsize > 1 && head == 2)
            {
                FetchByte(false);
            }

            x = FetchByte();

            offset = (sbyte)(x & 0x7F);

            if ((x & 0x80) != 0)
            {
                x = 0x80 - x;
            }

            //relative value first, then calculated (actual) value next
            return String.Format(SignArg(x) + "&H{0:X2} (&H{1:X4})", offset, x + y);
        }

        string Imm8Arg()
        {
            uint b = FetchByte();

            return String.Format("&H{0:X2} ({1})", b, Convert.ToString(b, 2).PadLeft(8, '0'));
        }

        string Imm16Arg()
        {
            uint x;

            x = FetchByte();

            return String.Format("&H{0:X2}{1:X2}", FetchByte(), x);
        }

        string AbsArg()
        {
            uint x;

            x = FetchByte();

            if (dsize > 1)
            {
                FetchByte(false);
            }

            return String.Format("&H{0:X2}{1:X2}", FetchByte(), x);
        }

        string RegArg(uint x)
        {
            //_sbOutput.Append(String.Format("$%u", x & 0x1F)); //verify this
            return ("$" + (x & 0x1F)); //verify this
        }

        string SirArg(uint x)
        {
           return doUpperConditional(sirtab[(x >> 5) & 3]);
        }

        string ShortRegArg(uint x)
        {
            string returnString = string.Empty;

            if ((x & 0x60) == 0x60)
            {
                returnString += RegArg(FetchByte());
            }
            else
            {
                returnString += '$';

                returnString += SirArg(x);
            }

            return returnString;
        }

        string ShortRegAr1(uint x, uint y)
        {
            string returnString = string.Empty;

            if ((x & 0x60) == 0x60)
            {
                returnString += RegArg(y);
            }
            else
            {
                returnString += '$';

                returnString += SirArg(x);
            }

            return returnString;
        }

        string IrArg(uint x)
        {
            return doUpperConditional((x & 1) == 0 ? "x" : "z");
        }

        string SignArg(uint x)
        {
            return (x & 0x80) != 0 ? "-" : "+";
        }

        string OptionalJr(uint x)
        {
            string returnString = string.Empty;

            if ((x & 0x80) != 0)
            {
                returnString += doUpperConditional(",jr ");

                returnString += Imm7Arg();
            }

            return returnString;
        }

        private string doUpperConditional(string input)
        {
            return mneumonicUpper ? input.ToUpper() : input;
        }

        string Arguments(uint index)
        {
            string returnValue = string.Empty;

            uint x, y;

            switch (mnem[index].kind)
            {
                case mneumonic.CC:
                    returnValue += doUpperConditional(cctab[index & 7]);
                    break;

                case mneumonic.JRCC:
                    returnValue += doUpperConditional(cctab[index & 7]);
                    returnValue += ",";
                    returnValue += Imm7Arg();
                    break;

                case mneumonic.JPCC:
                    returnValue += doUpperConditional(cctab[index & 7]);
                    returnValue += ",";
                    returnValue += AbsArg();
                    break;

                case mneumonic.JR:
                    returnValue += Imm7Arg();
                    break;

                case mneumonic.JP:
                    returnValue += AbsArg();
                    break;

                case mneumonic.REGREGJR:
                    x = FetchByte();
                    returnValue += RegArg(x);
                    returnValue += ',';
                    returnValue += ShortRegArg(x);
                    returnValue += OptionalJr(x);
                    break;

                case mneumonic.REGDIRJR:
                    x = FetchByte();
                    returnValue += RegArg(x);
                    returnValue += ",(";
                    returnValue += ShortRegArg(x);
                    returnValue += ')';
                    returnValue += OptionalJr(x);
                    break;

                case mneumonic.REGJR:
                    x = FetchByte();
                    returnValue += RegArg(x);
                    returnValue += OptionalJr(x);
                    break;

                case mneumonic.REGIRR:
                    x = FetchByte();
                    returnValue += RegArg(x);
                    returnValue += doUpperConditional(",(i");
                    returnValue += IrArg(index);
                    returnValue += SignArg(x);
                    returnValue += ShortRegArg(x);
                    returnValue += ')';
                    break;

                case mneumonic.REGIRRIM3:
                    x = FetchByte();
                    y = FetchByte();
                    returnValue += RegArg(x);
                    returnValue += doUpperConditional(",(i");
                    returnValue += IrArg(index);
                    returnValue += SignArg(x);
                    returnValue += ShortRegAr1(x, y);
                    returnValue += "),";
                    returnValue += Imm3Arg(y);
                    break;

                case mneumonic.REG:
                    returnValue += RegArg(FetchByte());
                    break;

                case mneumonic.DIR:
                    returnValue += '(';
                    returnValue += RegArg(FetchByte());
                    returnValue += ')';
                    break;

                case mneumonic.IRRREG:
                    x = FetchByte();
                    returnValue += "(i";
                    returnValue += IrArg(index);
                    returnValue += SignArg(x);
                    returnValue += ShortRegArg(x);
                    returnValue += "),";
                    returnValue += RegArg(x);
                    break;

                case mneumonic.REGIM8JR:
                    x = FetchByte();
                    returnValue += RegArg(x);
                    returnValue += ',';
                    returnValue += Imm8Arg();
                    returnValue += OptionalJr(x);
                    break;

                case mneumonic.IM8:
                    returnValue += Imm8Arg();
                    break;

                case mneumonic.IM8A:
                    FetchByte();
                    returnValue += Imm8Arg();
                    break;

                case mneumonic.R8IM8:
                    x = FetchByte();
                    returnValue += doUpperConditional(r8tab[index & 1][(x >> 5) & 3]);
                    returnValue += Imm8Arg();
                    break;

                case mneumonic.REGIRI:
                    x = FetchByte();
                    returnValue += RegArg(x);
                    returnValue += doUpperConditional(",(i");
                    returnValue += IrArg(index);
                    returnValue += SignArg(x);
                    returnValue += Imm8Arg();
                    returnValue += ')';
                    break;

                case mneumonic.IRIREG:
                    x = FetchByte();
                    returnValue += "(i";
                    returnValue += IrArg(index);
                    returnValue += SignArg(x);
                    returnValue += Imm8Arg();
                    returnValue += "),";
                    returnValue += RegArg(x);
                    break;

                case mneumonic.R8REGJR:
                    x = FetchByte();
                    returnValue += doUpperConditional(r8tab[index & 1][(x >> 5) & 3]);
                    returnValue += "," + RegArg(x);
                    returnValue += OptionalJr(x);
                    break;

                case mneumonic.R16REGJR:
                    x = FetchByte();
                    returnValue += doUpperConditional(r16tab[index & 1][(x >> 5) & 3]);
                    returnValue += " " + RegArg(x);
                    returnValue += OptionalJr(x);
                    break;

                case mneumonic.R16IM16:
                    x = FetchByte();
                    returnValue += doUpperConditional(r16tab[index & 1][(x >> 5) & 3]);
                    returnValue += Imm16Arg();
                    break;

                case mneumonic.IM8IND:
                    x = FetchByte();
                    returnValue += Imm8Arg();
                    returnValue = ",($";
                    returnValue += SirArg(x);
                    returnValue += ')';
                    break;

                case mneumonic.IM16IND:
                    x = FetchByte();
                    returnValue += Imm16Arg();
                    returnValue += ",($";
                    returnValue += SirArg(x);
                    returnValue += ')';
                    break;

                case mneumonic.RRIM3JR:
                    x = FetchByte();
                    y = FetchByte();
                    returnValue += RegArg(x);
                    returnValue += ',';
                    returnValue += ShortRegAr1(x, y);
                    returnValue += ',';
                    returnValue += Imm3Arg(y);
                    returnValue += OptionalJr(x);
                    break;

                case mneumonic.RIM5IM3JR:
                    x = FetchByte();
                    y = FetchByte();
                    returnValue += RegArg(x);
                    returnValue += ',';
                    returnValue += Imm5Arg(y);
                    returnValue += ',';
                    returnValue += Imm3Arg(y);
                    returnValue += OptionalJr(x);
                    break;

                case mneumonic.REGIM8:
                    x = FetchByte();
                    returnValue += RegArg(x);
                    returnValue += ',';
                    returnValue += Imm8Arg();
                    break;

                case mneumonic.REGIM16:
                    x = FetchByte();
                    returnValue += RegArg(x);
                    returnValue += ',';
                    returnValue += Imm16Arg();
                    break;

                case mneumonic.REGIM3:
                    x = FetchByte();
                    y = FetchByte();
                    returnValue += RegArg(x);
                    returnValue += ',';
                    returnValue += Imm3Arg(y);
                    break;

                case mneumonic.SIRREGJR:
                    x = FetchByte();
                    returnValue += SirArg(x);
                    returnValue += ',';
                    returnValue += RegArg(x);
                    returnValue += OptionalJr(x);
                    break;

                case mneumonic.SIRREGIM3:
                    x = FetchByte();
                    y = FetchByte();
                    returnValue += SirArg(x);
                    returnValue += ',';
                    returnValue += RegArg(x);
                    returnValue += ',';
                    returnValue += Imm3Arg(y);
                    break;

                case mneumonic.SIRIM5:
                    x = FetchByte();
                    returnValue += SirArg(x);
                    //_sbOutput.Append(String.Format(",%u", x & 0x1F)); //verify this
                    returnValue += (x & 0x1F);
                    break;

                default:
                    break;
            }

            return returnValue;
        }
    }
}

