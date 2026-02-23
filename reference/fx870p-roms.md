# Casio FX-870P ROM Disassembly

```
0000:  B7 02        jr      &H0002
0001:  B7 0F        jr      &H0010
0002:  1C 40        gfl     $0
0003:  44 00 02 00  anc     $0,&H02
0005:  34 00 00 80  jp      nz,&H8000
0007:  9F 61        gre     ky,$1
0008:  4C 01 08 00  an      $1,&H08
000A:  34 CF 00 0B  jp      nz,&H0BCF
000C:  56 40 00 00  pst     ib,&H00
000E:  37 6E 00 0D  jp      &H0D6E
0010:  1C 40        gfl     $0
0011:  44 00 02 00  anc     $0,&H02
0013:  34 00 00 90  jp      nz,&H9000
0015:  9F 61        gre     ky,$1
0016:  4C 01 07 00  an      $1,&H07
0018:  34 C5 00 0B  jp      nz,&H0BC5
001A:  37 71 00 0D  jp      &H0D71
001C:  D6 00 00 11  pre     ix,&H1100
001E:  2C 01        ldd     $1,(ix+$sx)
001F:  F7 00        rtn   
0020:  37 EE 00 FF  jp      &HFFEE
0022:  37 74 00 0D  jp      &H0D74
0024:  41 00 41 00  sbc     $0,&H41
0026:  B5 05        jr      c,&H002B
0027:  41 80 47 33  sbc     $0,&H47,jr &H005B
0029:  77 49 00 00  cal     &H0049
002B:  40 00 D0 00  adc     $0,&HD0
002D:  F1 00        rtn     nc
002E:  41 80 3A 2C  sbc     $0,&H3A,jr &H005B
0030:  37 F1 00 FF  jp      &HFFF1
0032:  E6 07 E0 00  phsm    $7,8
0034:  E6 0F E0 00  phsm    $15,8
0036:  1C 48        gfl     $8
0037:  1E 69        gst     ua,$9
0038:  9E 0A        gre     ix,$10
0039:  9E 4C        gre     iz,$12
003A:  37 77 00 0D  jp      &H0D77
003C:  77 49 00 00  cal     &H0049
003E:  41 80 03 1C  sbc     $0,&H03,jr &H005B
0040:  37 F4 00 FF  jp      &HFFF4
0042:  E6 03 60 00  phsm    $3,4
0044:  1C 40        gfl     $0
0045:  1E 61        gst     ua,$1
0046:  9E 02        gre     ix,$2
0047:  37 7A 00 0D  jp      &H0D7A
0049:  2D 00        ldd     $0,(iz+$sx)
004A:  41 00 20 00  sbc     $0,&H20
004C:  F4 00        rtn     nz
004D:  2D 20        ldd     $0,(iz+$sy)
004E:  41 80 20 83  sbc     $0,&H20,jr &HFFD2
0050:  37 F7 00 FF  jp      &HFFF7
0052:  37 7D 00 0D  jp      &H0D7D
0054:  D1 13 09 00  ldw     $19,&H0009
0056:  77 8C 00 0D  cal     &H0D8C
0058:  E7 11 E0 00  phum    $17,8
005A:  27 12        phu     $18
005B:  F7 00        rtn   
005C:  2F 12        ppu     $18
005D:  EF 0A E0 00  ppum    $10,8
005F:  F7 00        rtn   
0060:  37 FA 00 FF  jp      &HFFFA
0062:  37 80 00 0D  jp      &H0D80
0064:  D1 13 09 00  ldw     $19,&H0009
0066:  77 8C 00 0D  cal     &H0D8C
0068:  E7 07 E0 00  phum    $7,8
006A:  27 08        phu     $8
006B:  F7 00        rtn   
006C:  2F 08        ppu     $8
006D:  EF 00 E0 00  ppum    $0,8
006F:  F7 00        rtn   
0070:  37 FD 00 FF  jp      &HFFFD
0072:  37 83 00 0D  jp      &H0D83
0074:  56 60 14 00  pst     ua,&H14
0076:  77 0B 00 04  cal     &H040B
0078:  D6 00 0D 11  pre     ix,&H110D
007A:  3E 1E        sb      (ix+$sx),$30
007B:  B1 02        jr      nc,&H007D
007C:  24 1F        std     $31,(ix+$sx)
007D:  96 4C        pre     iz,$12
007E:  96 0A        pre     ix,$10
007F:  16 69        pst     ua,$9
0080:  14 48        pfl     $8
0081:  EE 08 E0 00  ppsm    $8,8
0083:  EE 00 E0 00  ppsm    $0,8
0085:  FD 00        rtni  
0086:  56 60 14 00  pst     ua,&H14
0088:  D6 00 0F 11  pre     ix,&H110F
008A:  3E 1E        sb      (ix+$sx),$30
008B:  B1 02        jr      nc,&H008D
008C:  24 1F        std     $31,(ix+$sx)
008D:  96 02        pre     ix,$2
008E:  16 61        pst     ua,$1
008F:  14 40        pfl     $0
0090:  EE 00 60 00  ppsm    $0,4
0092:  FD 00        rtni  
0093:  77 3C 00 00  cal     &H003C
0095:  F5 00        rtn     c
0096:  37 9E 00 0D  jp      &H0D9E
0098:  40 00 60 00  adc     $0,&H60
009A:  F1 00        rtn     nc
009B:  41 80 E0 3A  sbc     $0,&HE0,jr &H00D6
009D:  77 B6 00 00  cal     &H00B6
009F:  77 24 00 00  cal     &H0024
00A1:  F1 00        rtn     nc
00A2:  49 00 30 00  sb      $0,&H30
00A4:  41 00 0A 00  sbc     $0,&H0A
00A6:  F5 00        rtn     c
00A7:  48 80 F9 2E  ad      $0,&HF9,jr &H00D6
00A9:  77 49 00 00  cal     &H0049
00AB:  40 00 BF 00  adc     $0,&HBF
00AD:  F1 00        rtn     nc
00AE:  41 00 5B 00  sbc     $0,&H5B
00B0:  F5 00        rtn     c
00B1:  40 00 9F 00  adc     $0,&H9F
00B3:  F1 00        rtn     nc
00B4:  41 80 7B 21  sbc     $0,&H7B,jr &H00D6
00B6:  77 B1 00 00  cal     &H00B1
00B8:  F1 00        rtn     nc
00B9:  49 80 20 1C  sb      $0,&H20,jr &H00D6
00BB:  42 81 2F 15  ld      $1,&H2F,jr &H00D1
00BD:  42 81 3A 13  ld      $1,&H3A,jr &H00D1
00BF:  42 81 22 11  ld      $1,&H22,jr &H00D1
00C1:  42 81 40 0F  ld      $1,&H40,jr &H00D1
00C3:  42 81 2C 0D  ld      $1,&H2C,jr &H00D1
00C5:  42 81 28 0B  ld      $1,&H28,jr &H00D1
00C7:  42 81 29 09  ld      $1,&H29,jr &H00D1
00C9:  42 81 2D 07  ld      $1,&H2D,jr &H00D1
00CB:  42 81 3B 05  ld      $1,&H3B,jr &H00D1
00CD:  42 81 23 03  ld      $1,&H23,jr &H00D1
00CF:  42 01 2E 00  ld      $1,&H2E
00D1:  77 49 00 00  cal     &H0049
00D3:  01 41        sbc     $1,$sz
00D4:  F4 00        rtn     nz
00D5:  2D 20        ldd     $0,(iz+$sy)
00D6:  F7 00        rtn   
00D7:  42 81 3B 0D  ld      $1,&H3B,jr &H00E5
00D9:  42 81 24 0B  ld      $1,&H24,jr &H00E5
00DB:  42 81 2C 09  ld      $1,&H2C,jr &H00E5
00DD:  42 81 2D 07  ld      $1,&H2D,jr &H00E5
00DF:  42 81 29 05  ld      $1,&H29,jr &H00E5
00E1:  42 81 28 03  ld      $1,&H28,jr &H00E5
00E3:  42 01 3D 00  ld      $1,&H3D
00E5:  77 D1 00 00  cal     &H00D1
00E7:  F0 00        rtn     z
00E8:  B7 D2        jr      &H00BA
00E9:  42 81 07 07  ld      $1,&H07,jr &H00F1
00EB:  42 81 06 05  ld      $1,&H06,jr &H00F1
00ED:  42 81 05 03  ld      $1,&H05,jr &H00F1
00EF:  42 01 04 00  ld      $1,&H04
00F1:  77 49 00 00  cal     &H0049
00F3:  01 41        sbc     $1,$sz
00F4:  F4 00        rtn     nz
00F5:  3B 22        sbc     (iz+$sy),$2
00F6:  F4 00        rtn     nz
00F7:  AB 01        ldiw    $1,(iz+$sx)
00F8:  F7 00        rtn   
00F9:  81 24        sbcw    $4,$sy
00FA:  F5 00        rtn     c
00FB:  9E 46        gre     iz,$6
00FC:  A6 07        phsw    $7
00FD:  81 42        sbcw    $2,$sz
00FE:  B5 25        jr      c,&H0123
00FF:  96 02        pre     ix,$2
0100:  96 40        pre     iz,$0
0101:  1F 26        gst     ie,$6
0102:  44 06 A0 00  anc     $6,&HA0
0104:  B4 0D        jr      nz,&H0111
0105:  89 24        sbw     $4,$sy
0106:  88 62 04 00  adw     $2,$4
0108:  96 22        pre     iy,$2
0109:  D8 00        bup   
010A:  9E 40        gre     iz,$0
010B:  9E 02        gre     ix,$2
010C:  89 42        sbw     $2,$sz
010D:  88 20        adw     $0,$sy
010E:  AE 06        ppsw    $6
010F:  96 46        pre     iz,$6
0110:  F7 00        rtn   
0111:  89 42        sbw     $2,$sz
0112:  D1 00 08 00  ldw     $0,&H0008
0114:  89 44        sbw     $4,$sz
0115:  B5 06        jr      c,&H011B
0116:  EA 06 E0 00  ldim    $6,(ix+$sx),8
0118:  E3 06 E0 00  stim    $6,(iz+$sx),8
011A:  B7 86        jr      &H00A0
011B:  08 44        ad      $4,$sz
011C:  09 24        sb      $4,$sy
011D:  B5 04        jr      c,&H0121
011E:  2A 06        ldi     $6,(ix+$sx)
011F:  23 06        sti     $6,(iz+$sx)
0120:  B7 84        jr      &H00A4
0121:  9E C0 00 94  gre     iz,$0,jr &H00B6
0123:  96 22        pre     iy,$2
0124:  88 60 04 00  adw     $0,$4
0126:  88 62 04 00  adw     $2,$4
0128:  96 02        pre     ix,$2
0129:  96 40        pre     iz,$0
012A:  1F 26        gst     ie,$6
012B:  44 06 A0 00  anc     $6,&HA0
012D:  B4 08        jr      nz,&H0135
012E:  2C A0        ldd     $0,(ix-$sy)
012F:  2D A0        ldd     $0,(iz-$sy)
0130:  D9 00        bdn   
0131:  9E 00        gre     ix,$0
0132:  9E 42        gre     iz,$2
0133:  89 C2 00 A6  sbw     $2,$sz,jr &H00DA
0135:  89 42        sbw     $2,$sz
0136:  9B 02        cmpw    $2
0137:  D1 00 08 00  ldw     $0,&H0008
0139:  89 44        sbw     $4,$sz
013A:  B5 06        jr      c,&H0140
013B:  EC AD E0 00  lddm    $13,(ix-$sy),8
013D:  E5 AD E0 00  stdm    $13,(iz-$sy),8
013F:  B7 86        jr      &H00C5
0140:  08 44        ad      $4,$sz
0141:  09 24        sb      $4,$sy
0142:  B5 04        jr      c,&H0146
0143:  2C AD        ldd     $13,(ix-$sy)
0144:  25 AD        std     $13,(iz-$sy)
0145:  B7 84        jr      &H00C9
0146:  9E 80 00 B9  gre     ix,$0,jr &H0100
0148:  1E 66        gst     ua,$6
0149:  56 60 44 00  pst     ua,&H44
014B:  B7 04        jr      &H014F
014C:  1E 66        gst     ua,$6
014D:  56 60 54 00  pst     ua,&H54
014F:  26 06        phs     $6
0150:  77 F9 00 00  cal     &H00F9
0152:  2E 06        pps     $6
0153:  16 66        pst     ua,$6
0154:  F7 00        rtn   
0155:  77 4C 00 01  cal     &H014C
0157:  C9 64 E4 00  sbbm    $4,$4,8
0159:  96 00        pre     ix,$0
015A:  D1 00 08 00  ldw     $0,&H0008
015C:  89 42        sbw     $2,$sz
015D:  B5 04        jr      c,&H0161
015E:  E2 04 E0 00  stim    $4,(ix+$sx),8
0160:  B7 84        jr      &H00E4
0161:  88 42        adw     $2,$sz
0162:  09 22        sb      $2,$sy
0163:  F5 00        rtn     c
0164:  22 04        sti     $4,(ix+$sx)
0165:  B7 83        jr      &H00E8
0166:  1E 63        gst     ua,$3
0167:  56 60 04 00  pst     ua,&H04
0169:  EA 00 40 00  ldim    $0,(ix+$sx),3
016B:  01 50        sbc     $16,$sz
016C:  B0 03        jr      z,&H016F
016D:  04 40        anc     $0,$sz
016E:  B4 85        jr      nz,&H00F3
016F:  16 63        pst     ua,$3
0170:  DE 01        jp      $1
0171:  1F 21        gst     ie,$1
0172:  4E 81 18 04  or      $1,&H18,jr &H0177
0174:  1F 21        gst     ie,$1
0175:  4E 01 80 00  or      $1,&H80
0177:  17 21        pst     ie,$1
0178:  F7 00        rtn   
0179:  1F 21        gst     ie,$1
017A:  4C 81 7F 84  an      $1,&H7F,jr &H00FF
017C:  1F 21        gst     ie,$1
017D:  4C 81 E7 87  an      $1,&HE7,jr &H0105
017F:  D6 00 0B 11  pre     ix,&H110B
0181:  A8 03        ldw     $3,(ix+$sx)
0182:  A0 03        stw     $3,(ix+$sx)
0183:  54 00 C3 00  ppo     &HC3
0185:  02 00        ld      $0,$sx
0186:  96 03        pre     ix,$3
0187:  D1 01 56 0D  ldw     $1,&H0D56
0189:  01 63 01 00  sbc     $3,$1
018B:  1E 64        gst     ua,$4
018C:  56 60 04 00  pst     ua,&H04
018E:  A8 01        ldw     $1,(ix+$sx)
018F:  16 64        pst     ua,$4
0190:  B1 03        jr      nc,&H0193
0191:  DA 02 40 00  didm    $2,3
0193:  4E 00 0C 00  or      $0,&H0C
0195:  D2 00 40 00  stlm    $0,3
0197:  F7 00        rtn   
0198:  D1 01 2E 0D  ldw     $1,&H0D2E
019A:  42 80 FE 05  ld      $0,&HFE,jr &H01A0
019C:  D1 01 6C 0D  ldw     $1,&H0D6C
019E:  42 00 02 00  ld      $0,&H02
01A0:  D6 00 0B 11  pre     ix,&H110B
01A2:  A8 03        ldw     $3,(ix+$sx)
01A3:  01 63 01 00  sbc     $3,$1
01A5:  F0 00        rtn     z
01A6:  08 C3 00 A5  ad      $3,$sz,jr &H014C
01A8:  77 D4 00 01  cal     &H01D4
01AA:  77 DA 00 01  cal     &H01DA
01AC:  77 D2 00 01  cal     &H01D2
01AE:  77 D0 00 01  cal     &H01D0
01B0:  77 7F 00 01  cal     &H017F
01B2:  77 D6 00 01  cal     &H01D6
01B4:  C9 62 E2 00  sbbm    $2,$2,8
01B6:  D1 00 0B 03  ldw     $0,&H030B
01B8:  54 00 FB 00  ppo     &HFB
01BA:  92 00        stlw    $0
01BB:  54 00 FA 00  ppo     &HFA
01BD:  D2 02 E0 00  stlm    $2,8
01BF:  09 21        sb      $1,$sy
01C0:  B1 88        jr      nc,&H0148
01C1:  42 01 86 00  ld      $1,&H86
01C3:  77 C7 00 01  cal     &H01C7
01C5:  42 01 96 00  ld      $1,&H96
01C7:  54 00 FF 00  ppo     &HFF
01C9:  D2 01 40 00  stlm    $1,3
01CB:  54 00 FE 00  ppo     &HFE
01CD:  D2 02 E0 00  stlm    $2,8
01CF:  F7 00        rtn   
01D0:  42 82 F9 0B  ld      $2,&HF9,jr &H01DC
01D2:  42 82 28 09  ld      $2,&H28,jr &H01DC
01D4:  42 82 04 07  ld      $2,&H04,jr &H01DC
01D6:  42 82 AD 05  ld      $2,&HAD,jr &H01DC
01D8:  42 82 14 03  ld      $2,&H14,jr &H01DC
01DA:  42 02 0A 00  ld      $2,&H0A
01DC:  54 00 FF 00  ppo     &HFF
01DE:  12 02        stl     $2
01DF:  F7 00        rtn   
01E0:  77 F2 00 01  cal     &H01F2
01E2:  1E 60        gst     ua,$0
01E3:  96 02        pre     ix,$2
01E4:  D1 02 35 11  ldw     $2,&H1135
01E6:  E8 04 A0 00  ldm     $4,(ix+$sx),6
01E8:  16 60        pst     ua,$0
01E9:  96 02        pre     ix,$2
01EA:  E0 04 A0 00  stm     $4,(ix+$sx),6
01EC:  F7 00        rtn   
01ED:  D6 00 01 11  pre     ix,&H1101
01EF:  28 A0        ld      $0,(ix-$sy)
01F0:  44 80 08 0D  anc     $0,&H08,jr &H01FE
01F2:  D6 00 01 11  pre     ix,&H1101
01F4:  A8 00        ldw     $0,(ix+$sx)
01F5:  09 60 01 00  sb      $0,$1
01F7:  02 01        ld      $1,$sx
01F8:  D1 02 3C 12  ldw     $2,&H123C
01FA:  98 60        biuw    $0
01FB:  88 42        adw     $2,$sz
01FC:  98 60        biuw    $0
01FD:  88 42        adw     $2,$sz
01FE:  F7 00        rtn   
01FF:  D6 00 3B 11  pre     ix,&H113B
0201:  2C 41        ldd     $1,(ix+$sz)
0202:  9E 02        gre     ix,$2
0203:  01 01        sbc     $1,$sx
0204:  F7 00        rtn   
0205:  D1 02 82 00  ldw     $2,&H0082
0207:  77 0B 00 02  cal     &H020B
0209:  42 02 92 00  ld      $2,&H92
020B:  54 00 FF 00  ppo     &HFF
020D:  D2 02 40 00  stlm    $2,3
020F:  54 00 FE 00  ppo     &HFE
0211:  42 05 0B 00  ld      $5,&H0B
0213:  77 19 00 02  cal     &H0219
0215:  41 02 92 00  sbc     $2,&H92
0217:  B0 09        jr      z,&H0220
0218:  02 25        ld      $5,$sy
0219:  EA 06 E0 00  ldim    $6,(ix+$sx),8
021B:  D2 06 E0 00  stlm    $6,8
021D:  09 25        sb      $5,$sy
021E:  B4 85        jr      nz,&H01A3
021F:  F7 00        rtn   
0220:  EA 06 E0 00  ldim    $6,(ix+$sx),8
0222:  D2 06 C0 00  stlm    $6,7
0224:  F7 00        rtn   
0225:  02 65 04 00  ld      $5,$4
0227:  18 44        bid     $4
0228:  1A 04        did     $4
0229:  44 05 10 00  anc     $5,&H10
022B:  B0 03        jr      z,&H022E
022C:  4E 02 10 00  or      $2,&H10
022E:  1A 25        diu     $5
022F:  02 03        ld      $3,$sx
0230:  18 65        biu     $5
0231:  B1 03        jr      nc,&H0234
0232:  48 03 80 00  ad      $3,&H80
0234:  18 65        biu     $5
0235:  B1 03        jr      nc,&H0238
0236:  48 03 30 00  ad      $3,&H30
0238:  49 05 40 00  sb      $5,&H40
023A:  F5 00        rtn     c
023B:  48 83 0C 84  ad      $3,&H0C,jr &H01C0
023D:  77 1C 00 00  cal     &H001C
023F:  4C 81 EF 09  an      $1,&HEF,jr &H0249
0241:  77 1C 00 00  cal     &H001C
0243:  44 01 10 00  anc     $1,&H10
0245:  F0 00        rtn     z
0246:  B7 03        jr      &H0249
0247:  77 1C 00 00  cal     &H001C
0249:  44 01 02 00  anc     $1,&H02
024B:  F0 00        rtn     z
024C:  4F 01 10 00  xr      $1,&H10
024E:  24 01        std     $1,(ix+$sx)
024F:  2C 0A        ldd     $10,(ix+$sx)
0250:  77 E0 00 01  cal     &H01E0
0252:  44 0A 10 00  anc     $10,&H10
0254:  B0 0E        jr      z,&H0262
0255:  37 95 00 0D  jp      &H0D95
0257:  E6 10 A0 00  phsm    $16,6
0259:  77 86 00 02  cal     &H0286
025B:  CF 64 AB 00  xrm     $4,$11,6
025D:  EE 0B A0 00  ppsm    $11,6
025F:  96 02        pre     ix,$2
0260:  E0 04 A0 00  stm     $4,(ix+$sx),6
0262:  D6 00 01 11  pre     ix,&H1101
0264:  A8 04        ldw     $4,(ix+$sx)
0265:  09 64 05 00  sb      $4,$5
0267:  F5 00        rtn     c
0268:  68 05 09 00  ld      $5,(ix+&H09)
026A:  01 64 05 00  sbc     $4,$5
026C:  F1 00        rtn     nc
026D:  96 02        pre     ix,$2
026E:  42 02 82 00  ld      $2,&H82
0270:  77 25 00 02  cal     &H0225
0272:  54 00 FF 00  ppo     &HFF
0274:  D2 02 40 00  stlm    $2,3
0276:  E8 05 A0 00  ldm     $5,(ix+$sx),6
0278:  54 00 FE 00  ppo     &HFE
027A:  41 03 D4 00  sbc     $3,&HD4
027C:  B0 04        jr      z,&H0280
027D:  D2 05 A0 00  stlm    $5,6
027F:  F7 00        rtn   
0280:  41 02 92 00  sbc     $2,&H92
0282:  B4 85        jr      nz,&H0207
0283:  D2 05 80 00  stlm    $5,5
0285:  B7 86        jr      &H020B
0286:  37 AD 00 0D  jp      &H0DAD
0288:  02 20        ld      $0,$sy
0289:  D6 00 13 11  pre     ix,&H1113
028B:  2C 01        ldd     $1,(ix+$sx)
028C:  44 01 20 00  anc     $1,&H20
028E:  B0 03        jr      z,&H0291
028F:  42 00 03 00  ld      $0,&H03
0291:  02 0B        ld      $11,$sx
0292:  02 4C        ld      $12,$sz
0293:  02 4D        ld      $13,$sz
0294:  02 4E        ld      $14,$sz
0295:  02 0F        ld      $15,$sx
0296:  02 10        ld      $16,$sx
0297:  18 61        biu     $1
0298:  F5 00        rtn     c
0299:  02 4B        ld      $11,$sz
029A:  82 EF 0C 9C  ldw     $15,$12,jr &H0237
029C:  77 BB 00 02  cal     &H02BB
029E:  77 CD 00 02  cal     &H02CD
02A0:  EA A0 80 00  ldim    $0,(ix-$sy),5
02A2:  44 00 08 00  anc     $0,&H08
02A4:  B4 12        jr      nz,&H02B6
02A5:  0D 00        na      $0,$sx
02A6:  A0 3F        stw     $31,(ix+$sy)
02A7:  2C 00        ldd     $0,(ix+$sx)
02A8:  01 43        sbc     $3,$sz
02A9:  B5 03        jr      c,&H02AC
02AA:  02 60 03 00  ld      $0,$3
02AC:  01 44        sbc     $4,$sz
02AD:  B1 03        jr      nc,&H02B0
02AE:  02 60 03 00  ld      $0,$3
02B0:  01 41        sbc     $1,$sz
02B1:  B1 02        jr      nc,&H02B3
02B2:  9A 41        bydw    $1
02B3:  24 00        std     $0,(ix+$sx)
02B4:  01 1E        sbc     $30,$sx
02B5:  F7 00        rtn   
02B6:  A8 20        ldw     $0,(ix+$sy)
02B7:  60 80 02 00  st      $0,(ix-&H02)
02B9:  20 A1        st      $1,(ix-$sy)
02BA:  B7 87        jr      &H0241
02BB:  D1 01 01 11  ldw     $1,&H1101
02BD:  11 60 01 00  ld      $0,($1)
02BF:  4E 00 1F 00  or      $0,&H1F
02C1:  D6 00 3B 11  pre     ix,&H113B
02C3:  49 00 20 00  sb      $0,&H20
02C5:  B5 03        jr      c,&H02C8
02C6:  3A 5F        sbc     (ix+$sz),$31
02C7:  B4 84        jr      nz,&H024B
02C8:  08 20        ad      $0,$sy
02C9:  96 01        pre     ix,$1
02CA:  60 00 02 00  st      $0,(ix+&H02)
02CC:  F7 00        rtn   
02CD:  2C 00        ldd     $0,(ix+$sx)
02CE:  4E 00 1F 00  or      $0,&H1F
02D0:  D6 00 3B 11  pre     ix,&H113B
02D2:  3A 5F        sbc     (ix+$sz),$31
02D3:  B4 05        jr      nz,&H02D8
02D4:  96 01        pre     ix,$1
02D5:  60 00 03 00  st      $0,(ix+&H03)
02D7:  F7 00        rtn   
02D8:  48 00 20 00  ad      $0,&H20
02DA:  B1 88        jr      nc,&H0262
02DB:  49 80 20 88  sb      $0,&H20,jr &H0264
02DD:  42 81 E0 03  ld      $1,&HE0,jr &H02E1
02DF:  42 01 20 00  ld      $1,&H20
02E1:  3C 21        ad      (ix+$sy),$1
02E2:  F7 00        rtn   
02E3:  D1 01 04 11  ldw     $1,&H1104
02E5:  11 60 01 00  ld      $0,($1)
02E7:  77 F2 00 02  cal     &H02F2
02E9:  96 01        pre     ix,$1
02EA:  3A 00        sbc     (ix+$sx),$0
02EB:  B1 02        jr      nc,&H02ED
02EC:  2C 00        ldd     $0,(ix+$sx)
02ED:  3A 20        sbc     (ix+$sy),$0
02EE:  F0 00        rtn     z
02EF:  F5 00        rtn     c
02F0:  28 20        ld      $0,(ix+$sy)
02F1:  F7 00        rtn   
02F2:  D6 00 3B 11  pre     ix,&H113B
02F4:  3A 5F        sbc     (ix+$sz),$31
02F5:  B4 05        jr      nz,&H02FA
02F6:  01 00        sbc     $0,$sx
02F7:  F0 00        rtn     z
02F8:  09 A0 00 85  sb      $0,$sy,jr &H027E
02FA:  08 20        ad      $0,$sy
02FB:  F4 00        rtn     nz
02FC:  09 20        sb      $0,$sy
02FD:  F7 00        rtn   
02FE:  77 E3 00 02  cal     &H02E3
0300:  60 00 04 00  st      $0,(ix+&H04)
0302:  02 42        ld      $2,$sz
0303:  2C 20        ldd     $0,(ix+$sy)
0304:  02 43        ld      $3,$sz
0305:  42 01 20 00  ld      $1,&H20
0307:  D6 00 3B 11  pre     ix,&H113B
0309:  01 42        sbc     $2,$sz
030A:  F0 00        rtn     z
030B:  3A 41        sbc     (ix+$sz),$1
030C:  B1 02        jr      nc,&H030E
030D:  20 41        st      $1,(ix+$sz)
030E:  08 A0 00 86  ad      $0,$sy,jr &H0295
0310:  77 1C 00 00  cal     &H001C
0312:  44 01 02 00  anc     $1,&H02
0314:  F7 00        rtn   
0315:  42 80 20 08  ld      $0,&H20,jr &H031E
0317:  42 80 08 06  ld      $0,&H08,jr &H031E
0319:  42 80 04 04  ld      $0,&H04,jr &H031E
031B:  42 80 02 02  ld      $0,&H02,jr &H031E
031D:  02 20        ld      $0,$sy
031E:  77 1C 00 00  cal     &H001C
0320:  0E 41        or      $1,$sz
0321:  24 01        std     $1,(ix+$sx)
0322:  F7 00        rtn   
0323:  77 B0 00 0D  cal     &H0DB0
0325:  4C 01 EF 00  an      $1,&HEF
0327:  24 01        std     $1,(ix+$sx)
0328:  42 80 F7 09  ld      $0,&HF7,jr &H0332
032A:  42 80 DF 07  ld      $0,&HDF,jr &H0332
032C:  42 80 FB 05  ld      $0,&HFB,jr &H0332
032E:  42 80 FD 03  ld      $0,&HFD,jr &H0332
0330:  42 00 FE 00  ld      $0,&HFE
0332:  77 1C 00 00  cal     &H001C
0334:  0C C1 00 94  an      $1,$sz,jr &H02C9
0336:  77 3A 00 03  cal     &H033A
0338:  37 E6 00 01  jp      &H01E6
033A:  1E 60        gst     ua,$0
033B:  26 00        phs     $0
033C:  02 60 10 00  ld      $0,$16
033E:  02 01        ld      $1,$sx
033F:  49 00 20 00  sb      $0,&H20
0341:  B1 02        jr      nc,&H0343
0342:  02 00        ld      $0,$sx
0343:  41 00 DC 00  sbc     $0,&HDC
0345:  B1 0C        jr      nc,&H0351
0346:  77 B3 00 0D  cal     &H0DB3
0348:  56 60 24 00  pst     ua,&H24
034A:  98 60        biuw    $0
034B:  88 45        adw     $5,$sz
034C:  98 60        biuw    $0
034D:  88 45        adw     $5,$sz
034E:  96 05        pre     ix,$5
034F:  2E 00        pps     $0
0350:  F7 00        rtn   
0351:  D1 05 3C 15  ldw     $5,&H153C
0353:  49 80 DC 8A  sb      $0,&HDC,jr &H02DE
0355:  D6 00 1B 11  pre     ix,&H111B
0357:  E8 21 80 00  ldm     $1,(ix+$sy),5
0359:  3A 03        sbc     (ix+$sx),$3
035A:  B0 0E        jr      z,&H0368
035B:  3C 1E        ad      (ix+$sx),$30
035C:  08 22        ad      $2,$sy
035D:  01 62 03 00  sbc     $2,$3
035F:  B4 02        jr      nz,&H0361
0360:  02 02        ld      $2,$sx
0361:  64 02 02 00  std     $2,(ix+&H02)
0363:  96 04        pre     ix,$4
0364:  24 60 02 00  std     $0,(ix+$2)
0366:  00 3F        adc     $31,$sy
0367:  F7 00        rtn   
0368:  01 3F        sbc     $31,$sy
0369:  F7 00        rtn   
036A:  D6 00 1B 11  pre     ix,&H111B
036C:  E8 20 80 00  ldm     $0,(ix+$sy),5
036E:  3A 1E        sbc     (ix+$sx),$30
036F:  F5 00        rtn     c
0370:  3E 1E        sb      (ix+$sx),$30
0371:  08 20        ad      $0,$sy
0372:  01 42        sbc     $2,$sz
0373:  B4 02        jr      nz,&H0375
0374:  02 00        ld      $0,$sx
0375:  24 20        std     $0,(ix+$sy)
0376:  96 03        pre     ix,$3
0377:  2C 40        ldd     $0,(ix+$sz)
0378:  B7 92        jr      &H030A
0379:  D6 00 1B 11  pre     ix,&H111B
037B:  22 1F        sti     $31,(ix+$sx)
037C:  22 1F        sti     $31,(ix+$sx)
037D:  24 1F        std     $31,(ix+$sx)
037E:  F7 00        rtn   
037F:  42 00 4D 00  ld      $0,&H4D
0381:  17 00        pst     ia,$0
0382:  C0 64 24 00  adbcm   $4,$4,2
0384:  C0 64 24 00  adbcm   $4,$4,2
0386:  9F 61        gre     ky,$1
0387:  57 00 40 00  pst     ia,&H40
0389:  4C 82 E0 8C  an      $2,&HE0,jr &H0316
038B:  F0 00        rtn     z
038C:  57 00 40 00  pst     ia,&H40
038E:  9F 61        gre     ky,$1
038F:  4C 02 E0 00  an      $2,&HE0
0391:  06 E1 02 87  orc     $1,$2,jr &H0319
0393:  77 1C 00 00  cal     &H001C
0395:  04 21        anc     $1,$sy
0396:  F0 00        rtn     z
0397:  D6 00 14 11  pre     ix,&H1114
0399:  A8 00        ldw     $0,(ix+$sx)
039A:  7A 1F 07 00  sbc     (ix+&H07),$31
039C:  F4 00        rtn     nz
039D:  41 01 07 00  sbc     $1,&H07
039F:  F4 00        rtn     nz
03A0:  4E 00 04 00  or      $0,&H04
03A2:  24 00        std     $0,(ix+$sx)
03A3:  F7 00        rtn   
03A4:  D6 00 0D 11  pre     ix,&H110D
03A6:  28 20        ld      $0,(ix+$sy)
03A7:  24 00        std     $0,(ix+$sx)
03A8:  D6 00 0F 11  pre     ix,&H110F
03AA:  28 20        ld      $0,(ix+$sy)
03AB:  24 00        std     $0,(ix+$sx)
03AC:  77 71 00 01  cal     &H0171
03AE:  D6 00 0D 11  pre     ix,&H110D
03B0:  3A 1F        sbc     (ix+$sx),$31
03B1:  B4 09        jr      nz,&H03BA
03B2:  77 7C 00 01  cal     &H017C
03B4:  28 20        ld      $0,(ix+$sy)
03B5:  24 00        std     $0,(ix+$sx)
03B6:  77 47 00 02  cal     &H0247
03B8:  77 71 00 01  cal     &H0171
03BA:  77 F3 00 03  cal     &H03F3
03BC:  D6 00 1B 11  pre     ix,&H111B
03BE:  3A 1F        sbc     (ix+$sx),$31
03BF:  B0 91        jr      z,&H0350
03C0:  77 7C 00 01  cal     &H017C
03C2:  77 6C 00 03  cal     &H036C
03C4:  D6 00 14 11  pre     ix,&H1114
03C6:  2C 01        ldd     $1,(ix+$sx)
03C7:  41 00 FC 00  sbc     $0,&HFC
03C9:  B0 15        jr      z,&H03DE
03CA:  44 01 10 00  anc     $1,&H10
03CC:  B0 0A        jr      z,&H03D6
03CD:  41 00 1E 00  sbc     $0,&H1E
03CF:  B0 13        jr      z,&H03E2
03D0:  41 00 1F 00  sbc     $0,&H1F
03D2:  B0 13        jr      z,&H03E5
03D3:  4C 01 EF 00  an      $1,&HEF
03D5:  24 01        std     $1,(ix+$sx)
03D6:  41 00 03 00  sbc     $0,&H03
03D8:  30 98 00 0D  jp      z,&H0D98
03DA:  41 00 13 00  sbc     $0,&H13
03DC:  B0 25        jr      z,&H0401
03DD:  F7 00        rtn   
03DE:  4E 01 10 00  or      $1,&H10
03E0:  24 01        std     $1,(ix+$sx)
03E1:  B7 B9        jr      &H039A
03E2:  77 9C 00 01  cal     &H019C
03E4:  B7 03        jr      &H03E7
03E5:  77 98 00 01  cal     &H0198
03E7:  D6 00 14 11  pre     ix,&H1114
03E9:  A8 00        ldw     $0,(ix+$sx)
03EA:  77 9D 00 03  cal     &H039D
03EC:  B7 C4        jr      &H03B0
03ED:  1C 40        gfl     $0
03EE:  1C 41        gfl     $1
03EF:  01 41        sbc     $1,$sz
03F0:  B4 83        jr      nz,&H0373
03F1:  44 81 08 95  anc     $1,&H08,jr &H0387
03F3:  D6 00 0F 11  pre     ix,&H110F
03F5:  3A 1E        sbc     (ix+$sx),$30
03F6:  B5 0B        jr      c,&H0401
03F7:  1C 40        gfl     $0
03F8:  1C 41        gfl     $1
03F9:  01 41        sbc     $1,$sz
03FA:  B4 83        jr      nz,&H037D
03FB:  04 21        anc     $1,$sy
03FC:  30 AA 00 0D  jp      z,&H0DAA
03FE:  77 ED 00 03  cal     &H03ED
0400:  F4 00        rtn     nz
0401:  37 8F 00 0D  jp      &H0D8F
0403:  77 ED 00 03  cal     &H03ED
0405:  B0 04        jr      z,&H0409
0406:  44 01 04 00  anc     $1,&H04
0408:  F0 00        rtn     z
0409:  37 B6 00 0D  jp      &H0DB6
040B:  D6 00 15 11  pre     ix,&H1115
040D:  77 8C 00 03  cal     &H038C
040F:  38 1F        adc     (ix+$sx),$31
0410:  B4 16        jr      nz,&H0426
0411:  77 7F 00 03  cal     &H037F
0413:  81 21        sbcw    $1,$sy
0414:  F5 00        rtn     c
0415:  77 8C 00 03  cal     &H038C
0417:  42 00 4C 00  ld      $0,&H4C
0419:  77 81 00 03  cal     &H0381
041B:  81 21        sbcw    $1,$sy
041C:  B1 04        jr      nc,&H0420
041D:  09 20        sb      $0,$sy
041E:  B6 85        jr      nlz,&H03A3
041F:  F7 00        rtn   
0420:  E0 20 40 00  stm     $0,(ix+$sy),3
0422:  42 00 20 00  ld      $0,&H20
0424:  24 00        std     $0,(ix+$sx)
0425:  F7 00        rtn   
0426:  E8 00 60 00  ldm     $0,(ix+$sx),4
0428:  17 01        pst     ia,$1
0429:  C0 64 24 00  adbcm   $4,$4,2
042B:  C0 64 24 00  adbcm   $4,$4,2
042D:  9F 64        gre     ky,$4
042E:  4C 05 E0 00  an      $5,&HE0
0430:  49 00 10 00  sb      $0,&H10
0432:  57 00 40 00  pst     ia,&H40
0434:  B6 26        jr      nlz,&H045A
0435:  81 62 04 00  sbcw    $2,$4
0437:  B0 03        jr      z,&H043A
0438:  24 1F        std     $31,(ix+$sx)
0439:  F7 00        rtn   
043A:  24 00        std     $0,(ix+$sx)
043B:  01 00        sbc     $0,$sx
043C:  F4 00        rtn     nz
043D:  02 06        ld      $6,$sx
043E:  02 00        ld      $0,$sx
043F:  08 20        ad      $0,$sy
0440:  18 63        biu     $3
0441:  18 22        rou     $2
0442:  B1 83        jr      nc,&H03C5
0443:  81 22        sbcw    $2,$sy
0444:  B1 A2        jr      nc,&H03E6
0445:  4C 01 0F 00  an      $1,&H0F
0447:  26 06        phs     $6
0448:  77 92 00 0D  cal     &H0D92
044A:  2E 06        pps     $6
044B:  D6 00 15 11  pre     ix,&H1115
044D:  28 A0        ld      $0,(ix-$sy)
044E:  4C 00 FB 00  an      $0,&HFB
0450:  20 A0        st      $0,(ix-$sy)
0451:  D1 04 B4 14  ldw     $4,&H14B4
0453:  01 06        sbc     $6,$sx
0454:  B0 02        jr      z,&H0456
0455:  9A 45        bydw    $5
0456:  60 04 04 00  st      $4,(ix+&H04)
0458:  42 80 07 B5  ld      $0,&H07,jr &H040E
045A:  84 62 04 00  ancw    $2,$4
045C:  28 A0        ld      $0,(ix-$sy)
045D:  B4 03        jr      nz,&H0460
045E:  3E 1E        sb      (ix+$sx),$30
045F:  F7 00        rtn   
0460:  4C 00 04 00  an      $0,&H04
0462:  B0 8A        jr      z,&H03EC
0463:  68 04 04 00  ld      $4,(ix+&H04)
0465:  09 24        sb      $4,$sy
0466:  B4 90        jr      nz,&H03F6
0467:  68 04 05 00  ld      $4,(ix+&H05)
0469:  60 84 02 00  st      $4,(ix-&H02)
046B:  02 A6 00 AE  ld      $6,$sy,jr &H041A
046D:  D1 03 11 11  ldw     $3,&H1111
046F:  10 FE 03 91  st      $30,($3),jr &H0401
0471:  02 07        ld      $7,$sx
0472:  44 02 20 00  anc     $2,&H20
0474:  B0 2C        jr      z,&H04A0
0475:  77 AB 00 00  cal     &H00AB
0477:  B1 16        jr      nc,&H048D
0478:  77 B6 00 00  cal     &H00B6
047A:  02 01        ld      $1,$sx
047B:  D1 03 BF 0B  ldw     $3,&H0BBF
047D:  77 82 00 05  cal     &H0582
047F:  D1 03 11 11  ldw     $3,&H1111
0481:  91 65 03 00  ldw     $5,($3)
0483:  41 00 06 00  sbc     $0,&H06
0485:  B0 20        jr      z,&H04A5
0486:  01 25        sbc     $5,$sy
0487:  B4 2C        jr      nz,&H04B3
0488:  01 00        sbc     $0,$sx
0489:  B3 28        jr      uz,&H04B1
048A:  02 45        ld      $5,$sz
048B:  10 E5 03 AD  st      $5,($3),jr &H0439
048D:  D1 03 11 11  ldw     $3,&H1111
048F:  91 65 03 00  ldw     $5,($3)
0491:  10 7E 03 00  st      $30,($3)
0493:  41 05 1F 00  sbc     $5,&H1F
0495:  B0 04        jr      z,&H0499
0496:  41 06 1F 00  sbc     $6,&H1F
0498:  B4 08        jr      nz,&H04A0
0499:  02 27        ld      $7,$sy
049A:  DA 60 40 00  byum    $0,3
049C:  42 00 DD 00  ld      $0,&HDD
049E:  01 81 00 02  sbc     $1,$sx,jr &H04A1
04A0:  01 00        sbc     $0,$sx
04A1:  B4 02        jr      nz,&H04A3
04A2:  08 27        ad      $7,$sy
04A3:  37 57 00 05  jp      &H0557
04A5:  42 00 DD 00  ld      $0,&HDD
04A7:  41 05 1F 00  sbc     $5,&H1F
04A9:  B0 04        jr      z,&H04AD
04AA:  41 06 1F 00  sbc     $6,&H1F
04AC:  B4 03        jr      nz,&H04AF
04AD:  02 41        ld      $1,$sz
04AE:  02 27        ld      $7,$sy
04AF:  37 55 00 05  jp      &H0555
04B1:  48 80 B1 92  ad      $0,&HB1,jr &H0444
04B3:  02 01        ld      $1,$sx
04B4:  01 20        sbc     $0,$sy
04B5:  B3 15        jr      uz,&H04CA
04B6:  01 06        sbc     $6,$sx
04B7:  B0 02        jr      z,&H04B9
04B8:  9A 46        bydw    $6
04B9:  02 46        ld      $6,$sz
04BA:  41 05 1F 00  sbc     $5,&H1F
04BC:  B4 06        jr      nz,&H04C2
04BD:  41 06 33 00  sbc     $6,&H33
04BF:  B0 B4        jr      z,&H0473
04C0:  42 80 DD 06  ld      $0,&HDD,jr &H04C7
04C2:  01 65 06 00  sbc     $5,$6
04C4:  B4 B9        jr      nz,&H047D
04C5:  42 00 AF 00  ld      $0,&HAF
04C7:  9A 46        bydw    $6
04C8:  10 E5 03 A6  st      $5,($3),jr &H046F
04CA:  01 06        sbc     $6,$sx
04CB:  B0 2C        jr      z,&H04F7
04CC:  41 06 33 00  sbc     $6,&H33
04CE:  B4 06        jr      nz,&H04D4
04CF:  41 05 30 00  sbc     $5,&H30
04D1:  B3 25        jr      uz,&H04F6
04D2:  02 A6 00 24  ld      $6,$sy,jr &H04F7
04D4:  41 06 15 00  sbc     $6,&H15
04D6:  B4 0B        jr      nz,&H04E1
04D7:  41 05 1A 00  sbc     $5,&H1A
04D9:  B4 1D        jr      nz,&H04F6
04DA:  41 00 02 00  sbc     $0,&H02
04DC:  B4 1A        jr      nz,&H04F6
04DD:  02 86 00 19  ld      $6,$sx,jr &H04F7
04DF:  42 80 DD 75  ld      $0,&HDD,jr &H0555
04E1:  41 06 24 00  sbc     $6,&H24
04E3:  B4 13        jr      nz,&H04F6
04E4:  41 05 15 00  sbc     $5,&H15
04E6:  B0 0E        jr      z,&H04F4
04E7:  41 05 18 00  sbc     $5,&H18
04E9:  B0 09        jr      z,&H04F2
04EA:  41 05 5A 00  sbc     $5,&H5A
04EC:  B0 04        jr      z,&H04F0
04ED:  41 05 1A 00  sbc     $5,&H1A
04EF:  B4 07        jr      nz,&H04F6
04F0:  48 85 02 34  ad      $5,&H02,jr &H0525
04F2:  42 05 1A 00  ld      $5,&H1A
04F4:  02 86 00 2E  ld      $6,$sx,jr &H0523
04F6:  9A 46        bydw    $6
04F7:  41 05 38 00  sbc     $5,&H38
04F9:  B4 06        jr      nz,&H04FF
04FA:  04 20        anc     $0,$sy
04FB:  B0 2F        jr      z,&H052A
04FC:  02 41        ld      $1,$sz
04FD:  42 80 B3 7F  ld      $0,&HB3,jr &H057D
04FF:  41 05 2F 00  sbc     $5,&H2F
0501:  B4 02        jr      nz,&H0503
0502:  09 25        sb      $5,$sy
0503:  41 05 18 00  sbc     $5,&H18
0505:  B4 0B        jr      nz,&H0510
0506:  01 26        sbc     $6,$sy
0507:  B4 03        jr      nz,&H050A
0508:  42 85 1A 07  ld      $5,&H1A,jr &H0510
050A:  04 20        anc     $0,$sy
050B:  B0 03        jr      z,&H050E
050C:  42 85 15 03  ld      $5,&H15,jr &H0510
050E:  42 05 10 00  ld      $5,&H10
0510:  41 05 31 00  sbc     $5,&H31
0512:  B4 0A        jr      nz,&H051C
0513:  02 27        ld      $7,$sy
0514:  02 42        ld      $2,$sz
0515:  D1 00 B3 DE  ldw     $0,&HDEB3
0517:  41 02 02 00  sbc     $2,&H02
0519:  B0 3C        jr      z,&H0555
051A:  48 82 A7 39  ad      $2,&HA7,jr &H0554
051C:  41 05 4F 00  sbc     $5,&H4F
051E:  B4 08        jr      nz,&H0526
051F:  42 05 55 00  ld      $5,&H55
0521:  01 26        sbc     $6,$sy
0522:  B0 04        jr      z,&H0526
0523:  01 20        sbc     $0,$sy
0524:  B0 02        jr      z,&H0526
0525:  02 26        ld      $6,$sy
0526:  04 26        anc     $6,$sy
0527:  B0 49        jr      z,&H0570
0528:  02 42        ld      $2,$sz
0529:  02 20        ld      $0,$sy
052A:  49 05 10 00  sb      $5,&H10
052C:  08 60 05 00  ad      $0,$5
052E:  4C 00 3F 00  an      $0,&H3F
0530:  D1 03 1A 0C  ldw     $3,&H0C1A
0532:  77 82 00 05  cal     &H0582
0534:  44 05 40 00  anc     $5,&H40
0536:  B0 03        jr      z,&H0539
0537:  42 81 DE 06  ld      $1,&HDE,jr &H053E
0539:  44 05 80 00  anc     $5,&H80
053B:  B0 04        jr      z,&H053F
053C:  42 01 DF 00  ld      $1,&HDF
053E:  02 27        ld      $7,$sy
053F:  01 26        sbc     $6,$sy
0540:  B4 15        jr      nz,&H0555
0541:  08 27        ad      $7,$sy
0542:  D1 03 47 0C  ldw     $3,&H0C47
0544:  08 63 02 00  ad      $3,$2
0546:  A6 01        phsw    $1
0547:  77 83 00 05  cal     &H0583
0549:  02 42        ld      $2,$sz
054A:  AE 00        ppsw    $0
054B:  01 27        sbc     $7,$sy
054C:  B4 09        jr      nz,&H0555
054D:  02 E1 02 07  ld      $1,$2,jr &H0555
054F:  41 00 03 00  sbc     $0,&H03
0551:  B4 A7        jr      nz,&H04F8
0552:  D1 00 B2 AA  ldw     $0,&HAAB2
0554:  08 27        ad      $7,$sy
0555:  77 6D 00 04  cal     &H046D
0557:  D6 00 1B 11  pre     ix,&H111B
0559:  2C 03        ldd     $3,(ix+$sx)
055A:  08 63 07 00  ad      $3,$7
055C:  48 03 F1 00  ad      $3,&HF1
055E:  B5 07        jr      c,&H0565
055F:  A6 02        phsw    $2
0560:  77 55 00 03  cal     &H0355
0562:  AE 00        ppsw    $0
0563:  09 A7 00 86  sb      $7,$sy,jr &H04EA
0565:  D6 00 15 11  pre     ix,&H1115
0567:  68 82 02 00  ld      $2,(ix-&H02)
0569:  60 02 05 00  st      $2,(ix+&H05)
056B:  4C 02 7F 00  an      $2,&H7F
056D:  60 82 02 00  st      $2,(ix-&H02)
056F:  F7 00        rtn   
0570:  41 05 30 00  sbc     $5,&H30
0572:  B0 0D        jr      z,&H057F
0573:  B3 A4        jr      uz,&H0517
0574:  41 05 25 00  sbc     $5,&H25
0576:  B4 CC        jr      nz,&H0542
0577:  02 41        ld      $1,$sz
0578:  42 00 CC 00  ld      $0,&HCC
057A:  41 01 02 00  sbc     $1,&H02
057C:  B0 A7        jr      z,&H0523
057D:  48 81 A7 AA  ad      $1,&HA7,jr &H0528
057F:  02 41        ld      $1,$sz
0580:  42 80 B8 84  ld      $0,&HB8,jr &H0505
0582:  88 43        adw     $3,$sz
0583:  96 43        pre     iz,$3
0584:  A9 00        ldw     $0,(iz+$sx)
0585:  F7 00        rtn   
0586:  9E 51        gre     iz,$17
0587:  3A 1F        sbc     (ix+$sx),$31
0588:  B0 13        jr      z,&H059B
0589:  2A 01        ldi     $1,(ix+$sx)
058A:  2B 00        ldi     $0,(iz+$sx)
058B:  44 00 80 00  anc     $0,&H80
058D:  B4 09        jr      nz,&H0596
058E:  77 B6 00 00  cal     &H00B6
0590:  09 41        sb      $1,$sz
0591:  B0 88        jr      z,&H0519
0592:  41 01 80 00  sbc     $1,&H80
0594:  B0 0A        jr      z,&H059E
0595:  28 A1        ld      $1,(ix-$sy)
0596:  18 61        biu     $1
0597:  2A 01        ldi     $1,(ix+$sx)
0598:  B1 82        jr      nc,&H051A
0599:  96 D1 00 93  pre     iz,$17,jr &H052D
059B:  2C 20        ldd     $0,(ix+$sy)
059C:  96 51        pre     iz,$17
059D:  F7 00        rtn   
059E:  2C 11        ldd     $17,(ix+$sx)
059F:  01 3F        sbc     $31,$sy
05A0:  F7 00        rtn   
05A1:  C2 60 EA 00  ldm     $0,$10,8
05A3:  02 68 12 00  ld      $8,$18
05A5:  37 5C 00 00  jp      &H005C
05A7:  77 49 00 00  cal     &H0049
05A9:  41 00 2B 00  sbc     $0,&H2B
05AB:  F0 00        rtn     z
05AC:  41 00 07 00  sbc     $0,&H07
05AE:  F0 00        rtn     z
05AF:  41 00 2D 00  sbc     $0,&H2D
05B1:  F7 00        rtn   
05B2:  01 10        sbc     $16,$sx
05B3:  F0 00        rtn     z
05B4:  4A 12 05 00  adb     $18,&H05
05B6:  4C 12 0F 00  an      $18,&H0F
05B8:  F7 00        rtn   
05B9:  77 C5 00 0A  cal     &H0AC5
05BB:  D1 05 FF FF  ldw     $5,&HFFFF
05BD:  B7 03        jr      &H05C0
05BE:  77 BF 00 0A  cal     &H0ABF
05C0:  41 00 14 00  sbc     $0,&H14
05C2:  B0 08        jr      z,&H05CA
05C3:  41 00 12 00  sbc     $0,&H12
05C5:  B0 03        jr      z,&H05C8
05C6:  8F EF 05 05  xrw     $15,$5,jr &H05CC
05C8:  8C EF 05 03  anw     $15,$5,jr &H05CC
05CA:  8E 6F 05 00  orw     $15,$5
05CC:  37 97 00 0A  jp      &H0A97
05CE:  4A 12 05 00  adb     $18,&H05
05D0:  4C 92 0F 09  an      $18,&H0F,jr &H05DA
05D2:  77 69 00 06  cal     &H0669
05D4:  4A 08 05 00  adb     $8,&H05
05D6:  4C 88 0F 03  an      $8,&H0F,jr &H05DA
05D8:  77 69 00 06  cal     &H0669
05DA:  77 A6 00 06  cal     &H06A6
05DC:  B1 07        jr      nc,&H05E3
05DD:  77 60 00 09  cal     &H0960
05DF:  77 B8 00 06  cal     &H06B8
05E1:  77 60 00 09  cal     &H0960
05E3:  01 1B        sbc     $27,$sx
05E4:  B0 05        jr      z,&H05E9
05E5:  DA 20 C0 00  dium    $0,7
05E7:  DA 2A C0 00  dium    $10,7
05E9:  A6 12        phsw    $18
05EA:  C2 54 C0 00  ldm     $20,$sz,7
05EC:  8B 71 07 00  sbbw    $17,$7
05EE:  01 12        sbc     $18,$sx
05EF:  B4 04        jr      nz,&H05F3
05F0:  41 11 15 00  sbc     $17,&H15
05F2:  B5 05        jr      c,&H05F7
05F3:  C9 F3 F3 05  sbbm    $19,$19,8,jr &H05F9
05F5:  DA 1A E0 00  didm    $26,8
05F7:  0B 31        sbb     $17,$sy
05F8:  B1 83        jr      nc,&H057B
05F9:  AE 11        ppsw    $17
05FA:  01 1B        sbc     $27,$sx
05FB:  B0 06        jr      z,&H0601
05FC:  8B 31        sbbw    $17,$sy
05FD:  DA 06 C0 00  didm    $6,7
05FF:  C9 EA D4 1D  sbbm    $10,$20,7,jr &H061D
0601:  C8 EA D4 1B  adbm    $10,$20,7,jr &H061D
0603:  C2 60 CA 00  ldm     $0,$10,7
0605:  82 67 11 00  ldw     $7,$17
0607:  02 13        ld      $19,$sx
0608:  C2 74 CA 00  ldm     $20,$10,7
060A:  4E 1B 0F 00  or      $27,&H0F
060C:  8A 71 07 00  adbw    $17,$7
060E:  0B 32        sbb     $18,$sy
060F:  C9 E9 E9 05  sbbm    $9,$9,8,jr &H0615
0611:  DA 1A E0 00  didm    $26,8
0613:  DA 10 E0 00  didm    $16,8
0615:  09 13        sb      $19,$sx
0616:  B2 05        jr      lz,&H061B
0617:  C8 4A C0 00  adbm    $10,$sz,7
0619:  09 B3 00 84  sb      $19,$sy,jr &H059E
061B:  09 3B        sb      $27,$sy
061C:  B6 8B        jr      nlz,&H05A7
061D:  44 10 F0 00  anc     $16,&HF0
061F:  B0 14        jr      z,&H0633
0620:  8A 31        adbw    $17,$sy
0621:  DA 10 C0 00  didm    $16,7
0623:  4C 12 0F 00  an      $18,&H0F
0625:  02 7B 12 00  ld      $27,$18
0627:  4A 1B 05 00  adb     $27,&H05
0629:  4B 1B 05 00  sbb     $27,&H05
062B:  B0 15        jr      z,&H0640
062C:  B1 83        jr      nc,&H05AF
062D:  41 1B 97 00  sbc     $27,&H97
062F:  30 A4 00 0D  jp      z,&H0DA4
0631:  B1 05        jr      nc,&H0636
0632:  F7 00        rtn   
0633:  C6 6A CA 00  orcm    $10,$10,7
0635:  B4 05        jr      nz,&H063A
0636:  89 71 11 00  sbw     $17,$17
0638:  C9 EA CA 87  sbbm    $10,$10,7,jr &H05C0
063A:  01 10        sbc     $16,$sx
063B:  B4 98        jr      nz,&H05D3
063C:  DA 2A C0 00  dium    $10,7
063E:  8B B1 00 85  sbbw    $17,$sy,jr &H05C4
0640:  40 91 FF 90  adc     $17,&HFF,jr &H05D1
0642:  77 69 00 06  cal     &H0669
0644:  77 B8 00 06  cal     &H06B8
0646:  C1 4A C0 00  sbbcm   $10,$sz,7
0648:  B1 02        jr      nc,&H064A
0649:  8B 31        sbbw    $17,$sy
064A:  77 65 00 06  cal     &H0665
064C:  8B 71 07 00  sbbw    $17,$7
064E:  0A 32        adb     $18,$sy
064F:  C6 6A CA 00  orcm    $10,$10,7
0651:  B0 B4        jr      z,&H0605
0652:  C9 F3 D3 07  sbbm    $19,$19,7,jr &H065A
0654:  DA 2A C0 00  dium    $10,7
0656:  DA 33 C0 00  dium    $19,7
0658:  B7 02        jr      &H065A
0659:  0A 33        adb     $19,$sy
065A:  C9 4A C0 00  sbbm    $10,$sz,7
065C:  B1 83        jr      nc,&H05DF
065D:  C8 4A C0 00  adbm    $10,$sz,7
065F:  01 19        sbc     $25,$sx
0660:  B0 8C        jr      z,&H05EC
0661:  C2 EA D3 C5  ldm     $10,$19,7,jr &H0627
0663:  40 92 FB 02  adc     $18,&HFB,jr &H0666
0665:  01 26        sbc     $6,$sy
0666:  35 A1 00 0D  jp      c,&H0DA1
0668:  F7 00        rtn   
0669:  02 28        ld      $8,$sy
066A:  82 26        ldw     $6,$sy
066B:  C9 C0 A0 84  sbbm    $0,$sz,6,jr &H05F0
066D:  77 63 00 06  cal     &H0663
066F:  C2 60 EA 00  ldm     $0,$10,8
0671:  02 68 12 00  ld      $8,$18
0673:  02 78 12 00  ld      $24,$18
0675:  C8 4A C0 00  adbm    $10,$sz,7
0677:  C8 6A CA 00  adbm    $10,$10,7
0679:  C8 4A C0 00  adbm    $10,$sz,7
067B:  B0 03        jr      z,&H067E
067C:  4A 08 05 00  adb     $8,&H05
067E:  04 31        anc     $17,$sy
067F:  B4 03        jr      nz,&H0682
0680:  DA 10 C0 00  didm    $16,7
0682:  8A 71 11 00  adbw    $17,$17
0684:  8A 71 11 00  adbw    $17,$17
0686:  8A 71 07 00  adbw    $17,$7
0688:  9A 12        didw    $18
0689:  02 78 08 00  ld      $24,$8
068B:  A6 12        phsw    $18
068C:  C9 71 B1 00  sbbm    $17,$17,6
068E:  C9 61 C1 00  sbbm    $1,$1,7
0690:  42 00 50 00  ld      $0,&H50
0692:  42 89 0D 02  ld      $9,&H0D,jr &H0695
0694:  08 21        ad      $1,$sy
0695:  C9 4F E0 00  sbbm    $15,$sz,8
0697:  B1 83        jr      nc,&H061A
0698:  C8 4F E0 00  adbm    $15,$sz,8
069A:  09 29        sb      $9,$sy
069B:  B0 08        jr      z,&H06A3
069C:  DA 21 C0 00  dium    $1,7
069E:  DA 71 C0 00  byum    $17,7
06A0:  DA 6A E0 00  byum    $10,8
06A2:  B7 8D        jr      &H062F
06A3:  AE 11        ppsw    $17
06A4:  C2 EA C1 BD  ldm     $10,$1,7,jr &H0662
06A6:  02 1B        ld      $27,$sx
06A7:  44 12 04 00  anc     $18,&H04
06A9:  B2 03        jr      lz,&H06AC
06AA:  41 88 05 03  sbc     $8,&H05,jr &H06AE
06AC:  40 08 FB 00  adc     $8,&HFB
06AE:  B1 05        jr      nc,&H06B3
06AF:  42 1B 05 00  ld      $27,&H05
06B1:  77 60 00 09  cal     &H0960
06B3:  81 71 07 00  sbcw    $17,$7
06B5:  F4 00        rtn     nz
06B6:  C1 EA C0 CF  sbbcm   $10,$0,7,jr &H0686
06B8:  E6 12 C0 00  phsm    $18,7
06BA:  A6 0B        phsw    $11
06BB:  C2 4A C0 00  ldm     $10,$sz,7
06BD:  82 71 07 00  ldw     $17,$7
06BF:  AE 00        ppsw    $0
06C0:  EE 02 C0 00  ppsm    $2,7
06C2:  F7 00        rtn   
06C3:  42 07 0A 00  ld      $7,&H0A
06C5:  09 67 11 00  sb      $7,$17
06C7:  44 13 20 00  anc     $19,&H20
06C9:  B4 35        jr      nz,&H06FE
06CA:  40 11 80 00  adc     $17,&H80
06CC:  B3 2E        jr      uz,&H06FA
06CD:  B1 04        jr      nc,&H06D1
06CE:  44 1B 80 00  anc     $27,&H80
06D0:  B3 02        jr      uz,&H06D2
06D1:  02 07        ld      $7,$sx
06D2:  00 73 13 00  adc     $19,$19
06D4:  B5 07        jr      c,&H06DB
06D5:  B4 04        jr      nz,&H06D9
06D6:  08 27        ad      $7,$sy
06D7:  01 BF 00 21  sbc     $31,$sy,jr &H06F9
06D9:  18 E7 00 83  biu     $7,jr &H065D
06DB:  B4 03        jr      nz,&H06DE
06DC:  42 88 84 03  ld      $8,&H84,jr &H06E0
06DE:  42 08 4C 00  ld      $8,&H4C
06E0:  1A 27        diu     $7
06E1:  41 07 E0 00  sbc     $7,&HE0
06E3:  B0 83        jr      z,&H0666
06E4:  02 69 07 00  ld      $9,$7
06E6:  1A 09        did     $9
06E7:  18 47        bid     $7
06E8:  09 67 09 00  sb      $7,$9
06EA:  08 68 07 00  ad      $8,$7
06EC:  42 09 0C 00  ld      $9,&H0C
06EE:  96 08        pre     ix,$8
06EF:  1E 68        gst     ua,$8
06F0:  56 60 04 00  pst     ua,&H04
06F2:  EA 00 C0 00  ldim    $0,(ix+$sx),7
06F4:  16 68        pst     ua,$8
06F5:  C2 54 C0 00  ldm     $20,$sz,7
06F7:  09 67 07 00  sb      $7,$7
06F9:  F7 00        rtn   
06FA:  48 07 0A 00  ad      $7,&H0A
06FC:  40 91 7A B0  adc     $17,&H7A,jr &H06AD
06FE:  40 91 6D B2  adc     $17,&H6D,jr &H06B1
0700:  77 86 00 0D  cal     &H0D86
0702:  42 1B 1D 00  ld      $27,&H1D
0704:  C6 6A CA 00  orcm    $10,$10,7
0706:  B0 26        jr      z,&H072C
0707:  77 C3 00 06  cal     &H06C3
0709:  02 12        ld      $18,$sx
070A:  B1 08        jr      nc,&H0712
070B:  41 13 20 00  sbc     $19,&H20
070D:  B3 03        jr      uz,&H0710
070E:  C2 D4 C0 03  ldm     $20,$sz,7,jr &H0712
0710:  C2 74 CA 00  ldm     $20,$10,7
0712:  C9 4A C0 00  sbbm    $10,$sz,7
0714:  B5 0A        jr      c,&H071E
0715:  08 32        ad      $18,$sy
0716:  4C 1B 8F 00  an      $27,&H8F
0718:  44 07 0E 00  anc     $7,&H0E
071A:  B0 88        jr      z,&H06A2
071B:  77 5E 00 07  cal     &H075E
071D:  B7 92        jr      &H06AF
071E:  C8 4A C0 00  adbm    $10,$sz,7
0720:  44 1B 10 00  anc     $27,&H10
0722:  B4 04        jr      nz,&H0726
0723:  26 12        phs     $18
0724:  09 3B        sb      $27,$sy
0725:  B2 0D        jr      lz,&H0732
0726:  DA 2A C0 00  dium    $10,7
0728:  0B 31        sbb     $17,$sy
0729:  B1 A2        jr      nc,&H06CB
072A:  4E 9B 80 A4  or      $27,&H80,jr &H06CF
072C:  C9 74 D4 00  sbbm    $20,$20,7
072E:  E6 1A C0 00  phsm    $26,7
0730:  E6 1A A0 00  phsm    $26,6
0732:  48 13 80 00  ad      $19,&H80
0734:  C9 40 A0 00  sbbm    $0,$sz,6
0736:  42 06 10 00  ld      $6,&H10
0738:  4E 9B 0D 04  or      $27,&H0D,jr &H073D
073A:  0A 31        adb     $17,$sy
073B:  DA 10 C0 00  didm    $16,7
073D:  2E 12        pps     $18
073E:  77 C3 00 06  cal     &H06C3
0740:  B1 08        jr      nc,&H0748
0741:  40 13 E0 00  adc     $19,&HE0
0743:  B4 03        jr      nz,&H0746
0744:  C2 F4 CA 03  ldm     $20,$10,7,jr &H0748
0746:  C2 54 C0 00  ldm     $20,$sz,7
0748:  09 32        sb      $18,$sy
0749:  B5 0E        jr      c,&H0757
074A:  C8 4A C0 00  adbm    $10,$sz,7
074C:  44 07 0E 00  anc     $7,&H0E
074E:  B0 86        jr      z,&H06D4
074F:  01 13        sbc     $19,$sx
0750:  B4 04        jr      nz,&H0754
0751:  77 5E 00 07  cal     &H075E
0753:  B7 8D        jr      &H06E0
0754:  77 5C 00 07  cal     &H075C
0756:  B7 92        jr      &H06E8
0757:  09 3B        sb      $27,$sy
0758:  B6 9E        jr      nlz,&H06F6
0759:  02 12        ld      $18,$sx
075A:  37 1D 00 06  jp      &H061D
075C:  02 A9 00 02  ld      $9,$sy,jr &H075F
075E:  02 09        ld      $9,$sx
075F:  02 68 07 00  ld      $8,$7
0761:  4C 08 0F 00  an      $8,&H0F
0763:  18 08        rod     $8
0764:  B1 06        jr      nc,&H076A
0765:  DA 1A C0 00  didm    $26,7
0767:  B7 03        jr      &H076A
0768:  DA 5A C0 00  bydm    $26,7
076A:  09 28        sb      $8,$sy
076B:  B4 83        jr      nz,&H06EE
076C:  09 09        sb      $9,$sx
076D:  B4 03        jr      nz,&H0770
076E:  C8 E0 D4 19  adbm    $0,$20,7,jr &H0788
0770:  C9 E0 D4 17  sbbm    $0,$20,7,jr &H0788
0772:  02 02        ld      $2,$sx
0773:  77 49 00 00  cal     &H0049
0775:  41 00 2B 00  sbc     $0,&H2B
0777:  B0 08        jr      z,&H077F
0778:  41 00 2D 00  sbc     $0,&H2D
077A:  F4 00        rtn     nz
077B:  4A 02 05 00  adb     $2,&H05
077D:  4C 02 0F 00  an      $2,&H0F
077F:  2D 20        ldd     $0,(iz+$sy)
0780:  B7 8D        jr      &H070D
0781:  77 49 00 00  cal     &H0049
0783:  41 00 2E 00  sbc     $0,&H2E
0785:  34 2B 00 00  jp      nz,&H002B
0787:  01 3F        sbc     $31,$sy
0788:  F7 00        rtn   
0789:  41 00 26 00  sbc     $0,&H26
078B:  B4 1D        jr      nz,&H07A8
078C:  2B 20        ldi     $0,(iz+$sy)
078D:  77 B6 00 00  cal     &H00B6
078F:  02 41        ld      $1,$sz
0790:  C9 6F 4F 00  sbbm    $15,$15,3
0792:  2D 00        ldd     $0,(iz+$sx)
0793:  41 01 48 00  sbc     $1,&H48
0795:  B4 11        jr      nz,&H07A6
0796:  77 9D 00 00  cal     &H009D
0798:  B1 0E        jr      nc,&H07A6
0799:  02 4E        ld      $14,$sz
079A:  1A 2E        diu     $14
079B:  DA 2E 60 00  dium    $14,4
079D:  01 11        sbc     $17,$sx
079E:  B4 0C        jr      nz,&H07AA
079F:  2D 20        ldd     $0,(iz+$sy)
07A0:  77 9D 00 00  cal     &H009D
07A2:  B5 89        jr      c,&H072B
07A3:  77 97 00 0A  cal     &H0A97
07A5:  B7 9E        jr      &H0743
07A6:  6D 80 02 00  ldd     $0,(iz-&H02)
07A8:  37 36 00 06  jp      &H0636
07AA:  37 A4 00 0D  jp      &H0DA4
07AC:  77 81 00 07  cal     &H0781
07AE:  B1 A5        jr      nc,&H0753
07AF:  C9 6A CA 00  sbbm    $10,$10,7
07B1:  D1 11 12 01  ldw     $17,&H0112
07B3:  82 28        ldw     $8,$sy
07B4:  2B 00        ldi     $0,(iz+$sx)
07B5:  41 00 2E 00  sbc     $0,&H2E
07B7:  B0 44        jr      z,&H07FB
07B8:  0E 29        or      $9,$sy
07B9:  01 10        sbc     $16,$sx
07BA:  B4 2D        jr      nz,&H07E7
07BB:  4C 00 0F 00  an      $0,&H0F
07BD:  DA 2A C0 00  dium    $10,7
07BF:  0E 4A        or      $10,$sz
07C0:  01 08        sbc     $8,$sx
07C1:  B6 02        jr      nlz,&H07C3
07C2:  8B 31        sbbw    $17,$sy
07C3:  9E 43        gre     iz,$3
07C4:  2D 00        ldd     $0,(iz+$sx)
07C5:  41 00 45 00  sbc     $0,&H45
07C7:  B0 04        jr      z,&H07CB
07C8:  41 00 65 00  sbc     $0,&H65
07CA:  B4 21        jr      nz,&H07EB
07CB:  2B 00        ldi     $0,(iz+$sx)
07CC:  77 72 00 07  cal     &H0772
07CE:  77 2B 00 00  cal     &H002B
07D0:  B1 2F        jr      nc,&H07FF
07D1:  02 43        ld      $3,$sz
07D2:  4C 03 0F 00  an      $3,&H0F
07D4:  2D 20        ldd     $0,(iz+$sy)
07D5:  77 2B 00 00  cal     &H002B
07D7:  B1 0B        jr      nc,&H07E2
07D8:  1A 23        diu     $3
07D9:  4C 00 0F 00  an      $0,&H0F
07DB:  0E 43        or      $3,$sz
07DC:  2B 00        ldi     $0,(iz+$sx)
07DD:  2D 00        ldd     $0,(iz+$sx)
07DE:  77 2B 00 00  cal     &H002B
07E0:  35 9E 00 0D  jp      c,&H0D9E
07E2:  02 04        ld      $4,$sx
07E3:  01 02        sbc     $2,$sx
07E4:  B4 05        jr      nz,&H07E9
07E5:  8A F1 03 08  adbw    $17,$3,jr &H07EE
07E7:  8A B1 00 A8  adbw    $17,$sy,jr &H0790
07E9:  8B F1 03 04  sbbw    $17,$3,jr &H07EE
07EB:  77 83 00 07  cal     &H0783
07ED:  B5 B9        jr      c,&H07A6
07EE:  01 09        sbc     $9,$sx
07EF:  B0 12        jr      z,&H0801
07F0:  41 12 03 00  sbc     $18,&H03
07F2:  B5 06        jr      c,&H07F8
07F3:  41 12 90 00  sbc     $18,&H90
07F5:  B5 CB        jr      c,&H07C0
07F6:  C9 6A CA 00  sbbm    $10,$10,7
07F8:  77 1D 00 06  cal     &H061D
07FA:  B7 F3        jr      &H07ED
07FB:  09 28        sb      $8,$sy
07FC:  B2 B9        jr      lz,&H07B5
07FD:  2D A0        ldd     $0,(iz-$sy)
07FE:  B7 90        jr      &H078E
07FF:  96 C3 00 92  pre     iz,$3,jr &H0792
0801:  01 08        sbc     $8,$sx
0802:  B6 DA        jr      nlz,&H07DC
0803:  2D A0        ldd     $0,(iz-$sy)
0804:  B7 DC        jr      &H07E0
0805:  02 80 00 02  ld      $0,$sx,jr &H0808
0807:  02 20        ld      $0,$sy
0808:  26 00        phs     $0
0809:  77 63 00 06  cal     &H0663
080B:  01 12        sbc     $18,$sx
080C:  B4 0F        jr      nz,&H081B
080D:  01 10        sbc     $16,$sx
080E:  30 A1 00 0D  jp      z,&H0DA1
0810:  0A 31        adb     $17,$sy
0811:  D1 1C 00 05  ldw     $28,&H0500
0813:  0B 7C 11 00  sbb     $28,$17
0815:  C2 60 CA 00  ldm     $0,$10,7
0817:  42 10 10 00  ld      $16,&H10
0819:  C9 EA AA 06  sbbm    $10,$10,6,jr &H0820
081B:  02 1D        ld      $29,$sx
081C:  02 7C 11 00  ld      $28,$17
081E:  77 69 00 06  cal     &H0669
0820:  C9 4A C0 00  sbbm    $10,$sz,7
0822:  C9 71 51 00  sbbm    $17,$17,3
0824:  0B 31        sbb     $17,$sy
0825:  77 00 00 07  cal     &H0700
0827:  C2 66 5C 00  ldm     $6,$28,3
0829:  02 07        ld      $7,$sx
082A:  C9 60 A0 00  sbbm    $0,$0,6
082C:  77 B8 00 06  cal     &H06B8
082E:  77 1D 00 06  cal     &H061D
0830:  02 13        ld      $19,$sx
0831:  77 DA 00 05  cal     &H05DA
0833:  0A 72 1D 00  adb     $18,$29
0835:  2E 1C        pps     $28
0836:  01 3C        sbc     $28,$sy
0837:  F1 00        rtn     nc
0838:  77 AA 00 09  cal     &H09AA
083A:  37 46 00 06  jp      &H0646
083C:  02 1C        ld      $28,$sx
083D:  77 AA 00 09  cal     &H09AA
083F:  77 B8 00 06  cal     &H06B8
0841:  02 13        ld      $19,$sx
0842:  26 1C        phs     $28
0843:  77 08 00 06  cal     &H0608
0845:  77 87 00 09  cal     &H0987
0847:  01 12        sbc     $18,$sx
0848:  B0 0E        jr      z,&H0856
0849:  44 1C F0 00  anc     $28,&HF0
084B:  B4 09        jr      nz,&H0854
084C:  1A 3C        diu     $28
084D:  0E 7C 10 00  or      $28,$16
084F:  8B 31        sbbw    $17,$sy
0850:  DA 29 E0 00  dium    $9,8
0852:  4C 90 0F 8C  an      $16,&H0F,jr &H07DF
0854:  42 1C E0 00  ld      $28,&HE0
0856:  42 13 80 00  ld      $19,&H80
0858:  77 00 00 07  cal     &H0700
085A:  77 D8 00 05  cal     &H05D8
085C:  2E 00        pps     $0
085D:  0A 71 1C 00  adb     $17,$28
085F:  B1 07        jr      nc,&H0866
0860:  01 20        sbc     $0,$sy
0861:  B0 05        jr      z,&H0866
0862:  77 36 00 06  cal     &H0636
0864:  4A 1D 05 00  adb     $29,&H05
0866:  00 20        adc     $0,$sy
0867:  B1 07        jr      nc,&H086E
0868:  A6 1D        phsw    $29
0869:  D1 1C 99 00  ldw     $28,&H0099
086B:  77 1B 00 09  cal     &H091B
086D:  AE 1C        ppsw    $28
086E:  4A 1D 05 00  adb     $29,&H05
0870:  F6 00        rtn     nlz
0871:  B7 6B        jr      &H08DC
0872:  42 89 02 06  ld      $9,&H02,jr &H0879
0874:  02 29        ld      $9,$sy
0875:  02 1D        ld      $29,$sx
0876:  42 9C 80 04  ld      $28,&H80,jr &H087B
0878:  02 09        ld      $9,$sx
0879:  77 87 00 09  cal     &H0987
087B:  26 09        phs     $9
087C:  77 AE 00 09  cal     &H09AE
087E:  77 A6 00 06  cal     &H06A6
0880:  B5 29        jr      c,&H08A9
0881:  02 73 11 00  ld      $19,$17
0883:  02 14        ld      $20,$sx
0884:  0B F3 07 04  sbb     $19,$7,jr &H0889
0886:  8B 31        sbbw    $17,$sy
0887:  DA 2A C0 00  dium    $10,7
0889:  C9 4A C0 00  sbbm    $10,$sz,7
088B:  B5 14        jr      c,&H089F
088C:  01 33        sbc     $19,$sy
088D:  B4 05        jr      nz,&H0892
088E:  48 14 0A 00  ad      $20,&H0A
0890:  40 89 FF 07  adc     $9,&HFF,jr &H0898
0892:  B1 0B        jr      nc,&H089D
0893:  08 34        ad      $20,$sy
0894:  48 1C 80 00  ad      $28,&H80
0896:  B5 03        jr      c,&H0899
0897:  01 29        sbc     $9,$sy
0898:  B1 03        jr      nc,&H089B
0899:  4A 1D 05 00  adb     $29,&H05
089B:  01 14        sbc     $20,$sx
089C:  B3 93        jr      uz,&H082F
089D:  37 9B 00 0D  jp      &H0D9B
089F:  C8 4A C0 00  adbm    $10,$sz,7
08A1:  09 33        sb      $19,$sy
08A2:  B1 9C        jr      nc,&H083E
08A3:  41 14 06 00  sbc     $20,&H06
08A5:  B5 02        jr      c,&H08A7
08A6:  0E 3C        or      $28,$sy
08A7:  77 1D 00 06  cal     &H061D
08A9:  77 CE 00 05  cal     &H05CE
08AB:  77 A6 00 06  cal     &H06A6
08AD:  B5 05        jr      c,&H08B2
08AE:  77 B8 00 06  cal     &H06B8
08B0:  48 1C 80 00  ad      $28,&H80
08B2:  77 89 00 0D  cal     &H0D89
08B4:  77 B0 00 09  cal     &H09B0
08B6:  77 07 00 06  cal     &H0607
08B8:  41 11 90 00  sbc     $17,&H90
08BA:  B1 04        jr      nc,&H08BE
08BB:  04 3C        anc     $28,$sy
08BC:  74 36 00 06  cal     nz,&H0636
08BE:  42 13 A0 00  ld      $19,&HA0
08C0:  77 00 00 07  cal     &H0700
08C2:  89 67 07 00  sbw     $7,$7
08C4:  77 B8 00 06  cal     &H06B8
08C6:  0B 31        sbb     $17,$sy
08C7:  77 1D 00 06  cal     &H061D
08C9:  41 1C 80 00  sbc     $28,&H80
08CB:  75 B8 00 06  cal     c,&H06B8
08CD:  2E 09        pps     $9
08CE:  01 09        sbc     $9,$sx
08CF:  B0 06        jr      z,&H08D5
08D0:  D1 13 90 00  ldw     $19,&H0090
08D2:  C1 67 33 00  sbbcm   $7,$19,2
08D4:  B1 06        jr      nc,&H08DA
08D5:  77 44 00 06  cal     &H0644
08D7:  0A 72 1D 00  adb     $18,$29
08D9:  B7 40        jr      &H0919
08DA:  77 97 00 09  cal     &H0997
08DC:  77 42 00 06  cal     &H0642
08DE:  B7 87        jr      &H0865
08DF:  42 89 04 04  ld      $9,&H04,jr &H08E4
08E1:  02 A9 00 02  ld      $9,$sy,jr &H08E4
08E3:  02 09        ld      $9,$sx
08E4:  77 69 00 06  cal     &H0669
08E6:  26 09        phs     $9
08E7:  01 09        sbc     $9,$sx
08E8:  B0 09        jr      z,&H08F1
08E9:  77 54 00 00  cal     &H0054
08EB:  77 75 00 09  cal     &H0975
08ED:  77 6C 00 00  cal     &H006C
08EF:  77 B8 00 06  cal     &H06B8
08F1:  77 87 00 09  cal     &H0987
08F3:  77 A6 00 06  cal     &H06A6
08F5:  B5 04        jr      c,&H08F9
08F6:  77 B8 00 06  cal     &H06B8
08F8:  02 3C        ld      $28,$sy
08F9:  77 46 00 06  cal     &H0646
08FB:  77 69 00 06  cal     &H0669
08FD:  02 08        ld      $8,$sx
08FE:  0B 31        sbb     $17,$sy
08FF:  42 13 20 00  ld      $19,&H20
0901:  77 00 00 07  cal     &H0700
0903:  77 B0 00 09  cal     &H09B0
0905:  77 46 00 06  cal     &H0646
0907:  2E 09        pps     $9
0908:  01 1C        sbc     $28,$sx
0909:  B0 09        jr      z,&H0912
090A:  77 AE 00 09  cal     &H09AE
090C:  81 3C        sbcw    $28,$sy
090D:  B4 03        jr      nz,&H0910
090E:  01 29        sbc     $9,$sy
090F:  B0 0A        jr      z,&H0919
0910:  77 CE 00 05  cal     &H05CE
0912:  48 1C 80 00  ad      $28,&H80
0914:  F5 00        rtn     c
0915:  0A 72 1D 00  adb     $18,$29
0917:  01 29        sbc     $9,$sy
0918:  B0 8E        jr      z,&H08A6
0919:  37 1D 00 06  jp      &H061D
091B:  42 07 13 00  ld      $7,&H13
091D:  8B 68 08 00  sbbw    $8,$8
091F:  8A 7C 07 00  adbw    $28,$7
0921:  81 7C 11 00  sbcw    $28,$17
0923:  B5 8A        jr      c,&H08AD
0924:  B0 05        jr      z,&H0929
0925:  DA 10 E0 00  didm    $16,8
0927:  8A B1 00 87  adbw    $17,$sy,jr &H08AF
0929:  40 09 B0 00  adc     $9,&HB0
092B:  B1 92        jr      nc,&H08BD
092C:  CA 8A C1 94  adbm    $10,&H01,7,jr &H08C1
092E:  77 B8 00 06  cal     &H06B8
0930:  89 7C 1C 00  sbw     $28,$28
0932:  77 2A 00 0A  cal     &H0A2A
0934:  B4 0C        jr      nz,&H0940
0935:  42 1D 80 00  ld      $29,&H80
0937:  41 08 05 00  sbc     $8,&H05
0939:  B5 07        jr      c,&H0940
093A:  04 3C        anc     $28,$sy
093B:  B0 03        jr      z,&H093E
093C:  4E 1D 05 00  or      $29,&H05
093E:  4B 08 05 00  sbb     $8,&H05
0940:  77 B8 00 06  cal     &H06B8
0942:  01 10        sbc     $16,$sx
0943:  B4 06        jr      nz,&H0949
0944:  41 08 05 00  sbc     $8,&H05
0946:  B1 03        jr      nc,&H0949
0947:  01 06        sbc     $6,$sx
0948:  F4 00        rtn     nz
0949:  77 2A 00 0A  cal     &H0A2A
094B:  02 1C        ld      $28,$sx
094C:  B4 05        jr      nz,&H0951
094D:  41 1D 80 00  sbc     $29,&H80
094F:  B5 02        jr      c,&H0951
0950:  09 3C        sb      $28,$sy
0951:  A6 1D        phsw    $29
0952:  77 64 00 00  cal     &H0064
0954:  77 07 00 08  cal     &H0807
0956:  77 6C 00 00  cal     &H006C
0958:  AE 1C        ppsw    $28
0959:  26 1D        phs     $29
095A:  77 42 00 08  cal     &H0842
095C:  2E 00        pps     $0
095D:  0A 52        adb     $18,$sz
095E:  4C 92 0F 48  an      $18,&H0F,jr &H09A7
0960:  0A 68 1B 00  adb     $8,$27
0962:  4C 88 0F 44  an      $8,&H0F,jr &H09A7
0964:  77 54 00 00  cal     &H0054
0966:  77 64 00 00  cal     &H0064
0968:  77 DA 00 05  cal     &H05DA
096A:  E6 12 C0 00  phsm    $18,7
096C:  A6 0B        phsw    $11
096D:  77 5C 00 00  cal     &H005C
096F:  77 6C 00 00  cal     &H006C
0971:  77 D4 00 05  cal     &H05D4
0973:  37 BF 00 06  jp      &H06BF
0975:  77 69 00 06  cal     &H0669
0977:  77 64 00 09  cal     &H0964
0979:  77 07 00 06  cal     &H0607
097B:  37 6D 00 06  jp      &H066D
097D:  77 54 00 00  cal     &H0054
097F:  77 42 00 06  cal     &H0642
0981:  77 75 00 09  cal     &H0975
0983:  77 6C 00 00  cal     &H006C
0985:  77 07 00 06  cal     &H0607
0987:  89 7C 1C 00  sbw     $28,$28
0989:  41 12 05 00  sbc     $18,&H05
098B:  F5 00        rtn     c
098C:  4B 12 05 00  sbb     $18,&H05
098E:  42 9D 05 18  ld      $29,&H05,jr &H09A7
0990:  77 A6 00 06  cal     &H06A6
0992:  B5 05        jr      c,&H0997
0993:  77 44 00 06  cal     &H0644
0995:  26 1E        phs     $30
0996:  B7 04        jr      &H099A
0997:  77 46 00 06  cal     &H0646
0999:  26 1F        phs     $31
099A:  77 03 00 06  cal     &H0603
099C:  77 D8 00 05  cal     &H05D8
099E:  77 6D 00 06  cal     &H066D
09A0:  77 6C 00 00  cal     &H006C
09A2:  77 64 00 00  cal     &H0064
09A4:  2E 09        pps     $9
09A5:  01 09        sbc     $9,$sx
09A6:  B4 A1        jr      nz,&H0947
09A7:  F7 00        rtn   
09A8:  42 80 30 0F  ld      $0,&H30,jr &H09B8
09AA:  42 80 38 0D  ld      $0,&H38,jr &H09B8
09AC:  42 80 40 0B  ld      $0,&H40,jr &H09B8
09AE:  42 81 18 02  ld      $1,&H18,jr &H09B1
09B0:  02 01        ld      $1,$sx
09B1:  D6 00 32 11  pre     ix,&H1132
09B3:  2C 00        ldd     $0,(ix+$sx)
09B4:  1A 20        diu     $0
09B5:  18 40        bid     $0
09B6:  08 60 01 00  ad      $0,$1
09B8:  D6 00 E6 0C  pre     ix,&H0CE6
09BA:  1E 68        gst     ua,$8
09BB:  56 60 04 00  pst     ua,&H04
09BD:  E8 40 E0 00  ldm     $0,(ix+$sz),8
09BF:  16 68        pst     ua,$8
09C0:  02 08        ld      $8,$sx
09C1:  DA 26 40 00  dium    $6,3
09C3:  1A 06        did     $6
09C4:  F7 00        rtn   
09C5:  77 A8 00 09  cal     &H09A8
09C7:  37 B8 00 06  jp      &H06B8
09C9:  02 0A        ld      $10,$sx
09CA:  CA 0B A5 00  adbm    $11,&H05,6
09CC:  4C 0B F0 00  an      $11,&HF0
09CE:  37 1D 00 06  jp      &H061D
09D0:  C2 73 EA 00  ldm     $19,$10,8
09D2:  02 7B 12 00  ld      $27,$18
09D4:  C9 6A CA 00  sbbm    $10,$10,7
09D6:  41 12 05 00  sbc     $18,&H05
09D8:  B0 31        jr      z,&H0A09
09D9:  00 12        adc     $18,$sx
09DA:  B0 2F        jr      z,&H0A09
09DB:  41 11 12 00  sbc     $17,&H12
09DD:  B1 2E        jr      nc,&H0A0B
09DE:  42 1C 12 00  ld      $28,&H12
09E0:  0B 7C 11 00  sbb     $28,$17
09E2:  C2 6A D3 00  ldm     $10,$19,7
09E4:  DA 10 C0 00  didm    $16,7
09E6:  0B 3C        sbb     $28,$sy
09E7:  B4 83        jr      nz,&H096A
09E8:  42 11 12 00  ld      $17,&H12
09EA:  DA 33 C0 00  dium    $19,7
09EC:  0B 3A        sbb     $26,$sy
09ED:  B1 83        jr      nc,&H0970
09EE:  4C 19 0F 00  an      $25,&H0F
09F0:  09 3B        sb      $27,$sy
09F1:  02 7C 0A 00  ld      $28,$10
09F3:  26 1B        phs     $27
09F4:  77 1D 00 06  cal     &H061D
09F6:  2E 1B        pps     $27
09F7:  E6 16 60 00  phsm    $22,4
09F9:  77 54 00 00  cal     &H0054
09FB:  EE 13 60 00  ppsm    $19,4
09FD:  77 21 00 0A  cal     &H0A21
09FF:  77 1D 00 06  cal     &H061D
0A01:  C2 73 EA 00  ldm     $19,$10,8
0A03:  02 7B 12 00  ld      $27,$18
0A05:  77 5C 00 00  cal     &H005C
0A07:  C6 F3 D3 E1  orcm    $19,$19,7,jr &H09E9
0A09:  89 F1 11 83  sbw     $17,$17,jr &H098D
0A0B:  02 1C        ld      $28,$sx
0A0C:  B4 03        jr      nz,&H0A0F
0A0D:  02 7C 13 00  ld      $28,$19
0A0F:  77 21 00 0A  cal     &H0A21
0A11:  C9 73 F3 00  sbbm    $19,$19,8
0A13:  02 9B 00 8D  ld      $27,$sx,jr &H09A1
0A15:  77 D0 00 09  cal     &H09D0
0A17:  F0 00        rtn     z
0A18:  41 1B 05 00  sbc     $27,&H05
0A1A:  F5 00        rtn     c
0A1B:  77 69 00 06  cal     &H0669
0A1D:  37 D4 00 05  jp      &H05D4
0A1F:  77 D0 00 09  cal     &H09D0
0A21:  C2 6A F3 00  ldm     $10,$19,8
0A23:  02 F2 1B FD  ld      $18,$27,jr &H0A21
0A25:  41 12 05 00  sbc     $18,&H05
0A27:  F5 00        rtn     c
0A28:  49 92 05 69  sb      $18,&H05,jr &H0A92
0A2A:  77 54 00 00  cal     &H0054
0A2C:  77 D0 00 09  cal     &H09D0
0A2E:  37 5C 00 00  jp      &H005C
0A30:  77 35 00 0A  cal     &H0A35
0A32:  F1 00        rtn     nc
0A33:  37 9B 00 0D  jp      &H0D9B
0A35:  81 6F 05 00  sbcw    $15,$5
0A37:  B1 05        jr      nc,&H0A3C
0A38:  A6 06        phsw    $6
0A39:  82 65 0F 00  ldw     $5,$15
0A3B:  AE 0F        ppsw    $15
0A3C:  89 40        sbw     $0,$sz
0A3D:  04 25        anc     $5,$sy
0A3E:  B0 04        jr      z,&H0A42
0A3F:  88 60 0F 00  adw     $0,$15
0A41:  F5 00        rtn     c
0A42:  98 46        bidw    $6
0A43:  B0 28        jr      z,&H0A6B
0A44:  98 6F        biuw    $15
0A45:  B1 88        jr      nc,&H09CD
0A46:  F7 00        rtn   
0A47:  02 04        ld      $4,$sx
0A48:  44 06 80 00  anc     $6,&H80
0A4A:  B0 03        jr      z,&H0A4D
0A4B:  9B 05        cmpw    $5
0A4C:  1B 44        inv     $4
0A4D:  44 10 80 00  anc     $16,&H80
0A4F:  B0 03        jr      z,&H0A52
0A50:  9B 0F        cmpw    $15
0A51:  1B 44        inv     $4
0A52:  81 25        sbcw    $5,$sy
0A53:  35 A1 00 0D  jp      c,&H0DA1
0A55:  C9 40 40 00  sbbm    $0,$sz,3
0A57:  08 22        ad      $2,$sy
0A58:  98 65        biuw    $5
0A59:  B1 82        jr      nc,&H09DB
0A5A:  98 06        rodw    $6
0A5B:  88 20        adw     $0,$sy
0A5C:  89 6F 05 00  sbw     $15,$5
0A5E:  B1 04        jr      nc,&H0A62
0A5F:  89 20        sbw     $0,$sy
0A60:  88 6F 05 00  adw     $15,$5
0A62:  09 22        sb      $2,$sy
0A63:  B4 0C        jr      nz,&H0A6F
0A64:  00 04        adc     $4,$sx
0A65:  B4 08        jr      nz,&H0A6D
0A66:  44 01 80 00  anc     $1,&H80
0A68:  34 68 00 03  jp      nz,&H0368
0A6A:  82 4F        ldw     $15,$sz
0A6B:  01 1E        sbc     $30,$sx
0A6C:  F7 00        rtn   
0A6D:  9B 80 00 84  cmpw    $0,jr &H09F2
0A6F:  98 60        biuw    $0
0A70:  98 C6 00 96  bidw    $6,jr &H0A07
0A72:  41 12 05 00  sbc     $18,&H05
0A74:  B1 09        jr      nc,&H0A7D
0A75:  41 08 05 00  sbc     $8,&H05
0A77:  B1 06        jr      nc,&H0A7D
0A78:  81 71 07 00  sbcw    $17,$7
0A7A:  F4 00        rtn     nz
0A7B:  C1 CA C0 16  sbbcm   $10,$sz,7,jr &H0A92
0A7D:  81 67 11 00  sbcw    $7,$17
0A7F:  F4 00        rtn     nz
0A80:  81 E5 0F 11  sbcw    $5,$15,jr &H0A92
0A82:  9E 42        gre     iz,$2
0A83:  96 4F        pre     iz,$15
0A84:  96 05        pre     ix,$5
0A85:  01 11        sbc     $17,$sx
0A86:  B0 0D        jr      z,&H0A93
0A87:  01 07        sbc     $7,$sx
0A88:  B0 08        jr      z,&H0A90
0A89:  2A 00        ldi     $0,(ix+$sx)
0A8A:  2B 01        ldi     $1,(iz+$sx)
0A8B:  01 41        sbc     $1,$sz
0A8C:  B4 05        jr      nz,&H0A91
0A8D:  09 27        sb      $7,$sy
0A8E:  09 B1 00 89  sb      $17,$sy,jr &H0A18
0A90:  01 11        sbc     $17,$sx
0A91:  96 42        pre     iz,$2
0A92:  F7 00        rtn   
0A93:  01 07        sbc     $7,$sx
0A94:  B0 83        jr      z,&H0A17
0A95:  01 BF 00 85  sbc     $31,$sy,jr &H0A1B
0A97:  82 63 0F 00  ldw     $3,$15
0A99:  02 62 04 00  ld      $2,$4
0A9B:  C9 6A CA 00  sbbm    $10,$10,7
0A9D:  44 04 80 00  anc     $4,&H80
0A9F:  B0 02        jr      z,&H0AA1
0AA0:  9B 03        cmpw    $3
0AA1:  77 B4 00 0A  cal     &H0AB4
0AA3:  D1 11 04 06  ldw     $17,&H0604
0AA5:  00 10        adc     $16,$sx
0AA6:  B4 08        jr      nz,&H0AAE
0AA7:  09 31        sb      $17,$sy
0AA8:  B5 04        jr      c,&H0AAC
0AA9:  DA 2E 40 00  dium    $14,3
0AAB:  B7 86        jr      &H0A31
0AAC:  89 F1 11 04  sbw     $17,$17,jr &H0AB1
0AAE:  18 62        biu     $2
0AAF:  F5 00        rtn     c
0AB0:  02 32        ld      $18,$sy
0AB1:  F7 00        rtn   
0AB2:  C9 6E 4E 00  sbbm    $14,$14,3
0AB4:  42 00 10 00  ld      $0,&H10
0AB6:  C8 6E 4E 00  adbm    $14,$14,3
0AB8:  98 63        biuw    $3
0AB9:  B1 03        jr      nc,&H0ABC
0ABA:  CA 0E 41 00  adbm    $14,&H01,3
0ABC:  09 20        sb      $0,$sy
0ABD:  B4 87        jr      nz,&H0A44
0ABE:  F7 00        rtn   
0ABF:  77 C5 00 0A  cal     &H0AC5
0AC1:  82 65 0F 00  ldw     $5,$15
0AC3:  77 5C 00 00  cal     &H005C
0AC5:  89 6A 0A 00  sbw     $10,$10
0AC7:  01 12        sbc     $18,$sx
0AC8:  B0 0F        jr      z,&H0AD7
0AC9:  41 12 05 00  sbc     $18,&H05
0ACB:  B0 0C        jr      z,&H0AD7
0ACC:  77 DC 00 0A  cal     &H0ADC
0ACE:  D1 0C 00 80  ldw     $12,&H8000
0AD0:  81 6A 0C 00  sbcw    $10,$12
0AD2:  B0 07        jr      z,&H0AD9
0AD3:  B1 25        jr      nc,&H0AF8
0AD4:  01 32        sbc     $18,$sy
0AD5:  B0 02        jr      z,&H0AD7
0AD6:  9B 0A        cmpw    $10
0AD7:  82 EF 0A A7  ldw     $15,$10,jr &H0A7F
0AD9:  01 32        sbc     $18,$sy
0ADA:  B0 1E        jr      z,&H0AF8
0ADB:  B7 84        jr      &H0A5F
0ADC:  41 11 05 00  sbc     $17,&H05
0ADE:  B1 1A        jr      nc,&H0AF8
0ADF:  26 12        phs     $18
0AE0:  9A 71        byuw    $17
0AE1:  88 6A 10 00  adw     $10,$16
0AE3:  B5 15        jr      c,&H0AF8
0AE4:  09 32        sb      $18,$sy
0AE5:  B5 11        jr      c,&H0AF6
0AE6:  D1 0C 9A 19  ldw     $12,&H199A
0AE8:  81 6A 0C 00  sbcw    $10,$12
0AEA:  B1 0E        jr      nc,&H0AF8
0AEB:  DA 2E 40 00  dium    $14,3
0AED:  4C 10 0F 00  an      $16,&H0F
0AEF:  98 6A        biuw    $10
0AF0:  82 6C 0A 00  ldw     $12,$10
0AF2:  98 6A        biuw    $10
0AF3:  98 6A        biuw    $10
0AF4:  88 EA 0C 94  adw     $10,$12,jr &H0A89
0AF6:  2E 12        pps     $18
0AF7:  F7 00        rtn   
0AF8:  37 9B 00 0D  jp      &H0D9B
0AFA:  02 73 11 00  ld      $19,$17
0AFC:  4C 11 0F 00  an      $17,&H0F
0AFE:  1A 13        did     $19
0AFF:  77 02 00 0B  cal     &H0B02
0B01:  18 73        biu     $19
0B02:  18 73        biu     $19
0B03:  08 F1 13 D3  ad      $17,$19,jr &H0AD7
0B05:  2D 00        ldd     $0,(iz+$sx)
0B06:  9E 4F        gre     iz,$15
0B07:  02 11        ld      $17,$sx
0B08:  01 00        sbc     $0,$sx
0B09:  F0 00        rtn     z
0B0A:  01 41        sbc     $1,$sz
0B0B:  2D 20        ldd     $0,(iz+$sy)
0B0C:  F0 00        rtn     z
0B0D:  08 B1 00 86  ad      $17,$sy,jr &H0A94
0B0F:  44 18 20 00  anc     $24,&H20
0B11:  B4 08        jr      nz,&H0B19
0B12:  41 13 05 00  sbc     $19,&H05
0B14:  B1 0A        jr      nc,&H0B1E
0B15:  42 15 20 00  ld      $21,&H20
0B17:  22 15        sti     $21,(ix+$sx)
0B18:  F7 00        rtn   
0B19:  41 13 05 00  sbc     $19,&H05
0B1B:  B1 03        jr      nc,&H0B1E
0B1C:  42 95 2B 86  ld      $21,&H2B,jr &H0AA3
0B1E:  42 95 2D 88  ld      $21,&H2D,jr &H0AA7
0B20:  E8 13 60 00  ldm     $19,(ix+$sx),4
0B22:  96 13        pre     ix,$19
0B23:  81 73 15 00  sbcw    $19,$21
0B25:  B0 18        jr      z,&H0B3D
0B26:  AA 00        ldiw    $0,(ix+$sx)
0B27:  8F 60 0D 00  xrw     $0,$13
0B29:  4C 00 9F 00  an      $0,&H9F
0B2B:  06 41        orc     $1,$sz
0B2C:  B4 14        jr      nz,&H0B40
0B2D:  9E 05        gre     ix,$5
0B2E:  02 67 0E 00  ld      $7,$14
0B30:  96 4F        pre     iz,$15
0B31:  2A 00        ldi     $0,(ix+$sx)
0B32:  2B 01        ldi     $1,(iz+$sx)
0B33:  01 41        sbc     $1,$sz
0B34:  B4 0B        jr      nz,&H0B3F
0B35:  09 27        sb      $7,$sy
0B36:  B4 85        jr      nz,&H0ABB
0B37:  96 05        pre     ix,$5
0B38:  68 8D 02 00  ld      $13,(ix-&H02)
0B3A:  A8 75 0E 00  ldw     $21,(ix+$14)
0B3C:  01 3F        sbc     $31,$sy
0B3D:  96 42        pre     iz,$2
0B3E:  F7 00        rtn   
0B3F:  96 05        pre     ix,$5
0B40:  28 A0        ld      $0,(ix-$sy)
0B41:  AA 40        ldiw    $0,(ix+$sz)
0B42:  9E 93 00 A0  gre     ix,$19,jr &H0AE3
0B44:  77 56 00 0B  cal     &H0B56
0B46:  B5 0A        jr      c,&H0B50
0B47:  01 02        sbc     $2,$sx
0B48:  B0 84        jr      z,&H0ACC
0B49:  F7 00        rtn   
0B4A:  77 64 00 0B  cal     &H0B64
0B4C:  B5 04        jr      c,&H0B50
0B4D:  01 02        sbc     $2,$sx
0B4E:  B0 84        jr      z,&H0AD2
0B4F:  F7 00        rtn   
0B50:  2D 20        ldd     $0,(iz+$sy)
0B51:  41 00 0A 00  sbc     $0,&H0A
0B53:  B4 22        jr      nz,&H0B75
0B54:  2D 20        ldd     $0,(iz+$sy)
0B55:  B7 20        jr      &H0B75
0B56:  D1 02 20 0D  ldw     $2,&H0D20
0B58:  2B 00        ldi     $0,(iz+$sx)
0B59:  01 43        sbc     $3,$sz
0B5A:  B0 07        jr      z,&H0B61
0B5B:  41 00 1A 00  sbc     $0,&H1A
0B5D:  B0 05        jr      z,&H0B62
0B5E:  09 22        sb      $2,$sy
0B5F:  B4 87        jr      nz,&H0AE6
0B60:  F7 00        rtn   
0B61:  01 3F        sbc     $31,$sy
0B62:  2D A0        ldd     $0,(iz-$sy)
0B63:  F7 00        rtn   
0B64:  D1 02 20 0D  ldw     $2,&H0D20
0B66:  9E 40        gre     iz,$0
0B67:  81 59        sbcw    $25,$sz
0B68:  B0 0E        jr      z,&H0B76
0B69:  2D A0        ldd     $0,(iz-$sy)
0B6A:  01 43        sbc     $3,$sz
0B6B:  B0 0C        jr      z,&H0B77
0B6C:  09 22        sb      $2,$sy
0B6D:  B4 87        jr      nz,&H0AF4
0B6E:  41 00 0A 00  sbc     $0,&H0A
0B70:  B4 0C        jr      nz,&H0B7C
0B71:  3B A3        sbc     (iz-$sy),$3
0B72:  B4 0A        jr      nz,&H0B7C
0B73:  2D A0        ldd     $0,(iz-$sy)
0B74:  08 22        ad      $2,$sy
0B75:  01 3F        sbc     $31,$sy
0B76:  F7 00        rtn   
0B77:  42 03 0A 00  ld      $3,&H0A
0B79:  3B 23        sbc     (iz+$sy),$3
0B7A:  B4 85        jr      nz,&H0AFF
0B7B:  B7 87        jr      &H0B02
0B7C:  01 1F        sbc     $31,$sx
0B7D:  F7 00        rtn   
0B7E:  D1 00 0D 0A  ldw     $0,&H0A0D
0B80:  2B 02        ldi     $2,(iz+$sx)
0B81:  01 42        sbc     $2,$sz
0B82:  B0 06        jr      z,&H0B88
0B83:  41 02 1A 00  sbc     $2,&H1A
0B85:  B4 85        jr      nz,&H0B0A
0B86:  2D A2        ldd     $2,(iz-$sy)
0B87:  F7 00        rtn   
0B88:  3B 01        sbc     (iz+$sx),$1
0B89:  F4 00        rtn     nz
0B8A:  2D 22        ldd     $2,(iz+$sy)
0B8B:  F7 00        rtn   
0B8C:  96 D9 00 08  pre     iz,$25,jr &H0B95
0B8E:  3B 1F        sbc     (iz+$sx),$31
0B8F:  B0 09        jr      z,&H0B98
0B90:  BB 2F        sbcw    (iz+$sy),$15
0B91:  B0 06        jr      z,&H0B97
0B92:  B1 06        jr      nc,&H0B98
0B93:  2B 00        ldi     $0,(iz+$sx)
0B94:  2D 41        ldd     $1,(iz+$sz)
0B95:  9E D3 00 88  gre     iz,$19,jr &H0B1E
0B97:  01 3F        sbc     $31,$sy
0B98:  F7 00        rtn   
0B99:  02 A2 00 02  ld      $2,$sy,jr &H0B9C
0B9B:  02 02        ld      $2,$sx
0B9C:  D1 03 1F 03  ldw     $3,&H031F
0B9E:  2B 00        ldi     $0,(iz+$sx)
0B9F:  01 43        sbc     $3,$sz
0BA0:  B5 82        jr      c,&H0B22
0BA1:  01 42        sbc     $2,$sz
0BA2:  B1 08        jr      nc,&H0BAA
0BA3:  01 44        sbc     $4,$sz
0BA4:  B0 04        jr      z,&H0BA8
0BA5:  B1 87        jr      nc,&H0B2C
0BA6:  2D 20        ldd     $0,(iz+$sy)
0BA7:  B7 89        jr      &H0B30
0BA8:  AB 00        ldiw    $0,(iz+$sx)
0BA9:  B7 8B        jr      &H0B34
0BAA:  2D A1        ldd     $1,(iz-$sy)
0BAB:  F7 00        rtn   
0BAC:  D1 02 1F 03  ldw     $2,&H031F
0BAE:  42 04 04 00  ld      $4,&H04
0BB0:  2B 00        ldi     $0,(iz+$sx)
0BB1:  00 00        adc     $0,$sx
0BB2:  30 A7 00 0D  jp      z,&H0DA7
0BB4:  AB 00        ldiw    $0,(iz+$sx)
0BB5:  2B 00        ldi     $0,(iz+$sx)
0BB6:  01 42        sbc     $2,$sz
0BB7:  B5 82        jr      c,&H0B39
0BB8:  00 00        adc     $0,$sx
0BB9:  B0 89        jr      z,&H0B42
0BBA:  01 43        sbc     $3,$sz
0BBB:  B0 87        jr      z,&H0B42
0BBC:  B1 87        jr      nc,&H0B43
0BBD:  2B 01        ldi     $1,(iz+$sx)
0BBE:  01 44        sbc     $4,$sz
0BBF:  B4 8A        jr      nz,&H0B49
0BC0:  41 01 80 00  sbc     $1,&H80
0BC2:  B4 8D        jr      nz,&H0B4F
0BC3:  9E 4F        gre     iz,$15
0BC4:  F7 00        rtn   
0BC5:  41 01 02 00  sbc     $1,&H02
0BC7:  B5 06        jr      c,&H0BCD
0BC8:  B0 03        jr      z,&H0BCB
0BC9:  42 80 5A 07  ld      $0,&H5A,jr &H0BD1
0BCB:  42 80 A5 05  ld      $0,&HA5,jr &H0BD1
0BCD:  42 80 FF 03  ld      $0,&HFF,jr &H0BD1
0BCF:  42 00 00 00  ld      $0,&H00
0BD1:  02 61 00 00  ld      $1,$0
0BD3:  55 00        psr     sx,0
0BD4:  55 3A        psr     sy,26
0BD5:  55 5B        psr     sz,27
0BD6:  96 00        pre     ix,$0
0BD7:  96 20        pre     iy,$0
0BD8:  96 40        pre     iz,$0
0BD9:  F8 00        nop   
0BDA:  F8 00        nop   
0BDB:  82 02        ldw     $2,$sx
0BDC:  C2 64 60 00  ldm     $4,$0,4
0BDE:  C2 68 E0 00  ldm     $8,$0,8
0BE0:  C2 70 E8 00  ldm     $16,$8,8
0BE2:  54 00 C0 00  ppo     &HC0
0BE4:  D1 1A 0F 10  ldw     $26,&H100F
0BE6:  D1 1C EA 0B  ldw     $28,&H0BEA
0BE8:  37 EF 00 0B  jp      &H0BEF
0BEA:  FB 00        slw   
0BEB:  D1 1A 10 08  ldw     $26,&H0810
0BED:  D1 1C F6 0B  ldw     $28,&H0BF6
0BEF:  9F 78        gre     ky,$24
0BF0:  0C 38        an      $24,$sy
0BF1:  B4 82        jr      nz,&H0B73
0BF2:  9F 78        gre     ky,$24
0BF3:  0C 58        an      $24,$sz
0BF4:  B0 82        jr      z,&H0B76
0BF5:  DE 1C        jp      $28
0BF6:  C2 78 E0 00  ldm     $24,$0,8
0BF8:  FE 00        off   
0BF9:  B7 81        jr      &H0B7A
0BFA:  D1 0A 0F 5A  ldw     $10,&H5A0F
0BFC:  FB 00        slw   
0BFD:  96 4A        pre     iz,$10
0BFE:  37 00 00 A0  jp      &HA000
0C00:  00 64 18     adc     $4,$24
0C03:  5A           ****  
0C04:  03 25        ldc     $5,$sy
0C06:  50 24 01     st      &H01,($sy)
0C09:  4F 10 2E     xr      $16,&H2E
0C0C:  29 1F        ld      $31,(iz+$sx)
0C0E:  04 A4 30     anc     $4,$sy,jr &H0C40
0C11:  2F 15        ppu     $21
0C13:  1A 02        did     $2
0C15:  31 38 06     jp      nc,&H0638
0C18:  33 55 B6     jp      uz,&HB655
0C1B:  B7 B8        jr      &H0BD4
0C1D:  B9 BA        adcw    (iz-$sy),$26
0C1F:  BB BC        sbcw    (iz-$sy),$28
0C21:  BD BE        adw     (iz-$sy),$30
0C23:  BF C0        sbw     (iz-$sz),$0
0C25:  C1 C2 C3 C4  sbbcm   $2,$sz,7,jr &H0BEC
0C29:  C5 C6 C7 C8  nacm    $6,$sz,7,jr &H0BF4
0C2D:  C9 CA CB CC  sbbm    $10,$sz,7,jr &H0BFC
0C31:  CD CE CF D0  nam     $14,$sz,7,jr &H0C04
0C35:  D1           ****  
0C36:  D2 D3 D7     stlm    $19,7
0C39:  D8           bup   
0C3A:  D9           bdn   
0C3B:  DA DB D4     bydm    $27,7
0C3E:  B2 D5        jr      lz,&H0C14
0C40:  B4 D6        jr      nz,&H0C17
0C42:  DC B2        sup     $18
0C44:  B3 A9        jr      uz,&H0BEE
0C46:  A6 AC        phsw    $12
0C48:  A8 AD        ldw     $13,(ix-$sy)
0C4A:  AA AE        ldiw    $14,(ix-$sy)
0C4C:  00 00        adc     $0,$sx
0C4E:  00 00        adc     $0,$sx
0C50:  00 00        adc     $0,$sx
0C52:  10 00        st      $0,($sx)
0C54:  40 63 81     adc     $3,&H81
0C57:  39 85        adc     (iz-$sx),$5
0C59:  07 16        xrc     $22,$sx
0C5B:  91 24        ldw     $4,($sy)
0C5D:  65 68 96     std     $8,(iz+&H96)
0C60:  09 65 66     sb      $5,$6
0C63:  68 66 96     ld      $6,(ix+&H96)
0C66:  99           ****  
0C67:  09 69 66     sb      $9,$6
0C6A:  66           ****  
0C6B:  96 99 99     pre     ix,$25,jr &H0C06
0C6E:  09 67 66     sb      $7,$6
0C71:  96 99 99     pre     ix,$25,jr &H0C0C
0C74:  99           ****  
0C75:  09 67 96     sb      $7,$22
0C78:  99           ****  
0C79:  99           ****  
0C7A:  99           ****  
0C7B:  99           ****  
0C7C:  09 97 99     sb      $23,$sx,jr &H0C17
0C7F:  99           ****  
0C80:  99           ****  
0C81:  99           ****  
0C82:  99           ****  
0C83:  09 30        sb      $16,$sy
0C85:  90 81 44     stw     $1,($sx),jr &H0CCB
0C88:  29 34        ld      $20,(iz+$sy)
0C8A:  04 40        anc     $0,$sz
0C8C:  66           ****  
0C8D:  95 99 02     psrw    sx,$25,jr &H0C91
0C90:  01 03        sbc     $3,$sx
0C92:  22 58        sti     $24,(ix+$sz)
0C94:  51           ****  
0C95:  68 92 13     ld      $18,(ix-&H13)
0C98:  04 43        anc     $3,$sz
0C9A:  26 78        phs     $24
0C9C:  73 13 32     cal     uz,&H3213
0C9F:  04 86 31     anc     $6,$sx,jr &H0CD2
0CA2:  79 74 07     adc     (iz+&H07),$20
0CA5:  34 04 67     jp      nz,&H6704
0CA8:  62 68 27     sti     $8,(ix+&H27)
0CAB:  27 34        phu     $20
0CAD:  04 53        anc     $19,$sz
0CAF:  44 10 23     anc     $16,&H23
0CB2:  29 34        ld      $20,(iz+$sy)
0CB4:  04 62 75     anc     $2,$21
0CB7:  64 42 29     std     $2,(ix+&H29)
0CBA:  34 04 85     jp      nz,&H8504
0CBD:  18 60        biu     $0
0CBF:  44 29 34     anc     $9,&H34
0CC2:  04 18        anc     $24,$sx
0CC4:  73 79 44     cal     uz,&H4479
0CC7:  29 34        ld      $20,(iz+$sy)
0CC9:  04 61 68     anc     $1,$8
0CCC:  81 44        sbcw    $4,$sz
0CCE:  29 34        ld      $20,(iz+$sy)
0CD0:  04 15        anc     $21,$sx
0CD2:  88 81 44     adw     $1,$sx,jr &H0D18
0CD5:  29 34        ld      $20,(iz+$sy)
0CD7:  04 11        anc     $17,$sx
0CD9:  90 81 44     stw     $1,($sx),jr &H0D1F
0CDC:  29 34        ld      $20,(iz+$sy)
0CDE:  04 30        anc     $16,$sy
0CE0:  90 81 44     stw     $1,($sx),jr &H0D26
0CE3:  29 34        ld      $20,(iz+$sy)
0CE5:  04 00        anc     $0,$sx
0CE7:  20 25        st      $5,(ix+$sy)
0CE9:  29 53        ld      $19,(iz+$sz)
0CEB:  74 81 09     cal     nz,&H0981
0CEE:  00 00        adc     $0,$sx
0CF0:  00 00        adc     $0,$sx
0CF2:  00 00        adc     $0,$sx
0CF4:  01 10        sbc     $16,$sx
0CF6:  00 68 32     adc     $8,$18
0CF9:  96 07        pre     ix,$7
0CFB:  57 81 09     pst     ia,&H09
0CFE:  00 00        adc     $0,$sx
0D00:  00 00        adc     $0,$sx
0D02:  00 00        adc     $0,$sx
0D04:  19           ****  
0D05:  10 00        st      $0,($sx)
0D07:  68 32 96     ld      $18,(ix+&H96)
0D0A:  07 57        xrc     $23,$sz
0D0C:  01 10        sbc     $16,$sx
0D0E:  00 00        adc     $0,$sx
0D10:  00 00        adc     $0,$sx
0D12:  00 00        adc     $0,$sx
0D14:  21 10        st      $16,(iz+$sx)
0D16:  00 36        adc     $22,$sy
0D18:  65 92 15     std     $18,(iz-&H15)
0D1B:  14 03        ppo     $3
0D1D:  10 33        st      $19,($sy)
0D1F:  90 81 44     stw     $1,($sx),jr &H0D65
0D22:  29 34        ld      $20,(iz+$sy)
0D24:  94 09        ppow    $9
0D26:  00 00        adc     $0,$sx
0D28:  00 30        adc     $16,$sy
0D2A:  01 17        sbc     $23,$sx
0D2C:  17 10        pst     ia,$16
0D2E:  0A 10        adb     $16,$sx
0D30:  48 10 80     ad      $16,&H80
0D33:  11 40        ld      $0,($sz)
0D35:  20 06        st      $6,(ix+$sx)
0D37:  20 02        st      $2,(ix+$sx)
0D39:  22 01        sti     $1,(ix+$sx)
0D3B:  0C 80 0C     an      $0,$sx,jr &H0D49
0D3E:  01 0E        sbc     $14,$sx
0D40:  01 18        sbc     $24,$sx
0D42:  01 24        sbc     $4,$sy
0D44:  00 26        adc     $6,$sy
0D46:  40 26 03     adc     $6,&H03
0D49:  30 08 80     jp      z,&H8008
0D4C:  0B 80 08     sbb     $0,$sx,jr &H0D56
0D4F:  60 01 84     st      $1,(ix+&H84)
0D52:  00 8A 0F     adc     $10,$sx,jr &H0D63
0D55:  90 80 10     stw     $0,($sx),jr &H0D67
0D58:  00 12        adc     $18,$sx
0D5A:  00 14        adc     $20,$sx
0D5C:  20 0E        st      $14,(ix+$sx)
0D5E:  00 22        adc     $2,$sy
0D60:  00 1A        adc     $26,$sx
0D62:  00 30        adc     $16,$sy
0D64:  00 34        adc     $20,$sy
0D66:  00 3C        adc     $28,$sy
0D68:  C0 3F 00     adbcm   $31,$sy,1
0D6B:  78 FF 7F     adc     (ix-&H7F),$31
0D6E:  37 50 1F     jp      &H1F50
0D71:  37 4C 1F     jp      &H1F4C
0D74:  37 84 1F     jp      &H1F84
0D77:  37 74 00     jp      &H0074
0D7A:  37 86 00     jp      &H0086
0D7D:  37 AF 1F     jp      &H1FAF
0D80:  37 85 1F     jp      &H1F85
0D83:  37 B9 83     jp      &H83B9
0D86:  F7           rtn   
0D87:  FF           trp   
0D88:  FF           trp   
0D89:  F7           rtn   
0D8A:  FF           trp   
0D8B:  FF           trp   
0D8C:  37 B2 11     jp      &H11B2
0D8F:  37 AD 2A     jp      &H2AAD
0D92:  37 0D 25     jp      &H250D
0D95:  37 3D 27     jp      &H273D
0D98:  37 ED 29     jp      &H29ED
0D9B:  37 A4 2B     jp      &H2BA4
0D9E:  37 70 2B     jp      &H2B70
0DA1:  37 9C 2B     jp      &H2B9C
0DA4:  37 98 2B     jp      &H2B98
0DA7:  37 BC 2B     jp      &H2BBC
0DAA:  37 2C 2A     jp      &H2A2C
0DAD:  37 49 92     jp      &H9249
0DB0:  37 30 29     jp      &H2930
0DB3:  37 DD 92     jp      &H92DD
0DB6:  37 CB 2A     jp      &H2ACB
0DB9:  14 10        ppo     $16
0DBB:  11 10        ld      $16,($sx)
0DBD:  1D 10        gsr     sx,$16
0DBF:  25 10        std     $16,(iz+$sx)
0DC1:  45 10 5F     nac     $16,&H5F
0DC4:  10 2D        st      $13,($sy)
0DC6:  10 B2 05     st      $18,($sy),jr &H0DCD
0DC9:  B9 05        adcw    (iz+$sx),$5
0DCB:  BE 05        sbw     (ix+$sx),$5
0DCD:  BE 05        sbw     (ix+$sx),$5
0DCF:  BE 05        sbw     (ix+$sx),$5
0DD1:  78 18 6D     adc     (ix+&H6D),$24
0DD4:  18 F4 1B     biu     $20,jr &H0DF1
0DD7:  F8           nop   
0DD8:  1B           ****  
0DD9:  FC           cani  
0DDA:  1B 00        cmp     $0
0DDC:  1C 04        gpo     $4
0DDE:  1C 08        gpo     $8
0DE0:  1C           ****  
0DE1:  65 1C 6A     std     $28,(iz+&H6A)
0DE4:  1C           ****  
0DE5:  3F 1C        sb      (iz+$sx),$28
0DE7:  43 1C 59     ldc     $28,&H59
0DEA:  1C 5F        gfl     $31
0DEC:  1C 9B 1C     gpo     $27,jr &H0E0A
0DEF:  A6 1C        phsw    $28
0DF1:  AB 1C        ldiw    $28,(iz+$sx)
0DF3:  C5 09 E9     nacm    $9,$sx,8
0DF6:  7E A8 2B     sb      (ix-&H2B),$8
0DF9:  C2 19 A8     ldm     $25,$sx,6
0DFC:  2B A8        ldi     $8,(iz-$sy)
0DFE:  2B A8        ldi     $8,(iz-$sy)
0E00:  2B E4 19     ldi     $4,(iz-$25)
0E03:  A8 2B        ldw     $11,(ix+$sy)
0E05:  C9 1C E1     sbbm    $28,$sx,8
0E08:  1C           ****  
0E09:  72 08 74     cal     lz,&H7408
0E0C:  08 78 08     ad      $24,$8
0E0F:  DF 08        jp      ($8)
0E11:  E1 08 E3     stm     $8,(iz+$sx),8
0E14:  08 7F 14     ad      $31,$20
0E17:  83 14        ldcw    $20,$sx
0E19:  87 14        xrcw    $20,$sx
0E1B:  8A 14        adbw    $20,$sx
0E1D:  8E 14        orw     $20,$sx
0E1F:  92 14        stlw    $20
0E21:  05 08        nac     $8,$sx
0E23:  07 08        xrc     $8,$sx
0E25:  3C 08        ad      (ix+$sx),$8
0E27:  6D 06 25     ldd     $6,(iz+&H25)
0E2A:  0A 12        adb     $18,$sx
0E2C:  17 15        pst     ia,$21
0E2E:  0A D0 09     adb     $16,$sz,jr &H0E39
0E31:  1F 0A        gst     ia,$10
0E33:  A8 2B        ldw     $11,(ix+$sy)
0E35:  C5 15 64     nacm    $21,$sx,4
0E38:  15 A8 2B     psr     sy,$8,jr &H0E65
0E3B:  A8 2B        ldw     $11,(ix+$sy)
0E3D:  A8 2B        ldw     $11,(ix+$sy)
0E3F:  49 18 A8     sb      $24,&HA8
0E42:  2B A8        ldi     $8,(iz-$sy)
0E44:  2B A8        ldi     $8,(iz-$sy)
0E46:  2B 8D        ldi     $13,(iz-$sx)
0E48:  18 A8 2B     rou     $8,jr &H0E75
0E4B:  A8 2B        ldw     $11,(ix+$sy)
0E4D:  53           ****  
0E4E:  52 A8        stl     &HA8
0E50:  2B A8        ldi     $8,(iz-$sy)
0E52:  2B 4A        ldi     $10,(iz+$sz)
0E54:  17 A8 2B     pst     ie,$8,jr &H0E81
0E57:  40 1B B2     adc     $27,&HB2
0E5A:  1B           ****  
0E5B:  62 18 86     sti     $24,(ix+&H86)
0E5E:  18 B8 17     rou     $24,jr &H0E77
0E61:  A8 2B        ldw     $11,(ix+$sy)
0E63:  A8 2B        ldw     $11,(ix+$sy)
0E65:  A8 2B        ldw     $11,(ix+$sy)
0E67:  A8 2B        ldw     $11,(ix+$sy)
0E69:  A8 2B        ldw     $11,(ix+$sy)
0E6B:  EF 15 A8     ppum    $21,6
0E6E:  2B A8        ldi     $8,(iz-$sy)
0E70:  2B A8        ldi     $8,(iz-$sy)
0E72:  2B A8        ldi     $8,(iz-$sy)
0E74:  2B A8        ldi     $8,(iz-$sy)
0E76:  2B A8        ldi     $8,(iz-$sy)
0E78:  2B A8        ldi     $8,(iz-$sy)
0E7A:  2B A8        ldi     $8,(iz-$sy)
0E7C:  2B A8        ldi     $8,(iz-$sy)
0E7E:  2B A8        ldi     $8,(iz-$sy)
0E80:  2B ED 1A     ldi     $13,(iz-$26)
0E83:  A9 1A        ldw     $26,(iz+$sx)
0E85:  A8 2B        ldw     $11,(ix+$sy)
0E87:  31 1A 35     jp      nc,&H351A
0E8A:  1A 70        byu     $16
0E8C:  2B 38        ldi     $24,(iz+$sy)
0E8E:  16 A8 2B     pst     pd,$8,jr &H0EBB
0E91:  A8 2B        ldw     $11,(ix+$sy)
0E93:  A8 2B        ldw     $11,(ix+$sy)
0E95:  B6 18        jr      nlz,&H0EAE
0E97:  CC 17 17     anm     $23,$sx,1
0E9A:  18 14        rod     $20
0E9C:  18 A8 2B     rou     $8,jr &H0EC9
0E9F:  54 18 A7     ppo     &HA7
0EA2:  13           ****  
0EA3:  A8 2B        ldw     $11,(ix+$sy)
0EA5:  22 17        sti     $23,(ix+$sx)
0EA7:  A8 2B        ldw     $11,(ix+$sy)
0EA9:  A8 2B        ldw     $11,(ix+$sy)
0EAB:  A8 2B        ldw     $11,(ix+$sy)
0EAD:  A8 2B        ldw     $11,(ix+$sy)
0EAF:  1D 19        gsr     sx,$25
0EB1:  A8 2B        ldw     $11,(ix+$sy)
0EB3:  A8 2B        ldw     $11,(ix+$sy)
0EB5:  A8 2B        ldw     $11,(ix+$sy)
0EB7:  A8 2B        ldw     $11,(ix+$sy)
0EB9:  6D 14 1E     ldd     $20,(iz+&H1E)
0EBC:  66           ****  
0EBD:  56 60 64     pst     ua,&H64
0EC0:  37 4F 01     jp      &H014F
0EC3:  77 2F 11     cal     &H112F
0EC6:  01 32        sbc     $18,$sy
0EC8:  B1 0B        jr      nc,&H0ED4
0ECA:  89 6F 0F     sbw     $15,$15
0ECD:  F7           rtn   
0ECE:  01 10        sbc     $16,$sx
0ED0:  B0 0B        jr      z,&H0EDC
0ED2:  01 32        sbc     $18,$sy
0ED4:  B4 07        jr      nz,&H0EDC
0ED6:  77 F0 0E     cal     &H0EF0
0ED9:  01 10        sbc     $16,$sx
0EDB:  F0           rtn     z
0EDC:  37 A4 2B     jp      &H2BA4
0EDF:  77 2F 11     cal     &H112F
0EE2:  01 32        sbc     $18,$sy
0EE4:  B5 9B        jr      c,&H0E80
0EE6:  B7 07        jr      &H0EEE
0EE8:  01 10        sbc     $16,$sx
0EEA:  B0 8F        jr      z,&H0E7A
0EEC:  01 32        sbc     $18,$sy
0EEE:  B4 93        jr      nz,&H0E82
0EF0:  89 6A 0A     sbw     $10,$10
0EF3:  77 DC 0A     cal     &H0ADC
0EF6:  82 6F 0A     ldw     $15,$10
0EF9:  F7           rtn   
0EFA:  77 2F 11     cal     &H112F
0EFD:  41 12 05     sbc     $18,&H05
0F00:  B5 9F        jr      c,&H0EA0
0F02:  37 C5 0A     jp      &H0AC5
0F05:  77 E1 00     cal     &H00E1
0F08:  77 D2 11     cal     &H11D2
0F0B:  B7 07        jr      &H0F13
0F0D:  77 E1 00     cal     &H00E1
0F10:  77 2F 11     cal     &H112F
0F13:  37 C7 00     jp      &H00C7
0F16:  77 49 00     cal     &H0049
0F19:  41 00 07     sbc     $0,&H07
0F1C:  B4 26        jr      nz,&H0F43
0F1E:  2B 21        ldi     $1,(iz+$sy)
0F20:  D1 03 04 05  ldw     $3,&H0504
0F24:  41 01 C7     sbc     $1,&HC7
0F27:  F0           rtn     z
0F28:  D1 03 0C 09  ldw     $3,&H090C
0F2C:  41 01 C4     sbc     $1,&HC4
0F2F:  F0           rtn     z
0F30:  D1 03 0D 0A  ldw     $3,&H0A0D
0F34:  49 01 C5     sb      $1,&HC5
0F37:  F0           rtn     z
0F38:  08 24        ad      $4,$sy
0F3A:  01 21        sbc     $1,$sy
0F3C:  F0           rtn     z
0F3D:  6D 80 02     ldd     $0,(iz-&H02)
0F40:  0D 03        na      $3,$sx
0F42:  F7           rtn   
0F43:  D6 00 80 0A  pre     ix,&H0A80
0F47:  1E 61        gst     ua,$1
0F49:  56 60 A4     pst     ua,&HA4
0F4C:  EA 02 40     ldim    $2,(ix+$sx),3
0F4F:  01 42        sbc     $2,$sz
0F51:  B0 08        jr      z,&H0F5A
0F53:  00 22        adc     $2,$sy
0F55:  B1 8A        jr      nc,&H0EE0
0F57:  16 E1 99     pst     ua,$1,jr &H0EF2
0F5A:  16 61        pst     ua,$1
0F5C:  00 22        adc     $2,$sy
0F5E:  B5 9F        jr      c,&H0EFE
0F60:  2D 21        ldd     $1,(iz+$sy)
0F62:  41 03 09     sbc     $3,&H09
0F65:  F4           rtn     nz
0F66:  77 49 00     cal     &H0049
0F69:  49 00 3C     sb      $0,&H3C
0F6C:  41 00 03     sbc     $0,&H03
0F6F:  F1           rtn     nc
0F70:  2D 21        ldd     $1,(iz+$sy)
0F72:  08 60 04     ad      $0,$4
0F75:  41 00 04     sbc     $0,&H04
0F78:  B0 0A        jr      z,&H0F83
0F7A:  04 20        anc     $0,$sy
0F7C:  30 70 2B     jp      z,&H2B70
0F7F:  09 24        sb      $4,$sy
0F81:  B4 04        jr      nz,&H0F86
0F83:  48 00 02     ad      $0,&H02
0F86:  02 44        ld      $4,$sz
0F88:  F7           rtn   
0F89:  D6 00 33 11  pre     ix,&H1133
0F8D:  3A 1E        sbc     (ix+$sx),$30
0F8F:  F0           rtn     z
0F90:  82 60 0A     ldw     $0,$10
0F93:  4C 01 0F     an      $1,&H0F
0F96:  B0 14        jr      z,&H0FAB
0F98:  41 01 09     sbc     $1,&H09
0F9B:  F4           rtn     nz
0F9C:  41 00 50     sbc     $0,&H50
0F9F:  F5           rtn     c
0FA0:  02 0A        ld      $10,$sx
0FA2:  4C 0B F0     an      $11,&HF0
0FA5:  CA 0B B0     adbm    $11,&H10,6
0FA8:  37 1D 06     jp      &H061D
0FAB:  41 00 50     sbc     $0,&H50
0FAE:  F1           rtn     nc
0FAF:  02 0A        ld      $10,$sx
0FB1:  F7           rtn   
0FB2:  41 07 0D     sbc     $7,&H0D
0FB5:  F1           rtn     nc
0FB6:  42 08 0C     ld      $8,&H0C
0FB9:  09 68 07     sb      $8,$7
0FBC:  26 08        phs     $8
0FBE:  09 28        sb      $8,$sy
0FC0:  B5 06        jr      c,&H0FC7
0FC2:  DA 10 C0     didm    $16,7
0FC5:  B7 88        jr      &H0F4E
0FC7:  2E 08        pps     $8
0FC9:  C9 61 A1     sbbm    $1,$1,6
0FCC:  C8 4A C0     adbm    $10,$sz,7
0FCF:  4C 0A F0     an      $10,&HF0
0FD2:  09 28        sb      $8,$sy
0FD4:  B5 AD        jr      c,&H0F82
0FD6:  DA 2A C0     dium    $10,7
0FD9:  B7 88        jr      &H0F62
0FDB:  26 01        phs     $1
0FDD:  77 44 50     cal     &H5044
0FE0:  77 A1 05     cal     &H05A1
0FE3:  00 32        adc     $18,$sy
0FE5:  B5 18        jr      c,&H0FFE
0FE7:  77 72 0A     cal     &H0A72
0FEA:  2E 01        pps     $1
0FEC:  B5 20        jr      c,&H100D
0FEE:  B4 1A        jr      nz,&H1009
0FF0:  04 21        anc     $1,$sy
0FF2:  30 36 06     jp      z,&H0636
0FF5:  42 12 06     ld      $18,&H06
0FF8:  C9 6A EA     sbbm    $10,$10,8
0FFB:  02 30        ld      $16,$sy
0FFD:  F7           rtn   
0FFE:  1E 6A        gst     ua,$10
1000:  56 60 54     pst     ua,&H54
1003:  77 82 0A     cal     &H0A82
1006:  16 EA 9E     pst     ua,$10,jr &H0FA6
1009:  44 81 04 9A  anc     $1,&H04,jr &H0FA6
100D:  44 81 02 9E  anc     $1,&H02,jr &H0FAE
1011:  77 B2 05     cal     &H05B2
1014:  77 A1 05     cal     &H05A1
1017:  77 DA 05     cal     &H05DA
101A:  37 89 0F     jp      &H0F89
101D:  77 A1 05     cal     &H05A1
1020:  77 07 06     cal     &H0607
1023:  B7 8A        jr      &H0FAE
1025:  77 A1 05     cal     &H05A1
1028:  77 46 06     cal     &H0646
102B:  B7 92        jr      &H0FBE
102D:  77 A1 05     cal     &H05A1
1030:  77 2E 09     cal     &H092E
1033:  37 1D 06     jp      &H061D
1036:  77 D2 05     cal     &H05D2
1039:  B7 A0        jr      &H0FDA
103B:  77 D8 05     cal     &H05D8
103E:  B7 A5        jr      &H0FE4
1040:  77 D4 05     cal     &H05D4
1043:  B7 AA        jr      &H0FEE
1045:  77 69 10     cal     &H1069
1048:  0B 7D 1C     sbb     $29,$28
104B:  4C 1D 0F     an      $29,&H0F
104E:  77 BD 16     cal     &H16BD
1051:  77 B8 06     cal     &H06B8
1054:  0A 72 1D     adb     $18,$29
1057:  4C 12 0F     an      $18,&H0F
105A:  77 1D 06     cal     &H061D
105D:  B7 C4        jr      &H1022
105F:  77 69 10     cal     &H1069
1062:  9A 7C        byuw    $28
1064:  77 BD 16     cal     &H16BD
1067:  B7 94        jr      &H0FFC
1069:  77 A1 05     cal     &H05A1
106C:  77 D0 09     cal     &H09D0
106F:  77 87 09     cal     &H0987
1072:  41 11 11     sbc     $17,&H11
1075:  31 A4 2B     jp      nc,&H2BA4
1078:  26 1D        phs     $29
107A:  77 B8 06     cal     &H06B8
107D:  77 D0 09     cal     &H09D0
1080:  77 87 09     cal     &H0987
1083:  2E 1C        pps     $28
1085:  37 B8 06     jp      &H06B8
1088:  D6 00 99 18  pre     ix,&H1899
108C:  A8 02        ldw     $2,(ix+$sx)
108E:  A6 03        phsw    $3
1090:  42 03 F0     ld      $3,&HF0
1093:  77 A7 11     cal     &H11A7
1096:  A6 04        phsw    $4
1098:  77 A7 05     cal     &H05A7
109B:  B4 37        jr      nz,&H10D3
109D:  77 72 07     cal     &H0772
10A0:  01 02        sbc     $2,$sx
10A2:  B4 18        jr      nz,&H10BB
10A4:  42 02 C3     ld      $2,&HC3
10A7:  77 E9 00     cal     &H00E9
10AA:  B4 28        jr      nz,&H10D3
10AC:  AE 00        ppsw    $0
10AE:  41 00 0A     sbc     $0,&H0A
10B1:  B0 9A        jr      z,&H104C
10B3:  A6 01        phsw    $1
10B5:  D1 03 0A 08  ldw     $3,&H080A
10B9:  B7 A7        jr      &H1061
10BB:  2E 00        pps     $0
10BD:  26 00        phs     $0
10BF:  01 20        sbc     $0,$sy
10C1:  B0 07        jr      z,&H10C9
10C3:  D1 03 02 07  ldw     $3,&H0702
10C7:  B7 B5        jr      &H107D
10C9:  2D 00        ldd     $0,(iz+$sx)
10CB:  77 36 11     cal     &H1136
10CE:  77 B2 05     cal     &H05B2
10D1:  B7 04        jr      &H10D6
10D3:  77 36 11     cal     &H1136
10D6:  77 16 0F     cal     &H0F16
10D9:  AE 00        ppsw    $0
10DB:  01 43        sbc     $3,$sz
10DD:  B1 08        jr      nc,&H10E6
10DF:  A6 01        phsw    $1
10E1:  77 54 00     cal     &H0054
10E4:  B7 D2        jr      &H10B7
10E6:  41 00 F0     sbc     $0,&HF0
10E9:  B0 3A        jr      z,&H1124
10EB:  A6 04        phsw    $4
10ED:  44 00 02     anc     $0,&H02
10F0:  B4 22        jr      nz,&H1113
10F2:  2F 02        ppu     $2
10F4:  27 02        phu     $2
10F6:  00 22        adc     $2,$sy
10F8:  B1 0C        jr      nc,&H1105
10FA:  00 32        adc     $18,$sy
10FC:  B1 36        jr      nc,&H1133
10FE:  41 00 09     sbc     $0,&H09
1101:  B4 31        jr      nz,&H1133
1103:  B7 0A        jr      &H110E
1105:  00 32        adc     $18,$sy
1107:  B5 2B        jr      c,&H1133
1109:  41 00 09     sbc     $0,&H09
110C:  B4 0A        jr      nz,&H1117
110E:  77 DB 0F     cal     &H0FDB
1111:  B7 0E        jr      &H1120
1113:  00 32        adc     $18,$sy
1115:  B5 1D        jr      c,&H1133
1117:  9A 41        bydw    $1
1119:  D1 03 B9 0D  ldw     $3,&H0DB9
111D:  77 83 11     cal     &H1183
1120:  AE 03        ppsw    $3
1122:  B7 CA        jr      &H10ED
1124:  AE 02        ppsw    $2
1126:  00 32        adc     $18,$sy
1128:  D6 00 99 18  pre     ix,&H1899
112C:  A0 02        stw     $2,(ix+$sx)
112E:  F7           rtn   
112F:  77 88 10     cal     &H1088
1132:  F1           rtn     nc
1133:  37 B0 2B     jp      &H2BB0
1136:  41 00 41     sbc     $0,&H41
1139:  B1 5B        jr      nc,&H1195
113B:  77 AC 07     cal     &H07AC
113E:  F5           rtn     c
113F:  2D 00        ldd     $0,(iz+$sx)
1141:  41 00 22     sbc     $0,&H22
1144:  B0 5C        jr      z,&H11A1
1146:  41 00 06     sbc     $0,&H06
1149:  B0 57        jr      z,&H11A1
114B:  41 00 28     sbc     $0,&H28
114E:  30 0D 0F     jp      z,&H0F0D
1151:  41 00 05     sbc     $0,&H05
1154:  34 70 2B     jp      nz,&H2B70
1157:  2B 20        ldi     $0,(iz+$sy)
1159:  41 00 63     sbc     $0,&H63
115C:  B5 1F        jr      c,&H117C
115E:  41 00 8E     sbc     $0,&H8E
1161:  B1 1A        jr      nc,&H117C
1163:  26 00        phs     $0
1165:  77 A7 11     cal     &H11A7
1168:  77 72 07     cal     &H0772
116B:  26 02        phs     $2
116D:  77 36 11     cal     &H1136
1170:  2E 02        pps     $2
1172:  77 95 12     cal     &H1295
1175:  00 32        adc     $18,$sy
1177:  35 B0 2B     jp      c,&H2BB0
117A:  2E 00        pps     $0
117C:  49 00 4F     sb      $0,&H4F
117F:  D1 03 D1 0D  ldw     $3,&H0DD1
1183:  18 60        biu     $0
1185:  02 01        ld      $1,$sx
1187:  88 43        adw     $3,$sz
1189:  1E 61        gst     ua,$1
118B:  56 60 04     pst     ua,&H04
118E:  91 63 03     ldw     $3,($3)
1191:  16 61        pst     ua,$1
1193:  DE 03        jp      $3
1195:  9E 41        gre     iz,$1
1197:  77 5D 2F     cal     &H2F5D
119A:  01 0D        sbc     $13,$sx
119C:  36 45 30     jp      nlz,&H3045
119F:  96 41        pre     iz,$1
11A1:  77 D2 11     cal     &H11D2
11A4:  0D 12        na      $18,$sx
11A6:  F7           rtn   
11A7:  9F 00        gre     ss,$0
11A9:  D1 05 37 1B  ldw     $5,&H1B37
11AD:  81 45        sbcw    $5,$sz
11AF:  B1 0F        jr      nc,&H11BF
11B1:  F7           rtn   
11B2:  D1 15 DE 1B  ldw     $21,&H1BDE
11B6:  88 75 13     adw     $21,$19
11B9:  9E 73        gre     us,$19
11BB:  81 75 13     sbcw    $21,$19
11BE:  F5           rtn     c
11BF:  37 78 2B     jp      &H2B78
11C2:  D6 00 99 18  pre     ix,&H1899
11C6:  E8 02 60     ldm     $2,(ix+$sx),4
11C9:  89 64 02     sbw     $4,$2
11CC:  89 44        sbw     $4,$sz
11CE:  F1           rtn     nc
11CF:  37 6D 2B     jp      &H2B6D
11D2:  77 F1 11     cal     &H11F1
11D5:  77 49 00     cal     &H0049
11D8:  41 00 2B     sbc     $0,&H2B
11DB:  F4           rtn     nz
11DC:  2D 20        ldd     $0,(iz+$sy)
11DE:  E6 11 40     phsm    $17,3
11E1:  77 F1 11     cal     &H11F1
11E4:  02 60 11     ld      $0,$17
11E7:  EE 0F 40     ppsm    $15,3
11EA:  08 51        ad      $17,$sz
11EC:  B1 98        jr      nc,&H1185
11EE:  37 74 2B     jp      &H2B74
11F1:  77 A7 11     cal     &H11A7
11F4:  77 BF 00     cal     &H00BF
11F7:  B0 42        jr      z,&H123A
11F9:  D6 00 99 18  pre     ix,&H1899
11FD:  A8 01        ldw     $1,(ix+$sx)
11FF:  A6 02        phsw    $2
1201:  41 00 41     sbc     $0,&H41
1204:  B1 30        jr      nc,&H1235
1206:  77 AC 07     cal     &H07AC
1209:  35 B0 2B     jp      c,&H2BB0
120C:  AB 00        ldiw    $0,(iz+$sx)
120E:  49 00 05     sb      $0,&H05
1211:  30 B0 2B     jp      z,&H2BB0
1214:  01 20        sbc     $0,$sy
1216:  34 70 2B     jp      nz,&H2B70
1219:  26 01        phs     $1
121B:  44 01 08     anc     $1,&H08
121E:  70 0D 0F     cal     z,&H0F0D
1221:  2E 00        pps     $0
1223:  49 00 97     sb      $0,&H97
1226:  D1 03 8D 0E  ldw     $3,&H0E8D
122A:  77 83 11     cal     &H1183
122D:  AE 02        ppsw    $2
122F:  77 28 11     cal     &H1128
1232:  02 93 0B     ld      $19,$sx,jr &H123F
1235:  77 3D 30     cal     &H303D
1238:  B7 8C        jr      &H11C5
123A:  77 05 0B     cal     &H0B05
123D:  02 33        ld      $19,$sy
123F:  02 12        ld      $18,$sx
1241:  82 60 11     ldw     $0,$17
1244:  77 C2 11     cal     &H11C2
1247:  82 60 02     ldw     $0,$2
124A:  88 62 11     adw     $2,$17
124D:  77 28 11     cal     &H1128
1250:  C2 62 6F     ldm     $2,$15,4
1253:  82 4F        ldw     $15,$sz
1255:  01 33        sbc     $19,$sy
1257:  30 4C 01     jp      z,&H014C
125A:  37 4C 01     jp      &H014C
125D:  82 20        ldw     $0,$sy
125F:  77 C2 11     cal     &H11C2
1262:  BC 1E        adw     (ix+$sx),$30
1264:  10 7F 02     st      $31,($2)
1267:  F7           rtn   
1268:  77 BF 00     cal     &H00BF
126B:  30 05 0B     jp      z,&H0B05
126E:  9E 4F        gre     iz,$15
1270:  02 11        ld      $17,$sx
1272:  2D 00        ldd     $0,(iz+$sx)
1274:  01 00        sbc     $0,$sx
1276:  F0           rtn     z
1277:  41 00 2C     sbc     $0,&H2C
127A:  F0           rtn     z
127B:  41 00 20     sbc     $0,&H20
127E:  35 70 2B     jp      c,&H2B70
1281:  2D 20        ldd     $0,(iz+$sy)
1283:  08 31        ad      $17,$sy
1285:  35 74 2B     jp      c,&H2B74
1288:  B7 95        jr      &H121E
128A:  77 72 07     cal     &H0772
128D:  26 02        phs     $2
128F:  77 AC 07     cal     &H07AC
1292:  2E 02        pps     $2
1294:  F1           rtn     nc
1295:  01 02        sbc     $2,$sx
1297:  74 B2 05     cal     nz,&H05B2
129A:  01 3F        sbc     $31,$sy
129C:  F7           rtn   
129D:  1E 60        gst     ua,$0
129F:  A6 01        phsw    $1
12A1:  01 01        sbc     $1,$sx
12A3:  B4 04        jr      nz,&H12A8
12A5:  56 60 54     pst     ua,&H54
12A8:  D6 00 7F 16  pre     ix,&H167F
12AC:  3A 1F        sbc     (ix+$sx),$31
12AE:  B2 31        jr      lz,&H12E0
12B0:  77 49 00     cal     &H0049
12B3:  01 00        sbc     $0,$sx
12B5:  B0 25        jr      z,&H12DB
12B7:  41 00 2C     sbc     $0,&H2C
12BA:  B0 20        jr      z,&H12DB
12BC:  77 8A 12     cal     &H128A
12BF:  31 B0 2B     jp      nc,&H2BB0
12C2:  77 3C 00     cal     &H003C
12C5:  B5 06        jr      c,&H12CC
12C7:  77 DB 00     cal     &H00DB
12CA:  2D A0        ldd     $0,(iz-$sy)
12CC:  AE 00        ppsw    $0
12CE:  16 60        pst     ua,$0
12D0:  01 01        sbc     $1,$sx
12D2:  30 AD 31     jp      z,&H31AD
12D5:  77 B3 31     cal     &H31B3
12D8:  37 4C 01     jp      &H014C
12DB:  77 36 06     cal     &H0636
12DE:  B7 9D        jr      &H127C
12E0:  77 68 12     cal     &H1268
12E3:  B7 A2        jr      &H1286
12E5:  4C 10 0F     an      $16,&H0F
12E8:  48 10 30     ad      $16,&H30
12EB:  22 10        sti     $16,(ix+$sx)
12ED:  DA 2A C0     dium    $10,7
12F0:  F7           rtn   
12F1:  42 15 45     ld      $21,&H45
12F4:  22 15        sti     $21,(ix+$sx)
12F6:  02 73 12     ld      $19,$18
12F9:  81 31        sbcw    $17,$sy
12FB:  B5 03        jr      c,&H12FF
12FD:  09 33        sb      $19,$sy
12FF:  77 19 0B     cal     &H0B19
1302:  01 12        sbc     $18,$sx
1304:  B4 09        jr      nz,&H130E
1306:  02 13        ld      $19,$sx
1308:  0B 73 11     sbb     $19,$17
130B:  02 71 13     ld      $17,$19
130E:  02 72 11     ld      $18,$17
1311:  1A 11        did     $17
1313:  48 11 30     ad      $17,&H30
1316:  4C 12 0F     an      $18,&H0F
1319:  48 12 30     ad      $18,&H30
131C:  A2 11        stiw    $17,(ix+$sx)
131E:  F7           rtn   
131F:  D6 00 C3 16  pre     ix,&H16C3
1323:  2C 00        ldd     $0,(ix+$sx)
1325:  02 01        ld      $1,$sx
1327:  9A 20        diuw    $0
1329:  1A 00        did     $0
132B:  01 21        sbc     $1,$sy
132D:  35 A7 13     jp      c,&H13A7
1330:  D6 00 5E 16  pre     ix,&H165E
1334:  02 73 12     ld      $19,$18
1337:  02 16        ld      $22,$sx
1339:  B0 25        jr      z,&H135F
133B:  77 25 0A     cal     &H0A25
133E:  01 00        sbc     $0,$sx
1340:  B4 04        jr      nz,&H1345
1342:  42 00 0A     ld      $0,&H0A
1345:  02 54        ld      $20,$sz
1347:  41 00 0A     sbc     $0,&H0A
134A:  B1 09        jr      nc,&H1354
134C:  DA 10 A0     didm    $16,6
134F:  8A 31        adbw    $17,$sy
1351:  08 A0 8C     ad      $0,$sy,jr &H12DF
1354:  77 C9 09     cal     &H09C9
1357:  77 12 0B     cal     &H0B12
135A:  26 11        phs     $17
135C:  37 41 14     jp      &H1441
135F:  77 25 0A     cal     &H0A25
1362:  D1 02 10 01  ldw     $2,&H0110
1366:  81 71 02     sbcw    $17,$2
1369:  B1 49        jr      nc,&H13B3
136B:  A6 1D        phsw    $29
136D:  D1 1C 99 00  ldw     $28,&H0099
1371:  02 01        ld      $1,$sx
1373:  8B 5C        sbbw    $28,$sz
1375:  77 1B 09     cal     &H091B
1378:  AE 1C        ppsw    $28
137A:  01 12        sbc     $18,$sx
137C:  B0 11        jr      z,&H138E
137E:  02 74 11     ld      $20,$17
1381:  08 34        ad      $20,$sy
1383:  08 54        ad      $20,$sz
1385:  41 14 0A     sbc     $20,&H0A
1388:  B5 4C        jr      c,&H13D5
138A:  42 94 0A 48  ld      $20,&H0A,jr &H13D5
138E:  01 10        sbc     $16,$sx
1390:  02 14        ld      $20,$sx
1392:  B0 09        jr      z,&H139C
1394:  0B 74 11     sbb     $20,$17
1397:  0B 34        sbb     $20,$sy
1399:  09 60 14     sb      $0,$20
139C:  02 D4 37     ld      $20,$sz,jr &H13D5
139F:  D6 00 5E 16  pre     ix,&H165E
13A3:  42 96 80 0A  ld      $22,&H80,jr &H13B0
13A7:  D6 00 5E 16  pre     ix,&H165E
13AB:  02 16        ld      $22,$sx
13AD:  02 73 12     ld      $19,$18
13B0:  77 25 0A     cal     &H0A25
13B3:  77 C9 09     cal     &H09C9
13B6:  01 10        sbc     $16,$sx
13B8:  B0 12        jr      z,&H13CB
13BA:  42 14 0A     ld      $20,&H0A
13BD:  C2 60 AB     ldm     $0,$11,6
13C0:  4C 00 F0     an      $0,&HF0
13C3:  B4 11        jr      nz,&H13D5
13C5:  DA 05 A0     didm    $5,6
13C8:  09 B4 8A     sb      $20,$sy,jr &H1354
13CB:  02 14        ld      $20,$sx
13CD:  01 16        sbc     $22,$sx
13CF:  B0 05        jr      z,&H13D5
13D1:  02 17        ld      $23,$sx
13D3:  02 32        ld      $18,$sy
13D5:  77 12 0B     cal     &H0B12
13D8:  01 16        sbc     $22,$sx
13DA:  B0 1F        jr      z,&H13FA
13DC:  8B 71 17     sbbw    $17,$23
13DF:  26 11        phs     $17
13E1:  02 71 17     ld      $17,$23
13E4:  44 17 F0     anc     $23,&HF0
13E7:  B0 20        jr      z,&H1408
13E9:  0B 76 11     sbb     $22,$17
13EC:  09 36        sb      $22,$sy
13EE:  4C 11 0F     an      $17,&H0F
13F1:  01 71 14     sbc     $17,$20
13F4:  B1 71        jr      nc,&H1466
13F6:  02 F4 11 6D  ld      $20,$17,jr &H1466
13FA:  26 11        phs     $17
13FC:  00 12        adc     $18,$sx
13FE:  B0 4B        jr      z,&H144A
1400:  77 FA 0A     cal     &H0AFA
1403:  41 11 0A     sbc     $17,&H0A
1406:  B1 3A        jr      nc,&H1441
1408:  77 E5 12     cal     &H12E5
140B:  09 34        sb      $20,$sy
140D:  09 31        sb      $17,$sy
140F:  B1 88        jr      nc,&H1398
1411:  44 14 80     anc     $20,&H80
1414:  B4 1C        jr      nz,&H1431
1416:  01 14        sbc     $20,$sx
1418:  B0 18        jr      z,&H1431
141A:  42 15 2E     ld      $21,&H2E
141D:  22 15        sti     $21,(ix+$sx)
141F:  44 16 7F     anc     $22,&H7F
1422:  B0 07        jr      z,&H142A
1424:  42 15 30     ld      $21,&H30
1427:  09 B6 8C     sb      $22,$sy,jr &H13B5
142A:  77 E5 12     cal     &H12E5
142D:  09 34        sb      $20,$sy
142F:  B4 86        jr      nz,&H13B6
1431:  2E 11        pps     $17
1433:  18 76        biu     $22
1435:  75 F1 12     cal     c,&H12F1
1438:  77 45 17     cal     &H1745
143B:  9E 11        gre     ix,$17
143D:  89 71 0F     sbw     $17,$15
1440:  F7           rtn   
1441:  09 34        sb      $20,$sy
1443:  77 E5 12     cal     &H12E5
1446:  42 96 80 B3  ld      $22,&H80,jr &H13FC
144A:  02 13        ld      $19,$sx
144C:  0B 73 11     sbb     $19,$17
144F:  02 71 13     ld      $17,$19
1452:  77 FA 0A     cal     &H0AFA
1455:  01 11        sbc     $17,$sx
1457:  B0 0E        jr      z,&H1466
1459:  09 31        sb      $17,$sy
145B:  02 76 11     ld      $22,$17
145E:  08 71 14     ad      $17,$20
1461:  41 11 0B     sbc     $17,&H0B
1464:  B1 A4        jr      nc,&H1409
1466:  42 15 30     ld      $21,&H30
1469:  22 15        sti     $21,(ix+$sx)
146B:  B7 D6        jr      &H1442
146D:  D6 00 D3 18  pre     ix,&H18D3
1471:  2A 00        ldi     $0,(ix+$sx)
1473:  01 00        sbc     $0,$sx
1475:  B4 85        jr      nz,&H13FB
1477:  2C A0        ldd     $0,(ix-$sy)
1479:  D1 0F D3 18  ldw     $15,&H18D3
147D:  B7 C3        jr      &H1441
147F:  42 89 05 12  ld      $9,&H05,jr &H1494
1483:  42 89 03 0E  ld      $9,&H03,jr &H1494
1487:  02 A9 0B     ld      $9,$sy,jr &H1494
148A:  42 89 04 07  ld      $9,&H04,jr &H1494
148E:  42 89 02 03  ld      $9,&H02,jr &H1494
1492:  02 09        ld      $9,$sx
1494:  77 54 00     cal     &H0054
1497:  77 87 09     cal     &H0987
149A:  26 1D        phs     $29
149C:  44 09 02     anc     $9,&H02
149F:  B4 38        jr      nz,&H14D8
14A1:  77 AA 09     cal     &H09AA
14A4:  42 07 97     ld      $7,&H97
14A7:  77 A6 06     cal     &H06A6
14AA:  B1 2D        jr      nc,&H14D8
14AC:  02 7C 09     ld      $28,$9
14AF:  77 03 06     cal     &H0603
14B2:  77 69 06     cal     &H0669
14B5:  44 1C 04     anc     $28,&H04
14B8:  B4 05        jr      nz,&H14BE
14BA:  42 86 03 06  ld      $6,&H03,jr &H14C3
14BE:  42 06 06     ld      $6,&H06
14C1:  08 3C        ad      $28,$sy
14C3:  04 3C        anc     $28,$sy
14C5:  B0 04        jr      z,&H14CA
14C7:  42 08 06     ld      $8,&H06
14CA:  77 46 06     cal     &H0646
14CD:  77 D8 05     cal     &H05D8
14D0:  77 6C 00     cal     &H006C
14D3:  2E 09        pps     $9
14D5:  37 07 06     jp      &H0607
14D8:  04 29        anc     $9,$sy
14DA:  B0 33        jr      z,&H150E
14DC:  02 7C 09     ld      $28,$9
14DF:  26 09        phs     $9
14E1:  77 3D 08     cal     &H083D
14E4:  77 42 06     cal     &H0642
14E7:  2E 09        pps     $9
14E9:  41 09 03     sbc     $9,&H03
14EC:  B5 16        jr      c,&H1503
14EE:  B4 0A        jr      nz,&H14F9
14F0:  77 DA 05     cal     &H05DA
14F3:  2E 09        pps     $9
14F5:  26 1F        phs     $31
14F7:  B7 04        jr      &H14FC
14F9:  77 CE 05     cal     &H05CE
14FC:  77 69 06     cal     &H0669
14FF:  42 86 02 04  ld      $6,&H02,jr &H1506
1503:  77 64 09     cal     &H0964
1506:  77 46 06     cal     &H0646
1509:  77 6C 00     cal     &H006C
150C:  B7 39        jr      &H1546
150E:  77 69 06     cal     &H0669
1511:  41 09 02     sbc     $9,&H02
1514:  B5 22        jr      c,&H1537
1516:  B0 0F        jr      z,&H1526
1518:  77 90 09     cal     &H0990
151B:  77 6C 00     cal     &H006C
151E:  77 B8 06     cal     &H06B8
1521:  77 87 09     cal     &H0987
1524:  B7 0D        jr      &H1532
1526:  77 A6 06     cal     &H06A6
1529:  35 9C 2B     jp      c,&H2B9C
152C:  77 7D 09     cal     &H097D
152F:  77 6C 00     cal     &H006C
1532:  77 DA 05     cal     &H05DA
1535:  B7 0D        jr      &H1543
1537:  77 64 09     cal     &H0964
153A:  77 44 06     cal     &H0644
153D:  77 6D 06     cal     &H066D
1540:  77 6C 00     cal     &H006C
1543:  77 05 08     cal     &H0805
1546:  37 5C 09     jp      &H095C
1549:  D1 00 02 00  ldw     $0,&H0002
154D:  8B 51        sbbw    $17,$sz
154F:  75 36 06     cal     c,&H0636
1552:  77 1D 06     cal     &H061D
1555:  37 6C 00     jp      &H006C
1558:  E6 16 60     phsm    $22,4
155B:  77 54 00     cal     &H0054
155E:  EE 13 60     ppsm    $19,4
1561:  37 21 0A     jp      &H0A21
1564:  77 87 09     cal     &H0987
1567:  77 D0 09     cal     &H09D0
156A:  77 58 15     cal     &H1558
156D:  77 25 16     cal     &H1625
1570:  77 07 06     cal     &H0607
1573:  77 D0 09     cal     &H09D0
1576:  77 58 15     cal     &H1558
1579:  77 25 16     cal     &H1625
157C:  77 07 06     cal     &H0607
157F:  77 49 15     cal     &H1549
1582:  77 DA 05     cal     &H05DA
1585:  77 49 15     cal     &H1549
1588:  77 DA 05     cal     &H05DA
158B:  77 C9 09     cal     &H09C9
158E:  77 54 00     cal     &H0054
1591:  77 D0 09     cal     &H09D0
1594:  77 21 0A     cal     &H0A21
1597:  C9 40 E0     sbbm    $0,$sz,8
159A:  02 08        ld      $8,$sx
159C:  81 31        sbcw    $17,$sy
159E:  B5 1E        jr      c,&H15BD
15A0:  DA 10 C0     didm    $16,7
15A3:  0A 31        adb     $17,$sy
15A5:  B1 86        jr      nc,&H152C
15A7:  41 0E 60     sbc     $14,&H60
15AA:  B5 07        jr      c,&H15B2
15AC:  0A 2F        adb     $15,$sy
15AE:  D1 06 04 97  ldw     $6,&H9704
15B2:  41 0F 60     sbc     $15,&H60
15B5:  B5 07        jr      c,&H15BD
15B7:  9A 46        bydw    $6
15B9:  D1 06 04 99  ldw     $6,&H9904
15BD:  77 5C 00     cal     &H005C
15C0:  77 DA 05     cal     &H05DA
15C3:  B7 25        jr      &H15E9
15C5:  77 87 09     cal     &H0987
15C8:  77 D0 09     cal     &H09D0
15CB:  77 58 15     cal     &H1558
15CE:  01 10        sbc     $16,$sx
15D0:  B0 05        jr      z,&H15D6
15D2:  8A 31        adbw    $17,$sy
15D4:  8A 31        adbw    $17,$sy
15D6:  77 D0 09     cal     &H09D0
15D9:  77 58 15     cal     &H1558
15DC:  8A 31        adbw    $17,$sy
15DE:  8A 31        adbw    $17,$sy
15E0:  77 1D 06     cal     &H061D
15E3:  42 1C 70     ld      $28,&H70
15E6:  77 0F 16     cal     &H160F
15E9:  0A 72 1D     adb     $18,$29
15EC:  37 1D 06     jp      &H061D
15EF:  77 E1 00     cal     &H00E1
15F2:  02 1C        ld      $28,$sx
15F4:  26 1C        phs     $28
15F6:  77 2F 11     cal     &H112F
15F9:  2E 1C        pps     $28
15FB:  77 C7 00     cal     &H00C7
15FE:  B0 1C        jr      z,&H161B
1600:  48 1C 70     ad      $28,&H70
1603:  B5 1D        jr      c,&H1621
1605:  77 C3 00     cal     &H00C3
1608:  B4 18        jr      nz,&H1621
160A:  77 54 00     cal     &H0054
160D:  B7 9A        jr      &H15A8
160F:  77 25 16     cal     &H1625
1612:  77 46 06     cal     &H0646
1615:  77 6C 00     cal     &H006C
1618:  77 DA 05     cal     &H05DA
161B:  49 1C 70     sb      $28,&H70
161E:  B1 90        jr      nc,&H15AF
1620:  F7           rtn   
1621:  49 9C 70 89  sb      $28,&H70,jr &H15AD
1625:  77 69 06     cal     &H0669
1628:  D1 06 06 01  ldw     $6,&H0106
162C:  F7           rtn   
162D:  77 69 06     cal     &H0669
1630:  D1 06 03 03  ldw     $6,&H0303
1634:  42 05 60     ld      $5,&H60
1637:  F7           rtn   
1638:  42 02 2D     ld      $2,&H2D
163B:  D1 00 05 06  ldw     $0,&H0605
163F:  41 12 05     sbc     $18,&H05
1642:  B1 05        jr      nc,&H1648
1644:  D1 01 01 20  ldw     $1,&H2001
1648:  81 51        sbcw    $17,$sz
164A:  31 A7 13     jp      nc,&H13A7
164D:  D6 00 5E 16  pre     ix,&H165E
1651:  77 87 09     cal     &H0987
1654:  22 02        sti     $2,(ix+$sx)
1656:  77 2D 16     cal     &H162D
1659:  77 07 06     cal     &H0607
165C:  D1 1C 97 00  ldw     $28,&H0097
1660:  77 1B 09     cal     &H091B
1663:  77 2D 16     cal     &H162D
1666:  77 C4 16     cal     &H16C4
1669:  42 1B DF     ld      $27,&HDF
166C:  77 38 92     cal     &H9238
166F:  B4 04        jr      nz,&H1674
1671:  42 1B F8     ld      $27,&HF8
1674:  22 1B        sti     $27,(ix+$sx)
1676:  77 25 16     cal     &H1625
1679:  77 C4 16     cal     &H16C4
167C:  9E 06        gre     ix,$6
167E:  77 AB 13     cal     &H13AB
1681:  77 38 14     cal     &H1438
1684:  42 00 27     ld      $0,&H27
1687:  10 60 06     st      $0,($6)
168A:  F7           rtn   
168B:  89 73 13     sbw     $19,$19
168E:  77 A6 06     cal     &H06A6
1691:  B5 24        jr      c,&H16B6
1693:  02 73 11     ld      $19,$17
1696:  0B 73 07     sbb     $19,$7
1699:  C1 4A C0     sbbcm   $10,$sz,7
169C:  B1 07        jr      nc,&H16A4
169E:  DA 2A C0     dium    $10,7
16A1:  8B B1 13     sbbw    $17,$sy,jr &H16B6
16A4:  02 14        ld      $20,$sx
16A6:  C9 4A C0     sbbm    $10,$sz,7
16A9:  B5 04        jr      c,&H16AE
16AB:  0A B4 87     adb     $20,$sy,jr &H1634
16AE:  C8 4A C0     adbm    $10,$sz,7
16B1:  DA 2A C0     dium    $10,7
16B4:  8B 31        sbbw    $17,$sy
16B6:  0B 33        sbb     $19,$sy
16B8:  B1 95        jr      nc,&H164E
16BA:  37 1D 06     jp      &H061D
16BD:  D6 00 5E 16  pre     ix,&H165E
16C1:  77 65 06     cal     &H0665
16C4:  C9 73 D3     sbbm    $19,$19,7
16C7:  42 1A 11     ld      $26,&H11
16CA:  02 3C        ld      $28,$sy
16CC:  77 A6 06     cal     &H06A6
16CF:  B5 25        jr      c,&H16F5
16D1:  02 7B 11     ld      $27,$17
16D4:  0B 7B 07     sbb     $27,$7
16D7:  C1 4A C0     sbbcm   $10,$sz,7
16DA:  B1 07        jr      nc,&H16E2
16DC:  DA 2A C0     dium    $10,7
16DF:  8B B1 1B     sbbw    $17,$sy,jr &H16FC
16E2:  DA 33 C0     dium    $19,7
16E5:  C9 4A C0     sbbm    $10,$sz,7
16E8:  B5 04        jr      c,&H16ED
16EA:  0A B3 87     adb     $19,$sy,jr &H1673
16ED:  C8 4A C0     adbm    $10,$sz,7
16F0:  DA 2A C0     dium    $10,7
16F3:  8B 31        sbbw    $17,$sy
16F5:  4E 13 30     or      $19,&H30
16F8:  22 13        sti     $19,(ix+$sx)
16FA:  1A 33        diu     $19
16FC:  0B 3B        sbb     $27,$sy
16FE:  B1 9D        jr      nc,&H169C
1700:  77 B8 06     cal     &H06B8
1703:  C2 6A F3     ldm     $10,$19,8
1706:  02 72 1C     ld      $18,$28
1709:  77 1D 06     cal     &H061D
170C:  77 B8 06     cal     &H06B8
170F:  37 1D 06     jp      &H061D
1712:  01 10        sbc     $16,$sx
1714:  F0           rtn     z
1715:  77 F8 0F     cal     &H0FF8
1718:  41 12 05     sbc     $18,&H05
171B:  02 32        ld      $18,$sy
171D:  F5           rtn     c
171E:  42 12 06     ld      $18,&H06
1721:  F7           rtn   
1722:  77 FD 0E     cal     &H0EFD
1725:  42 12 04     ld      $18,&H04
1728:  D6 00 5E 16  pre     ix,&H165E
172C:  02 11        ld      $17,$sx
172E:  DA 2F 40     dium    $15,3
1731:  48 11 30     ad      $17,&H30
1734:  41 11 3A     sbc     $17,&H3A
1737:  B5 04        jr      c,&H173C
1739:  48 11 07     ad      $17,&H07
173C:  22 11        sti     $17,(ix+$sx)
173E:  09 32        sb      $18,$sy
1740:  B4 95        jr      nz,&H16D6
1742:  42 11 04     ld      $17,&H04
1745:  D1 0F 5E 16  ldw     $15,&H165E
1749:  F7           rtn   
174A:  77 E1 00     cal     &H00E1
174D:  77 2F 11     cal     &H112F
1750:  77 54 00     cal     &H0054
1753:  77 DB 00     cal     &H00DB
1756:  77 FA 0E     cal     &H0EFA
1759:  77 C7 00     cal     &H00C7
175C:  26 0F        phs     $15
175E:  01 10        sbc     $16,$sx
1760:  B0 08        jr      z,&H1769
1762:  08 30        ad      $16,$sy
1764:  34 A4 2B     jp      nz,&H2BA4
1767:  1B 0F        cmp     $15
1769:  41 0F 64     sbc     $15,&H64
176C:  31 A4 2B     jp      nc,&H2BA4
176F:  77 5C 00     cal     &H005C
1772:  2E 07        pps     $7
1774:  A6 12        phsw    $18
1776:  77 FA 0A     cal     &H0AFA
1779:  01 32        sbc     $18,$sy
177B:  B0 2D        jr      z,&H17A9
177D:  41 12 06     sbc     $18,&H06
1780:  B0 28        jr      z,&H17A9
1782:  02 73 11     ld      $19,$17
1785:  42 11 64     ld      $17,&H64
1788:  09 71 13     sb      $17,$19
178B:  1B 11        cmp     $17
178D:  09 71 07     sb      $17,$7
1790:  18 67        biu     $7
1792:  B1 11        jr      nc,&H17A4
1794:  44 11 80     anc     $17,&H80
1797:  B4 0C        jr      nz,&H17A4
1799:  02 67 11     ld      $7,$17
179C:  AE 11        ppsw    $17
179E:  42 00 05     ld      $0,&H05
17A1:  37 B2 0F     jp      &H0FB2
17A4:  AE 11        ppsw    $17
17A6:  37 36 06     jp      &H0636
17A9:  09 71 07     sb      $17,$7
17AC:  18 67        biu     $7
17AE:  B1 9B        jr      nc,&H174A
17B0:  44 11 80     anc     $17,&H80
17B3:  B0 A0        jr      z,&H1754
17B5:  AE 11        ppsw    $17
17B7:  F7           rtn   
17B8:  77 05 0F     cal     &H0F05
17BB:  77 5D 12     cal     &H125D
17BE:  9E 40        gre     iz,$0
17C0:  A6 01        phsw    $1
17C2:  96 4F        pre     iz,$15
17C4:  77 8A 12     cal     &H128A
17C7:  AE 00        ppsw    $0
17C9:  96 40        pre     iz,$0
17CB:  F7           rtn   
17CC:  77 E1 00     cal     &H00E1
17CF:  77 D2 11     cal     &H11D2
17D2:  A6 10        phsw    $16
17D4:  26 11        phs     $17
17D6:  77 DB 00     cal     &H00DB
17D9:  77 2F 11     cal     &H112F
17DC:  77 CE 0E     cal     &H0ECE
17DF:  77 C3 00     cal     &H00C3
17E2:  B4 26        jr      nz,&H1809
17E4:  26 0F        phs     $15
17E6:  77 C3 0E     cal     &H0EC3
17E9:  9A 6F        byuw    $15
17EB:  2E 0F        pps     $15
17ED:  77 C7 00     cal     &H00C7
17F0:  2E 11        pps     $17
17F2:  09 71 0F     sb      $17,$15
17F5:  B5 19        jr      c,&H180F
17F7:  08 31        ad      $17,$sy
17F9:  01 71 10     sbc     $17,$16
17FC:  B5 03        jr      c,&H1800
17FE:  9A 70        byuw    $16
1800:  09 2F        sb      $15,$sy
1802:  02 10        ld      $16,$sx
1804:  AE 00        ppsw    $0
1806:  88 4F        adw     $15,$sz
1808:  F7           rtn   
1809:  2E 10        pps     $16
180B:  26 10        phs     $16
180D:  B7 A1        jr      &H17AF
180F:  02 11        ld      $17,$sx
1811:  AE 0F        ppsw    $15
1813:  F7           rtn   
1814:  02 A0 03     ld      $0,$sy,jr &H1819
1817:  02 00        ld      $0,$sx
1819:  26 00        phs     $0
181B:  77 E1 00     cal     &H00E1
181E:  77 D2 11     cal     &H11D2
1821:  E6 11 40     phsm    $17,3
1824:  77 DB 00     cal     &H00DB
1827:  77 C3 0E     cal     &H0EC3
182A:  77 C7 00     cal     &H00C7
182D:  02 6D 0F     ld      $13,$15
1830:  EE 0F 40     ppsm    $15,3
1833:  2E 00        pps     $0
1835:  01 71 0D     sbc     $17,$13
1838:  F5           rtn     c
1839:  01 20        sbc     $0,$sy
183B:  B0 09        jr      z,&H1845
183D:  09 71 0D     sb      $17,$13
1840:  02 12        ld      $18,$sx
1842:  88 6F 11     adw     $15,$17
1845:  02 71 0D     ld      $17,$13
1848:  F7           rtn   
1849:  77 FD 0E     cal     &H0EFD
184C:  77 A0 19     cal     &H19A0
184F:  2C 0F        ldd     $15,(ix+$sx)
1851:  16 E2 20     pst     ua,$2,jr &H1873
1854:  77 C6 0E     cal     &H0EC6
1857:  D6 00 5E 16  pre     ix,&H165E
185B:  24 0F        std     $15,(ix+$sx)
185D:  02 31        ld      $17,$sy
185F:  37 45 17     jp      &H1745
1862:  77 05 0F     cal     &H0F05
1865:  01 11        sbc     $17,$sx
1867:  30 36 06     jp      z,&H0636
186A:  96 8F 05     pre     ix,$15,jr &H1871
186D:  D6 00 E7 16  pre     ix,&H16E7
1871:  2C 0F        ldd     $15,(ix+$sx)
1873:  02 10        ld      $16,$sx
1875:  37 97 0A     jp      &H0A97
1878:  D6 00 E3 16  pre     ix,&H16E3
187C:  A8 03        ldw     $3,(ix+$sx)
187E:  02 02        ld      $2,$sx
1880:  C9 6A CA     sbbm    $10,$10,7
1883:  37 A1 0A     jp      &H0AA1
1886:  77 05 0F     cal     &H0F05
1889:  02 EF 11 99  ld      $15,$17,jr &H1825
188D:  77 CE 0E     cal     &H0ECE
1890:  77 D3 4F     cal     &H4FD3
1893:  77 36 4E     cal     &H4E36
1896:  BA 1E        sbcw    (ix+$sx),$30
1898:  35 D7 2B     jp      c,&H2BD7
189B:  68 00 04     ld      $0,(ix+&H04)
189E:  41 00 02     sbc     $0,&H02
18A1:  B4 0B        jr      nz,&H18AD
18A3:  D6 00 59 15  pre     ix,&H1559
18A7:  38 1F        adc     (ix+$sx),$31
18A9:  B4 03        jr      nz,&H18AD
18AB:  09 24        sb      $4,$sy
18AD:  02 6F 04     ld      $15,$4
18B0:  02 70 04     ld      $16,$4
18B3:  37 97 0A     jp      &H0A97
18B6:  77 D9 00     cal     &H00D9
18B9:  77 E1 00     cal     &H00E1
18BC:  77 C3 0E     cal     &H0EC3
18BF:  A7 10        phuw    $16
18C1:  77 C3 00     cal     &H00C3
18C4:  02 15        ld      $21,$sx
18C6:  B4 09        jr      nz,&H18D0
18C8:  77 CD 00     cal     &H00CD
18CB:  77 B1 3E     cal     &H3EB1
18CE:  0D 15        na      $21,$sx
18D0:  77 C7 00     cal     &H00C7
18D3:  9E 41        gre     iz,$1
18D5:  A6 02        phsw    $2
18D7:  77 1B 03     cal     &H031B
18DA:  AF 00        ppuw    $0
18DC:  77 C2 11     cal     &H11C2
18DF:  26 00        phs     $0
18E1:  A6 03        phsw    $3
18E3:  82 76 02     ldw     $22,$2
18E6:  02 54        ld      $20,$sz
18E8:  09 34        sb      $20,$sy
18EA:  B5 2A        jr      c,&H1915
18EC:  01 15        sbc     $21,$sx
18EE:  B0 12        jr      z,&H1901
18F0:  E6 17 60     phsm    $23,4
18F3:  77 0E 4C     cal     &H4C0E
18F6:  EE 14 60     ppsm    $20,4
18F9:  10 60 16     st      $0,($22)
18FC:  88 B6 96     adw     $22,$sy,jr &H1894
18FF:  B5 87        jr      c,&H1887
1901:  77 3D 02     cal     &H023D
1904:  77 A4 03     cal     &H03A4
1907:  26 00        phs     $0
1909:  77 41 02     cal     &H0241
190C:  2E 00        pps     $0
190E:  77 8F 19     cal     &H198F
1911:  B5 91        jr      c,&H18A3
1913:  B7 9B        jr      &H18AF
1915:  EE 0F 40     ppsm    $15,3
1918:  AE 01        ppsw    $1
191A:  96 41        pre     iz,$1
191C:  F7           rtn   
191D:  D1 0F 5E 16  ldw     $15,&H165E
1921:  42 00 4B     ld      $0,&H4B
1924:  D1 11 00 10  ldw     $17,&H1000
1928:  77 8C 03     cal     &H038C
192B:  77 81 03     cal     &H0381
192E:  06 61 02     orc     $1,$2
1931:  B0 58        jr      z,&H198A
1933:  09 32        sb      $18,$sy
1935:  B4 8E        jr      nz,&H18C4
1937:  26 00        phs     $0
1939:  D6 00 15 11  pre     ix,&H1115
193D:  E0 20 40     stm     $0,(ix+$sy),3
1940:  77 58 04     cal     &H0458
1943:  2E 00        pps     $0
1945:  41 00 41     sbc     $0,&H41
1948:  30 E3 29     jp      z,&H29E3
194B:  DA 60 60     byum    $0,4
194E:  08 20        ad      $0,$sy
1950:  18 63        biu     $3
1952:  18 22        rou     $2
1954:  B1 87        jr      nc,&H18DC
1956:  81 22        sbcw    $2,$sy
1958:  F1           rtn     nc
1959:  4C 01 0F     an      $1,&H0F
195C:  D1 02 06 02  ldw     $2,&H0206
1960:  81 42        sbcw    $2,$sz
1962:  F0           rtn     z
1963:  01 20        sbc     $0,$sy
1965:  B4 05        jr      nz,&H196B
1967:  41 01 08     sbc     $1,&H08
196A:  F0           rtn     z
196B:  D1 03 13 11  ldw     $3,&H1113
196F:  11 62 03     ld      $2,($3)
1972:  1E 6E        gst     ua,$14
1974:  9E 4C        gre     iz,$12
1976:  56 60 A4     pst     ua,&HA4
1979:  77 B2 25     cal     &H25B2
197C:  96 4C        pre     iz,$12
197E:  16 6E        pst     ua,$14
1980:  77 8F 19     cal     &H198F
1983:  F5           rtn     c
1984:  02 31        ld      $17,$sy
1986:  10 60 0F     st      $0,($15)
1989:  F7           rtn   
198A:  09 20        sb      $0,$sy
198C:  B6 E9        jr      nlz,&H1976
198E:  F7           rtn   
198F:  40 00 80     adc     $0,&H80
1992:  F1           rtn     nc
1993:  41 00 A0     sbc     $0,&HA0
1996:  B4 05        jr      nz,&H199C
1998:  42 00 45     ld      $0,&H45
199B:  F7           rtn   
199C:  41 00 A6     sbc     $0,&HA6
199F:  F7           rtn   
19A0:  D6 00 C0 16  pre     ix,&H16C0
19A4:  A8 00        ldw     $0,(ix+$sx)
19A6:  1E 62        gst     ua,$2
19A8:  41 01 10     sbc     $1,&H10
19AB:  B5 07        jr      c,&H19B3
19AD:  56 60 F4     pst     ua,&HF4
19B0:  4E 01 08     or      $1,&H08
19B3:  9A 20        diuw    $0
19B5:  88 4F        adw     $15,$sz
19B7:  B1 07        jr      nc,&H19BF
19B9:  56 60 F4     pst     ua,&HF4
19BC:  4E 0F 80     or      $15,&H80
19BF:  96 0F        pre     ix,$15
19C1:  F7           rtn   
19C2:  77 54 00     cal     &H0054
19C5:  77 69 06     cal     &H0669
19C8:  42 06 03     ld      $6,&H03
19CB:  77 B8 06     cal     &H06B8
19CE:  77 42 06     cal     &H0642
19D1:  77 6C 00     cal     &H006C
19D4:  02 1D        ld      $29,$sx
19D6:  41 08 05     sbc     $8,&H05
19D9:  B5 07        jr      c,&H19E1
19DB:  42 1D 05     ld      $29,&H05
19DE:  4B 08 05     sbb     $8,&H05
19E1:  37 40 09     jp      &H0940
19E4:  C9 40 E0     sbbm    $0,$sz,8
19E7:  02 08        ld      $8,$sx
19E9:  77 64 00     cal     &H0064
19EC:  40 12 FB     adc     $18,&HFB
19EF:  B5 04        jr      c,&H19F4
19F1:  77 2A 0A     cal     &H0A2A
19F4:  34 A4 2B     jp      nz,&H2BA4
19F7:  41 11 10     sbc     $17,&H10
19FA:  31 A4 2B     jp      nc,&H2BA4
19FD:  77 69 06     cal     &H0669
1A00:  2F 1B        ppu     $27
1A02:  EF 13 E0     ppum    $19,8
1A05:  C7 6A F3     xrcm    $10,$19,8
1A08:  B4 07        jr      nz,&H1A10
1A0A:  01 72 1B     sbc     $18,$27
1A0D:  30 B8 06     jp      z,&H06B8
1A10:  E7 1A E0     phum    $26,8
1A13:  27 1B        phu     $27
1A15:  77 54 00     cal     &H0054
1A18:  77 07 06     cal     &H0607
1A1B:  77 6C 00     cal     &H006C
1A1E:  77 54 00     cal     &H0054
1A21:  77 B8 06     cal     &H06B8
1A24:  77 D2 05     cal     &H05D2
1A27:  40 12 FB     adc     $18,&HFB
1A2A:  B5 B7        jr      c,&H19E2
1A2C:  77 6C 00     cal     &H006C
1A2F:  B7 B0        jr      &H19E0
1A31:  26 1E        phs     $30
1A33:  B7 03        jr      &H1A37
1A35:  26 1F        phs     $31
1A37:  77 87 1A     cal     &H1A87
1A3A:  77 54 00     cal     &H0054
1A3D:  77 64 00     cal     &H0064
1A40:  F8           nop   
1A41:  77 5B 91     cal     &H915B
1A44:  41 08 05     sbc     $8,&H05
1A47:  30 A4 2B     jp      z,&H2BA4
1A4A:  77 D4 05     cal     &H05D4
1A4D:  77 6C 00     cal     &H006C
1A50:  2E 13        pps     $19
1A52:  01 13        sbc     $19,$sx
1A54:  B0 07        jr      z,&H1A5C
1A56:  C9 40 E0     sbbm    $0,$sz,8
1A59:  02 88 07     ld      $8,$sx,jr &H1A62
1A5C:  77 A6 06     cal     &H06A6
1A5F:  75 B8 06     cal     c,&H06B8
1A62:  E6 11 E0     phsm    $17,8
1A65:  26 12        phs     $18
1A67:  77 5C 00     cal     &H005C
1A6A:  77 64 00     cal     &H0064
1A6D:  2E 08        pps     $8
1A6F:  EE 00 E0     ppsm    $0,8
1A72:  77 E9 19     cal     &H19E9
1A75:  77 B8 06     cal     &H06B8
1A78:  77 5C 00     cal     &H005C
1A7B:  77 64 00     cal     &H0064
1A7E:  77 E4 19     cal     &H19E4
1A81:  77 6C 00     cal     &H006C
1A84:  37 44 06     jp      &H0644
1A87:  77 E1 00     cal     &H00E1
1A8A:  77 2F 11     cal     &H112F
1A8D:  77 54 00     cal     &H0054
1A90:  77 DB 00     cal     &H00DB
1A93:  77 2F 11     cal     &H112F
1A96:  77 B8 06     cal     &H06B8
1A99:  77 5C 00     cal     &H005C
1A9C:  A6 01        phsw    $1
1A9E:  77 C7 00     cal     &H00C7
1AA1:  AE 00        ppsw    $0
1AA3:  F7           rtn   
1AA4:  26 1E        phs     $30
1AA6:  37 EF 08     jp      &H08EF
1AA9:  77 87 1A     cal     &H1A87
1AAC:  77 54 00     cal     &H0054
1AAF:  77 64 00     cal     &H0064
1AB2:  77 B8 06     cal     &H06B8
1AB5:  77 87 09     cal     &H0987
1AB8:  26 1D        phs     $29
1ABA:  77 A4 1A     cal     &H1AA4
1ABD:  2E 00        pps     $0
1ABF:  0A 52        adb     $18,$sz
1AC1:  4C 12 0F     an      $18,&H0F
1AC4:  77 1D 06     cal     &H061D
1AC7:  77 89 0F     cal     &H0F89
1ACA:  77 21 1B     cal     &H1B21
1ACD:  77 6C 00     cal     &H006C
1AD0:  77 5C 00     cal     &H005C
1AD3:  77 A6 06     cal     &H06A6
1AD6:  71 B8 06     cal     nc,&H06B8
1AD9:  77 64 00     cal     &H0064
1ADC:  77 97 09     cal     &H0997
1ADF:  77 6C 00     cal     &H006C
1AE2:  77 07 06     cal     &H0607
1AE5:  77 25 0A     cal     &H0A25
1AE8:  77 89 0F     cal     &H0F89
1AEB:  B7 31        jr      &H1B1D
1AED:  77 87 1A     cal     &H1A87
1AF0:  77 63 06     cal     &H0663
1AF3:  77 64 00     cal     &H0064
1AF6:  77 54 00     cal     &H0054
1AF9:  77 B8 06     cal     &H06B8
1AFC:  77 72 08     cal     &H0872
1AFF:  77 6C 00     cal     &H006C
1B02:  77 64 00     cal     &H0064
1B05:  77 07 06     cal     &H0607
1B08:  77 21 1B     cal     &H1B21
1B0B:  77 6C 00     cal     &H006C
1B0E:  77 5C 00     cal     &H005C
1B11:  77 64 00     cal     &H0064
1B14:  77 74 08     cal     &H0874
1B17:  77 6C 00     cal     &H006C
1B1A:  77 07 06     cal     &H0607
1B1D:  42 80 58 04  ld      $0,&H58,jr &H1B24
1B21:  42 00 59     ld      $0,&H59
1B24:  77 54 00     cal     &H0054
1B27:  D6 00 5E 16  pre     ix,&H165E
1B2B:  24 00        std     $0,(ix+$sx)
1B2D:  9E 02        gre     ix,$2
1B2F:  D1 00 08 01  ldw     $0,&H0108
1B33:  D6 00 7E 16  pre     ix,&H167E
1B37:  E0 1F 80     stm     $31,(ix+$sx),5
1B3A:  77 AD 31     cal     &H31AD
1B3D:  37 5C 00     jp      &H005C
1B40:  D6 00 C4 16  pre     ix,&H16C4
1B44:  E8 00 40     ldm     $0,(ix+$sx),3
1B47:  44 00 08     anc     $0,&H08
1B4A:  B4 04        jr      nz,&H1B4F
1B4C:  44 02 04     anc     $2,&H04
1B4F:  34 78 2B     jp      nz,&H2B78
1B52:  77 E1 00     cal     &H00E1
1B55:  77 30 29     cal     &H2930
1B58:  2C 20        ldd     $0,(ix+$sy)
1B5A:  4E 00 04     or      $0,&H04
1B5D:  24 00        std     $0,(ix+$sx)
1B5F:  77 D2 11     cal     &H11D2
1B62:  77 5D 12     cal     &H125D
1B65:  D1 00 D5 19  ldw     $0,&H19D5
1B69:  77 57 97     cal     &H9757
1B6C:  9E 40        gre     iz,$0
1B6E:  A6 01        phsw    $1
1B70:  96 4F        pre     iz,$15
1B72:  D6 00 00 10  pre     ix,&H1000
1B76:  2C 00        ldd     $0,(ix+$sx)
1B78:  26 00        phs     $0
1B7A:  24 1F        std     $31,(ix+$sx)
1B7C:  D6 00 D5 19  pre     ix,&H19D5
1B80:  77 F9 1C     cal     &H1CF9
1B83:  2E 00        pps     $0
1B85:  D6 00 00 10  pre     ix,&H1000
1B89:  24 00        std     $0,(ix+$sx)
1B8B:  77 30 29     cal     &H2930
1B8E:  2C 20        ldd     $0,(ix+$sy)
1B90:  4E 00 04     or      $0,&H04
1B93:  24 00        std     $0,(ix+$sx)
1B95:  D6 40 D5 19  pre     iz,&H19D5
1B99:  77 2F 11     cal     &H112F
1B9C:  02 01        ld      $1,$sx
1B9E:  77 E5 00     cal     &H00E5
1BA1:  AE 00        ppsw    $0
1BA3:  96 40        pre     iz,$0
1BA5:  77 30 29     cal     &H2930
1BA8:  2C 20        ldd     $0,(ix+$sy)
1BAA:  4C 00 03     an      $0,&H03
1BAD:  24 00        std     $0,(ix+$sx)
1BAF:  37 C7 00     jp      &H00C7
1BB2:  77 C5 00     cal     &H00C5
1BB5:  42 00 FF     ld      $0,&HFF
1BB8:  B4 0A        jr      nz,&H1BC3
1BBA:  77 2F 11     cal     &H112F
1BBD:  77 C7 00     cal     &H00C7
1BC0:  82 60 11     ldw     $0,$17
1BC3:  D6 00 40 17  pre     ix,&H1740
1BC7:  EA 0A E0     ldim    $10,(ix+$sx),8
1BCA:  2C 12        ldd     $18,(ix+$sx)
1BCC:  81 20        sbcw    $0,$sy
1BCE:  F5           rtn     c
1BCF:  41 01 05     sbc     $1,&H05
1BD2:  B5 09        jr      c,&H1BDC
1BD4:  1F 60        gst     tm,$0
1BD6:  0A 00        adb     $0,$sx
1BD8:  0A 4F        adb     $15,$sz
1BDA:  0B 4D        sbb     $13,$sz
1BDC:  77 AC 09     cal     &H09AC
1BDF:  77 07 06     cal     &H0607
1BE2:  77 1F 0A     cal     &H0A1F
1BE5:  D6 00 40 17  pre     ix,&H1740
1BE9:  E2 0A E0     stim    $10,(ix+$sx),8
1BEC:  F7           rtn   
1BED:  02 BC 1C     ld      $28,$sy,jr &H1C0B
1BF0:  42 9C 0A 18  ld      $28,&H0A,jr &H1C0B
1BF4:  42 9C 13 14  ld      $28,&H13,jr &H1C0B
1BF8:  42 9C 1C 10  ld      $28,&H1C,jr &H1C0B
1BFC:  42 9C 25 0C  ld      $28,&H25,jr &H1C0B
1C00:  42 9C 2E 08  ld      $28,&H2E,jr &H1C0B
1C04:  42 9C 37 04  ld      $28,&H37,jr &H1C0B
1C08:  42 1C 40     ld      $28,&H40
1C0B:  D6 00 F0 16  pre     ix,&H16F0
1C0F:  EA 60 FC     ldim    $0,(ix+$28),8
1C12:  2C 08        ldd     $8,(ix+$sx)
1C14:  37 B8 06     jp      &H06B8
1C17:  01 00        sbc     $0,$sx
1C19:  B4 0F        jr      nz,&H1C29
1C1B:  77 65 1C     cal     &H1C65
1C1E:  77 F8 1B     cal     &H1BF8
1C21:  77 07 06     cal     &H0607
1C24:  77 00 1C     cal     &H1C00
1C27:  B7 0D        jr      &H1C35
1C29:  77 6A 1C     cal     &H1C6A
1C2C:  77 FC 1B     cal     &H1BFC
1C2F:  77 07 06     cal     &H0607
1C32:  77 04 1C     cal     &H1C04
1C35:  77 D4 05     cal     &H05D4
1C38:  41 12 05     sbc     $18,&H05
1C3B:  F5           rtn     c
1C3C:  37 36 06     jp      &H0636
1C3F:  26 1F        phs     $31
1C41:  B7 03        jr      &H1C45
1C43:  26 1E        phs     $30
1C45:  77 F4 1B     cal     &H1BF4
1C48:  77 D2 05     cal     &H05D2
1C4B:  2E 00        pps     $0
1C4D:  77 54 00     cal     &H0054
1C50:  77 17 1C     cal     &H1C17
1C53:  77 C3 1C     cal     &H1CC3
1C56:  37 6D 06     jp      &H066D
1C59:  77 F4 1B     cal     &H1BF4
1C5C:  02 80 91     ld      $0,$sx,jr &H1BEF
1C5F:  77 F4 1B     cal     &H1BF4
1C62:  02 A0 97     ld      $0,$sy,jr &H1BFB
1C65:  77 F8 1B     cal     &H1BF8
1C68:  B7 04        jr      &H1C6D
1C6A:  77 FC 1B     cal     &H1BFC
1C6D:  77 F4 1B     cal     &H1BF4
1C70:  B7 6D        jr      &H1CDE
1C72:  77 6A 1C     cal     &H1C6A
1C75:  77 F8 1B     cal     &H1BF8
1C78:  77 07 06     cal     &H0607
1C7B:  77 08 1C     cal     &H1C08
1C7E:  B7 19        jr      &H1C98
1C80:  77 65 1C     cal     &H1C65
1C83:  77 08 1C     cal     &H1C08
1C86:  77 07 06     cal     &H0607
1C89:  77 54 00     cal     &H0054
1C8C:  77 6A 1C     cal     &H1C6A
1C8F:  77 00 1C     cal     &H1C00
1C92:  77 07 06     cal     &H0607
1C95:  77 6C 00     cal     &H006C
1C98:  37 D4 05     jp      &H05D4
1C9B:  77 80 1C     cal     &H1C80
1C9E:  77 54 00     cal     &H0054
1CA1:  77 1B 1C     cal     &H1C1B
1CA4:  B7 36        jr      &H1CDB
1CA6:  77 1B 1C     cal     &H1C1B
1CA9:  B7 13        jr      &H1CBD
1CAB:  77 1B 1C     cal     &H1C1B
1CAE:  77 54 00     cal     &H0054
1CB1:  77 29 1C     cal     &H1C29
1CB4:  77 6C 00     cal     &H006C
1CB7:  77 07 06     cal     &H0607
1CBA:  77 6D 06     cal     &H066D
1CBD:  77 54 00     cal     &H0054
1CC0:  77 72 1C     cal     &H1C72
1CC3:  77 6C 00     cal     &H006C
1CC6:  37 46 06     jp      &H0646
1CC9:  77 54 00     cal     &H0054
1CCC:  77 9B 1C     cal     &H1C9B
1CCF:  77 6C 00     cal     &H006C
1CD2:  77 CE 05     cal     &H05CE
1CD5:  77 54 00     cal     &H0054
1CD8:  77 A6 1C     cal     &H1CA6
1CDB:  77 6C 00     cal     &H006C
1CDE:  37 44 06     jp      &H0644
1CE1:  77 54 00     cal     &H0054
1CE4:  77 A6 1C     cal     &H1CA6
1CE7:  77 6C 00     cal     &H006C
1CEA:  77 07 06     cal     &H0607
1CED:  77 54 00     cal     &H0054
1CF0:  77 9B 1C     cal     &H1C9B
1CF3:  77 6C 00     cal     &H006C
1CF6:  37 DA 05     jp      &H05DA
1CF9:  89 6E 0E     sbw     $14,$14
1CFC:  02 97 4B     ld      $23,$sx,jr &H1D49
1CFF:  01 01        sbc     $1,$sx
1D01:  30 7B 1D     jp      z,&H1D7B
1D04:  37 7C 2B     jp      &H2B7C
1D07:  02 17        ld      $23,$sx
1D09:  89 6E 0E     sbw     $14,$14
1D0C:  77 72 29     cal     &H2972
1D0F:  D6 00 00 10  pre     ix,&H1000
1D13:  B0 35        jr      z,&H1D49
1D15:  77 29 00     cal     &H0029
1D18:  B1 30        jr      nc,&H1D49
1D1A:  02 00        ld      $0,$sx
1D1C:  D6 00 05 11  pre     ix,&H1105
1D20:  3A 1F        sbc     (ix+$sx),$31
1D22:  B4 0F        jr      nz,&H1D32
1D24:  38 BE        adc     (ix-$sy),$30
1D26:  B1 0B        jr      nc,&H1D32
1D28:  D6 00 39 12  pre     ix,&H1239
1D2C:  A8 00        ldw     $0,(ix+$sx)
1D2E:  01 01        sbc     $1,$sx
1D30:  B4 AD        jr      nz,&H1CDE
1D32:  26 00        phs     $0
1D34:  D6 00 00 10  pre     ix,&H1000
1D38:  77 9F 1E     cal     &H1E9F
1D3B:  81 31        sbcw    $17,$sy
1D3D:  35 AC 2B     jp      c,&H2BAC
1D40:  2E 01        pps     $1
1D42:  42 00 20     ld      $0,&H20
1D45:  3B 00        sbc     (iz+$sx),$0
1D47:  B4 C9        jr      nz,&H1D11
1D49:  2B 00        ldi     $0,(iz+$sx)
1D4B:  41 00 20     sbc     $0,&H20
1D4E:  B1 13        jr      nc,&H1D62
1D50:  D6 00 00 10  pre     ix,&H1000
1D54:  2C 00        ldd     $0,(ix+$sx)
1D56:  02 0F        ld      $15,$sx
1D58:  41 00 03     sbc     $0,&H03
1D5B:  F4           rtn     nz
1D5C:  24 0E        std     $14,(ix+$sx)
1D5E:  02 6F 0E     ld      $15,$14
1D61:  F7           rtn   
1D62:  41 0F 40     sbc     $15,&H40
1D65:  B0 09        jr      z,&H1D6F
1D67:  41 00 22     sbc     $0,&H22
1D6A:  B4 15        jr      nz,&H1D80
1D6C:  4F 0F 80     xr      $15,&H80
1D6F:  41 00 3D     sbc     $0,&H3D
1D72:  B4 08        jr      nz,&H1D7B
1D74:  44 0F C0     anc     $15,&HC0
1D77:  B4 03        jr      nz,&H1D7B
1D79:  0E 37        or      $23,$sy
1D7B:  77 CD 1E     cal     &H1ECD
1D7E:  B7 B6        jr      &H1D35
1D80:  44 0F 80     anc     $15,&H80
1D83:  B4 95        jr      nz,&H1D19
1D85:  41 00 3A     sbc     $0,&H3A
1D88:  B4 06        jr      nz,&H1D8F
1D8A:  02 20        ld      $0,$sy
1D8C:  02 8F 9F     ld      $15,$sx,jr &H1D2D
1D8F:  41 00 27     sbc     $0,&H27
1D92:  B4 08        jr      nz,&H1D9B
1D94:  42 00 02     ld      $0,&H02
1D97:  42 8F 40 AB  ld      $15,&H40,jr &H1D45
1D9B:  41 00 26     sbc     $0,&H26
1D9E:  B4 04        jr      nz,&H1DA3
1DA0:  02 AF B3     ld      $15,$sy,jr &H1D55
1DA3:  77 B6 00     cal     &H00B6
1DA6:  01 2F        sbc     $15,$sy
1DA8:  B4 08        jr      nz,&H1DB1
1DAA:  1A 2F        diu     $15
1DAC:  41 00 48     sbc     $0,&H48
1DAF:  B0 C1        jr      z,&H1D71
1DB1:  77 AB 00     cal     &H00AB
1DB4:  B1 19        jr      nc,&H1DCE
1DB6:  41 0F 20     sbc     $15,&H20
1DB9:  B0 19        jr      z,&H1DD3
1DBB:  41 0F 10     sbc     $15,&H10
1DBE:  B4 06        jr      nz,&H1DC5
1DC0:  41 00 47     sbc     $0,&H47
1DC3:  B5 D5        jr      c,&H1D99
1DC5:  2D A1        ldd     $1,(iz-$sy)
1DC7:  77 51 1E     cal     &H1E51
1DCA:  B1 08        jr      nc,&H1DD3
1DCC:  B7 13        jr      &H1DE0
1DCE:  77 98 00     cal     &H0098
1DD1:  B1 07        jr      nc,&H1DD9
1DD3:  29 A0        ld      $0,(iz-$sy)
1DD5:  42 8F 20 E9  ld      $15,&H20,jr &H1DC1
1DD9:  77 2B 00     cal     &H002B
1DDC:  B1 D1        jr      nc,&H1DAE
1DDE:  B7 F0        jr      &H1DCF
1DE0:  02 0F        ld      $15,$sx
1DE2:  41 11 48     sbc     $17,&H48
1DE5:  B4 1A        jr      nz,&H1E00
1DE7:  02 20        ld      $0,$sy
1DE9:  77 CD 1E     cal     &H1ECD
1DEC:  77 D4 1E     cal     &H1ED4
1DEF:  41 11 A9     sbc     $17,&HA9
1DF2:  B0 09        jr      z,&H1DFC
1DF4:  D1 00 04 80  ldw     $0,&H8004
1DF8:  81 50        sbcw    $16,$sz
1DFA:  B4 37        jr      nz,&H1E32
1DFC:  42 8F 40 30  ld      $15,&H40,jr &H1E2F
1E00:  D1 00 05 AC  ldw     $0,&HAC05
1E04:  81 50        sbcw    $16,$sz
1E06:  B4 9B        jr      nz,&H1DA2
1E08:  77 D4 1E     cal     &H1ED4
1E0B:  77 49 00     cal     &H0049
1E0E:  77 AB 00     cal     &H00AB
1E11:  B1 1D        jr      nc,&H1E2F
1E13:  77 B6 00     cal     &H00B6
1E16:  77 51 1E     cal     &H1E51
1E19:  B1 C7        jr      nc,&H1DE1
1E1B:  41 10 05     sbc     $16,&H05
1E1E:  B4 BF        jr      nz,&H1DDE
1E20:  41 11 6B     sbc     $17,&H6B
1E23:  B5 C4        jr      c,&H1DE8
1E25:  41 11 71     sbc     $17,&H71
1E28:  B1 C9        jr      nc,&H1DF2
1E2A:  48 11 06     ad      $17,&H06
1E2D:  20 B1        st      $17,(ix-$sy)
1E2F:  37 49 1D     jp      &H1D49
1E32:  41 11 4E     sbc     $17,&H4E
1E35:  B1 87        jr      nc,&H1DBD
1E37:  77 C0 1E     cal     &H1EC0
1E3A:  77 2B 00     cal     &H002B
1E3D:  B1 07        jr      nc,&H1E45
1E3F:  77 9F 1E     cal     &H1E9F
1E42:  77 C0 1E     cal     &H1EC0
1E45:  41 00 2C     sbc     $0,&H2C
1E48:  B4 9A        jr      nz,&H1DE3
1E4A:  77 CD 1E     cal     &H1ECD
1E4D:  2D 20        ldd     $0,(iz+$sy)
1E4F:  B7 99        jr      &H1DE9
1E51:  9E 02        gre     ix,$2
1E53:  49 00 41     sb      $0,&H41
1E56:  18 60        biu     $0
1E58:  1E 61        gst     ua,$1
1E5A:  26 01        phs     $1
1E5C:  4C 01 CF     an      $1,&HCF
1E5F:  4E 01 20     or      $1,&H20
1E62:  16 61        pst     ua,$1
1E64:  D6 00 74 0B  pre     ix,&H0B74
1E68:  A8 40        ldw     $0,(ix+$sz)
1E6A:  96 00        pre     ix,$0
1E6C:  42 10 04     ld      $16,&H04
1E6F:  77 86 05     cal     &H0586
1E72:  B5 11        jr      c,&H1E84
1E74:  08 30        ad      $16,$sy
1E76:  41 10 08     sbc     $16,&H08
1E79:  B4 8B        jr      nz,&H1E05
1E7B:  2B 00        ldi     $0,(iz+$sx)
1E7D:  96 02        pre     ix,$2
1E7F:  2E 01        pps     $1
1E81:  16 61        pst     ua,$1
1E83:  F7           rtn   
1E84:  41 10 05     sbc     $16,&H05
1E87:  B4 13        jr      nz,&H1E9B
1E89:  41 11 82     sbc     $17,&H82
1E8C:  B4 0E        jr      nz,&H1E9B
1E8E:  2D 00        ldd     $0,(iz+$sx)
1E90:  41 00 24     sbc     $0,&H24
1E93:  B4 07        jr      nz,&H1E9B
1E95:  D1 10 06 97  ldw     $16,&H9706
1E99:  2B 00        ldi     $0,(iz+$sx)
1E9B:  01 3F        sbc     $31,$sy
1E9D:  B7 A1        jr      &H1E3F
1E9F:  77 DF 1E     cal     &H1EDF
1EA2:  81 31        sbcw    $17,$sy
1EA4:  B5 13        jr      c,&H1EB8
1EA6:  48 0E 03     ad      $14,&H03
1EA9:  B5 2F        jr      c,&H1ED9
1EAB:  E2 10 40     stim    $16,(ix+$sx),3
1EAE:  2D A0        ldd     $0,(iz-$sy)
1EB0:  41 00 20     sbc     $0,&H20
1EB3:  B0 86        jr      z,&H1E3A
1EB5:  2D 20        ldd     $0,(iz+$sy)
1EB7:  F7           rtn   
1EB8:  42 00 30     ld      $0,&H30
1EBB:  77 CD 1E     cal     &H1ECD
1EBE:  B7 91        jr      &H1E50
1EC0:  2D 00        ldd     $0,(iz+$sx)
1EC2:  41 00 20     sbc     $0,&H20
1EC5:  F4           rtn     nz
1EC6:  77 CD 1E     cal     &H1ECD
1EC9:  2D 20        ldd     $0,(iz+$sy)
1ECB:  B7 8A        jr      &H1E56
1ECD:  08 2E        ad      $14,$sy
1ECF:  B5 09        jr      c,&H1ED9
1ED1:  22 00        sti     $0,(ix+$sx)
1ED3:  F7           rtn   
1ED4:  48 0E 02     ad      $14,&H02
1ED7:  B1 04        jr      nc,&H1EDC
1ED9:  37 7C 2B     jp      &H2B7C
1EDC:  A2 10        stiw    $16,(ix+$sx)
1EDE:  F7           rtn   
1EDF:  77 E6 1E     cal     &H1EE6
1EE2:  35 98 2B     jp      c,&H2B98
1EE5:  F7           rtn   
1EE6:  42 10 03     ld      $16,&H03
1EE9:  89 71 11     sbw     $17,$17
1EEC:  D1 02 9A 19  ldw     $2,&H199A
1EF0:  77 29 00     cal     &H0029
1EF3:  F1           rtn     nc
1EF4:  81 71 02     sbcw    $17,$2
1EF7:  B1 16        jr      nc,&H1F0E
1EF9:  4C 00 0F     an      $0,&H0F
1EFC:  02 01        ld      $1,$sx
1EFE:  98 71        biuw    $17
1F00:  88 60 11     adw     $0,$17
1F03:  98 71        biuw    $17
1F05:  98 71        biuw    $17
1F07:  88 51        adw     $17,$sz
1F09:  2D 20        ldd     $0,(iz+$sy)
1F0B:  B1 9C        jr      nc,&H1EA8
1F0D:  F7           rtn   
1F0E:  01 3F        sbc     $31,$sy
1F10:  F7           rtn   
1F11:  77 DF 1E     cal     &H1EDF
1F14:  81 31        sbcw    $17,$sy
1F16:  F1           rtn     nc
1F17:  37 AC 2B     jp      &H2BAC
1F1A:  C9 64 64     sbbm    $4,$4,4
1F1D:  9B 46        invw    $6
1F1F:  A6 12        phsw    $18
1F21:  77 C9 00     cal     &H00C9
1F24:  B0 16        jr      z,&H1F3B
1F26:  77 2B 00     cal     &H002B
1F29:  B1 1D        jr      nc,&H1F47
1F2B:  77 11 1F     cal     &H1F11
1F2E:  82 64 11     ldw     $4,$17
1F31:  77 C9 00     cal     &H00C9
1F34:  B4 09        jr      nz,&H1F3E
1F36:  77 3C 00     cal     &H003C
1F39:  B5 0D        jr      c,&H1F47
1F3B:  77 11 1F     cal     &H1F11
1F3E:  82 66 11     ldw     $6,$17
1F41:  81 66 04     sbcw    $6,$4
1F44:  35 A4 2B     jp      c,&H2BA4
1F47:  AE 11        ppsw    $17
1F49:  37 93 00     jp      &H0093
1F4C:  42 90 01 04  ld      $16,&H01,jr &H1F53
1F50:  42 10 00     ld      $16,&H00
1F53:  55 1F        psr     sx,31
1F55:  55 3E        psr     sy,30
1F57:  55 40        psr     sz,0
1F59:  D1 1E 01 00  ldw     $30,&H0001
1F5D:  56 60 D4     pst     ua,&HD4
1F60:  D7 00 D7 1B  pre     ss,&H1BD7
1F64:  D6 60 D0 1C  pre     us,&H1CD0
1F68:  77 03 04     cal     &H0403
1F6B:  01 10        sbc     $16,$sx
1F6D:  B4 0D        jr      nz,&H1F7B
1F6F:  D6 00 0F 11  pre     ix,&H110F
1F73:  42 00 07     ld      $0,&H07
1F76:  20 20        st      $0,(ix+$sy)
1F78:  77 EA 92     cal     &H92EA
1F7B:  77 A7 27     cal     &H27A7
1F7E:  56 60 54     pst     ua,&H54
1F81:  37 C3 1F     jp      &H1FC3
1F84:  F7           rtn   
1F85:  E6 03 60     phsm    $3,4
1F88:  1C 40        gfl     $0
1F8A:  9E 01        gre     ix,$1
1F8C:  1E 63        gst     ua,$3
1F8E:  56 60 54     pst     ua,&H54
1F91:  D6 00 ED 16  pre     ix,&H16ED
1F95:  3A 1F        sbc     (ix+$sx),$31
1F97:  B0 0D        jr      z,&H1FA5
1F99:  BE 3E        sbw     (ix+$sy),$30
1F9B:  B4 09        jr      nz,&H1FA5
1F9D:  A0 3E        stw     $30,(ix+$sy)
1F9F:  D6 00 0F 11  pre     ix,&H110F
1FA3:  24 1F        std     $31,(ix+$sx)
1FA5:  16 63        pst     ua,$3
1FA7:  96 01        pre     ix,$1
1FA9:  14 40        pfl     $0
1FAB:  EE 00 60     ppsm    $0,4
1FAE:  FD           rtni  
1FAF:  FD           rtni  
1FB0:  77 91 29     cal     &H2991
1FB3:  77 B4 29     cal     &H29B4
1FB6:  77 E8 2A     cal     &H2AE8
1FB9:  D7 00 D7 1B  pre     ss,&H1BD7
1FBD:  77 91 28     cal     &H2891
1FC0:  77 88 28     cal     &H2888
1FC3:  77 72 29     cal     &H2972
1FC6:  74 64 2D     cal     nz,&H2D64
1FC9:  77 72 92     cal     &H9272
1FCC:  77 1C 00     cal     &H001C
1FCF:  4C 01 20     an      $1,&H20
1FD2:  4E 01 06     or      $1,&H06
1FD5:  24 01        std     $1,(ix+$sx)
1FD7:  56 60 54     pst     ua,&H54
1FDA:  D1 02 B0 1F  ldw     $2,&H1FB0
1FDE:  77 7A 29     cal     &H297A
1FE1:  77 BB 29     cal     &H29BB
1FE4:  77 02 20     cal     &H2002
1FE7:  77 A1 29     cal     &H29A1
1FEA:  B4 06        jr      nz,&H1FF1
1FEC:  77 10 26     cal     &H2610
1FEF:  B7 99        jr      &H1F89
1FF1:  24 1F        std     $31,(ix+$sx)
1FF3:  77 E8 2A     cal     &H2AE8
1FF6:  B7 A0        jr      &H1F97
1FF8:  D7 00 D7 1B  pre     ss,&H1BD7
1FFC:  D6 60 D0 1C  pre     us,&H1CD0
2000:  B7 9D        jr      &H1F9E
2002:  77 C8 23     cal     &H23C8
2005:  77 4F 29     cal     &H294F
2008:  44 01 04     anc     $1,&H04
200B:  34 5A 5A     jp      nz,&H5A5A
200E:  41 00 9A     sbc     $0,&H9A
2011:  30 F0 21     jp      z,&H21F0
2014:  41 00 9B     sbc     $0,&H9B
2017:  30 F8 21     jp      z,&H21F8
201A:  41 00 80     sbc     $0,&H80
201D:  B5 06        jr      c,&H2024
201F:  41 00 A6     sbc     $0,&HA6
2022:  B5 10        jr      c,&H2033
2024:  41 00 0D     sbc     $0,&H0D
2027:  F0           rtn     z
2028:  41 00 E0     sbc     $0,&HE0
202B:  31 75 20     jp      nc,&H2075
202E:  77 38 20     cal     &H2038
2031:  B7 B0        jr      &H1FE2
2033:  77 43 21     cal     &H2143
2036:  B7 B5        jr      &H1FEC
2038:  02 50        ld      $16,$sz
203A:  77 A1 29     cal     &H29A1
203D:  B0 31        jr      z,&H206F
203F:  41 10 20     sbc     $16,&H20
2042:  B5 2C        jr      c,&H206F
2044:  26 10        phs     $16
2046:  77 E8 2A     cal     &H2AE8
2049:  2E 10        pps     $16
204B:  41 10 5C     sbc     $16,&H5C
204E:  B0 16        jr      z,&H2065
2050:  41 10 2A     sbc     $16,&H2A
2053:  B0 11        jr      z,&H2065
2055:  B5 19        jr      c,&H206F
2057:  41 10 5E     sbc     $16,&H5E
205A:  B0 0A        jr      z,&H2065
205C:  41 10 30     sbc     $16,&H30
205F:  B1 0F        jr      nc,&H206F
2061:  04 30        anc     $16,$sy
2063:  B0 0B        jr      z,&H206F
2065:  26 10        phs     $16
2067:  77 DB 2A     cal     &H2ADB
206A:  77 AA 21     cal     &H21AA
206D:  2E 10        pps     $16
206F:  77 B1 29     cal     &H29B1
2072:  37 E3 2A     jp      &H2AE3
2075:  02 50        ld      $16,$sz
2077:  D6 00 7E 20  pre     ix,&H207E
207B:  37 66 01     jp      &H0166
207E:  E0 65 23     stm     $5,(ix+$3),2
2081:  E1 65 23     stm     $5,(iz+$3),2
2084:  E2 0C 22     stim    $12,(ix+$sx),2
2087:  E3 14 22     stim    $20,(iz+$sx),2
208A:  E4 4C 22     stdm    $12,(ix+$sz),2
208D:  E5 5F 22     stdm    $31,(iz+$sz),2
2090:  E6 BB 22     phsm    $27,2
2093:  E7 E6 22     phum    $6,2
2096:  E8 B8 2D     ldm     $24,(ix-$sy),2
2099:  E9 03 22     ldm     $3,(iz+$sx),2
209C:  EE 4B 61     ppsm    $11,4
209F:  EF 4B 61     ppum    $11,4
20A2:  00 A7 24     adc     $7,$sy,jr &H20C8
20A5:  42 0E 0A     ld      $14,&H0A
20A8:  42 90 46 06  ld      $16,&H46,jr &H20B1
20AC:  02 0E        ld      $14,$sx
20AE:  42 10 50     ld      $16,&H50
20B1:  77 F1 2A     cal     &H2AF1
20B4:  77 D7 2A     cal     &H2AD7
20B7:  42 11 0A     ld      $17,&H0A
20BA:  77 28 34     cal     &H3428
20BD:  77 FA 33     cal     &H33FA
20C0:  42 10 2A     ld      $16,&H2A
20C3:  B4 0F        jr      nz,&H20D3
20C5:  02 70 0E     ld      $16,$14
20C8:  41 10 0A     sbc     $16,&H0A
20CB:  B5 04        jr      c,&H20D0
20CD:  49 10 0A     sb      $16,&H0A
20D0:  4E 10 30     or      $16,&H30
20D3:  77 F1 2A     cal     &H2AF1
20D6:  77 D7 2A     cal     &H2AD7
20D9:  08 2E        ad      $14,$sy
20DB:  09 31        sb      $17,$sy
20DD:  B4 A4        jr      nz,&H2082
20DF:  37 50 7B     jp      &H7B50
20E2:  D1 00 D1 18  ldw     $0,&H18D1
20E6:  91 43        ldw     $3,($sz)
20E8:  D1 00 CF 18  ldw     $0,&H18CF
20EC:  91 40        ldw     $0,($sz)
20EE:  89 43        sbw     $3,$sz
20F0:  77 FC 20     cal     &H20FC
20F3:  42 10 42     ld      $16,&H42
20F6:  77 F1 2A     cal     &H2AF1
20F9:  37 D3 95     jp      &H95D3
20FC:  77 7E 18     cal     &H187E
20FF:  42 0D 04     ld      $13,&H04
2102:  01 71 0D     sbc     $17,$13
2105:  B1 0D        jr      nc,&H2113
2107:  E6 10 60     phsm    $16,4
210A:  77 D7 2A     cal     &H2AD7
210D:  EE 0D 60     ppsm    $13,4
2110:  09 AD 90     sb      $13,$sy,jr &H20A2
2113:  26 10        phs     $16
2115:  4C 10 0F     an      $16,&H0F
2118:  4E 10 30     or      $16,&H30
211B:  77 F1 2A     cal     &H2AF1
211E:  2E 10        pps     $16
2120:  DA 2E 40     dium    $14,3
2123:  09 31        sb      $17,$sy
2125:  B1 93        jr      nc,&H20B9
2127:  F7           rtn   
2128:  26 00        phs     $0
212A:  77 A1 29     cal     &H29A1
212D:  2E 00        pps     $0
212F:  B0 18        jr      z,&H2148
2131:  26 00        phs     $0
2133:  77 E8 2A     cal     &H2AE8
2136:  77 DB 2A     cal     &H2ADB
2139:  77 AA 21     cal     &H21AA
213C:  77 B1 29     cal     &H29B1
213F:  2E 00        pps     $0
2141:  B7 0D        jr      &H214F
2143:  41 00 A1     sbc     $0,&HA1
2146:  B1 9F        jr      nc,&H20E6
2148:  26 00        phs     $0
214A:  77 AA 29     cal     &H29AA
214D:  2E 00        pps     $0
214F:  77 7F 21     cal     &H217F
2152:  E6 0C 40     phsm    $12,3
2155:  2B 10        ldi     $16,(iz+$sx)
2157:  44 10 80     anc     $16,&H80
215A:  B4 06        jr      nz,&H2161
215C:  77 E3 2A     cal     &H2AE3
215F:  B7 8B        jr      &H20EB
2161:  4C 10 7F     an      $16,&H7F
2164:  77 E3 2A     cal     &H2AE3
2167:  42 10 28     ld      $16,&H28
216A:  18 6E        biu     $14
216C:  75 E3 2A     cal     c,&H2AE3
216F:  42 10 20     ld      $16,&H20
2172:  18 6E        biu     $14
2174:  75 E3 2A     cal     c,&H2AE3
2177:  EE 00 40     ppsm    $0,3
217A:  96 41        pre     iz,$1
217C:  16 60        pst     ua,$0
217E:  F7           rtn   
217F:  49 00 80     sb      $0,&H80
2182:  18 60        biu     $0
2184:  1E 6A        gst     ua,$10
2186:  9E 4B        gre     iz,$11
2188:  56 60 94     pst     ua,&H94
218B:  D6 40 B1 13  pre     iz,&H13B1
218F:  A9 40        ldw     $0,(iz+$sz)
2191:  02 6E 01     ld      $14,$1
2194:  4C 01 1F     an      $1,&H1F
2197:  96 40        pre     iz,$0
2199:  F7           rtn   
219A:  77 A4 22     cal     &H22A4
219D:  77 1F 13     cal     &H131F
21A0:  D6 00 31 11  pre     ix,&H1131
21A4:  24 1E        std     $30,(ix+$sx)
21A6:  F7           rtn   
21A7:  02 80 03     ld      $0,$sx,jr &H21AC
21AA:  02 20        ld      $0,$sy
21AC:  26 1B        phs     $27
21AE:  E6 16 A0     phsm    $22,6
21B1:  77 CC 21     cal     &H21CC
21B4:  77 A7 13     cal     &H13A7
21B7:  96 0F        pre     ix,$15
21B9:  2A 10        ldi     $16,(ix+$sx)
21BB:  9E 0E        gre     ix,$14
21BD:  77 E3 2A     cal     &H2AE3
21C0:  96 0E        pre     ix,$14
21C2:  09 31        sb      $17,$sy
21C4:  B4 8C        jr      nz,&H2151
21C6:  EE 11 A0     ppsm    $17,6
21C9:  2E 1B        pps     $27
21CB:  F7           rtn   
21CC:  01 20        sbc     $0,$sy
21CE:  B0 07        jr      z,&H21D6
21D0:  D6 00 53 17  pre     ix,&H1753
21D4:  B7 05        jr      &H21DA
21D6:  D6 00 49 17  pre     ix,&H1749
21DA:  EA 0A E0     ldim    $10,(ix+$sx),8
21DD:  2A 12        ldi     $18,(ix+$sx)
21DF:  F7           rtn   
21E0:  77 A1 29     cal     &H29A1
21E3:  B4 06        jr      nz,&H21EA
21E5:  AE 02        ppsw    $2
21E7:  37 33 20     jp      &H2033
21EA:  77 AA 29     cal     &H29AA
21ED:  37 D6 21     jp      &H21D6
21F0:  77 E0 21     cal     &H21E0
21F3:  77 C5 15     cal     &H15C5
21F6:  B7 07        jr      &H21FE
21F8:  77 E0 21     cal     &H21E0
21FB:  77 64 15     cal     &H1564
21FE:  77 A4 22     cal     &H22A4
2201:  B7 2C        jr      &H222E
2203:  77 AA 29     cal     &H29AA
2206:  77 AA 21     cal     &H21AA
2209:  37 02 20     jp      &H2002
220C:  77 AA 29     cal     &H29AA
220F:  77 A7 21     cal     &H21A7
2212:  B7 8A        jr      &H219D
2214:  77 76 22     cal     &H2276
2217:  B1 8F        jr      nc,&H21A7
2219:  77 D6 21     cal     &H21D6
221C:  77 54 00     cal     &H0054
221F:  77 C9 09     cal     &H09C9
2222:  77 5C 00     cal     &H005C
2225:  D6 00 53 17  pre     ix,&H1753
2229:  E2 0A E0     stim    $10,(ix+$sx),8
222C:  24 12        std     $18,(ix+$sx)
222E:  77 D6 21     cal     &H21D6
2231:  77 A4 22     cal     &H22A4
2234:  77 1F 13     cal     &H131F
2237:  D6 00 31 11  pre     ix,&H1131
223B:  24 1E        std     $30,(ix+$sx)
223D:  26 10        phs     $16
223F:  77 DB 2A     cal     &H2ADB
2242:  2E 10        pps     $16
2244:  77 D5 97     cal     &H97D5
2247:  77 BB 29     cal     &H29BB
224A:  B7 C2        jr      &H220D
224C:  77 76 22     cal     &H2276
224F:  B1 C7        jr      nc,&H2217
2251:  77 D6 21     cal     &H21D6
2254:  77 B8 06     cal     &H06B8
2257:  77 D0 21     cal     &H21D0
225A:  77 DA 05     cal     &H05DA
225D:  B7 C2        jr      &H2220
225F:  77 76 22     cal     &H2276
2262:  B1 DA        jr      nc,&H223D
2264:  77 D6 21     cal     &H21D6
2267:  77 B8 06     cal     &H06B8
226A:  77 D0 21     cal     &H21D0
226D:  77 D4 05     cal     &H05D4
2270:  B7 D5        jr      &H2246
2272:  AE 00        ppsw    $0
2274:  B7 EC        jr      &H2261
2276:  D6 00 C4 16  pre     ix,&H16C4
227A:  BA 1E        sbcw    (ix+$sx),$30
227C:  B1 8B        jr      nc,&H2208
227E:  77 A1 29     cal     &H29A1
2281:  B0 06        jr      z,&H2288
2283:  77 AA 29     cal     &H29AA
2286:  B7 31        jr      &H22B8
2288:  77 5E 97     cal     &H975E
228B:  77 07 1D     cal     &H1D07
228E:  D6 40 00 10  pre     iz,&H1000
2292:  3B 1F        sbc     (iz+$sx),$31
2294:  B0 A3        jr      z,&H2238
2296:  77 AF 28     cal     &H28AF
2299:  77 D3 95     cal     &H95D3
229C:  77 2F 11     cal     &H112F
229F:  3B 1F        sbc     (iz+$sx),$31
22A1:  34 70 2B     jp      nz,&H2B70
22A4:  77 54 00     cal     &H0054
22A7:  77 C9 09     cal     &H09C9
22AA:  77 5C 00     cal     &H005C
22AD:  D6 00 49 17  pre     ix,&H1749
22B1:  E2 0A E0     stim    $10,(ix+$sx),8
22B4:  0D 13        na      $19,$sx
22B6:  A0 12        stw     $18,(ix+$sx)
22B8:  01 3F        sbc     $31,$sy
22BA:  F7           rtn   
22BB:  77 EF 22     cal     &H22EF
22BE:  77 30 29     cal     &H2930
22C1:  01 01        sbc     $1,$sx
22C3:  B4 1C        jr      nz,&H22E0
22C5:  77 D3 95     cal     &H95D3
22C8:  77 B1 29     cal     &H29B1
22CB:  77 0C 2A     cal     &H2A0C
22CE:  6C 00 02     ldd     $0,(ix+&H02)
22D1:  02 41        ld      $1,$sz
22D3:  4C 00 02     an      $0,&H02
22D6:  24 00        std     $0,(ix+$sx)
22D8:  04 21        anc     $1,$sy
22DA:  34 B9 1F     jp      nz,&H1FB9
22DD:  37 F8 1F     jp      &H1FF8
22E0:  77 DB 2A     cal     &H2ADB
22E3:  37 02 20     jp      &H2002
22E6:  77 AA 29     cal     &H29AA
22E9:  77 54 23     cal     &H2354
22EC:  37 02 20     jp      &H2002
22EF:  77 9C 02     cal     &H029C
22F2:  77 FE 02     cal     &H02FE
22F5:  77 3A 97     cal     &H973A
22F8:  D6 00 04 11  pre     ix,&H1104
22FC:  A8 02        ldw     $2,(ix+$sx)
22FE:  02 60 02     ld      $0,$2
2301:  09 60 03     sb      $0,$3
2304:  D6 00 3B 11  pre     ix,&H113B
2308:  42 04 21     ld      $4,&H21
230B:  00 20        adc     $0,$sy
230D:  B1 2C        jr      nc,&H233A
230F:  3A 44        sbc     (ix+$sz),$4
2311:  B5 28        jr      c,&H233A
2313:  77 37 29     cal     &H2937
2316:  B0 07        jr      z,&H231E
2318:  77 23 03     cal     &H0323
231B:  77 D3 95     cal     &H95D3
231E:  77 3F 29     cal     &H293F
2321:  30 7C 2B     jp      z,&H2B7C
2324:  3A BF        sbc     (ix-$sy),$31
2326:  34 7C 2B     jp      nz,&H2B7C
2329:  77 DB 2A     cal     &H2ADB
232C:  D1 11 3C 26  ldw     $17,&H263C
2330:  77 20 65     cal     &H6520
2333:  77 E8 2A     cal     &H2AE8
2336:  AE 00        ppsw    $0
2338:  B7 D6        jr      &H230F
233A:  D1 00 D3 18  ldw     $0,&H18D3
233E:  28 64 03     ld      $4,(ix+$3)
2341:  01 63 02     sbc     $3,$2
2344:  B0 08        jr      z,&H234D
2346:  10 44        st      $4,($sz)
2348:  88 20        adw     $0,$sy
234A:  08 A3 8E     ad      $3,$sy,jr &H22DA
234D:  10 44        st      $4,($sz)
234F:  88 20        adw     $0,$sy
2351:  10 5F        st      $31,($sz)
2353:  F7           rtn   
2354:  D6 00 D3 18  pre     ix,&H18D3
2358:  2A 10        ldi     $16,(ix+$sx)
235A:  01 10        sbc     $16,$sx
235C:  F0           rtn     z
235D:  9E 0E        gre     ix,$14
235F:  77 E3 2A     cal     &H2AE3
2362:  96 8E 8C     pre     ix,$14,jr &H22F0
2365:  77 A1 29     cal     &H29A1
2368:  30 02 20     jp      z,&H2002
236B:  02 60 10     ld      $0,$16
236E:  77 D6 21     cal     &H21D6
2371:  02 73 12     ld      $19,$18
2374:  77 25 0A     cal     &H0A25
2377:  2C 17        ldd     $23,(ix+$sx)
2379:  00 37        adc     $23,$sy
237B:  B1 18        jr      nc,&H2394
237D:  82 77 11     ldw     $23,$17
2380:  9A 37        diuw    $23
2382:  1A 17        did     $23
2384:  0A 77 18     adb     $23,$24
2387:  0B 37        sbb     $23,$sy
2389:  B0 1E        jr      z,&H23A8
238B:  4B 17 03     sbb     $23,&H03
238E:  B1 86        jr      nc,&H2315
2390:  04 20        anc     $0,$sy
2392:  B4 15        jr      nz,&H23A8
2394:  4A 17 03     adb     $23,&H03
2397:  04 20        anc     $0,$sy
2399:  B0 04        jr      z,&H239E
239B:  4B 17 06     sbb     $23,&H06
239E:  01 17        sbc     $23,$sx
23A0:  B3 07        jr      uz,&H23A8
23A2:  40 17 6F     adc     $23,&H6F
23A5:  31 02 20     jp      nc,&H2002
23A8:  02 18        ld      $24,$sx
23AA:  41 17 50     sbc     $23,&H50
23AD:  B5 03        jr      c,&H23B1
23AF:  0B 38        sbb     $24,$sy
23B1:  82 60 11     ldw     $0,$17
23B4:  8B 60 17     sbbw    $0,$23
23B7:  44 01 FE     anc     $1,&HFE
23BA:  34 02 20     jp      nz,&H2002
23BD:  24 17        std     $23,(ix+$sx)
23BF:  77 9F 13     cal     &H139F
23C2:  77 4E 26     cal     &H264E
23C5:  37 02 20     jp      &H2002
23C8:  77 3D 02     cal     &H023D
23CB:  77 A4 03     cal     &H03A4
23CE:  26 00        phs     $0
23D0:  77 41 02     cal     &H0241
23D3:  77 4F 29     cal     &H294F
23D6:  44 01 46     anc     $1,&H46
23D9:  2E 00        pps     $0
23DB:  B4 09        jr      nz,&H23E5
23DD:  41 00 FD     sbc     $0,&HFD
23E0:  B4 04        jr      nz,&H23E5
23E2:  42 00 0D     ld      $0,&H0D
23E5:  D6 00 13 11  pre     ix,&H1113
23E9:  2C 02        ldd     $2,(ix+$sx)
23EB:  41 00 FB     sbc     $0,&HFB
23EE:  B0 21        jr      z,&H2410
23F0:  02 63 02     ld      $3,$2
23F3:  4C 02 EF     an      $2,&HEF
23F6:  24 02        std     $2,(ix+$sx)
23F8:  44 03 10     anc     $3,&H10
23FB:  B0 07        jr      z,&H2403
23FD:  77 2B 00     cal     &H002B
2400:  35 17 24     jp      c,&H2417
2403:  41 00 EA     sbc     $0,&HEA
2406:  F5           rtn     c
2407:  02 50        ld      $16,$sz
2409:  D6 00 84 24  pre     ix,&H2484
240D:  37 66 01     jp      &H0166
2410:  4E 02 10     or      $2,&H10
2413:  24 02        std     $2,(ix+$sx)
2415:  B7 CE        jr      &H23E4
2417:  41 00 39     sbc     $0,&H39
241A:  30 CE 5A     jp      z,&H5ACE
241D:  41 00 31     sbc     $0,&H31
2420:  B5 25        jr      c,&H2446
2422:  B0 0E        jr      z,&H2431
2424:  41 00 34     sbc     $0,&H34
2427:  B5 A5        jr      c,&H23CD
2429:  4C 00 0F     an      $0,&H0F
242C:  77 BA 52     cal     &H52BA
242F:  B7 9B        jr      &H23CB
2431:  77 57 24     cal     &H2457
2434:  77 8D 29     cal     &H298D
2437:  77 AC 20     cal     &H20AC
243A:  77 D7 2A     cal     &H2AD7
243D:  77 E2 20     cal     &H20E2
2440:  77 43 65     cal     &H6543
2443:  02 A1 06     ld      $1,$sy,jr &H244B
2446:  77 57 24     cal     &H2457
2449:  02 01        ld      $1,$sx
244B:  89 62 02     sbw     $2,$2
244E:  77 71 24     cal     &H2471
2451:  77 B4 29     cal     &H29B4
2454:  37 B9 1F     jp      &H1FB9
2457:  77 91 29     cal     &H2991
245A:  77 B4 29     cal     &H29B4
245D:  77 23 03     cal     &H0323
2460:  77 2A 03     cal     &H032A
2463:  B7 04        jr      &H2468
2465:  77 7E 27     cal     &H277E
2468:  77 74 97     cal     &H9774
246B:  37 DF 2A     jp      &H2ADF
246E:  C9 61 41     sbbm    $1,$1,3
2471:  E6 03 40     phsm    $3,3
2474:  77 4F 99     cal     &H994F
2477:  EE 01 40     ppsm    $1,3
247A:  D6 00 C4 16  pre     ix,&H16C4
247E:  E0 01 40     stm     $1,(ix+$sx),3
2481:  37 72 92     jp      &H9272
2484:  EA 46 6F     ldim    $6,(ix+$sz),4
2487:  EB 13 70     ldim    $19,(iz+$sx),4
248A:  EC 4F 6A     lddm    $15,(ix+$sz),4
248D:  ED 6B 62     lddm    $11,(iz+$2),4
2490:  FA           fst   
2491:  7E 26 FE     sb      (ix+&HFE),$6
2494:  31 8A 00     jp      nc,&H008A
2497:  99           ****  
2498:  24 02        std     $2,(ix+$sx)
249A:  60 10 F7     st      $16,(ix+&HF7)
249D:  26 10        phs     $16
249F:  77 65 24     cal     &H2465
24A2:  77 6E 24     cal     &H246E
24A5:  2E 10        pps     $16
24A7:  77 4F 29     cal     &H294F
24AA:  60 1F 02     st      $31,(ix+&H02)
24AD:  04 21        anc     $1,$sy
24AF:  B4 0E        jr      nz,&H24BE
24B1:  3A 3F        sbc     (ix+$sy),$31
24B3:  B0 0A        jr      z,&H24BE
24B5:  4C 10 3F     an      $16,&H3F
24B8:  02 60 10     ld      $0,$16
24BB:  37 2E 20     jp      &H202E
24BE:  77 0C 2A     cal     &H2A0C
24C1:  02 6E 10     ld      $14,$16
24C4:  4C 0E 0F     an      $14,&H0F
24C7:  77 04 34     cal     &H3404
24CA:  77 72 29     cal     &H2972
24CD:  34 31 24     jp      nz,&H2431
24D0:  77 AA 29     cal     &H29AA
24D3:  77 DC 24     cal     &H24DC
24D6:  8B 71 11     sbbw    $17,$17
24D9:  37 38 35     jp      &H3538
24DC:  D6 00 03 11  pre     ix,&H1103
24E0:  A8 00        ldw     $0,(ix+$sx)
24E2:  D6 00 3B 11  pre     ix,&H113B
24E6:  09 41        sb      $1,$sz
24E8:  42 10 02     ld      $16,&H02
24EB:  2C 40        ldd     $0,(ix+$sz)
24ED:  09 21        sb      $1,$sy
24EF:  35 F1 2A     jp      c,&H2AF1
24F2:  2A 00        ldi     $0,(ix+$sx)
24F4:  41 00 21     sbc     $0,&H21
24F7:  B5 8B        jr      c,&H2483
24F9:  37 E8 2A     jp      &H2AE8
24FC:  D6 00 1E 11  pre     ix,&H111E
2500:  42 00 10     ld      $0,&H10
2503:  D1 01 21 11  ldw     $1,&H1121
2507:  E0 00 40     stm     $0,(ix+$sx),3
250A:  37 79 03     jp      &H0379
250D:  28 A4        ld      $4,(ix-$sy)
250F:  44 04 02     anc     $4,&H02
2512:  68 82 02     ld      $2,(ix-&H02)
2515:  9E 0E        gre     ix,$14
2517:  A6 0F        phsw    $15
2519:  D6 00 5C 16  pre     ix,&H165C
251D:  D1 0E DB 8B  ldw     $14,&H8BDB
2521:  BA 0E        sbcw    (ix+$sx),$14
2523:  AE 0E        ppsw    $14
2525:  96 0E        pre     ix,$14
2527:  B0 2B        jr      z,&H2553
2529:  D1 0E 06 02  ldw     $14,&H0206
252D:  81 60 0E     sbcw    $0,$14
2530:  B0 41        jr      z,&H2572
2532:  D1 0E 01 08  ldw     $14,&H0801
2536:  81 60 0E     sbcw    $0,$14
2539:  B4 19        jr      nz,&H2553
253B:  44 02 80     anc     $2,&H80
253E:  B4 06        jr      nz,&H2545
2540:  77 94 25     cal     &H2594
2543:  B7 31        jr      &H2575
2545:  A6 06        phsw    $6
2547:  77 38 92     cal     &H9238
254A:  AE 05        ppsw    $5
254C:  B0 8D        jr      z,&H24DA
254E:  77 9B 25     cal     &H259B
2551:  B7 23        jr      &H2575
2553:  D1 0E 01 02  ldw     $14,&H0201
2557:  81 60 0E     sbcw    $0,$14
255A:  B0 10        jr      z,&H256B
255C:  01 21        sbc     $1,$sy
255E:  B4 2F        jr      nz,&H258E
2560:  77 79 03     cal     &H0379
2563:  42 00 03     ld      $0,&H03
2566:  02 07        ld      $7,$sx
2568:  37 55 05     jp      &H0555
256B:  77 79 03     cal     &H0379
256E:  42 80 13 8B  ld      $0,&H13,jr &H24FC
2572:  77 A2 25     cal     &H25A2
2575:  D1 03 11 11  ldw     $3,&H1111
2579:  91 65 03     ldw     $5,($3)
257C:  90 7E 03     stw     $30,($3)
257F:  41 05 1F     sbc     $5,&H1F
2582:  B0 05        jr      z,&H2588
2584:  41 06 1F     sbc     $6,&H1F
2587:  F4           rtn     nz
2588:  42 00 DD     ld      $0,&HDD
258B:  37 55 03     jp      &H0355
258E:  77 B2 25     cal     &H25B2
2591:  37 71 04     jp      &H0471
2594:  4C 02 60     an      $2,&H60
2597:  4F 82 40 0B  xr      $2,&H40,jr &H25A5
259B:  4C 02 60     an      $2,&H60
259E:  4F 82 20 04  xr      $2,&H20,jr &H25A5
25A2:  4F 02 80     xr      $2,&H80
25A5:  60 82 02     st      $2,(ix-&H02)
25A8:  E6 05 60     phsm    $5,4
25AB:  77 AC 92     cal     &H92AC
25AE:  EE 02 60     ppsm    $2,4
25B1:  F7           rtn   
25B2:  41 00 0B     sbc     $0,&H0B
25B5:  B0 3D        jr      z,&H25F3
25B7:  49 00 01     sb      $0,&H01
25BA:  49 01 02     sb      $1,&H02
25BD:  18 61        biu     $1
25BF:  08 60 01     ad      $0,$1
25C2:  18 61        biu     $1
25C4:  18 61        biu     $1
25C6:  08 60 01     ad      $0,$1
25C9:  D1 03 51 0F  ldw     $3,&H0F51
25CD:  44 02 80     anc     $2,&H80
25D0:  B4 0E        jr      nz,&H25DF
25D2:  18 60        biu     $0
25D4:  44 02 40     anc     $2,&H40
25D7:  B0 03        jr      z,&H25DB
25D9:  08 20        ad      $0,$sy
25DB:  D1 03 B1 0E  ldw     $3,&H0EB1
25DF:  02 01        ld      $1,$sx
25E1:  26 05        phs     $5
25E3:  1E 65        gst     ua,$5
25E5:  56 60 A4     pst     ua,&HA4
25E8:  77 82 05     cal     &H0582
25EB:  16 65        pst     ua,$5
25ED:  2E 05        pps     $5
25EF:  77 F7 25     cal     &H25F7
25F2:  F7           rtn   
25F3:  42 00 FE     ld      $0,&HFE
25F6:  F7           rtn   
25F7:  A6 06        phsw    $6
25F9:  77 38 92     cal     &H9238
25FC:  AE 05        ppsw    $5
25FE:  F4           rtn     nz
25FF:  41 00 EB     sbc     $0,&HEB
2602:  B4 05        jr      nz,&H2608
2604:  42 00 EA     ld      $0,&HEA
2607:  F7           rtn   
2608:  41 00 EA     sbc     $0,&HEA
260B:  F4           rtn     nz
260C:  42 00 ED     ld      $0,&HED
260F:  F7           rtn   
2610:  77 5E 97     cal     &H975E
2613:  77 07 1D     cal     &H1D07
2616:  77 72 29     cal     &H2972
2619:  B0 06        jr      z,&H2620
261B:  01 0F        sbc     $15,$sx
261D:  34 38 34     jp      nz,&H3438
2620:  D6 40 00 10  pre     iz,&H1000
2624:  3B 1F        sbc     (iz+$sx),$31
2626:  F0           rtn     z
2627:  77 AF 28     cal     &H28AF
262A:  77 D3 95     cal     &H95D3
262D:  77 49 00     cal     &H0049
2630:  41 00 04     sbc     $0,&H04
2633:  B0 2A        jr      z,&H265E
2635:  01 37        sbc     $23,$sy
2637:  B0 38        jr      z,&H2670
2639:  77 72 29     cal     &H2972
263C:  B4 30        jr      nz,&H266D
263E:  77 88 10     cal     &H1088
2641:  1C 40        gfl     $0
2643:  3B 1F        sbc     (iz+$sx),$31
2645:  B4 27        jr      nz,&H266D
2647:  14 40        pfl     $0
2649:  B5 0E        jr      c,&H2658
264B:  77 9A 21     cal     &H219A
264E:  26 10        phs     $16
2650:  77 DB 2A     cal     &H2ADB
2653:  2E 10        pps     $16
2655:  37 D5 97     jp      &H97D5
2658:  77 4E 26     cal     &H264E
265B:  37 E8 2A     jp      &H2AE8
265E:  2B 20        ldi     $0,(iz+$sy)
2660:  49 00 49     sb      $0,&H49
2663:  D1 03 DE 57  ldw     $3,&H57DE
2667:  77 83 11     cal     &H1183
266A:  3B 1F        sbc     (iz+$sx),$31
266C:  F0           rtn     z
266D:  37 70 2B     jp      &H2B70
2670:  42 02 AD     ld      $2,&HAD
2673:  77 EB 00     cal     &H00EB
2676:  30 A8 2B     jp      z,&H2BA8
2679:  77 A2 2E     cal     &H2EA2
267C:  B7 93        jr      &H2610
267E:  56 60 D4     pst     ua,&HD4
2681:  77 EA 92     cal     &H92EA
2684:  77 9A 93     cal     &H939A
2687:  D6 00 0F 11  pre     ix,&H110F
268B:  42 00 07     ld      $0,&H07
268E:  20 20        st      $0,(ix+$sy)
2690:  77 D4 28     cal     &H28D4
2693:  77 B6 27     cal     &H27B6
2696:  D1 00 40 0A  ldw     $0,&H0A40
269A:  D6 00 13 11  pre     ix,&H1113
269E:  A0 00        stw     $0,(ix+$sx)
26A0:  D6 00 3D 17  pre     ix,&H173D
26A4:  02 20        ld      $0,$sy
26A6:  D1 01 B0 02  ldw     $1,&H02B0
26AA:  E0 00 40     stm     $0,(ix+$sx),3
26AD:  D6 00 B7 16  pre     ix,&H16B7
26B1:  D1 00 50 00  ldw     $0,&H0050
26B5:  E0 1F 40     stm     $31,(ix+$sx),3
26B8:  D6 00 32 11  pre     ix,&H1132
26BC:  C9 40 E0     sbbm    $0,$sz,8
26BF:  A0 1F        stw     $31,(ix+$sx)
26C1:  D6 00 49 17  pre     ix,&H1749
26C5:  E2 00 E0     stim    $0,(ix+$sx),8
26C8:  E2 00 40     stim    $0,(ix+$sx),3
26CB:  E0 00 E0     stm     $0,(ix+$sx),8
26CE:  D1 00 8B 16  ldw     $0,&H168B
26D2:  D0 40 01 02  stw     &H0201,($sz)
26D6:  56 60 54     pst     ua,&H54
26D9:  D6 00 D3 18  pre     ix,&H18D3
26DD:  24 1F        std     $31,(ix+$sx)
26DF:  77 2F 43     cal     &H432F
26E2:  77 94 52     cal     &H5294
26E5:  42 00 FF     ld      $0,&HFF
26E8:  24 00        std     $0,(ix+$sx)
26EA:  77 72 92     cal     &H9272
26ED:  77 49 65     cal     &H6549
26F0:  D1 11 86 23  ldw     $17,&H2386
26F4:  77 14 83     cal     &H8314
26F7:  B5 05        jr      c,&H26FD
26F9:  D1 11 D5 23  ldw     $17,&H23D5
26FD:  77 20 65     cal     &H6520
2700:  D1 11 24 24  ldw     $17,&H2424
2704:  D6 00 D1 18  pre     ix,&H18D1
2708:  A8 00        ldw     $0,(ix+$sx)
270A:  44 01 10     anc     $1,&H10
270D:  B0 04        jr      z,&H2712
270F:  49 01 50     sb      $1,&H50
2712:  41 01 4F     sbc     $1,&H4F
2715:  B5 0B        jr      c,&H2721
2717:  D1 11 4A 24  ldw     $17,&H244A
271B:  B0 05        jr      z,&H2721
271D:  D1 11 70 24  ldw     $17,&H2470
2721:  77 40 65     cal     &H6540
2724:  D1 02 34 27  ldw     $2,&H2734
2728:  77 7A 29     cal     &H297A
272B:  D6 00 F0 16  pre     ix,&H16F0
272F:  24 1F        std     $31,(ix+$sx)
2731:  77 A4 03     cal     &H03A4
2734:  77 DF 2A     cal     &H2ADF
2737:  77 D8 01     cal     &H01D8
273A:  37 C3 1F     jp      &H1FC3
273D:  D1 00 34 27  ldw     $0,&H2734
2741:  D6 00 5C 16  pre     ix,&H165C
2745:  BA 00        sbcw    (ix+$sx),$0
2747:  B0 0A        jr      z,&H2752
2749:  D1 00 A4 2A  ldw     $0,&H2AA4
274D:  BA 00        sbcw    (ix+$sx),$0
274F:  34 57 02     jp      nz,&H0257
2752:  4F 0A 10     xr      $10,&H10
2755:  D6 00 00 11  pre     ix,&H1100
2759:  24 0A        std     $10,(ix+$sx)
275B:  D6 00 F0 16  pre     ix,&H16F0
275F:  2C 00        ldd     $0,(ix+$sx)
2761:  08 20        ad      $0,$sy
2763:  24 00        std     $0,(ix+$sx)
2765:  04 20        anc     $0,$sy
2767:  F4           rtn     nz
2768:  44 00 02     anc     $0,&H02
276B:  34 D8 01     jp      nz,&H01D8
276E:  37 D4 01     jp      &H01D4
2771:  D1 00 00 11  ldw     $0,&H1100
2775:  50 40 06     st      &H06,($sz)
2778:  77 74 97     cal     &H9774
277B:  37 DF 2A     jp      &H2ADF
277E:  77 91 29     cal     &H2991
2781:  77 0F 34     cal     &H340F
2784:  77 0A 36     cal     &H360A
2787:  77 B4 29     cal     &H29B4
278A:  77 23 03     cal     &H0323
278D:  77 2A 03     cal     &H032A
2790:  77 4F 29     cal     &H294F
2793:  41 01 08     sbc     $1,&H08
2796:  B4 08        jr      nz,&H279F
2798:  D1 02 5C 17  ldw     $2,&H175C
279C:  11 61 02     ld      $1,($2)
279F:  24 01        std     $1,(ix+$sx)
27A1:  60 1F 02     st      $31,(ix+&H02)
27A4:  37 B3 46     jp      &H46B3
27A7:  D1 00 07 41  ldw     $0,&H4107
27AB:  D1 02 80 00  ldw     $2,&H0080
27AF:  D6 00 15 11  pre     ix,&H1115
27B3:  E0 00 60     stm     $0,(ix+$sx),4
27B6:  77 91 29     cal     &H2991
27B9:  D6 00 70 17  pre     ix,&H1770
27BD:  02 00        ld      $0,$sx
27BF:  A0 1F        stw     $31,(ix+$sx)
27C1:  54 00 C0     ppo     &HC0
27C4:  57 00 40     pst     ia,&H40
27C7:  56 20 CC     pst     pd,&HCC
27CA:  56 00 CE     pst     pe,&HCE
27CD:  D6 00 95 18  pre     ix,&H1895
27D1:  AA 00        ldiw    $0,(ix+$sx)
27D3:  A2 00        stiw    $0,(ix+$sx)
27D5:  A0 00        stw     $0,(ix+$sx)
27D7:  D1 00 00 11  ldw     $0,&H1100
27DB:  50 40 06     st      &H06,($sz)
27DE:  77 74 97     cal     &H9774
27E1:  D6 00 13 11  pre     ix,&H1113
27E5:  A8 00        ldw     $0,(ix+$sx)
27E7:  4C 00 60     an      $0,&H60
27EA:  4C 01 02     an      $1,&H02
27ED:  A0 00        stw     $0,(ix+$sx)
27EF:  77 FC 24     cal     &H24FC
27F2:  77 B4 29     cal     &H29B4
27F5:  D6 00 BF 16  pre     ix,&H16BF
27F9:  C9 40 E0     sbbm    $0,$sz,8
27FC:  E0 00 E0     stm     $0,(ix+$sx),8
27FF:  D6 00 3A 17  pre     ix,&H173A
2803:  E0 00 40     stm     $0,(ix+$sx),3
2806:  D6 00 D9 16  pre     ix,&H16D9
280A:  E2 00 E0     stim    $0,(ix+$sx),8
280D:  E2 00 E0     stim    $0,(ix+$sx),8
2810:  A0 00        stw     $0,(ix+$sx)
2812:  D6 00 0D 11  pre     ix,&H110D
2816:  42 00 5F     ld      $0,&H5F
2819:  20 20        st      $0,(ix+$sy)
281B:  77 02 34     cal     &H3402
281E:  77 6D 04     cal     &H046D
2821:  D6 00 33 11  pre     ix,&H1133
2825:  24 1F        std     $31,(ix+$sx)
2827:  77 0A 36     cal     &H360A
282A:  1E 22        gst     pd,$2
282C:  4C 02 FB     an      $2,&HFB
282F:  16 22        pst     pd,$2
2831:  56 60 34     pst     ua,&H34
2834:  D1 00 F8 FF  ldw     $0,&HFFF8
2838:  10 41        st      $1,($sz)
283A:  42 00 FC     ld      $0,&HFC
283D:  50 40 80     st      &H80,($sz)
2840:  D1 05 78 00  ldw     $5,&H0078
2844:  89 25        sbw     $5,$sy
2846:  B4 83        jr      nz,&H27CA
2848:  50 40 C0     st      &HC0,($sz)
284B:  02 24        ld      $4,$sy
284D:  56 60 54     pst     ua,&H54
2850:  D6 00 BE 16  pre     ix,&H16BE
2854:  24 04        std     $4,(ix+$sx)
2856:  4E 02 04     or      $2,&H04
2859:  16 22        pst     pd,$2
285B:  1C 00        gpo     $0
285D:  1C 01        gpo     $1
285F:  01 41        sbc     $1,$sz
2861:  B4 87        jr      nz,&H27E9
2863:  04 21        anc     $1,$sy
2865:  D6 00 ED 16  pre     ix,&H16ED
2869:  B0 11        jr      z,&H287B
286B:  D1 00 10 0E  ldw     $0,&H0E10
286F:  E0 1F 40     stm     $31,(ix+$sx),3
2872:  77 A8 01     cal     &H01A8
2875:  77 F7 95     cal     &H95F7
2878:  37 DA 01     jp      &H01DA
287B:  A8 22        ldw     $2,(ix+$sy)
287D:  D1 00 68 01  ldw     $0,&H0168
2881:  81 42        sbcw    $2,$sz
2883:  35 AD 2A     jp      c,&H2AAD
2886:  B7 95        jr      &H281C
2888:  D6 00 C7 16  pre     ix,&H16C7
288C:  AA 00        ldiw    $0,(ix+$sx)
288E:  A0 00        stw     $0,(ix+$sx)
2890:  F7           rtn   
2891:  77 A0 28     cal     &H28A0
2894:  77 A6 28     cal     &H28A6
2897:  77 AF 28     cal     &H28AF
289A:  77 BC 28     cal     &H28BC
289D:  37 B3 46     jp      &H46B3
28A0:  D6 00 9F 18  pre     ix,&H189F
28A4:  B7 05        jr      &H28AA
28A6:  D6 00 9D 18  pre     ix,&H189D
28AA:  A8 00        ldw     $0,(ix+$sx)
28AC:  A4 A1        stdw    $1,(ix-$sy)
28AE:  F7           rtn   
28AF:  D6 60 D0 1C  pre     us,&H1CD0
28B3:  D6 00 97 18  pre     ix,&H1897
28B7:  AA 00        ldiw    $0,(ix+$sx)
28B9:  A0 00        stw     $0,(ix+$sx)
28BB:  F7           rtn   
28BC:  D6 00 C6 16  pre     ix,&H16C6
28C0:  24 1F        std     $31,(ix+$sx)
28C2:  F7           rtn   
28C3:  48 01 1F     ad      $1,&H1F
28C6:  01 62 04     sbc     $2,$4
28C9:  B4 37        jr      nz,&H2901
28CB:  48 01 60     ad      $1,&H60
28CE:  D1 02 1A 0B  ldw     $2,&H0B1A
28D2:  B7 3B        jr      &H290E
28D4:  D1 00 00 30  ldw     $0,&H3000
28D8:  77 14 83     cal     &H8314
28DB:  B5 05        jr      c,&H28E1
28DD:  D1 00 00 80  ldw     $0,&H8000
28E1:  FB           slw   
28E2:  11 42        ld      $2,($sz)
28E4:  02 64 02     ld      $4,$2
28E7:  1B 42        inv     $2
28E9:  10 42        st      $2,($sz)
28EB:  11 43        ld      $3,($sz)
28ED:  4E 01 40     or      $1,&H40
28F0:  10 44        st      $4,($sz)
28F2:  4C 01 BF     an      $1,&HBF
28F5:  11 44        ld      $4,($sz)
28F7:  FA           fst   
28F8:  09 20        sb      $0,$sy
28FA:  01 62 03     sbc     $2,$3
28FD:  B0 BB        jr      z,&H28B9
28FF:  09 21        sb      $1,$sy
2901:  D1 02 DE 0A  ldw     $2,&H0ADE
2905:  44 01 10     anc     $1,&H10
2908:  B0 05        jr      z,&H290E
290A:  D1 02 1A 0B  ldw     $2,&H0B1A
290E:  D6 00 D1 18  pre     ix,&H18D1
2912:  A0 00        stw     $0,(ix+$sx)
2914:  D1 00 95 18  ldw     $0,&H1895
2918:  D1 04 3C 00  ldw     $4,&H003C
291C:  77 BB 0E     cal     &H0EBB
291F:  D6 00 A7 18  pre     ix,&H18A7
2923:  A8 00        ldw     $0,(ix+$sx)
2925:  D1 02 56 0B  ldw     $2,&H0B56
2929:  D1 04 14 00  ldw     $4,&H0014
292D:  37 BB 0E     jp      &H0EBB
2930:  D6 00 C5 16  pre     ix,&H16C5
2934:  2C 01        ldd     $1,(ix+$sx)
2936:  F7           rtn   
2937:  42 80 10 0F  ld      $0,&H10,jr &H2949
293B:  42 80 08 0B  ld      $0,&H08,jr &H2949
293F:  42 80 04 07  ld      $0,&H04,jr &H2949
2943:  42 80 02 03  ld      $0,&H02,jr &H2949
2947:  02 20        ld      $0,$sy
2949:  77 30 29     cal     &H2930
294C:  04 41        anc     $1,$sz
294E:  F7           rtn   
294F:  D6 00 C4 16  pre     ix,&H16C4
2953:  2C 01        ldd     $1,(ix+$sx)
2955:  F7           rtn   
2956:  42 80 80 1B  ld      $0,&H80,jr &H2974
295A:  42 80 40 17  ld      $0,&H40,jr &H2974
295E:  42 80 20 13  ld      $0,&H20,jr &H2974
2962:  42 80 10 0F  ld      $0,&H10,jr &H2974
2966:  42 80 08 0B  ld      $0,&H08,jr &H2974
296A:  42 80 04 07  ld      $0,&H04,jr &H2974
296E:  42 80 02 03  ld      $0,&H02,jr &H2974
2972:  02 20        ld      $0,$sy
2974:  77 4F 29     cal     &H294F
2977:  04 41        anc     $1,$sz
2979:  F7           rtn   
297A:  D6 00 5C 16  pre     ix,&H165C
297E:  A0 02        stw     $2,(ix+$sx)
2980:  F7           rtn   
2981:  42 80 08 0F  ld      $0,&H08,jr &H2993
2985:  42 80 04 0B  ld      $0,&H04,jr &H2993
2989:  42 80 02 07  ld      $0,&H02,jr &H2993
298D:  42 80 01 03  ld      $0,&H01,jr &H2993
2991:  02 00        ld      $0,$sx
2993:  D6 00 39 17  pre     ix,&H1739
2997:  24 00        std     $0,(ix+$sx)
2999:  F7           rtn   
299A:  D6 00 39 17  pre     ix,&H1739
299E:  2C 01        ldd     $1,(ix+$sx)
29A0:  F7           rtn   
29A1:  D6 00 31 11  pre     ix,&H1131
29A5:  2C 01        ldd     $1,(ix+$sx)
29A7:  01 01        sbc     $1,$sx
29A9:  F7           rtn   
29AA:  77 A1 29     cal     &H29A1
29AD:  F0           rtn     z
29AE:  77 E8 2A     cal     &H2AE8
29B1:  77 1B 03     cal     &H031B
29B4:  D1 00 31 11  ldw     $0,&H1131
29B8:  10 5F        st      $31,($sz)
29BA:  F7           rtn   
29BB:  77 2E 03     cal     &H032E
29BE:  77 A1 29     cal     &H29A1
29C1:  F4           rtn     nz
29C2:  37 1B 03     jp      &H031B
29C5:  D1 00 EE 16  ldw     $0,&H16EE
29C9:  91 40        ldw     $0,($sz)
29CB:  81 20        sbcw    $0,$sy
29CD:  30 AD 2A     jp      z,&H2AAD
29D0:  77 F7 03     cal     &H03F7
29D3:  42 03 03     ld      $3,&H03
29D6:  42 00 41     ld      $0,&H41
29D9:  77 81 03     cal     &H0381
29DC:  01 01        sbc     $1,$sx
29DE:  F0           rtn     z
29DF:  09 23        sb      $3,$sy
29E1:  B4 8C        jr      nz,&H296E
29E3:  D6 00 15 11  pre     ix,&H1115
29E7:  E0 20 40     stm     $0,(ix+$sy),3
29EA:  77 58 04     cal     &H0458
29ED:  77 41 02     cal     &H0241
29F0:  56 60 54     pst     ua,&H54
29F3:  77 0C 2A     cal     &H2A0C
29F6:  77 EE 46     cal     &H46EE
29F9:  D6 00 14 11  pre     ix,&H1114
29FD:  2C 00        ldd     $0,(ix+$sx)
29FF:  4C 00 42     an      $0,&H42
2A02:  24 00        std     $0,(ix+$sx)
2A04:  D6 00 5C 16  pre     ix,&H165C
2A08:  A8 00        ldw     $0,(ix+$sx)
2A0A:  DE 00        jp      $0
2A0C:  77 4F 29     cal     &H294F
2A0F:  2C 02        ldd     $2,(ix+$sx)
2A11:  68 03 02     ld      $3,(ix+&H02)
2A14:  4C 03 03     an      $3,&H03
2A17:  60 03 02     st      $3,(ix+&H02)
2A1A:  41 02 08     sbc     $2,&H08
2A1D:  B4 08        jr      nz,&H2A26
2A1F:  D1 02 5C 17  ldw     $2,&H175C
2A23:  11 62 02     ld      $2,($2)
2A26:  4C 02 C7     an      $2,&HC7
2A29:  24 02        std     $2,(ix+$sx)
2A2B:  F7           rtn   
2A2C:  D1 00 C2 16  ldw     $0,&H16C2
2A30:  11 40        ld      $0,($sz)
2A32:  01 00        sbc     $0,$sx
2A34:  34 FE 03     jp      nz,&H03FE
2A37:  42 01 0A     ld      $1,&H0A
2A3A:  1C 00        gpo     $0
2A3C:  04 20        anc     $0,$sy
2A3E:  B4 8B        jr      nz,&H29CA
2A40:  09 21        sb      $1,$sy
2A42:  B4 89        jr      nz,&H29CC
2A44:  D6 00 C2 16  pre     ix,&H16C2
2A48:  24 1E        std     $30,(ix+$sx)
2A4A:  D6 00 ED 16  pre     ix,&H16ED
2A4E:  24 1E        std     $30,(ix+$sx)
2A50:  D7 00 D7 1B  pre     ss,&H1BD7
2A54:  77 7C 01     cal     &H017C
2A57:  56 60 54     pst     ua,&H54
2A5A:  77 91 29     cal     &H2991
2A5D:  77 0F 34     cal     &H340F
2A60:  77 0A 36     cal     &H360A
2A63:  77 B4 29     cal     &H29B4
2A66:  77 23 03     cal     &H0323
2A69:  77 2A 03     cal     &H032A
2A6C:  77 68 24     cal     &H2468
2A6F:  D1 11 38 25  ldw     $17,&H2538
2A73:  77 38 92     cal     &H9238
2A76:  B4 05        jr      nz,&H2A7C
2A78:  D1 11 BA 25  ldw     $17,&H25BA
2A7C:  77 3D 65     cal     &H653D
2A7F:  89 40        sbw     $0,$sz
2A81:  D6 00 C4 16  pre     ix,&H16C4
2A85:  E0 1F 40     stm     $31,(ix+$sx),3
2A88:  D1 02 A4 2A  ldw     $2,&H2AA4
2A8C:  77 7A 29     cal     &H297A
2A8F:  77 1B 03     cal     &H031B
2A92:  D6 00 F0 16  pre     ix,&H16F0
2A96:  24 1F        std     $31,(ix+$sx)
2A98:  1F 24        gst     ie,$4
2A9A:  4E 04 40     or      $4,&H40
2A9D:  17 24        pst     ie,$4
2A9F:  77 A4 03     cal     &H03A4
2AA2:  B7 84        jr      &H2A27
2AA4:  77 DF 2A     cal     &H2ADF
2AA7:  77 D8 01     cal     &H01D8
2AAA:  37 B9 1F     jp      &H1FB9
2AAD:  77 4F 99     cal     &H994F
2AB0:  D7 00 D7 1B  pre     ss,&H1BD7
2AB4:  77 7C 01     cal     &H017C
2AB7:  77 EE 46     cal     &H46EE
2ABA:  77 7E 27     cal     &H277E
2ABD:  D1 03 2E 0D  ldw     $3,&H0D2E
2AC1:  77 83 01     cal     &H0183
2AC4:  77 D4 01     cal     &H01D4
2AC7:  D1 00 FC FF  ldw     $0,&HFFFC
2ACB:  14 1F        ppo     $31
2ACD:  17 3F        pst     ie,$31
2ACF:  FE           off   
2AD0:  FE           off   
2AD1:  82 63 13     ldw     $3,$19
2AD4:  77 FC 20     cal     &H20FC
2AD7:  42 90 20 17  ld      $16,&H20,jr &H2AF1
2ADB:  42 90 05 13  ld      $16,&H05,jr &H2AF1
2ADF:  42 90 0C 0F  ld      $16,&H0C,jr &H2AF1
2AE3:  77 1D 03     cal     &H031D
2AE6:  B7 0D        jr      &H2AF4
2AE8:  42 10 0D     ld      $16,&H0D
2AEB:  77 F1 2A     cal     &H2AF1
2AEE:  42 10 0A     ld      $16,&H0A
2AF1:  77 30 03     cal     &H0330
2AF4:  D6 00 39 17  pre     ix,&H1739
2AF8:  2C 00        ldd     $0,(ix+$sx)
2AFA:  41 00 02     sbc     $0,&H02
2AFD:  35 E2 93     jp      c,&H93E2
2B00:  9E 4C        gre     iz,$12
2B02:  E6 0F 60     phsm    $15,4
2B05:  B0 1E        jr      z,&H2B24
2B07:  41 00 08     sbc     $0,&H08
2B0A:  B0 22        jr      z,&H2B2D
2B0C:  77 2E 48     cal     &H482E
2B0F:  77 44 2B     cal     &H2B44
2B12:  41 10 0D     sbc     $16,&H0D
2B15:  B0 13        jr      z,&H2B29
2B17:  41 10 20     sbc     $16,&H20
2B1A:  B5 03        jr      c,&H2B1E
2B1C:  3C 1E        ad      (ix+$sx),$30
2B1E:  EE 0C 60     ppsm    $12,4
2B21:  96 4C        pre     iz,$12
2B23:  F7           rtn   
2B24:  77 A9 89     cal     &H89A9
2B27:  B7 99        jr      &H2AC1
2B29:  24 1F        std     $31,(ix+$sx)
2B2B:  B7 8E        jr      &H2ABA
2B2D:  77 3D 2B     cal     &H2B3D
2B30:  70 A9 89     cal     z,&H89A9
2B33:  77 E2 93     cal     &H93E2
2B36:  77 3D 2B     cal     &H2B3D
2B39:  B0 AB        jr      z,&H2AE5
2B3B:  B7 9E        jr      &H2ADA
2B3D:  D6 00 3B 17  pre     ix,&H173B
2B41:  3A 1E        sbc     (ix+$sx),$30
2B43:  F7           rtn   
2B44:  D6 00 39 17  pre     ix,&H1739
2B48:  2C 00        ldd     $0,(ix+$sx)
2B4A:  44 00 0A     anc     $0,&H0A
2B4D:  B4 09        jr      nz,&H2B57
2B4F:  D6 00 70 17  pre     ix,&H1770
2B53:  6C 00 1B     ldd     $0,(ix+&H1B)
2B56:  F7           rtn   
2B57:  D6 00 3C 17  pre     ix,&H173C
2B5B:  2C 00        ldd     $0,(ix+$sx)
2B5D:  F7           rtn   
2B5E:  D6 00 BF 16  pre     ix,&H16BF
2B62:  24 1E        std     $30,(ix+$sx)
2B64:  77 8D 80     cal     &H808D
2B67:  42 0F 0B     ld      $15,&H0B
2B6A:  37 EA 2B     jp      &H2BEA
2B6D:  02 AF 7B     ld      $15,$sy,jr &H2BEA
2B70:  42 8F 02 77  ld      $15,&H02,jr &H2BEA
2B74:  42 8F 03 73  ld      $15,&H03,jr &H2BEA
2B78:  42 8F 04 6F  ld      $15,&H04,jr &H2BEA
2B7C:  42 8F 05 6B  ld      $15,&H05,jr &H2BEA
2B80:  42 8F 06 67  ld      $15,&H06,jr &H2BEA
2B84:  42 8F 07 63  ld      $15,&H07,jr &H2BEA
2B88:  42 8F 08 5F  ld      $15,&H08,jr &H2BEA
2B8C:  42 8F 09 5B  ld      $15,&H09,jr &H2BEA
2B90:  42 8F 0A 57  ld      $15,&H0A,jr &H2BEA
2B94:  42 8F 0C 53  ld      $15,&H0C,jr &H2BEA
2B98:  42 8F 0D 4F  ld      $15,&H0D,jr &H2BEA
2B9C:  42 8F 0E 4B  ld      $15,&H0E,jr &H2BEA
2BA0:  42 8F 0F 47  ld      $15,&H0F,jr &H2BEA
2BA4:  42 8F 10 43  ld      $15,&H10,jr &H2BEA
2BA8:  42 8F 11 3F  ld      $15,&H11,jr &H2BEA
2BAC:  42 8F 12 3B  ld      $15,&H12,jr &H2BEA
2BB0:  42 8F 13 37  ld      $15,&H13,jr &H2BEA
2BB4:  42 8F 14 33  ld      $15,&H14,jr &H2BEA
2BB8:  42 8F 15 2F  ld      $15,&H15,jr &H2BEA
2BBC:  42 8F 16 2B  ld      $15,&H16,jr &H2BEA
2BC0:  42 8F 17 27  ld      $15,&H17,jr &H2BEA
2BC4:  42 8F 18 23  ld      $15,&H18,jr &H2BEA
2BC8:  42 8F 19 1F  ld      $15,&H19,jr &H2BEA
2BCC:  77 8D 80     cal     &H808D
2BCF:  42 8F 1A 18  ld      $15,&H1A,jr &H2BEA
2BD3:  42 8F 1B 14  ld      $15,&H1B,jr &H2BEA
2BD7:  42 8F 1C 10  ld      $15,&H1C,jr &H2BEA
2BDB:  42 8F 1D 0C  ld      $15,&H1D,jr &H2BEA
2BDF:  42 8F 1E 08  ld      $15,&H1E,jr &H2BEA
2BE3:  42 8F 1F 04  ld      $15,&H1F,jr &H2BEA
2BE7:  42 0F 20     ld      $15,&H20
2BEA:  56 60 54     pst     ua,&H54
2BED:  77 5E 29     cal     &H295E
2BF0:  74 EE 46     cal     nz,&H46EE
2BF3:  77 47 29     cal     &H2947
2BF6:  70 91 29     cal     z,&H2991
2BF9:  D6 00 BA 16  pre     ix,&H16BA
2BFD:  D1 00 41 66  ldw     $0,&H6641
2C01:  BA 00        sbcw    (ix+$sx),$0
2C03:  74 91 29     cal     nz,&H2991
2C06:  D6 00 34 11  pre     ix,&H1134
2C0A:  24 0F        std     $15,(ix+$sx)
2C0C:  77 4F 29     cal     &H294F
2C0F:  4C 01 CF     an      $1,&HCF
2C12:  24 01        std     $1,(ix+$sx)
2C14:  AA 22        ldiw    $2,(ix+$sy)
2C16:  4C 03 03     an      $3,&H03
2C19:  24 A3        std     $3,(ix-$sy)
2C1B:  D6 00 57 15  pre     ix,&H1557
2C1F:  24 1F        std     $31,(ix+$sx)
2C21:  02 72 0F     ld      $18,$15
2C24:  41 01 40     sbc     $1,&H40
2C27:  30 DC FF     jp      z,&HFFDC
2C2A:  01 01        sbc     $1,$sx
2C2C:  B4 0A        jr      nz,&H2C37
2C2E:  04 22        anc     $2,$sy
2C30:  B4 58        jr      nz,&H2C89
2C32:  41 02 02     sbc     $2,&H02
2C35:  B0 5C        jr      z,&H2C92
2C37:  44 01 02     anc     $1,&H02
2C3A:  B4 57        jr      nz,&H2C92
2C3C:  D6 00 C9 16  pre     ix,&H16C9
2C40:  E8 0C A0     ldm     $12,(ix+$sx),6
2C43:  77 4A 50     cal     &H504A
2C46:  B0 26        jr      z,&H2C6D
2C48:  D6 00 E3 16  pre     ix,&H16E3
2C4C:  E0 0E 80     stm     $14,(ix+$sx),5
2C4F:  D6 00 DF 16  pre     ix,&H16DF
2C53:  EA 04 E0     ldim    $4,(ix+$sx),8
2C56:  3A 3E        sbc     (ix+$sy),$30
2C58:  B1 14        jr      nc,&H2C6D
2C5A:  81 26        sbcw    $6,$sy
2C5C:  B5 10        jr      c,&H2C6D
2C5E:  81 64 0C     sbcw    $4,$12
2C61:  B4 0B        jr      nz,&H2C6D
2C63:  20 3E        st      $30,(ix+$sy)
2C65:  77 0C 2A     cal     &H2A0C
2C68:  96 46        pre     iz,$6
2C6A:  37 59 35     jp      &H3559
2C6D:  56 60 54     pst     ua,&H54
2C70:  77 0A 2D     cal     &H2D0A
2C73:  77 23 3B     cal     &H3B23
2C76:  77 66 29     cal     &H2966
2C79:  34 89 2F     jp      nz,&H2F89
2C7C:  0C 21        an      $1,$sy
2C7E:  24 01        std     $1,(ix+$sx)
2C80:  77 BC 28     cal     &H28BC
2C83:  77 EE 46     cal     &H46EE
2C86:  37 B9 1F     jp      &H1FB9
2C89:  D6 00 BA 16  pre     ix,&H16BA
2C8D:  E8 00 E0     ldm     $0,(ix+$sx),8
2C90:  DE 00        jp      $0
2C92:  D7 00 D7 1B  pre     ss,&H1BD7
2C96:  77 57 5D     cal     &H5D57
2C99:  77 EF 2C     cal     &H2CEF
2C9C:  56 60 04     pst     ua,&H04
2C9F:  D6 00 47 2D  pre     ix,&H2D47
2CA3:  E8 0A A0     ldm     $10,(ix+$sx),6
2CA6:  56 60 54     pst     ua,&H54
2CA9:  D6 00 1C 15  pre     ix,&H151C
2CAD:  E0 08 E0     stm     $8,(ix+$sx),8
2CB0:  77 1E 5D     cal     &H5D1E
2CB3:  77 2E 03     cal     &H032E
2CB6:  D6 60 C3 1C  pre     us,&H1CC3
2CBA:  EF 11 80     ppum    $17,5
2CBD:  EF 16 E0     ppum    $22,8
2CC0:  D1 02 5C 9F  ldw     $2,&H9F5C
2CC4:  77 37 99     cal     &H9937
2CC7:  74 7A 29     cal     nz,&H297A
2CCA:  77 79 03     cal     &H0379
2CCD:  77 A4 03     cal     &H03A4
2CD0:  02 42        ld      $2,$sz
2CD2:  77 37 99     cal     &H9937
2CD5:  34 E4 97     jp      nz,&H97E4
2CD8:  77 4F 29     cal     &H294F
2CDB:  42 00 02     ld      $0,&H02
2CDE:  BA 1F        sbcw    (ix+$sx),$31
2CE0:  30 4F 6A     jp      z,&H6A4F
2CE3:  02 60 02     ld      $0,$2
2CE6:  77 E5 23     cal     &H23E5
2CE9:  77 1B 03     cal     &H031B
2CEC:  37 71 5B     jp      &H5B71
2CEF:  02 6F 12     ld      $15,$18
2CF2:  41 0F 21     sbc     $15,&H21
2CF5:  B5 03        jr      c,&H2CF9
2CF7:  02 0F        ld      $15,$sx
2CF9:  1E 60        gst     ua,$0
2CFB:  56 60 A4     pst     ua,&HA4
2CFE:  D6 00 9C 0A  pre     ix,&H0A9C
2D02:  18 6F        biu     $15
2D04:  A8 68 0F     ldw     $8,(ix+$15)
2D07:  16 60        pst     ua,$0
2D09:  F7           rtn   
2D0A:  77 65 3C     cal     &H3C65
2D0D:  77 EF 2C     cal     &H2CEF
2D10:  82 70 08     ldw     $16,$8
2D13:  77 F1 2A     cal     &H2AF1
2D16:  9A 51        bydw    $17
2D18:  77 F1 2A     cal     &H2AF1
2D1B:  77 2C 2D     cal     &H2D2C
2D1E:  77 4A 50     cal     &H504A
2D21:  B0 07        jr      z,&H2D29
2D23:  77 71 2D     cal     &H2D71
2D26:  77 8E 2D     cal     &H2D8E
2D29:  37 E8 2A     jp      &H2AE8
2D2C:  D1 0F 46 2D  ldw     $15,&H2D46
2D30:  B7 30        jr      &H2D61
2D32:  06 52        orc     $18,$sz
2D34:  65 61 64     std     $1,(iz+&H64)
2D37:  79 20 06     adc     (iz+&H06),$0
2D3A:  42 72 65     ld      $18,&H65
2D3D:  61 6B 20     st      $11,(iz+&H20)
2D40:  05 53        nac     $19,$sz
2D42:  54 4F 50     pfl     &H50
2D45:  20 07        st      $7,(ix+$sx)
2D47:  20 65 72     st      $5,(ix+$18)
2D4A:  72 6F 72     cal     lz,&H726F
2D4D:  20 D1        st      $17,(ix-$sz)
2D4F:  11 40        ld      $0,($sz)
2D51:  2D B7        ldd     $23,(iz-$sy)
2D53:  07 D1 11     xrc     $17,$sz,jr &H2D66
2D56:  39 2D        adc     (iz+$sy),$13
2D58:  B7 01        jr      &H2D5A
2D5A:  A6 12        phsw    $18
2D5C:  77 65 3C     cal     &H3C65
2D5F:  AE 0F        ppsw    $15
2D61:  37 B4 97     jp      &H97B4
2D64:  D1 11 32 2D  ldw     $17,&H2D32
2D68:  77 5A 2D     cal     &H2D5A
2D6B:  77 71 2D     cal     &H2D71
2D6E:  37 E8 2A     jp      &H2AE8
2D71:  42 10 50     ld      $16,&H50
2D74:  77 F1 2A     cal     &H2AF1
2D77:  D6 00 C9 16  pre     ix,&H16C9
2D7B:  A8 02        ldw     $2,(ix+$sx)
2D7D:  D1 00 A7 18  ldw     $0,&H18A7
2D81:  89 42        sbw     $2,$sz
2D83:  02 70 02     ld      $16,$2
2D86:  18 50        bid     $16
2D88:  4E 10 30     or      $16,&H30
2D8B:  37 F1 2A     jp      &H2AF1
2D8E:  42 10 2D     ld      $16,&H2D
2D91:  77 F1 2A     cal     &H2AF1
2D94:  D6 00 CB 16  pre     ix,&H16CB
2D98:  A8 03        ldw     $3,(ix+$sx)
2D9A:  D6 00 5E 16  pre     ix,&H165E
2D9E:  02 0D        ld      $13,$sx
2DA0:  77 B4 50     cal     &H50B4
2DA3:  77 38 14     cal     &H1438
2DA6:  37 D5 97     jp      &H97D5
2DA9:  77 91 29     cal     &H2991
2DAC:  77 EE 46     cal     &H46EE
2DAF:  77 54 2D     cal     &H2D54
2DB2:  77 1E 2D     cal     &H2D1E
2DB5:  37 B9 1F     jp      &H1FB9
2DB8:  77 72 29     cal     &H2972
2DBB:  B4 08        jr      nz,&H2DC4
2DBD:  77 14 61     cal     &H6114
2DC0:  B4 03        jr      nz,&H2DC4
2DC2:  3A 3F        sbc     (ix+$sy),$31
2DC4:  34 02 20     jp      nz,&H2002
2DC7:  D7 00 D7 1B  pre     ss,&H1BD7
2DCB:  56 60 54     pst     ua,&H54
2DCE:  77 BC 28     cal     &H28BC
2DD1:  77 7E 27     cal     &H277E
2DD4:  77 71 27     cal     &H2771
2DD7:  D6 00 A1 18  pre     ix,&H18A1
2DDB:  E8 00 60     ldm     $0,(ix+$sx),4
2DDE:  96 00        pre     ix,$0
2DE0:  81 42        sbcw    $2,$sz
2DE2:  B0 0E        jr      z,&H2DF1
2DE4:  A8 00        ldw     $0,(ix+$sx)
2DE6:  4C 00 9F     an      $0,&H9F
2DE9:  A2 00        stiw    $0,(ix+$sx)
2DEB:  AA 60 01     ldiw    $0,(ix+$1)
2DEE:  9E 80 90     gre     ix,$0,jr &H2D80
2DF1:  D1 02 B0 1F  ldw     $2,&H1FB0
2DF5:  77 7A 29     cal     &H297A
2DF8:  77 6E 24     cal     &H246E
2DFB:  77 74 97     cal     &H9774
2DFE:  D6 00 D3 18  pre     ix,&H18D3
2E02:  D6 40 93 17  pre     iz,&H1793
2E06:  2A 00        ldi     $0,(ix+$sx)
2E08:  01 20        sbc     $0,$sy
2E0A:  35 B9 1F     jp      c,&H1FB9
2E0D:  77 8E 2E     cal     &H2E8E
2E10:  30 70 2B     jp      z,&H2B70
2E13:  23 00        sti     $0,(iz+$sx)
2E15:  2A 00        ldi     $0,(ix+$sx)
2E17:  77 8B 2E     cal     &H2E8B
2E1A:  B4 88        jr      nz,&H2DA3
2E1C:  2C A0        ldd     $0,(ix-$sy)
2E1E:  25 1F        std     $31,(iz+$sx)
2E20:  9E 00        gre     ix,$0
2E22:  A6 01        phsw    $1
2E24:  77 53 97     cal     &H9753
2E27:  D6 40 93 17  pre     iz,&H1793
2E2B:  77 07 1D     cal     &H1D07
2E2E:  D1 00 93 17  ldw     $0,&H1793
2E32:  96 40        pre     iz,$0
2E34:  D1 02 00 10  ldw     $2,&H1000
2E38:  D1 04 00 01  ldw     $4,&H0100
2E3C:  77 4C 01     cal     &H014C
2E3F:  42 00 10     ld      $0,&H10
2E42:  77 70 2F     cal     &H2F70
2E45:  77 49 00     cal     &H0049
2E48:  41 00 04     sbc     $0,&H04
2E4B:  B0 BC        jr      z,&H2E08
2E4D:  77 AF 28     cal     &H28AF
2E50:  77 35 26     cal     &H2635
2E53:  D6 00 C4 16  pre     ix,&H16C4
2E57:  24 1F        std     $31,(ix+$sx)
2E59:  77 C5 29     cal     &H29C5
2E5C:  77 A1 29     cal     &H29A1
2E5F:  B0 12        jr      z,&H2E72
2E61:  77 BB 29     cal     &H29BB
2E64:  77 02 20     cal     &H2002
2E67:  77 10 03     cal     &H0310
2E6A:  B4 15        jr      nz,&H2E80
2E6C:  77 74 97     cal     &H9774
2E6F:  77 AA 29     cal     &H29AA
2E72:  AE 00        ppsw    $0
2E74:  96 00        pre     ix,$0
2E76:  2A 00        ldi     $0,(ix+$sx)
2E78:  41 00 3A     sbc     $0,&H3A
2E7B:  34 D7 2D     jp      nz,&H2DD7
2E7E:  B7 FD        jr      &H2E7C
2E80:  77 10 26     cal     &H2610
2E83:  77 A1 29     cal     &H29A1
2E86:  B4 A6        jr      nz,&H2E2D
2E88:  37 B9 1F     jp      &H1FB9
2E8B:  01 00        sbc     $0,$sx
2E8D:  F0           rtn     z
2E8E:  41 00 3A     sbc     $0,&H3A
2E91:  F0           rtn     z
2E92:  41 00 3B     sbc     $0,&H3B
2E95:  F7           rtn   
2E96:  09 34        sb      $20,$sy
2E98:  F5           rtn     c
2E99:  11 70 15     ld      $16,($21)
2E9C:  77 F1 2A     cal     &H2AF1
2E9F:  88 B5 8B     adw     $21,$sy,jr &H2E2C
2EA2:  77 01 2F     cal     &H2F01
2EA5:  77 E3 00     cal     &H00E3
2EA8:  D6 00 7E 16  pre     ix,&H167E
2EAC:  E8 00 80     ldm     $0,(ix+$sx),5
2EAF:  E6 04 80     phsm    $4,5
2EB2:  01 01        sbc     $1,$sx
2EB4:  B2 47        jr      lz,&H2EFC
2EB6:  77 2F 11     cal     &H112F
2EB9:  EE 03 80     ppsm    $3,5
2EBC:  D6 00 7E 16  pre     ix,&H167E
2EC0:  E0 03 80     stm     $3,(ix+$sx),5
2EC3:  77 62 29     cal     &H2962
2EC6:  30 AD 31     jp      z,&H31AD
2EC9:  C2 73 64     ldm     $19,$4,4
2ECC:  41 13 08     sbc     $19,&H08
2ECF:  34 AD 31     jp      nz,&H31AD
2ED2:  E6 12 E0     phsm    $18,8
2ED5:  26 0A        phs     $10
2ED7:  E6 16 60     phsm    $22,4
2EDA:  77 AD 31     cal     &H31AD
2EDD:  77 DB 2A     cal     &H2ADB
2EE0:  EE 13 60     ppsm    $19,4
2EE3:  77 96 2E     cal     &H2E96
2EE6:  42 10 3D     ld      $16,&H3D
2EE9:  77 F1 2A     cal     &H2AF1
2EEC:  EE 0A E0     ppsm    $10,8
2EEF:  2E 12        pps     $18
2EF1:  3B 1F        sbc     (iz+$sx),$31
2EF3:  34 70 2B     jp      nz,&H2B70
2EF6:  77 9A 21     cal     &H219A
2EF9:  37 D5 97     jp      &H97D5
2EFC:  77 D2 11     cal     &H11D2
2EFF:  B7 C7        jr      &H2EC7
2F01:  77 0C 2F     cal     &H2F0C
2F04:  D6 00 7E 16  pre     ix,&H167E
2F08:  E0 0C 80     stm     $12,(ix+$sx),5
2F0B:  F7           rtn   
2F0C:  77 5D 2F     cal     &H2F5D
2F0F:  02 0C        ld      $12,$sx
2F11:  44 0D 80     anc     $13,&H80
2F14:  F0           rtn     z
2F15:  E6 10 80     phsm    $16,5
2F18:  77 DF 0E     cal     &H0EDF
2F1B:  D1 13 02 00  ldw     $19,&H0002
2F1F:  77 B2 11     cal     &H11B2
2F22:  A7 10        phuw    $16
2F24:  2E 0C        pps     $12
2F26:  08 2C        ad      $12,$sy
2F28:  26 0C        phs     $12
2F2A:  77 C3 00     cal     &H00C3
2F2D:  B0 96        jr      z,&H2EC4
2F2F:  77 C7 00     cal     &H00C7
2F32:  EE 0C 80     ppsm    $12,5
2F35:  F7           rtn   
2F36:  77 49 00     cal     &H0049
2F39:  9E 4F        gre     iz,$15
2F3B:  77 8E 31     cal     &H318E
2F3E:  01 0E        sbc     $14,$sx
2F40:  F0           rtn     z
2F41:  42 0D 08     ld      $13,&H08
2F44:  41 00 24     sbc     $0,&H24
2F47:  B4 05        jr      nz,&H2F4D
2F49:  2D 20        ldd     $0,(iz+$sy)
2F4B:  02 0D        ld      $13,$sx
2F4D:  77 49 00     cal     &H0049
2F50:  41 00 28     sbc     $0,&H28
2F53:  B4 06        jr      nz,&H2F5A
2F55:  2D 20        ldd     $0,(iz+$sy)
2F57:  4E 0D 80     or      $13,&H80
2F5A:  01 3F        sbc     $31,$sy
2F5C:  F7           rtn   
2F5D:  77 36 2F     cal     &H2F36
2F60:  F5           rtn     c
2F61:  37 70 2B     jp      &H2B70
2F64:  D6 00 5C 17  pre     ix,&H175C
2F68:  EA 00 C0     ldim    $0,(ix+$sx),7
2F6B:  96 45        pre     iz,$5
2F6D:  E8 01 80     ldm     $1,(ix+$sx),5
2F70:  D6 00 C4 16  pre     ix,&H16C4
2F74:  24 00        std     $0,(ix+$sx)
2F76:  F7           rtn   
2F77:  D6 00 01 11  pre     ix,&H1101
2F7B:  2C 00        ldd     $0,(ix+$sx)
2F7D:  60 00 04     st      $0,(ix+&H04)
2F80:  77 BB 29     cal     &H29BB
2F83:  77 02 20     cal     &H2002
2F86:  37 5E 97     jp      &H975E
2F89:  D6 00 5C 17  pre     ix,&H175C
2F8D:  EA 05 E0     ldim    $5,(ix+$sx),8
2F90:  97 06        pre     ss,$6
2F92:  41 05 10     sbc     $5,&H10
2F95:  B0 08        jr      z,&H2F9E
2F97:  D6 00 C4 16  pre     ix,&H16C4
2F9B:  24 05        std     $5,(ix+$sx)
2F9D:  F7           rtn   
2F9E:  E8 0F E0     ldm     $15,(ix+$sx),8
2FA1:  02 32        ld      $18,$sy
2FA3:  96 E8 24     pre     us,$8,jr &H2FC9
2FA6:  02 0C        ld      $12,$sx
2FA8:  C2 73 6D     ldm     $19,$13,4
2FAB:  02 32        ld      $18,$sy
2FAD:  D1 00 C4 16  ldw     $0,&H16C4
2FB1:  11 45        ld      $5,($sz)
2FB3:  50 40 08     st      &H08,($sz)
2FB6:  9F 06        gre     ss,$6
2FB8:  9E 68        gre     us,$8
2FBA:  9E 4A        gre     iz,$10
2FBC:  D6 00 5C 17  pre     ix,&H175C
2FC0:  E2 05 E0     stim    $5,(ix+$sx),8
2FC3:  E2 0D 60     stim    $13,(ix+$sx),4
2FC6:  E0 13 60     stm     $19,(ix+$sx),4
2FC9:  77 96 2E     cal     &H2E96
2FCC:  42 10 3F     ld      $16,&H3F
2FCF:  01 32        sbc     $18,$sy
2FD1:  70 F1 2A     cal     z,&H2AF1
2FD4:  77 77 2F     cal     &H2F77
2FD7:  89 71 11     sbw     $17,$17
2FDA:  9E 4F        gre     iz,$15
2FDC:  2B 00        ldi     $0,(iz+$sx)
2FDE:  01 00        sbc     $0,$sx
2FE0:  B0 04        jr      z,&H2FE5
2FE2:  88 B1 88     adw     $17,$sy,jr &H2F6C
2FE5:  96 4F        pre     iz,$15
2FE7:  D6 00 64 17  pre     ix,&H1764
2FEB:  3A 1F        sbc     (ix+$sx),$31
2FED:  B6 08        jr      nlz,&H2FF6
2FEF:  09 32        sb      $18,$sy
2FF1:  31 74 2B     jp      nc,&H2B74
2FF4:  B7 2B        jr      &H3020
2FF6:  81 31        sbcw    $17,$sy
2FF8:  B1 1A        jr      nc,&H3013
2FFA:  E8 AC 80     ldm     $12,(ix-$sy),5
2FFD:  77 5E 30     cal     &H305E
3000:  96 13        pre     ix,$19
3002:  2C 00        ldd     $0,(ix+$sx)
3004:  4E 00 20     or      $0,&H20
3007:  24 00        std     $0,(ix+$sx)
3009:  77 64 2F     cal     &H2F64
300C:  E6 12 E0     phsm    $18,8
300F:  26 0A        phs     $10
3011:  B7 20        jr      &H3032
3013:  77 07 1D     cal     &H1D07
3016:  D6 40 00 10  pre     iz,&H1000
301A:  77 2F 11     cal     &H112F
301D:  77 93 00     cal     &H0093
3020:  77 64 2F     cal     &H2F64
3023:  D6 00 7E 16  pre     ix,&H167E
3027:  E0 01 80     stm     $1,(ix+$sx),5
302A:  E6 12 E0     phsm    $18,8
302D:  26 0A        phs     $10
302F:  77 AD 31     cal     &H31AD
3032:  77 D3 95     cal     &H95D3
3035:  2E 0A        pps     $10
3037:  EE 0B E0     ppsm    $11,8
303A:  01 1F        sbc     $31,$sx
303C:  F7           rtn   
303D:  77 5D 2F     cal     &H2F5D
3040:  01 0D        sbc     $13,$sx
3042:  36 B0 2B     jp      nlz,&H2BB0
3045:  77 62 29     cal     &H2962
3048:  B0 12        jr      z,&H305B
304A:  41 0D 08     sbc     $13,&H08
304D:  B4 0D        jr      nz,&H305B
304F:  77 A4 31     cal     &H31A4
3052:  31 A6 2F     jp      nc,&H2FA6
3055:  44 0D 20     anc     $13,&H20
3058:  30 A6 2F     jp      z,&H2FA6
305B:  77 0F 2F     cal     &H2F0F
305E:  77 A4 31     cal     &H31A4
3061:  B5 09        jr      c,&H306B
3063:  01 0C        sbc     $12,$sx
3065:  34 A8 2B     jp      nz,&H2BA8
3068:  77 4D 32     cal     &H324D
306B:  01 0C        sbc     $12,$sx
306D:  96 15        pre     ix,$21
306F:  B0 58        jr      z,&H30C8
3071:  2C 05        ldd     $5,(ix+$sx)
3073:  3A 0C        sbc     (ix+$sx),$12
3075:  34 A4 2B     jp      nz,&H2BA4
3078:  26 0C        phs     $12
307A:  89 62 02     sbw     $2,$2
307D:  82 2F        ldw     $15,$sy
307F:  18 65        biu     $5
3081:  08 25        ad      $5,$sy
3083:  2C 60 05     ldd     $0,(ix+$5)
3086:  AF 05        ppuw    $5
3088:  82 67 05     ldw     $7,$5
308B:  A6 10        phsw    $16
308D:  77 30 0A     cal     &H0A30
3090:  AE 0F        ppsw    $15
3092:  88 42        adw     $2,$sz
3094:  AC A6        lddw    $6,(ix-$sy)
3096:  BA 07        sbcw    (ix+$sx),$7
3098:  35 A4 2B     jp      c,&H2BA4
309B:  09 2C        sb      $12,$sy
309D:  B0 09        jr      z,&H30A7
309F:  88 25        adw     $5,$sy
30A1:  77 30 0A     cal     &H0A30
30A4:  82 CF A0     ldw     $15,$sz,jr &H3046
30A7:  2E 0C        pps     $12
30A9:  18 6C        biu     $12
30AB:  08 2C        ad      $12,$sy
30AD:  96 15        pre     ix,$21
30AF:  2C 60 0C     ldd     $0,(ix+$12)
30B2:  01 0D        sbc     $13,$sx
30B4:  B2 23        jr      lz,&H30D8
30B6:  44 03 E0     anc     $3,&HE0
30B9:  34 98 2B     jp      nz,&H2B98
30BC:  98 62        biuw    $2
30BE:  98 62        biuw    $2
30C0:  98 62        biuw    $2
30C2:  9E 00        gre     ix,$0
30C4:  88 42        adw     $2,$sz
30C6:  96 02        pre     ix,$2
30C8:  9E 15        gre     ix,$21
30CA:  44 0D 40     anc     $13,&H40
30CD:  B4 14        jr      nz,&H30E2
30CF:  01 0D        sbc     $13,$sx
30D1:  B6 17        jr      nlz,&H30E9
30D3:  2A 11        ldi     $17,(ix+$sx)
30D5:  9E 0F        gre     ix,$15
30D7:  F7           rtn   
30D8:  89 22        sbw     $2,$sy
30DA:  B5 93        jr      c,&H306E
30DC:  2A 00        ldi     $0,(ix+$sx)
30DE:  2C 41        ldd     $1,(ix+$sz)
30E0:  B7 89        jr      &H306A
30E2:  E8 2E 40     ldm     $14,(ix+$sy),3
30E5:  02 71 0E     ld      $17,$14
30E8:  F7           rtn   
30E9:  E8 0A E0     ldm     $10,(ix+$sx),8
30EC:  02 12        ld      $18,$sx
30EE:  DA 30 40     dium    $16,3
30F1:  1A 10        did     $16
30F3:  F7           rtn   
30F4:  44 0D 80     anc     $13,&H80
30F7:  B4 0A        jr      nz,&H3102
30F9:  82 29        ldw     $9,$sy
30FB:  01 0D        sbc     $13,$sx
30FD:  F2           rtn     lz
30FE:  42 09 08     ld      $9,&H08
3101:  F7           rtn   
3102:  E6 10 80     phsm    $16,5
3105:  9E 7C        gre     us,$28
3107:  82 2F        ldw     $15,$sy
3109:  AF 05        ppuw    $5
310B:  88 25        adw     $5,$sy
310D:  30 A4 2B     jp      z,&H2BA4
3110:  77 30 0A     cal     &H0A30
3113:  82 4F        ldw     $15,$sz
3115:  09 2C        sb      $12,$sy
3117:  B4 8F        jr      nz,&H30A7
3119:  96 7C        pre     us,$28
311B:  EE 0C 80     ppsm    $12,5
311E:  01 0D        sbc     $13,$sx
3120:  B2 0C        jr      lz,&H312D
3122:  44 01 E0     anc     $1,&HE0
3125:  B4 13        jr      nz,&H3139
3127:  98 60        biuw    $0
3129:  98 60        biuw    $0
312B:  98 60        biuw    $0
312D:  02 69 0C     ld      $9,$12
3130:  18 69        biu     $9
3132:  08 29        ad      $9,$sy
3134:  02 0A        ld      $10,$sx
3136:  88 49        adw     $9,$sz
3138:  F1           rtn     nc
3139:  37 6D 2B     jp      &H2B6D
313C:  96 15        pre     ix,$21
313E:  24 0C        std     $12,(ix+$sx)
3140:  02 60 0C     ld      $0,$12
3143:  02 41        ld      $1,$sz
3145:  18 60        biu     $0
3147:  2A 42        ldi     $2,(ix+$sz)
3149:  AF 02        ppuw    $2
314B:  A4 A3        stdw    $3,(ix-$sy)
314D:  09 21        sb      $1,$sy
314F:  B4 87        jr      nz,&H30D7
3151:  2C 41        ldd     $1,(ix+$sz)
3153:  9E 15        gre     ix,$21
3155:  F7           rtn   
3156:  02 64 18     ld      $4,$24
3159:  82 2F        ldw     $15,$sy
315B:  AA 05        ldiw    $5,(ix+$sx)
315D:  88 25        adw     $5,$sy
315F:  77 30 0A     cal     &H0A30
3162:  82 4F        ldw     $15,$sz
3164:  09 24        sb      $4,$sy
3166:  B4 8C        jr      nz,&H30F3
3168:  F7           rtn   
3169:  96 15        pre     ix,$21
316B:  2A 18        ldi     $24,(ix+$sx)
316D:  77 56 31     cal     &H3156
3170:  11 62 13     ld      $2,($19)
3173:  01 02        sbc     $2,$sx
3175:  B6 0D        jr      nlz,&H3183
3177:  2A 02        ldi     $2,(ix+$sx)
3179:  2C 62 02     ldd     $2,(ix+$2)
317C:  89 20        sbw     $0,$sy
317E:  B4 88        jr      nz,&H3107
3180:  9E 11        gre     ix,$17
3182:  F7           rtn   
3183:  98 60        biuw    $0
3185:  98 60        biuw    $0
3187:  98 60        biuw    $0
3189:  9E 11        gre     ix,$17
318B:  88 51        adw     $17,$sz
318D:  F7           rtn   
318E:  02 0E        ld      $14,$sx
3190:  77 AB 00     cal     &H00AB
3193:  B5 05        jr      c,&H3199
3195:  77 98 00     cal     &H0098
3198:  F1           rtn     nc
3199:  2D 20        ldd     $0,(iz+$sy)
319B:  08 2E        ad      $14,$sy
319D:  77 2B 00     cal     &H002B
31A0:  B5 88        jr      c,&H3129
31A2:  B7 93        jr      &H3136
31A4:  9E 42        gre     iz,$2
31A6:  D6 00 A1 18  pre     ix,&H18A1
31AA:  37 20 0B     jp      &H0B20
31AD:  77 B3 31     cal     &H31B3
31B0:  37 4C 01     jp      &H014C
31B3:  E6 11 E0     phsm    $17,8
31B6:  26 12        phs     $18
31B8:  D6 00 7E 16  pre     ix,&H167E
31BC:  E8 0C 80     ldm     $12,(ix+$sx),5
31BF:  77 5E 30     cal     &H305E
31C2:  2E 12        pps     $18
31C4:  EE 0A E0     ppsm    $10,8
31C7:  96 13        pre     ix,$19
31C9:  2C 00        ldd     $0,(ix+$sx)
31CB:  4C 00 9F     an      $0,&H9F
31CE:  4E 00 20     or      $0,&H20
31D1:  24 00        std     $0,(ix+$sx)
31D3:  96 15        pre     ix,$21
31D5:  B6 26        jr      nlz,&H31FC
31D7:  2C 12        ldd     $18,(ix+$sx)
31D9:  26 11        phs     $17
31DB:  09 71 12     sb      $17,$18
31DE:  B0 08        jr      z,&H31E7
31E0:  02 12        ld      $18,$sx
31E2:  B5 12        jr      c,&H31F5
31E4:  77 C8 32     cal     &H32C8
31E7:  2E 04        pps     $4
31E9:  96 15        pre     ix,$21
31EB:  22 04        sti     $4,(ix+$sx)
31ED:  02 05        ld      $5,$sx
31EF:  9E 00        gre     ix,$0
31F1:  82 62 0F     ldw     $2,$15
31F4:  F7           rtn   
31F5:  1B 11        cmp     $17
31F7:  77 AE 32     cal     &H32AE
31FA:  B7 94        jr      &H318F
31FC:  1A 30        diu     $16
31FE:  DA 12 40     didm    $18,3
3201:  E0 0A E0     stm     $10,(ix+$sx),8
3204:  AE 00        ppsw    $0
3206:  F7           rtn   
3207:  82 71 09     ldw     $17,$9
320A:  01 0D        sbc     $13,$sx
320C:  B2 31        jr      lz,&H323E
320E:  D1 17 9F 18  ldw     $23,&H189F
3212:  91 75 17     ldw     $21,($23)
3215:  77 2A 33     cal     &H332A
3218:  91 75 17     ldw     $21,($23)
321B:  E6 0E E0     phsm    $14,8
321E:  E6 16 E0     phsm    $22,8
3221:  01 0C        sbc     $12,$sx
3223:  B0 25        jr      z,&H3249
3225:  77 3C 31     cal     &H313C
3228:  02 01        ld      $1,$sx
322A:  82 62 09     ldw     $2,$9
322D:  89 42        sbw     $2,$sz
322F:  89 22        sbw     $2,$sy
3231:  82 60 15     ldw     $0,$21
3234:  77 57 01     cal     &H0157
3237:  EE 0F E0     ppsm    $15,8
323A:  EE 07 E0     ppsm    $7,8
323D:  F7           rtn   
323E:  D6 00 A5 18  pre     ix,&H18A5
3242:  A8 15        ldw     $21,(ix+$sx)
3244:  77 C8 32     cal     &H32C8
3247:  B7 AD        jr      &H31F5
3249:  82 E2 09 9B  ldw     $2,$9,jr &H31E7
324D:  02 67 0E     ld      $7,$14
3250:  02 08        ld      $8,$sx
3252:  D1 00 04 00  ldw     $0,&H0004
3256:  88 47        adw     $7,$sz
3258:  77 F4 30     cal     &H30F4
325B:  82 60 07     ldw     $0,$7
325E:  01 0D        sbc     $13,$sx
3260:  B2 07        jr      lz,&H3268
3262:  88 60 09     adw     $0,$9
3265:  35 6D 2B     jp      c,&H2B6D
3268:  77 C2 11     cal     &H11C2
326B:  77 07 32     cal     &H3207
326E:  A6 16        phsw    $22
3270:  82 71 07     ldw     $17,$7
3273:  D1 17 A1 18  ldw     $23,&H18A1
3277:  91 75 17     ldw     $21,($23)
327A:  77 1F 33     cal     &H331F
327D:  AE 15        ppsw    $21
327F:  91 73 17     ldw     $19,($23)
3282:  96 13        pre     ix,$19
3284:  A2 0D        stiw    $13,(ix+$sx)
3286:  9E 00        gre     ix,$0
3288:  82 62 0F     ldw     $2,$15
328B:  02 64 0E     ld      $4,$14
328E:  02 05        ld      $5,$sx
3290:  82 57        ldw     $23,$sz
3292:  88 77 04     adw     $23,$4
3295:  E6 0D C0     phsm    $13,7
3298:  77 4C 01     cal     &H014C
329B:  EE 07 C0     ppsm    $7,7
329E:  96 17        pre     ix,$23
32A0:  01 0D        sbc     $13,$sx
32A2:  B2 08        jr      lz,&H32AB
32A4:  D1 17 9F 18  ldw     $23,&H189F
32A8:  91 75 17     ldw     $21,($23)
32AB:  A2 15        stiw    $21,(ix+$sx)
32AD:  F7           rtn   
32AE:  E6 12 80     phsm    $18,5
32B1:  E6 0D E0     phsm    $13,8
32B4:  82 60 15     ldw     $0,$21
32B7:  82 62 11     ldw     $2,$17
32BA:  88 42        adw     $2,$sz
32BC:  D6 00 A5 18  pre     ix,&H18A5
32C0:  A8 04        ldw     $4,(ix+$sx)
32C2:  89 64 02     sbw     $4,$2
32C5:  9B 91 25     cmpw    $17,jr &H32EC
32C8:  E6 12 80     phsm    $18,5
32CB:  E6 0D E0     phsm    $13,8
32CE:  82 60 15     ldw     $0,$21
32D1:  82 42        ldw     $2,$sz
32D3:  D6 00 A5 18  pre     ix,&H18A5
32D7:  A8 04        ldw     $4,(ix+$sx)
32D9:  AA 06        ldiw    $6,(ix+$sx)
32DB:  88 66 11     adw     $6,$17
32DE:  B5 03        jr      c,&H32E2
32E0:  BA 06        sbcw    (ix+$sx),$6
32E2:  35 6D 2B     jp      c,&H2B6D
32E5:  89 44        sbw     $4,$sz
32E7:  B0 2A        jr      z,&H3312
32E9:  88 60 11     adw     $0,$17
32EC:  77 4C 01     cal     &H014C
32EF:  D6 00 A1 18  pre     ix,&H18A1
32F3:  E8 00 60     ldm     $0,(ix+$sx),4
32F6:  96 00        pre     ix,$0
32F8:  81 42        sbcw    $2,$sz
32FA:  B0 17        jr      z,&H3312
32FC:  AA 00        ldiw    $0,(ix+$sx)
32FE:  01 00        sbc     $0,$sx
3300:  2C 60 01     ldd     $0,(ix+$1)
3303:  B6 09        jr      nlz,&H330D
3305:  BA 15        sbcw    (ix+$sx),$21
3307:  B0 0A        jr      z,&H3312
3309:  B5 08        jr      c,&H3312
330B:  BC 11        adw     (ix+$sx),$17
330D:  AA 00        ldiw    $0,(ix+$sx)
330F:  9E 80 99     gre     ix,$0,jr &H32AA
3312:  D6 00 A5 18  pre     ix,&H18A5
3316:  BC 11        adw     (ix+$sx),$17
3318:  EE 06 E0     ppsm    $6,8
331B:  EE 0E 80     ppsm    $14,5
331E:  F7           rtn   
331F:  42 9C 04 0B  ld      $28,&H04,jr &H332D
3323:  02 BC 08     ld      $28,$sy,jr &H332D
3326:  42 9C 02 04  ld      $28,&H02,jr &H332D
332A:  42 1C 03     ld      $28,&H03
332D:  E6 12 80     phsm    $18,5
3330:  E6 0D E0     phsm    $13,8
3333:  82 60 11     ldw     $0,$17
3336:  77 C2 11     cal     &H11C2
3339:  D6 00 9B 18  pre     ix,&H189B
333D:  A8 00        ldw     $0,(ix+$sx)
333F:  82 42        ldw     $2,$sz
3341:  82 64 15     ldw     $4,$21
3344:  89 60 11     sbw     $0,$17
3347:  89 64 02     sbw     $4,$2
334A:  77 4C 01     cal     &H014C
334D:  9B 11        cmpw    $17
334F:  41 1C 04     sbc     $28,&H04
3352:  B4 22        jr      nz,&H3375
3354:  D6 00 A1 18  pre     ix,&H18A1
3358:  E8 00 60     ldm     $0,(ix+$sx),4
335B:  96 00        pre     ix,$0
335D:  81 42        sbcw    $2,$sz
335F:  B0 15        jr      z,&H3375
3361:  AA 00        ldiw    $0,(ix+$sx)
3363:  01 00        sbc     $0,$sx
3365:  2C 60 01     ldd     $0,(ix+$1)
3368:  B2 07        jr      lz,&H3370
336A:  BA 15        sbcw    (ix+$sx),$21
336C:  B1 08        jr      nc,&H3375
336E:  BC 11        adw     (ix+$sx),$17
3370:  AA 00        ldiw    $0,(ix+$sx)
3372:  9E 80 97     gre     ix,$0,jr &H330B
3375:  D6 00 9B 18  pre     ix,&H189B
3379:  BC 11        adw     (ix+$sx),$17
337B:  AA 00        ldiw    $0,(ix+$sx)
337D:  09 3C        sb      $28,$sy
337F:  B4 87        jr      nz,&H3307
3381:  B7 EA        jr      &H336C
3383:  02 BC 0E     ld      $28,$sy,jr &H3393
3386:  42 9C 02 0A  ld      $28,&H02,jr &H3393
338A:  D6 00 A1 18  pre     ix,&H18A1
338E:  BC 11        adw     (ix+$sx),$17
3390:  42 1C 03     ld      $28,&H03
3393:  E6 12 80     phsm    $18,5
3396:  E6 0D E0     phsm    $13,8
3399:  D6 00 9B 18  pre     ix,&H189B
339D:  A8 00        ldw     $0,(ix+$sx)
339F:  82 42        ldw     $2,$sz
33A1:  82 64 15     ldw     $4,$21
33A4:  89 44        sbw     $4,$sz
33A6:  88 60 11     adw     $0,$17
33A9:  77 4C 01     cal     &H014C
33AC:  41 1C 03     sbc     $28,&H03
33AF:  B0 DC        jr      z,&H338C
33B1:  B7 BD        jr      &H336F
33B3:  D1 02 00 10  ldw     $2,&H1000
33B7:  02 A4 07     ld      $4,$sy,jr &H33C0
33BA:  D1 02 00 02  ldw     $2,&H0200
33BE:  02 04        ld      $4,$sx
33C0:  1E 21        gst     pd,$1
33C2:  4C 01 3F     an      $1,&H3F
33C5:  4E 01 40     or      $1,&H40
33C8:  16 21        pst     pd,$1
33CA:  4F 01 C0     xr      $1,&HC0
33CD:  8B 22        sbbw    $2,$sy
33CF:  B5 12        jr      c,&H33E2
33D1:  01 04        sbc     $4,$sx
33D3:  B0 05        jr      z,&H33D9
33D5:  C2 E0 A0 90  ldm     $0,$0,6,jr &H3368
33D9:  48 04 0D     ad      $4,&H0D
33DC:  B1 84        jr      nc,&H3361
33DE:  02 04        ld      $4,$sx
33E0:  B7 99        jr      &H337A
33E2:  4E 01 C0     or      $1,&HC0
33E5:  16 21        pst     pd,$1
33E7:  F7           rtn   
33E8:  D6 00 CF 16  pre     ix,&H16CF
33EC:  B7 05        jr      &H33F2
33EE:  D6 00 C9 16  pre     ix,&H16C9
33F2:  A8 01        ldw     $1,(ix+$sx)
33F4:  96 41        pre     iz,$1
33F6:  E9 19 60     ldm     $25,(iz+$sx),4
33F9:  F7           rtn   
33FA:  C2 60 79     ldm     $0,$25,4
33FD:  89 42        sbw     $2,$sz
33FF:  89 22        sbw     $2,$sy
3401:  F7           rtn   
3402:  02 0E        ld      $14,$sx
3404:  77 28 34     cal     &H3428
3407:  D6 00 C7 16  pre     ix,&H16C7
340B:  A2 01        stiw    $1,(ix+$sx)
340D:  A0 01        stw     $1,(ix+$sx)
340F:  8B 65 05     sbbw    $5,$5
3412:  D6 00 CB 16  pre     ix,&H16CB
3416:  A0 05        stw     $5,(ix+$sx)
3418:  F7           rtn   
3419:  77 25 34     cal     &H3425
341C:  D6 00 CF 16  pre     ix,&H16CF
3420:  A0 01        stw     $1,(ix+$sx)
3422:  F7           rtn   
3423:  B0 04        jr      z,&H3428
3425:  48 0E 0A     ad      $14,&H0A
3428:  D1 01 A7 18  ldw     $1,&H18A7
342C:  02 6F 0E     ld      $15,$14
342F:  02 10        ld      $16,$sx
3431:  18 6F        biu     $15
3433:  88 61 0F     adw     $1,$15
3436:  B7 C3        jr      &H33FA
3438:  77 EE 46     cal     &H46EE
343B:  77 D3 95     cal     &H95D3
343E:  77 EE 33     cal     &H33EE
3441:  77 9B 52     cal     &H529B
3444:  77 BC 28     cal     &H28BC
3447:  D6 40 00 10  pre     iz,&H1000
344B:  3B 1F        sbc     (iz+$sx),$31
344D:  F0           rtn     z
344E:  2D 02        ldd     $2,(iz+$sx)
3450:  A9 25        ldw     $5,(iz+$sy)
3452:  77 12 34     cal     &H3412
3455:  A9 2F        ldw     $15,(iz+$sy)
3457:  77 8C 0B     cal     &H0B8C
345A:  B5 23        jr      c,&H347E
345C:  41 02 04     sbc     $2,&H04
345F:  F0           rtn     z
3460:  26 02        phs     $2
3462:  02 60 02     ld      $0,$2
3465:  02 01        ld      $1,$sx
3467:  88 20        adw     $0,$sy
3469:  9E 42        gre     iz,$2
346B:  77 B1 34     cal     &H34B1
346E:  82 60 02     ldw     $0,$2
3471:  2E 04        pps     $4
3473:  02 05        ld      $5,$sx
3475:  88 24        adw     $4,$sy
3477:  D1 02 00 10  ldw     $2,&H1000
347B:  37 F9 00     jp      &H00F9
347E:  41 02 04     sbc     $2,&H04
3481:  B0 24        jr      z,&H34A6
3483:  3B 02        sbc     (iz+$sx),$2
3485:  B1 0E        jr      nc,&H3494
3487:  26 02        phs     $2
3489:  2D 01        ldd     $1,(iz+$sx)
348B:  02 60 02     ld      $0,$2
348E:  09 60 01     sb      $0,$1
3491:  02 81 AA     ld      $1,$sx,jr &H343D
3494:  26 02        phs     $2
3496:  9E 40        gre     iz,$0
3498:  B0 A8        jr      z,&H3441
349A:  2D 03        ldd     $3,(iz+$sx)
349C:  09 63 02     sb      $3,$2
349F:  9A 43        bydw    $3
34A1:  77 EA 34     cal     &H34EA
34A4:  B7 B7        jr      &H345C
34A6:  2D 02        ldd     $2,(iz+$sx)
34A8:  02 03        ld      $3,$sx
34AA:  88 22        adw     $2,$sy
34AC:  9E 40        gre     iz,$0
34AE:  37 EA 34     jp      &H34EA
34B1:  81 20        sbcw    $0,$sy
34B3:  F5           rtn     c
34B4:  A6 03        phsw    $3
34B6:  D6 00 CF 18  pre     ix,&H18CF
34BA:  E8 04 60     ldm     $4,(ix+$sx),4
34BD:  89 66 04     sbw     $6,$4
34C0:  81 46        sbcw    $6,$sz
34C2:  35 6D 2B     jp      c,&H2B6D
34C5:  A6 01        phsw    $1
34C7:  88 60 02     adw     $0,$2
34CA:  89 64 02     sbw     $4,$2
34CD:  77 4C 01     cal     &H014C
34D0:  AE 00        ppsw    $0
34D2:  AE 02        ppsw    $2
34D4:  88 5B        adw     $27,$sz
34D6:  D1 04 CF 18  ldw     $4,&H18CF
34DA:  91 66 04     ldw     $6,($4)
34DD:  81 66 19     sbcw    $6,$25
34E0:  F0           rtn     z
34E1:  96 04        pre     ix,$4
34E3:  BC 00        adw     (ix+$sx),$0
34E5:  89 24        sbw     $4,$sy
34E7:  89 A4 8F     sbw     $4,$sy,jr &H3478
34EA:  81 22        sbcw    $2,$sy
34EC:  F5           rtn     c
34ED:  A6 01        phsw    $1
34EF:  D6 00 CF 18  pre     ix,&H18CF
34F3:  9E 04        gre     ix,$4
34F5:  9B 02        cmpw    $2
34F7:  A6 03        phsw    $3
34F9:  9B 02        cmpw    $2
34FB:  A8 04        ldw     $4,(ix+$sx)
34FD:  88 C2 B5     adw     $2,$sz,jr &H34B4
3500:  77 44 50     cal     &H5044
3503:  77 DC 35     cal     &H35DC
3506:  77 4E 2D     cal     &H2D4E
3509:  77 23 2D     cal     &H2D23
350C:  D6 00 C6 16  pre     ix,&H16C6
3510:  42 00 02     ld      $0,&H02
3513:  24 00        std     $0,(ix+$sx)
3515:  9E 40        gre     iz,$0
3517:  D6 00 DD 16  pre     ix,&H16DD
351B:  A0 00        stw     $0,(ix+$sx)
351D:  37 D7 1F     jp      &H1FD7
3520:  77 93 00     cal     &H0093
3523:  77 65 3C     cal     &H3C65
3526:  77 0C 2A     cal     &H2A0C
3529:  37 B9 1F     jp      &H1FB9
352C:  77 37 50     cal     &H5037
352F:  77 3D 50     cal     &H503D
3532:  77 DF 1E     cal     &H1EDF
3535:  77 93 00     cal     &H0093
3538:  D1 02 A9 2D  ldw     $2,&H2DA9
353C:  77 7A 29     cal     &H297A
353F:  77 C5 29     cal     &H29C5
3542:  77 72 3C     cal     &H3C72
3545:  D7 00 D7 1B  pre     ss,&H1BD7
3549:  77 E8 35     cal     &H35E8
354C:  77 3D 50     cal     &H503D
354F:  24 1E        std     $30,(ix+$sx)
3551:  82 6F 11     ldw     $15,$17
3554:  77 76 51     cal     &H5176
3557:  B7 06        jr      &H355E
3559:  77 6E 50     cal     &H506E
355C:  B0 D7        jr      z,&H3534
355E:  39 1F        adc     (iz+$sx),$31
3560:  B0 BE        jr      z,&H351F
3562:  EB 04 40     ldim    $4,(iz+$sx),3
3565:  D6 00 CB 16  pre     ix,&H16CB
3569:  A0 05        stw     $5,(ix+$sx)
356B:  D7 00 D7 1B  pre     ss,&H1BD7
356F:  77 74 35     cal     &H3574
3572:  B7 9A        jr      &H350D
3574:  77 88 3C     cal     &H3C88
3577:  77 AF 28     cal     &H28AF
357A:  9E 40        gre     iz,$0
357C:  D6 00 CD 16  pre     ix,&H16CD
3580:  A0 00        stw     $0,(ix+$sx)
3582:  77 49 00     cal     &H0049
3585:  41 00 02     sbc     $0,&H02
3588:  B0 12        jr      z,&H359B
358A:  41 00 04     sbc     $0,&H04
358D:  B4 1B        jr      nz,&H35A9
358F:  2B 20        ldi     $0,(iz+$sy)
3591:  49 00 49     sb      $0,&H49
3594:  D1 03 DE 57  ldw     $3,&H57DE
3598:  77 83 11     cal     &H1183
359B:  77 DC 35     cal     &H35DC
359E:  39 BF        adc     (iz-$sy),$31
35A0:  F0           rtn     z
35A1:  77 6E 50     cal     &H506E
35A4:  B4 B1        jr      nz,&H3556
35A6:  37 06 35     jp      &H3506
35A9:  42 80 4F 9B  ld      $0,&H4F,jr &H3547
35AD:  77 4A 50     cal     &H504A
35B0:  44 01 02     anc     $1,&H02
35B3:  30 A8 2B     jp      z,&H2BA8
35B6:  77 93 00     cal     &H0093
35B9:  D6 00 C6 16  pre     ix,&H16C6
35BD:  24 1E        std     $30,(ix+$sx)
35BF:  D1 02 A9 2D  ldw     $2,&H2DA9
35C3:  77 7A 29     cal     &H297A
35C6:  77 EE 33     cal     &H33EE
35C9:  D6 00 DD 16  pre     ix,&H16DD
35CD:  A8 00        ldw     $0,(ix+$sx)
35CF:  96 40        pre     iz,$0
35D1:  81 59        sbcw    $25,$sz
35D3:  B0 03        jr      z,&H35D7
35D5:  39 BF        adc     (iz-$sy),$31
35D7:  30 59 35     jp      z,&H3559
35DA:  B7 F0        jr      &H35CB
35DC:  77 93 00     cal     &H0093
35DF:  41 00 02     sbc     $0,&H02
35E2:  70 9B 0B     cal     z,&H0B9B
35E5:  2D 21        ldd     $1,(iz+$sy)
35E7:  F7           rtn   
35E8:  D6 00 BB 18  pre     ix,&H18BB
35EC:  E8 00 60     ldm     $0,(ix+$sx),4
35EF:  D6 00 D5 16  pre     ix,&H16D5
35F3:  E0 00 60     stm     $0,(ix+$sx),4
35F6:  D1 00 D9 16  ldw     $0,&H16D9
35FA:  D1 02 10 00  ldw     $2,&H0010
35FE:  77 57 01     cal     &H0157
3601:  77 A0 28     cal     &H28A0
3604:  77 A6 28     cal     &H28A6
3607:  77 8D 27     cal     &H278D
360A:  77 AA 09     cal     &H09AA
360D:  D6 00 48 17  pre     ix,&H1748
3611:  37 B4 51     jp      &H51B4
3614:  02 8F 03     ld      $15,$sx,jr &H3619
3617:  02 2F        ld      $15,$sy
3619:  D6 00 E9 16  pre     ix,&H16E9
361D:  24 0F        std     $15,(ix+$sx)
361F:  F7           rtn   
3620:  77 44 50     cal     &H5044
3623:  77 99 36     cal     &H3699
3626:  77 93 00     cal     &H0093
3629:  A6 02        phsw    $2
362B:  A6 10        phsw    $16
362D:  77 36 36     cal     &H3636
3630:  AE 0F        ppsw    $15
3632:  AE 01        ppsw    $1
3634:  B7 5E        jr      &H3693
3636:  D6 00 9D 18  pre     ix,&H189D
363A:  A8 15        ldw     $21,(ix+$sx)
363C:  D1 11 06 00  ldw     $17,&H0006
3640:  77 26 33     cal     &H3326
3643:  D6 00 C9 16  pre     ix,&H16C9
3647:  E8 0B 60     ldm     $11,(ix+$sx),4
364A:  9E 4F        gre     iz,$15
364C:  96 15        pre     ix,$21
364E:  6C 80 06     ldd     $0,(ix-&H06)
3651:  E0 0B A0     stm     $11,(ix+$sx),6
3654:  96 4F        pre     iz,$15
3656:  F7           rtn   
3657:  BA 0B        sbcw    (ix+$sx),$11
3659:  B0 89        jr      z,&H35E3
365B:  77 51 36     cal     &H3651
365E:  A4 AC        stdw    $12,(ix-$sy)
3660:  37 72 3C     jp      &H3C72
3663:  77 44 50     cal     &H5044
3666:  D6 00 9D 18  pre     ix,&H189D
366A:  AA 15        ldiw    $21,(ix+$sx)
366C:  BA 15        sbcw    (ix+$sx),$21
366E:  30 C8 2B     jp      z,&H2BC8
3671:  77 3C 00     cal     &H003C
3674:  1C 59        gfl     $25
3676:  D1 11 06 00  ldw     $17,&H0006
367A:  96 15        pre     ix,$21
367C:  E8 0B A0     ldm     $11,(ix+$sx),6
367F:  77 86 33     cal     &H3386
3682:  D6 00 C9 16  pre     ix,&H16C9
3686:  14 59        pfl     $25
3688:  B5 B2        jr      c,&H363B
368A:  77 44 50     cal     &H5044
368D:  77 99 36     cal     &H3699
3690:  77 93 00     cal     &H0093
3693:  77 AB 36     cal     &H36AB
3696:  37 59 35     jp      &H3559
3699:  77 C4 36     cal     &H36C4
369C:  81 2F        sbcw    $15,$sy
369E:  B5 09        jr      c,&H36A8
36A0:  9E 55        gre     iz,$21
36A2:  77 76 51     cal     &H5176
36A5:  31 AC 2B     jp      nc,&H2BAC
36A8:  96 55        pre     iz,$21
36AA:  F7           rtn   
36AB:  81 2F        sbcw    $15,$sy
36AD:  B5 04        jr      c,&H36B2
36AF:  96 53        pre     iz,$19
36B1:  F7           rtn   
36B2:  77 07 34     cal     &H3407
36B5:  77 8C 0B     cal     &H0B8C
36B8:  B0 06        jr      z,&H36BF
36BA:  AB 25        ldiw    $5,(iz+$sy)
36BC:  77 12 34     cal     &H3412
36BF:  77 72 3C     cal     &H3C72
36C2:  B7 94        jr      &H3657
36C4:  77 49 00     cal     &H0049
36C7:  41 00 03     sbc     $0,&H03
36CA:  B0 0F        jr      z,&H36DA
36CC:  77 CD 00     cal     &H00CD
36CF:  B0 0D        jr      z,&H36DD
36D1:  77 DF 0E     cal     &H0EDF
36D4:  81 2F        sbcw    $15,$sy
36D6:  35 AC 2B     jp      c,&H2BAC
36D9:  F7           rtn   
36DA:  AB 2F        ldiw    $15,(iz+$sy)
36DC:  F7           rtn   
36DD:  77 C3 0E     cal     &H0EC3
36E0:  41 0F 0A     sbc     $15,&H0A
36E3:  31 A4 2B     jp      nc,&H2BA4
36E6:  9A 4F        bydw    $15
36E8:  9E 55        gre     iz,$21
36EA:  77 28 34     cal     &H3428
36ED:  96 55        pre     iz,$21
36EF:  8B 6F 0F     sbbw    $15,$15
36F2:  F7           rtn   
36F3:  77 F8 0F     cal     &H0FF8
36F6:  02 B2 40     ld      $18,$sy,jr &H3738
36F9:  77 44 50     cal     &H5044
36FC:  77 01 2F     cal     &H2F01
36FF:  D6 00 7F 16  pre     ix,&H167F
3703:  2C 00        ldd     $0,(ix+$sx)
3705:  00 00        adc     $0,$sx
3707:  32 B0 2B     jp      lz,&H2BB0
370A:  18 60        biu     $0
370C:  35 B0 2B     jp      c,&H2BB0
370F:  77 E3 00     cal     &H00E3
3712:  77 2F 11     cal     &H112F
3715:  77 58 00     cal     &H0058
3718:  42 02 C1     ld      $2,&HC1
371B:  77 E9 00     cal     &H00E9
371E:  34 70 2B     jp      nz,&H2B70
3721:  77 2F 11     cal     &H112F
3724:  77 6C 00     cal     &H006C
3727:  77 58 00     cal     &H0058
372A:  77 68 00     cal     &H0068
372D:  42 02 C0     ld      $2,&HC0
3730:  77 E9 00     cal     &H00E9
3733:  B4 C1        jr      nz,&H36F5
3735:  77 2F 11     cal     &H112F
3738:  77 93 00     cal     &H0093
373B:  77 6C 00     cal     &H006C
373E:  77 58 00     cal     &H0058
3741:  C2 4A E0     ldm     $10,$sz,8
3744:  02 72 08     ld      $18,$8
3747:  77 AD 31     cal     &H31AD
374A:  D6 00 CB 16  pre     ix,&H16CB
374E:  A8 05        ldw     $5,(ix+$sx)
3750:  A8 15        ldw     $21,(ix+$sx)
3752:  9E 57        gre     iz,$23
3754:  E7 18 A0     phum    $24,6
3757:  D1 03 03 04  ldw     $3,&H0403
375B:  02 A7 27     ld      $7,$sy,jr &H3784
375E:  01 43        sbc     $3,$sz
3760:  B4 19        jr      nz,&H377A
3762:  AB 00        ldiw    $0,(iz+$sx)
3764:  B7 1F        jr      &H3784
3766:  77 49 00     cal     &H0049
3769:  B5 1A        jr      c,&H3784
376B:  08 27        ad      $7,$sy
376D:  B4 16        jr      nz,&H3784
376F:  37 C4 2B     jp      &H2BC4
3772:  42 02 82     ld      $2,&H82
3775:  77 EF 00     cal     &H00EF
3778:  B7 0B        jr      &H3784
377A:  00 00        adc     $0,$sx
377C:  B4 07        jr      nz,&H3784
377E:  39 1F        adc     (iz+$sx),$31
3780:  B0 92        jr      z,&H3713
3782:  AB 25        ldiw    $5,(iz+$sy)
3784:  2B 00        ldi     $0,(iz+$sx)
3786:  01 44        sbc     $4,$sz
3788:  B4 AB        jr      nz,&H3734
378A:  2B 00        ldi     $0,(iz+$sx)
378C:  41 00 81     sbc     $0,&H81
378F:  B0 AA        jr      z,&H373A
3791:  41 00 4C     sbc     $0,&H4C
3794:  B0 A3        jr      z,&H3738
3796:  41 00 82     sbc     $0,&H82
3799:  B4 96        jr      nz,&H3730
379B:  09 27        sb      $7,$sy
379D:  B0 18        jr      z,&H37B6
379F:  77 3C 00     cal     &H003C
37A2:  B5 9F        jr      c,&H3742
37A4:  77 12 34     cal     &H3412
37A7:  77 36 2F     cal     &H2F36
37AA:  31 70 2B     jp      nc,&H2B70
37AD:  77 C3 00     cal     &H00C3
37B0:  B4 AD        jr      nz,&H375E
37B2:  09 27        sb      $7,$sy
37B4:  B4 8E        jr      nz,&H3743
37B6:  77 12 34     cal     &H3412
37B9:  41 00 2C     sbc     $0,&H2C
37BC:  B0 06        jr      z,&H37C3
37BE:  77 3C 00     cal     &H003C
37C1:  B5 18        jr      c,&H37DA
37C3:  77 36 2F     cal     &H2F36
37C6:  31 70 2B     jp      nc,&H2B70
37C9:  77 A4 31     cal     &H31A4
37CC:  31 C0 2B     jp      nc,&H2BC0
37CF:  AF 00        ppuw    $0
37D1:  A7 01        phuw    $1
37D3:  81 53        sbcw    $19,$sz
37D5:  34 C0 2B     jp      nz,&H2BC0
37D8:  96 4F        pre     iz,$15
37DA:  77 18 38     cal     &H3818
37DD:  B5 25        jr      c,&H3803
37DF:  D6 00 CB 16  pre     ix,&H16CB
37E3:  A8 07        ldw     $7,(ix+$sx)
37E5:  EF 03 60     ppum    $3,4
37E8:  E7 06 60     phum    $6,4
37EB:  A0 05        stw     $5,(ix+$sx)
37ED:  D6 00 9B 18  pre     ix,&H189B
37F1:  A8 15        ldw     $21,(ix+$sx)
37F3:  D1 11 1A 00  ldw     $17,&H001A
37F7:  77 23 33     cal     &H3323
37FA:  89 75 11     sbw     $21,$17
37FD:  82 65 07     ldw     $5,$7
3800:  77 12 34     cal     &H3412
3803:  96 15        pre     ix,$21
3805:  9E 40        gre     iz,$0
3807:  EF 02 A0     ppum    $2,6
380A:  E2 00 E0     stim    $0,(ix+$sx),8
380D:  77 32 38     cal     &H3832
3810:  77 32 38     cal     &H3832
3813:  77 A8 38     cal     &H38A8
3816:  B7 57        jr      &H386E
3818:  9E 44        gre     iz,$4
381A:  D6 00 9B 18  pre     ix,&H189B
381E:  E8 15 60     ldm     $21,(ix+$sx),4
3821:  96 15        pre     ix,$21
3823:  81 75 17     sbcw    $21,$23
3826:  F0           rtn     z
3827:  BA 04        sbcw    (ix+$sx),$4
3829:  30 76 96     jp      z,&H9676
382C:  6C 00 1A     ldd     $0,(ix+&H1A)
382F:  9E 95 8E     gre     ix,$21,jr &H37BF
3832:  77 5C 00     cal     &H005C
3835:  E2 0A E0     stim    $10,(ix+$sx),8
3838:  22 12        sti     $18,(ix+$sx)
383A:  F7           rtn   
383B:  77 44 50     cal     &H5044
383E:  77 49 00     cal     &H0049
3841:  77 18 38     cal     &H3818
3844:  31 C0 2B     jp      nc,&H2BC0
3847:  77 A8 38     cal     &H38A8
384A:  E6 17 40     phsm    $23,3
384D:  A6 01        phsw    $1
384F:  96 15        pre     ix,$21
3851:  42 00 08     ld      $0,&H08
3854:  EA 40 E0     ldim    $0,(ix+$sz),8
3857:  2C 08        ldd     $8,(ix+$sx)
3859:  77 DA 05     cal     &H05DA
385C:  1A 30        diu     $16
385E:  DA 12 40     didm    $18,3
3861:  EE 13 80     ppsm    $19,5
3864:  96 13        pre     ix,$19
3866:  E0 0A E0     stm     $10,(ix+$sx),8
3869:  DA 30 40     dium    $16,3
386C:  1A 10        did     $16
386E:  96 15        pre     ix,$21
3870:  42 00 11     ld      $0,&H11
3873:  EA 40 E0     ldim    $0,(ix+$sz),8
3876:  2C 08        ldd     $8,(ix+$sx)
3878:  77 72 0A     cal     &H0A72
387B:  B0 1E        jr      z,&H389A
387D:  B5 17        jr      c,&H3895
387F:  41 17 05     sbc     $23,&H05
3882:  B1 17        jr      nc,&H389A
3884:  D1 11 1A 00  ldw     $17,&H001A
3888:  77 83 33     cal     &H3383
388B:  77 36 2F     cal     &H2F36
388E:  F1           rtn     nc
388F:  77 C3 00     cal     &H00C3
3892:  B0 D8        jr      z,&H386B
3894:  F7           rtn   
3895:  41 17 05     sbc     $23,&H05
3898:  B1 95        jr      nc,&H382E
389A:  96 15        pre     ix,$21
389C:  E8 22 C0     ldm     $2,(ix+$sy),7
389F:  D6 00 CB 16  pre     ix,&H16CB
38A3:  A0 05        stw     $5,(ix+$sx)
38A5:  96 47        pre     iz,$7
38A7:  F7           rtn   
38A8:  96 15        pre     ix,$21
38AA:  E8 21 40     ldm     $1,(ix+$sy),3
38AD:  68 17 10     ld      $23,(ix+&H10)
38B0:  96 02        pre     ix,$2
38B2:  2A 20        ldi     $0,(ix+$sy)
38B4:  A8 40        ldw     $0,(ix+$sz)
38B6:  96 00        pre     ix,$0
38B8:  37 E9 30     jp      &H30E9
38BB:  77 2F 11     cal     &H112F
38BE:  01 30        sbc     $16,$sy
38C0:  B5 23        jr      c,&H38E4
38C2:  42 02 49     ld      $2,&H49
38C5:  77 EF 00     cal     &H00EF
38C8:  B0 18        jr      z,&H38E1
38CA:  42 02 47     ld      $2,&H47
38CD:  77 E9 00     cal     &H00E9
38D0:  34 70 2B     jp      nz,&H2B70
38D3:  77 49 00     cal     &H0049
38D6:  41 00 03     sbc     $0,&H03
38D9:  B0 07        jr      z,&H38E1
38DB:  41 00 23     sbc     $0,&H23
38DE:  34 6B 35     jp      nz,&H356B
38E1:  37 8A 36     jp      &H368A
38E4:  77 EA 38     cal     &H38EA
38E7:  F1           rtn     nc
38E8:  B7 96        jr      &H387F
38EA:  D1 02 1F 03  ldw     $2,&H031F
38EE:  D1 04 04 07  ldw     $4,&H0704
38F2:  02 26        ld      $6,$sy
38F4:  2B 00        ldi     $0,(iz+$sx)
38F6:  00 00        adc     $0,$sx
38F8:  B0 2D        jr      z,&H3926
38FA:  01 42        sbc     $2,$sz
38FC:  B5 89        jr      c,&H3886
38FE:  01 43        sbc     $3,$sz
3900:  B0 19        jr      z,&H391A
3902:  B1 8F        jr      nc,&H3892
3904:  2B 01        ldi     $1,(iz+$sx)
3906:  01 44        sbc     $4,$sz
3908:  B0 15        jr      z,&H391E
390A:  01 45        sbc     $5,$sz
390C:  B4 99        jr      nz,&H38A6
390E:  41 01 48     sbc     $1,&H48
3911:  B4 9E        jr      nz,&H38B0
3913:  09 26        sb      $6,$sy
3915:  B4 A2        jr      nz,&H38B8
3917:  01 3F        sbc     $31,$sy
3919:  F7           rtn   
391A:  AB 00        ldiw    $0,(iz+$sx)
391C:  B7 A9        jr      &H38C6
391E:  41 01 8D     sbc     $1,&H8D
3921:  B4 AE        jr      nz,&H38D0
3923:  08 A6 B1     ad      $6,$sy,jr &H38D6
3926:  2D A0        ldd     $0,(iz-$sy)
3928:  F7           rtn   
3929:  77 C3 0E     cal     &H0EC3
392C:  77 93 00     cal     &H0093
392F:  41 0F 03     sbc     $15,&H03
3932:  31 A4 2B     jp      nc,&H2BA4
3935:  D6 00 32 11  pre     ix,&H1132
3939:  24 0F        std     $15,(ix+$sx)
393B:  37 8A 92     jp      &H928A
393E:  77 49 00     cal     &H0049
3941:  41 00 20     sbc     $0,&H20
3944:  31 A2 2E     jp      nc,&H2EA2
3947:  2B 22        ldi     $2,(iz+$sy)
3949:  41 00 06     sbc     $0,&H06
394C:  B0 0F        jr      z,&H395C
394E:  41 00 07     sbc     $0,&H07
3951:  B4 07        jr      nz,&H3959
3953:  41 02 48     sbc     $2,&H48
3956:  30 9B 0B     jp      z,&H0B9B
3959:  37 70 2B     jp      &H2B70
395C:  41 02 9B     sbc     $2,&H9B
395F:  30 EE 3D     jp      z,&H3DEE
3962:  41 02 AD     sbc     $2,&HAD
3965:  B4 8D        jr      nz,&H38F3
3967:  77 E3 00     cal     &H00E3
396A:  77 D2 11     cal     &H11D2
396D:  77 5D 12     cal     &H125D
3970:  77 93 00     cal     &H0093
3973:  96 0F        pre     ix,$15
3975:  02 62 11     ld      $2,$17
3978:  02 03        ld      $3,$sx
397A:  37 3A 23     jp      &H233A
397D:  42 02 A0     ld      $2,&HA0
3980:  77 EB 00     cal     &H00EB
3983:  34 70 2B     jp      nz,&H2B70
3986:  77 E1 00     cal     &H00E1
3989:  77 C3 0E     cal     &H0EC3
398C:  49 0F FC     sb      $15,&HFC
398F:  35 A4 2B     jp      c,&H2BA4
3992:  18 6F        biu     $15
3994:  02 60 0F     ld      $0,$15
3997:  18 6F        biu     $15
3999:  08 4F        ad      $15,$sz
399B:  26 0F        phs     $15
399D:  77 DF 00     cal     &H00DF
39A0:  77 E3 00     cal     &H00E3
39A3:  77 D2 11     cal     &H11D2
39A6:  41 11 0D     sbc     $17,&H0D
39A9:  31 A8 2B     jp      nc,&H2BA8
39AC:  D1 00 3C 15  ldw     $0,&H153C
39B0:  2E 02        pps     $2
39B2:  02 03        ld      $3,$sx
39B4:  88 42        adw     $2,$sz
39B6:  9E 44        gre     iz,$4
39B8:  A6 03        phsw    $3
39BA:  D6 40 5E 16  pre     iz,&H165E
39BE:  C9 66 A6     sbbm    $6,$6,6
39C1:  E1 06 A0     stm     $6,(iz+$sx),6
39C4:  96 0F        pre     ix,$15
39C6:  09 31        sb      $17,$sy
39C8:  B5 20        jr      c,&H39E9
39CA:  2A 00        ldi     $0,(ix+$sx)
39CC:  77 9D 00     cal     &H009D
39CF:  B1 0E        jr      nc,&H39DE
39D1:  02 41        ld      $1,$sz
39D3:  1A 21        diu     $1
39D5:  09 31        sb      $17,$sy
39D7:  B5 0F        jr      c,&H39E7
39D9:  2A 00        ldi     $0,(ix+$sx)
39DB:  77 9D 00     cal     &H009D
39DE:  31 70 2B     jp      nc,&H2B70
39E1:  08 41        ad      $1,$sz
39E3:  23 01        sti     $1,(iz+$sx)
39E5:  B7 A0        jr      &H3986
39E7:  25 01        std     $1,(iz+$sx)
39E9:  D6 40 5E 16  pre     iz,&H165E
39ED:  E9 06 A0     ldm     $6,(iz+$sx),6
39F0:  AE 02        ppsw    $2
39F2:  96 42        pre     iz,$2
39F4:  E1 06 A0     stm     $6,(iz+$sx),6
39F7:  96 44        pre     iz,$4
39F9:  F7           rtn   
39FA:  77 C3 0E     cal     &H0EC3
39FD:  41 0F 20     sbc     $15,&H20
3A00:  B1 1F        jr      nc,&H3A20
3A02:  26 0F        phs     $15
3A04:  77 DB 00     cal     &H00DB
3A07:  77 C3 0E     cal     &H0EC3
3A0A:  41 0F 08     sbc     $15,&H08
3A0D:  B1 12        jr      nc,&H3A20
3A0F:  2E 00        pps     $0
3A11:  1A 2F        diu     $15
3A13:  18 6F        biu     $15
3A15:  08 4F        ad      $15,$sz
3A17:  D6 00 01 11  pre     ix,&H1101
3A1B:  24 0F        std     $15,(ix+$sx)
3A1D:  37 6A 95     jp      &H956A
3A20:  37 A4 2B     jp      &H2BA4
3A23:  77 FA 0E     cal     &H0EFA
3A26:  A6 10        phsw    $16
3A28:  77 DB 00     cal     &H00DB
3A2B:  77 C3 0E     cal     &H0EC3
3A2E:  9A 4F        bydw    $15
3A30:  AE 0F        ppsw    $15
3A32:  77 A0 19     cal     &H19A0
3A35:  24 0E        std     $14,(ix+$sx)
3A37:  16 62        pst     ua,$2
3A39:  F7           rtn   
3A3A:  77 E3 00     cal     &H00E3
3A3D:  77 FA 0E     cal     &H0EFA
3A40:  77 93 00     cal     &H0093
3A43:  D6 00 C0 16  pre     ix,&H16C0
3A47:  A0 0F        stw     $15,(ix+$sx)
3A49:  F7           rtn   
3A4A:  77 0C 2F     cal     &H2F0C
3A4D:  00 0C        adc     $12,$sx
3A4F:  30 70 2B     jp      z,&H2B70
3A52:  77 A4 31     cal     &H31A4
3A55:  B5 0A        jr      c,&H3A60
3A57:  77 4D 32     cal     &H324D
3A5A:  77 C3 00     cal     &H00C3
3A5D:  B0 94        jr      z,&H39F2
3A5F:  F7           rtn   
3A60:  96 15        pre     ix,$21
3A62:  2A 18        ldi     $24,(ix+$sx)
3A64:  77 56 31     cal     &H3156
3A67:  01 6C 18     sbc     $12,$24
3A6A:  34 A0 2B     jp      nz,&H2BA0
3A6D:  9E 60        gre     us,$0
3A6F:  96 00        pre     ix,$0
3A71:  82 62 0F     ldw     $2,$15
3A74:  77 56 31     cal     &H3156
3A77:  81 42        sbcw    $2,$sz
3A79:  34 A0 2B     jp      nz,&H2BA0
3A7C:  77 3C 31     cal     &H313C
3A7F:  B7 A6        jr      &H3A26
3A81:  77 36 2F     cal     &H2F36
3A84:  B1 06        jr      nc,&H3A8B
3A86:  48 0D 80     ad      $13,&H80
3A89:  B5 6D        jr      c,&H3AF7
3A8B:  77 C3 00     cal     &H00C3
3A8E:  B0 06        jr      z,&H3A95
3A90:  77 93 00     cal     &H0093
3A93:  01 3F        sbc     $31,$sy
3A95:  1C 40        gfl     $0
3A97:  26 00        phs     $0
3A99:  77 A4 31     cal     &H31A4
3A9C:  B1 22        jr      nc,&H3ABF
3A9E:  77 69 31     cal     &H3169
3AA1:  89 71 15     sbw     $17,$21
3AA4:  00 0D        adc     $13,$sx
3AA6:  B2 1F        jr      lz,&H3AC6
3AA8:  77 90 33     cal     &H3390
3AAB:  02 71 0E     ld      $17,$14
3AAE:  02 12        ld      $18,$sx
3AB0:  D1 00 04 00  ldw     $0,&H0004
3AB4:  88 51        adw     $17,$sz
3AB6:  82 75 13     ldw     $21,$19
3AB9:  77 8A 33     cal     &H338A
3ABC:  77 A6 28     cal     &H28A6
3ABF:  2E 00        pps     $0
3AC1:  14 40        pfl     $0
3AC3:  B1 C3        jr      nc,&H3A87
3AC5:  F7           rtn   
3AC6:  77 AE 32     cal     &H32AE
3AC9:  B7 9F        jr      &H3A69
3ACB:  77 44 50     cal     &H5044
3ACE:  D6 00 C9 16  pre     ix,&H16C9
3AD2:  A8 00        ldw     $0,(ix+$sx)
3AD4:  D6 00 DF 16  pre     ix,&H16DF
3AD8:  BA 00        sbcw    (ix+$sx),$0
3ADA:  34 B4 2B     jp      nz,&H2BB4
3ADD:  EA 01 E0     ldim    $1,(ix+$sx),8
3AE0:  3A 3E        sbc     (ix+$sy),$30
3AE2:  35 B4 2B     jp      c,&H2BB4
3AE5:  42 02 82     ld      $2,&H82
3AE8:  77 EF 00     cal     &H00EF
3AEB:  B0 19        jr      z,&H3B05
3AED:  77 3C 00     cal     &H003C
3AF0:  B5 09        jr      c,&H3AFA
3AF2:  41 00 03     sbc     $0,&H03
3AF5:  B0 21        jr      z,&H3B17
3AF7:  37 70 2B     jp      &H2B70
3AFA:  96 47        pre     iz,$7
3AFC:  77 12 34     cal     &H3412
3AFF:  77 23 3B     cal     &H3B23
3B02:  37 6B 35     jp      &H356B
3B05:  77 93 00     cal     &H0093
3B08:  96 47        pre     iz,$7
3B0A:  77 99 0B     cal     &H0B99
3B0D:  2D 21        ldd     $1,(iz+$sy)
3B0F:  B0 94        jr      z,&H3AA4
3B11:  77 23 3B     cal     &H3B23
3B14:  37 59 35     jp      &H3559
3B17:  77 99 36     cal     &H3699
3B1A:  77 93 00     cal     &H0093
3B1D:  77 23 3B     cal     &H3B23
3B20:  37 93 36     jp      &H3693
3B23:  D6 00 E8 16  pre     ix,&H16E8
3B27:  24 1F        std     $31,(ix+$sx)
3B29:  F7           rtn   
3B2A:  42 02 49     ld      $2,&H49
3B2D:  77 EF 00     cal     &H00EF
3B30:  B4 BA        jr      nz,&H3AEB
3B32:  77 49 00     cal     &H0049
3B35:  41 00 03     sbc     $0,&H03
3B38:  B0 21        jr      z,&H3B5A
3B3A:  41 00 30     sbc     $0,&H30
3B3D:  B4 C7        jr      nz,&H3B05
3B3F:  2D 20        ldd     $0,(iz+$sy)
3B41:  C9 71 71     sbbm    $17,$17,4
3B44:  77 66 3B     cal     &H3B66
3B47:  D6 00 E3 16  pre     ix,&H16E3
3B4B:  E8 05 A0     ldm     $5,(ix+$sx),6
3B4E:  01 2A        sbc     $10,$sy
3B50:  F5           rtn     c
3B51:  77 12 34     cal     &H3412
3B54:  02 72 09     ld      $18,$9
3B57:  37 6D 2C     jp      &H2C6D
3B5A:  77 DA 36     cal     &H36DA
3B5D:  77 A0 36     cal     &H36A0
3B60:  D6 00 C9 16  pre     ix,&H16C9
3B64:  A8 11        ldw     $17,(ix+$sx)
3B66:  77 93 00     cal     &H0093
3B69:  D6 00 DF 16  pre     ix,&H16DF
3B6D:  E0 11 60     stm     $17,(ix+$sx),4
3B70:  F7           rtn   
3B71:  77 44 50     cal     &H5044
3B74:  42 02 86     ld      $2,&H86
3B77:  77 EF 00     cal     &H00EF
3B7A:  B0 D1        jr      z,&H3B4C
3B7C:  77 2F 11     cal     &H112F
3B7F:  01 32        sbc     $18,$sy
3B81:  34 99 0B     jp      nz,&H0B99
3B84:  41 11 02     sbc     $17,&H02
3B87:  31 99 0B     jp      nc,&H0B99
3B8A:  77 C6 0E     cal     &H0EC6
3B8D:  42 02 49     ld      $2,&H49
3B90:  77 EF 00     cal     &H00EF
3B93:  B0 09        jr      z,&H3B9D
3B95:  08 22        ad      $2,$sy
3B97:  77 EF 00     cal     &H00EF
3B9A:  34 70 2B     jp      nz,&H2B70
3B9D:  77 3C 00     cal     &H003C
3BA0:  35 70 2B     jp      c,&H2B70
3BA3:  02 6E 02     ld      $14,$2
3BA6:  09 2F        sb      $15,$sy
3BA8:  B0 1A        jr      z,&H3BC3
3BAA:  A6 0F        phsw    $15
3BAC:  77 C3 00     cal     &H00C3
3BAF:  B0 0A        jr      z,&H3BBA
3BB1:  77 C4 36     cal     &H36C4
3BB4:  77 5D 12     cal     &H125D
3BB7:  77 C3 00     cal     &H00C3
3BBA:  AE 0E        ppsw    $14
3BBC:  B0 97        jr      z,&H3B54
3BBE:  F7           rtn   
3BBF:  AB 20        ldiw    $0,(iz+$sy)
3BC1:  B7 8B        jr      &H3B4D
3BC3:  77 3C 00     cal     &H003C
3BC6:  F5           rtn     c
3BC7:  77 C3 00     cal     &H00C3
3BCA:  30 99 0B     jp      z,&H0B99
3BCD:  26 0E        phs     $14
3BCF:  77 99 36     cal     &H3699
3BD2:  A6 02        phsw    $2
3BD4:  77 C3 00     cal     &H00C3
3BD7:  74 93 00     cal     nz,&H0093
3BDA:  EE 01 40     ppsm    $1,3
3BDD:  41 03 49     sbc     $3,&H49
3BE0:  30 93 36     jp      z,&H3693
3BE3:  A6 02        phsw    $2
3BE5:  77 99 0B     cal     &H0B99
3BE8:  37 2B 36     jp      &H362B
3BEB:  42 02 57     ld      $2,&H57
3BEE:  77 EF 00     cal     &H00EF
3BF1:  34 70 2B     jp      nz,&H2B70
3BF4:  77 93 00     cal     &H0093
3BF7:  77 5A 3C     cal     &H3C5A
3BFA:  9E 5C        gre     iz,$28
3BFC:  D6 00 A1 18  pre     ix,&H18A1
3C00:  E8 17 60     ldm     $23,(ix+$sx),4
3C03:  96 17        pre     ix,$23
3C05:  9E 00        gre     ix,$0
3C07:  81 59        sbcw    $25,$sz
3C09:  B0 45        jr      z,&H3C4F
3C0B:  AA 11        ldiw    $17,(ix+$sx)
3C0D:  9E 0F        gre     ix,$15
3C0F:  E6 12 60     phsm    $18,4
3C12:  02 77 11     ld      $23,$17
3C15:  9A 52        bydw    $18
3C17:  77 81 29     cal     &H2981
3C1A:  77 D5 97     cal     &H97D5
3C1D:  00 17        adc     $23,$sx
3C1F:  42 10 24     ld      $16,&H24
3C22:  72 F1 2A     cal     lz,&H2AF1
3C25:  18 77        biu     $23
3C27:  B1 0C        jr      nc,&H3C34
3C29:  42 10 28     ld      $16,&H28
3C2C:  77 F1 2A     cal     &H2AF1
3C2F:  08 30        ad      $16,$sy
3C31:  77 F1 2A     cal     &H2AF1
3C34:  77 91 29     cal     &H2991
3C37:  D6 00 3B 17  pre     ix,&H173B
3C3B:  3A 1E        sbc     (ix+$sx),$30
3C3D:  B0 17        jr      z,&H3C55
3C3F:  77 5C 50     cal     &H505C
3C42:  77 98 3C     cal     &H3C98
3C45:  EE 0F 60     ppsm    $15,4
3C48:  96 0F        pre     ix,$15
3C4A:  AA 60 12     ldiw    $0,(ix+$18)
3C4D:  B7 C9        jr      &H3C17
3C4F:  77 5A 3C     cal     &H3C5A
3C52:  96 5C        pre     iz,$28
3C54:  F7           rtn   
3C55:  77 C5 29     cal     &H29C5
3C58:  B7 97        jr      &H3BF0
3C5A:  77 3D 2B     cal     &H2B3D
3C5D:  B4 07        jr      nz,&H3C65
3C5F:  77 89 29     cal     &H2989
3C62:  77 82 3C     cal     &H3C82
3C65:  D6 00 01 11  pre     ix,&H1101
3C69:  2C 00        ldd     $0,(ix+$sx)
3C6B:  44 00 1F     anc     $0,&H1F
3C6E:  F0           rtn     z
3C6F:  37 E8 2A     jp      &H2AE8
3C72:  D6 00 E9 16  pre     ix,&H16E9
3C76:  3A 1F        sbc     (ix+$sx),$31
3C78:  F0           rtn     z
3C79:  77 5A 3C     cal     &H3C5A
3C7C:  77 81 29     cal     &H2981
3C7F:  77 C3 3C     cal     &H3CC3
3C82:  77 E8 2A     cal     &H2AE8
3C85:  37 91 29     jp      &H2991
3C88:  D6 00 E9 16  pre     ix,&H16E9
3C8C:  3A 1F        sbc     (ix+$sx),$31
3C8E:  F0           rtn     z
3C8F:  77 81 29     cal     &H2981
3C92:  77 CE 3C     cal     &H3CCE
3C95:  77 91 29     cal     &H2991
3C98:  77 3D 2B     cal     &H2B3D
3C9B:  B4 14        jr      nz,&H3CB0
3C9D:  77 89 29     cal     &H2989
3CA0:  77 D7 2A     cal     &H2AD7
3CA3:  77 57 2B     cal     &H2B57
3CA6:  44 00 07     anc     $0,&H07
3CA9:  B0 03        jr      z,&H3CAD
3CAB:  B7 8C        jr      &H3C38
3CAD:  77 91 29     cal     &H2991
3CB0:  D6 00 01 11  pre     ix,&H1101
3CB4:  2C 00        ldd     $0,(ix+$sx)
3CB6:  4C 00 F8     an      $0,&HF8
3CB9:  48 00 08     ad      $0,&H08
3CBC:  B5 CE        jr      c,&H3C8B
3CBE:  24 00        std     $0,(ix+$sx)
3CC0:  37 6A 95     jp      &H956A
3CC3:  42 10 5B     ld      $16,&H5B
3CC6:  77 F1 2A     cal     &H2AF1
3CC9:  77 71 2D     cal     &H2D71
3CCC:  B7 0A        jr      &H3CD7
3CCE:  42 10 5B     ld      $16,&H5B
3CD1:  77 F1 2A     cal     &H2AF1
3CD4:  77 94 2D     cal     &H2D94
3CD7:  42 10 5D     ld      $16,&H5D
3CDA:  37 F1 2A     jp      &H2AF1
3CDD:  77 53 50     cal     &H5053
3CE0:  77 E5 3C     cal     &H3CE5
3CE3:  B7 63        jr      &H3D47
3CE5:  77 3C 00     cal     &H003C
3CE8:  35 70 2B     jp      c,&H2B70
3CEB:  77 1A 1F     cal     &H1F1A
3CEE:  77 73 51     cal     &H5173
3CF1:  A6 14        phsw    $20
3CF3:  82 6F 06     ldw     $15,$6
3CF6:  77 8C 0B     cal     &H0B8C
3CF9:  B1 06        jr      nc,&H3D00
3CFB:  3B 1F        sbc     (iz+$sx),$31
3CFD:  74 52 59     cal     nz,&H5952
3D00:  77 0F 34     cal     &H340F
3D03:  AE 00        ppsw    $0
3D05:  9E 42        gre     iz,$2
3D07:  89 42        sbw     $2,$sz
3D09:  82 53        ldw     $19,$sz
3D0B:  37 EA 34     jp      &H34EA
3D0E:  77 56 50     cal     &H5056
3D11:  77 93 00     cal     &H0093
3D14:  02 0E        ld      $14,$sx
3D16:  77 63 6B     cal     &H6B63
3D19:  77 FA 33     cal     &H33FA
3D1C:  74 9D 6B     cal     nz,&H6B9D
3D1F:  B7 24        jr      &H3D44
3D21:  77 89 29     cal     &H2989
3D24:  B7 04        jr      &H3D29
3D26:  77 81 29     cal     &H2981
3D29:  77 CD 00     cal     &H00CD
3D2C:  B0 9F        jr      z,&H3CCC
3D2E:  77 53 50     cal     &H5053
3D31:  42 02 BB     ld      $2,&HBB
3D34:  77 E9 00     cal     &H00E9
3D37:  B0 1F        jr      z,&H3D57
3D39:  77 CF 00     cal     &H00CF
3D3C:  B0 0D        jr      z,&H3D4A
3D3E:  77 1A 1F     cal     &H1F1A
3D41:  77 91 3D     cal     &H3D91
3D44:  77 91 29     cal     &H2991
3D47:  37 B9 1F     jp      &H1FB9
3D4A:  D6 00 CB 16  pre     ix,&H16CB
3D4E:  A8 04        ldw     $4,(ix+$sx)
3D50:  A8 06        ldw     $6,(ix+$sx)
3D52:  77 93 00     cal     &H0093
3D55:  B7 95        jr      &H3CEB
3D57:  77 93 00     cal     &H0093
3D5A:  02 11        ld      $17,$sx
3D5C:  26 11        phs     $17
3D5E:  02 6E 11     ld      $14,$17
3D61:  77 57 6B     cal     &H6B57
3D64:  77 EE 33     cal     &H33EE
3D67:  77 FA 33     cal     &H33FA
3D6A:  B0 16        jr      z,&H3D81
3D6C:  77 E8 2A     cal     &H2AE8
3D6F:  42 10 50     ld      $16,&H50
3D72:  77 F1 2A     cal     &H2AF1
3D75:  02 70 11     ld      $16,$17
3D78:  77 D7 7B     cal     &H7BD7
3D7B:  77 E8 2A     cal     &H2AE8
3D7E:  77 8C 3D     cal     &H3D8C
3D81:  2E 11        pps     $17
3D83:  0A 31        adb     $17,$sy
3D85:  B3 AA        jr      uz,&H3D30
3D87:  77 02 34     cal     &H3402
3D8A:  B7 C7        jr      &H3D52
3D8C:  C9 64 64     sbbm    $4,$4,4
3D8F:  89 26        sbw     $6,$sy
3D91:  77 73 51     cal     &H5173
3D94:  39 1F        adc     (iz+$sx),$31
3D96:  A6 07        phsw    $7
3D98:  74 E8 2A     cal     nz,&H2AE8
3D9B:  AE 06        ppsw    $6
3D9D:  39 1F        adc     (iz+$sx),$31
3D9F:  F0           rtn     z
3DA0:  BB 26        sbcw    (iz+$sy),$6
3DA2:  B0 02        jr      z,&H3DA5
3DA4:  F1           rtn     nc
3DA5:  A6 07        phsw    $7
3DA7:  77 8B 50     cal     &H508B
3DAA:  9E 51        gre     iz,$17
3DAC:  24 1F        std     $31,(ix+$sx)
3DAE:  D6 00 00 10  pre     ix,&H1000
3DB2:  2A 10        ldi     $16,(ix+$sx)
3DB4:  00 10        adc     $16,$sx
3DB6:  B0 09        jr      z,&H3DC0
3DB8:  9E 13        gre     ix,$19
3DBA:  77 CB 3D     cal     &H3DCB
3DBD:  96 93 8D     pre     ix,$19,jr &H3D4C
3DC0:  77 E8 2A     cal     &H2AE8
3DC3:  77 F5 49     cal     &H49F5
3DC6:  AE 06        ppsw    $6
3DC8:  96 D1 AD     pre     iz,$17,jr &H3D77
3DCB:  D6 00 39 17  pre     ix,&H1739
3DCF:  2C 00        ldd     $0,(ix+$sx)
3DD1:  44 00 0F     anc     $0,&H0F
3DD4:  B4 07        jr      nz,&H3DDC
3DD6:  77 5C 50     cal     &H505C
3DD9:  37 F1 2A     jp      &H2AF1
3DDC:  41 00 08     sbc     $0,&H08
3DDF:  B4 09        jr      nz,&H3DE9
3DE1:  D6 00 3B 17  pre     ix,&H173B
3DE5:  3A 1E        sbc     (ix+$sx),$30
3DE7:  B4 92        jr      nz,&H3D7A
3DE9:  77 C5 29     cal     &H29C5
3DEC:  B7 94        jr      &H3D81
3DEE:  77 44 50     cal     &H5044
3DF1:  77 CD 00     cal     &H00CD
3DF4:  B4 71        jr      nz,&H3E66
3DF6:  77 B1 3E     cal     &H3EB1
3DF9:  77 DB 00     cal     &H00DB
3DFC:  A6 09        phsw    $9
3DFE:  77 01 2F     cal     &H2F01
3E01:  AE 08        ppsw    $8
3E03:  D6 00 00 10  pre     ix,&H1000
3E07:  9E 53        gre     iz,$19
3E09:  A6 14        phsw    $20
3E0B:  77 2B 4D     cal     &H4D2B
3E0E:  D6 40 00 10  pre     iz,&H1000
3E12:  A6 09        phsw    $9
3E14:  02 01        ld      $1,$sx
3E16:  77 9D 12     cal     &H129D
3E19:  AE 08        ppsw    $8
3E1B:  AE 13        ppsw    $19
3E1D:  96 53        pre     iz,$19
3E1F:  77 C3 00     cal     &H00C3
3E22:  B0 A7        jr      z,&H3DCA
3E24:  B7 3E        jr      &H3E63
3E26:  42 02 9B     ld      $2,&H9B
3E29:  77 EB 00     cal     &H00EB
3E2C:  34 70 2B     jp      nz,&H2B70
3E2F:  77 CD 00     cal     &H00CD
3E32:  B4 87        jr      nz,&H3DBA
3E34:  77 B1 3E     cal     &H3EB1
3E37:  77 DB 00     cal     &H00DB
3E3A:  A6 09        phsw    $9
3E3C:  77 01 2F     cal     &H2F01
3E3F:  AE 08        ppsw    $8
3E41:  D6 00 7F 16  pre     ix,&H167F
3E45:  3A 1F        sbc     (ix+$sx),$31
3E47:  36 A8 2B     jp      nlz,&H2BA8
3E4A:  9E 55        gre     iz,$21
3E4C:  A6 16        phsw    $22
3E4E:  D6 00 00 10  pre     ix,&H1000
3E52:  77 28 4D     cal     &H4D28
3E55:  AE 15        ppsw    $21
3E57:  96 55        pre     iz,$21
3E59:  02 71 17     ld      $17,$23
3E5C:  D1 0F 00 10  ldw     $15,&H1000
3E60:  77 AD 31     cal     &H31AD
3E63:  37 93 00     jp      &H0093
3E66:  9E 40        gre     iz,$0
3E68:  D6 00 EA 16  pre     ix,&H16EA
3E6C:  A0 00        stw     $0,(ix+$sx)
3E6E:  D6 60 D0 1C  pre     us,&H1CD0
3E72:  D6 00 EA 16  pre     ix,&H16EA
3E76:  A8 00        ldw     $0,(ix+$sx)
3E78:  96 40        pre     iz,$0
3E7A:  77 49 00     cal     &H0049
3E7D:  C9 74 74     sbbm    $20,$20,4
3E80:  02 32        ld      $18,$sy
3E82:  41 00 22     sbc     $0,&H22
3E85:  B4 16        jr      nz,&H3E9C
3E87:  77 D2 11     cal     &H11D2
3E8A:  82 75 0F     ldw     $21,$15
3E8D:  02 74 11     ld      $20,$17
3E90:  02 32        ld      $18,$sy
3E92:  77 CB 00     cal     &H00CB
3E95:  B0 06        jr      z,&H3E9C
3E97:  77 DB 00     cal     &H00DB
3E9A:  02 12        ld      $18,$sx
3E9C:  E6 17 A0     phsm    $23,6
3E9F:  77 01 2F     cal     &H2F01
3EA2:  EE 12 A0     ppsm    $18,6
3EA5:  77 AD 2F     cal     &H2FAD
3EA8:  B4 BB        jr      nz,&H3E64
3EAA:  77 C3 00     cal     &H00C3
3EAD:  B0 C8        jr      z,&H3E76
3EAF:  B7 CD        jr      &H3E7D
3EB1:  77 BF 3E     cal     &H3EBF
3EB4:  41 00 32     sbc     $0,&H32
3EB7:  F0           rtn     z
3EB8:  41 00 41     sbc     $0,&H41
3EBB:  F0           rtn     z
3EBC:  37 DB 2B     jp      &H2BDB
3EBF:  77 D0 4F     cal     &H4FD0
3EC2:  D6 00 70 17  pre     ix,&H1770
3EC6:  A8 00        ldw     $0,(ix+$sx)
3EC8:  81 20        sbcw    $0,$sy
3ECA:  35 D7 2B     jp      c,&H2BD7
3ECD:  68 00 03     ld      $0,(ix+&H03)
3ED0:  F7           rtn   
3ED1:  77 85 29     cal     &H2985
3ED4:  77 BF 3E     cal     &H3EBF
3ED7:  49 00 31     sb      $0,&H31
3EDA:  30 DB 2B     jp      z,&H2BDB
3EDD:  09 20        sb      $0,$sy
3EDF:  30 DB 2B     jp      z,&H2BDB
3EE2:  77 3C 00     cal     &H003C
3EE5:  B5 21        jr      c,&H3F07
3EE7:  77 DB 00     cal     &H00DB
3EEA:  B7 0E        jr      &H3EF9
3EEC:  77 89 29     cal     &H2989
3EEF:  B7 09        jr      &H3EF9
3EF1:  77 81 29     cal     &H2981
3EF4:  77 CD 00     cal     &H00CD
3EF7:  B0 A7        jr      z,&H3E9F
3EF9:  42 02 C2     ld      $2,&HC2
3EFC:  77 E9 00     cal     &H00E9
3EFF:  30 C6 3F     jp      z,&H3FC6
3F02:  77 3C 00     cal     &H003C
3F05:  B1 07        jr      nc,&H3F0D
3F07:  77 E8 2A     cal     &H2AE8
3F0A:  37 91 29     jp      &H2991
3F0D:  41 00 3B     sbc     $0,&H3B
3F10:  B0 09        jr      z,&H3F1A
3F12:  41 00 2C     sbc     $0,&H2C
3F15:  B4 0D        jr      nz,&H3F23
3F17:  77 7C 51     cal     &H517C
3F1A:  2D 20        ldd     $0,(iz+$sy)
3F1C:  77 3C 00     cal     &H003C
3F1F:  B1 93        jr      nc,&H3EB3
3F21:  B7 98        jr      &H3EBA
3F23:  41 00 07     sbc     $0,&H07
3F26:  B4 2C        jr      nz,&H3F53
3F28:  29 20        ld      $0,(iz+$sy)
3F2A:  49 00 BB     sb      $0,&HBB
3F2D:  B1 25        jr      nc,&H3F53
3F2F:  48 00 05     ad      $0,&H05
3F32:  31 70 2B     jp      nc,&H2B70
3F35:  2B 21        ldi     $1,(iz+$sy)
3F37:  B0 12        jr      z,&H3F4A
3F39:  77 74 3F     cal     &H3F74
3F3C:  B4 BB        jr      nz,&H3EF8
3F3E:  41 00 04     sbc     $0,&H04
3F41:  B0 0D        jr      z,&H3F4F
3F43:  4E 01 20     or      $1,&H20
3F46:  24 01        std     $1,(ix+$sx)
3F48:  B7 C7        jr      &H3F10
3F4A:  77 8D 3F     cal     &H3F8D
3F4D:  B7 CC        jr      &H3F1A
3F4F:  4C 81 DF 8C  an      $1,&HDF,jr &H3EDE
3F53:  77 88 10     cal     &H1088
3F56:  9E 5C        gre     iz,$28
3F58:  B5 16        jr      c,&H3F6F
3F5A:  77 54 00     cal     &H0054
3F5D:  77 A4 22     cal     &H22A4
3F60:  77 5C 00     cal     &H005C
3F63:  77 1F 13     cal     &H131F
3F66:  77 D5 97     cal     &H97D5
3F69:  77 D7 2A     cal     &H2AD7
3F6C:  96 DC EC     pre     iz,$28,jr &H3F5A
3F6F:  77 D5 97     cal     &H97D5
3F72:  B7 87        jr      &H3EFA
3F74:  D6 00 39 17  pre     ix,&H1739
3F78:  38 1F        adc     (ix+$sx),$31
3F7A:  D6 00 00 11  pre     ix,&H1100
3F7E:  2C 01        ldd     $1,(ix+$sx)
3F80:  F7           rtn   
3F81:  D6 00 02 11  pre     ix,&H1102
3F85:  28 21        ld      $1,(ix+$sy)
3F87:  28 A0        ld      $0,(ix-$sy)
3F89:  09 E0 01 15  sb      $0,$1,jr &H3FA1
3F8D:  77 0D 0F     cal     &H0F0D
3F90:  77 C6 0E     cal     &H0EC6
3F93:  D6 00 39 17  pre     ix,&H1739
3F97:  2C 00        ldd     $0,(ix+$sx)
3F99:  44 00 06     anc     $0,&H06
3F9C:  B0 9C        jr      z,&H3F39
3F9E:  77 44 2B     cal     &H2B44
3FA1:  09 4F        sb      $15,$sz
3FA3:  F0           rtn     z
3FA4:  B1 06        jr      nc,&H3FAB
3FA6:  08 4F        ad      $15,$sz
3FA8:  77 E8 2A     cal     &H2AE8
3FAB:  02 71 0F     ld      $17,$15
3FAE:  09 31        sb      $17,$sy
3FB0:  F5           rtn     c
3FB1:  77 D7 2A     cal     &H2AD7
3FB4:  B7 87        jr      &H3F3C
3FB6:  A3 C3        stiw    $3,(iz-$sz)
3FB8:  40 2E A3     adc     $14,&HA3
3FBB:  C1 40 A1     sbbcm   $0,$sz,6
3FBE:  A3 40        stiw    $0,(iz+$sz)
3FC0:  A6 AA        phsw    $10
3FC2:  40 C0 BE 40  adc     $0,&HBE,jr &H4005
3FC6:  77 D2 11     cal     &H11D2
3FC9:  77 5D 12     cal     &H125D
3FCC:  77 D7 00     cal     &H00D7
3FCF:  A6 10        phsw    $16
3FD1:  A6 10        phsw    $16
3FD3:  77 88 10     cal     &H1088
3FD6:  9E 5C        gre     iz,$28
3FD8:  B5 47        jr      c,&H4020
3FDA:  77 54 00     cal     &H0054
3FDD:  AE 0F        ppsw    $15
3FDF:  77 53 40     cal     &H4053
3FE2:  30 B0 2B     jp      z,&H2BB0
3FE5:  35 B0 2B     jp      c,&H2BB0
3FE8:  9E 4F        gre     iz,$15
3FEA:  A6 10        phsw    $16
3FEC:  77 9E 41     cal     &H419E
3FEF:  77 D5 97     cal     &H97D5
3FF2:  AE 0F        ppsw    $15
3FF4:  77 53 40     cal     &H4053
3FF7:  B4 05        jr      nz,&H3FFD
3FF9:  AE 0F        ppsw    $15
3FFB:  A6 10        phsw    $16
3FFD:  96 5C        pre     iz,$28
3FFF:  77 3C 00     cal     &H003C
4002:  B5 18        jr      c,&H401B
4004:  41 00 3B     sbc     $0,&H3B
4007:  B0 07        jr      z,&H400F
4009:  41 00 2C     sbc     $0,&H2C
400C:  34 70 2B     jp      nz,&H2B70
400F:  2D 20        ldd     $0,(iz+$sy)
4011:  77 3C 00     cal     &H003C
4014:  B1 C4        jr      nc,&H3FD9
4016:  AE 00        ppsw    $0
4018:  37 91 29     jp      &H2991
401B:  77 E8 2A     cal     &H2AE8
401E:  B7 89        jr      &H3FA8
4020:  C2 73 4F     ldm     $19,$15,3
4023:  AE 0F        ppsw    $15
4025:  77 53 40     cal     &H4053
4028:  31 B0 2B     jp      nc,&H2BB0
402B:  9E 4F        gre     iz,$15
402D:  A6 10        phsw    $16
402F:  01 71 15     sbc     $17,$21
4032:  B5 0E        jr      c,&H4041
4034:  00 31        adc     $17,$sy
4036:  B5 07        jr      c,&H403E
4038:  09 71 15     sb      $17,$21
403B:  02 7B 11     ld      $27,$17
403E:  02 71 15     ld      $17,$21
4041:  1C 5A        gfl     $26
4043:  82 6F 13     ldw     $15,$19
4046:  77 D5 97     cal     &H97D5
4049:  02 71 1B     ld      $17,$27
404C:  14 5A        pfl     $26
404E:  71 AE 3F     cal     nc,&H3FAE
4051:  B7 E0        jr      &H4032
4053:  C9 77 77     sbbm    $23,$23,4
4056:  42 18 10     ld      $24,&H10
4059:  1E 61        gst     ua,$1
405B:  26 01        phs     $1
405D:  56 60 44     pst     ua,&H44
4060:  D6 00 B6 3F  pre     ix,&H3FB6
4064:  96 4F        pre     iz,$15
4066:  2B 00        ldi     $0,(iz+$sx)
4068:  2C 01        ldd     $1,(ix+$sx)
406A:  4C 01 7F     an      $1,&H7F
406D:  2A 02        ldi     $2,(ix+$sx)
406F:  01 41        sbc     $1,$sz
4071:  B4 0F        jr      nz,&H4081
4073:  18 62        biu     $2
4075:  B1 90        jr      nc,&H4006
4077:  2D A0        ldd     $0,(iz-$sy)
4079:  A8 05        ldw     $5,(ix+$sx)
407B:  2E 01        pps     $1
407D:  16 61        pst     ua,$1
407F:  DE 05        jp      $5
4081:  18 62        biu     $2
4083:  2A 02        ldi     $2,(ix+$sx)
4085:  B1 85        jr      nc,&H400B
4087:  2C 20        ldd     $0,(ix+$sy)
4089:  41 01 40     sbc     $1,&H40
408C:  B4 A9        jr      nz,&H4036
408E:  2E 01        pps     $1
4090:  16 61        pst     ua,$1
4092:  96 4F        pre     iz,$15
4094:  2B 10        ldi     $16,(iz+$sx)
4096:  00 10        adc     $16,$sx
4098:  B0 07        jr      z,&H40A0
409A:  77 F1 2A     cal     &H2AF1
409D:  9E CF C6     gre     iz,$15,jr &H4065
40A0:  2D A0        ldd     $0,(iz-$sy)
40A2:  F7           rtn   
40A3:  02 31        ld      $17,$sy
40A5:  2D 20        ldd     $0,(iz+$sy)
40A7:  01 3F        sbc     $31,$sy
40A9:  F7           rtn   
40AA:  9E 41        gre     iz,$1
40AC:  2D 23        ldd     $3,(iz+$sy)
40AE:  77 49 00     cal     &H0049
40B1:  41 00 26     sbc     $0,&H26
40B4:  B4 A3        jr      nz,&H4058
40B6:  2D 20        ldd     $0,(iz+$sy)
40B8:  9E 51        gre     iz,$17
40BA:  89 F1 01 96  sbw     $17,$1,jr &H4053
40BE:  0D 91 9B     na      $17,$sx,jr &H405B
40C1:  2D A0        ldd     $0,(iz-$sy)
40C3:  2B 00        ldi     $0,(iz+$sx)
40C5:  41 00 23     sbc     $0,&H23
40C8:  B4 0C        jr      nz,&H40D5
40CA:  44 18 04     anc     $24,&H04
40CD:  B0 04        jr      z,&H40D2
40CF:  08 BA 8E     ad      $26,$sy,jr &H405F
40D2:  08 B9 91     ad      $25,$sy,jr &H4065
40D5:  41 00 2E     sbc     $0,&H2E
40D8:  B4 0A        jr      nz,&H40E3
40DA:  44 18 04     anc     $24,&H04
40DD:  B4 2E        jr      nz,&H410C
40DF:  4E 98 04 9F  or      $24,&H04,jr &H4081
40E3:  41 00 2C     sbc     $0,&H2C
40E6:  B4 0A        jr      nz,&H40F1
40E8:  44 18 04     anc     $24,&H04
40EB:  B4 20        jr      nz,&H410C
40ED:  4E 98 02 9E  or      $24,&H02,jr &H408E
40F1:  41 00 5E     sbc     $0,&H5E
40F4:  B4 17        jr      nz,&H410C
40F6:  9E 40        gre     iz,$0
40F8:  42 02 03     ld      $2,&H03
40FB:  2B 03        ldi     $3,(iz+$sx)
40FD:  41 03 5E     sbc     $3,&H5E
4100:  B4 09        jr      nz,&H410A
4102:  09 22        sb      $2,$sy
4104:  B4 8A        jr      nz,&H408F
4106:  4E 98 08 05  or      $24,&H08,jr &H410E
410A:  96 40        pre     iz,$0
410C:  2D A0        ldd     $0,(iz-$sy)
410E:  4E 18 10     or      $24,&H10
4111:  82 60 19     ldw     $0,$25
4114:  08 41        ad      $1,$sz
4116:  41 01 20     sbc     $1,&H20
4119:  31 70 2B     jp      nc,&H2B70
411C:  00 01        adc     $1,$sx
411E:  F7           rtn   
411F:  41 19 02     sbc     $25,&H02
4122:  B1 30        jr      nc,&H4153
4124:  00 1A        adc     $26,$sx
4126:  B0 5D        jr      z,&H4184
4128:  02 67 1A     ld      $7,$26
412B:  77 9E 17     cal     &H179E
412E:  00 19        adc     $25,$sx
4130:  B4 08        jr      nz,&H4139
4132:  41 16 05     sbc     $22,&H05
4135:  B1 4E        jr      nc,&H4184
4137:  0E 38        or      $24,$sy
4139:  81 31        sbcw    $17,$sy
413B:  B5 0C        jr      c,&H4148
413D:  00 12        adc     $18,$sx
413F:  B0 06        jr      z,&H4146
4141:  41 11 99     sbc     $17,&H99
4144:  B0 3F        jr      z,&H4184
4146:  8A 31        adbw    $17,$sy
4148:  00 19        adc     $25,$sx
414A:  B0 03        jr      z,&H414E
414C:  09 39        sb      $25,$sy
414E:  02 00        ld      $0,$sx
4150:  37 02 42     jp      &H4202
4153:  02 67 19     ld      $7,$25
4156:  08 67 1A     ad      $7,$26
4159:  09 27        sb      $7,$sy
415B:  77 9E 17     cal     &H179E
415E:  02 60 19     ld      $0,$25
4161:  49 00 02     sb      $0,&H02
4164:  77 9F 51     cal     &H519F
4167:  04 32        anc     $18,$sy
4169:  B4 11        jr      nz,&H417B
416B:  01 60 11     sbc     $0,$17
416E:  B5 0C        jr      c,&H417B
4170:  01 31        sbc     $17,$sy
4172:  B1 11        jr      nc,&H4184
4174:  02 60 19     ld      $0,$25
4177:  49 80 02 07  sb      $0,&H02,jr &H4181
417B:  02 01        ld      $1,$sx
417D:  8B 51        sbbw    $17,$sz
417F:  02 00        ld      $0,$sx
4181:  09 B9 7F     sb      $25,$sy,jr &H4202
4184:  D6 60 C7 1C  pre     us,&H1CC7
4188:  77 5C 00     cal     &H005C
418B:  E6 12 E0     phsm    $18,8
418E:  26 0A        phs     $10
4190:  42 10 25     ld      $16,&H25
4193:  77 F1 2A     cal     &H2AF1
4196:  2E 0A        pps     $10
4198:  EE 0B E0     ppsm    $11,8
419B:  37 A7 13     jp      &H13A7
419E:  77 5C 00     cal     &H005C
41A1:  02 76 12     ld      $22,$18
41A4:  77 25 0A     cal     &H0A25
41A7:  D6 00 5E 16  pre     ix,&H165E
41AB:  44 18 08     anc     $24,&H08
41AE:  34 1F 41     jp      nz,&H411F
41B1:  41 16 05     sbc     $22,&H05
41B4:  B5 5D        jr      c,&H4212
41B6:  09 39        sb      $25,$sy
41B8:  B5 B5        jr      c,&H416E
41BA:  02 67 1A     ld      $7,$26
41BD:  A6 12        phsw    $18
41BF:  00 12        adc     $18,$sx
41C1:  B4 53        jr      nz,&H4215
41C3:  9A 71        byuw    $17
41C5:  0B 71 12     sbb     $17,$18
41C8:  77 FA 0A     cal     &H0AFA
41CB:  09 67 11     sb      $7,$17
41CE:  08 27        ad      $7,$sy
41D0:  AE 11        ppsw    $17
41D2:  77 9E 17     cal     &H179E
41D5:  26 11        phs     $17
41D7:  77 FA 0A     cal     &H0AFA
41DA:  02 60 11     ld      $0,$17
41DD:  02 54        ld      $20,$sz
41DF:  2E 11        pps     $17
41E1:  00 12        adc     $18,$sx
41E3:  B0 15        jr      z,&H41F9
41E5:  44 18 02     anc     $24,&H02
41E8:  B0 33        jr      z,&H421C
41EA:  01 60 19     sbc     $0,$25
41ED:  B1 EA        jr      nc,&H41D8
41EF:  02 53        ld      $19,$sz
41F1:  49 13 03     sb      $19,&H03
41F4:  B5 27        jr      c,&H421C
41F6:  09 B9 87     sb      $25,$sy,jr &H417F
41F9:  02 60 19     ld      $0,$25
41FC:  09 20        sb      $0,$sy
41FE:  B1 03        jr      nc,&H4202
4200:  02 00        ld      $0,$sx
4202:  81 39        sbcw    $25,$sy
4204:  B5 CD        jr      c,&H41D2
4206:  42 15 20     ld      $21,&H20
4209:  09 20        sb      $0,$sy
420B:  B5 1B        jr      c,&H4227
420D:  22 15        sti     $21,(ix+$sx)
420F:  09 B9 88     sb      $25,$sy,jr &H4199
4212:  0E B8 DA     or      $24,$sy,jr &H41EE
4215:  77 FA 0A     cal     &H0AFA
4218:  08 E7 11 CD  ad      $7,$17,jr &H41E8
421C:  09 60 19     sb      $0,$25
421F:  31 84 41     jp      nc,&H4184
4222:  08 20        ad      $0,$sy
4224:  1B 80 A4     cmp     $0,jr &H41CA
4227:  02 73 16     ld      $19,$22
422A:  04 38        anc     $24,$sy
422C:  70 12 0B     cal     z,&H0B12
422F:  00 19        adc     $25,$sx
4231:  B0 0F        jr      z,&H4241
4233:  44 18 08     anc     $24,&H08
4236:  B4 3E        jr      nz,&H4275
4238:  00 12        adc     $18,$sx
423A:  B4 3A        jr      nz,&H4275
423C:  42 15 30     ld      $21,&H30
423F:  22 15        sti     $21,(ix+$sx)
4241:  44 18 04     anc     $24,&H04
4244:  B0 23        jr      z,&H4268
4246:  42 15 2E     ld      $21,&H2E
4249:  22 15        sti     $21,(ix+$sx)
424B:  00 1A        adc     $26,$sx
424D:  B0 1A        jr      z,&H4268
424F:  44 18 08     anc     $24,&H08
4252:  B4 44        jr      nz,&H4297
4254:  00 12        adc     $18,$sx
4256:  B4 40        jr      nz,&H4297
4258:  42 15 30     ld      $21,&H30
425B:  08 34        ad      $20,$sy
425D:  41 14 64     sbc     $20,&H64
4260:  B0 36        jr      z,&H4297
4262:  22 15        sti     $21,(ix+$sx)
4264:  09 3A        sb      $26,$sy
4266:  B4 8C        jr      nz,&H41F3
4268:  44 18 08     anc     $24,&H08
426B:  74 F1 12     cal     nz,&H12F1
426E:  D1 0F 5E 16  ldw     $15,&H165E
4272:  37 3B 14     jp      &H143B
4275:  77 E5 12     cal     &H12E5
4278:  09 39        sb      $25,$sy
427A:  B0 BA        jr      z,&H4235
427C:  44 18 02     anc     $24,&H02
427F:  B0 8B        jr      z,&H420B
4281:  44 18 08     anc     $24,&H08
4284:  B4 90        jr      nz,&H4215
4286:  02 60 19     ld      $0,$25
4289:  49 00 03     sb      $0,&H03
428C:  B5 98        jr      c,&H4225
428E:  B4 86        jr      nz,&H4215
4290:  42 15 2C     ld      $21,&H2C
4293:  22 15        sti     $21,(ix+$sx)
4295:  B7 A1        jr      &H4237
4297:  77 E5 12     cal     &H12E5
429A:  09 3A        sb      $26,$sy
429C:  B4 86        jr      nz,&H4223
429E:  B7 B7        jr      &H4256
42A0:  77 44 50     cal     &H5044
42A3:  77 CD 00     cal     &H00CD
42A6:  30 3D 54     jp      z,&H543D
42A9:  77 01 2F     cal     &H2F01
42AC:  9E 40        gre     iz,$0
42AE:  A6 01        phsw    $1
42B0:  D6 00 DB 16  pre     ix,&H16DB
42B4:  A8 0F        ldw     $15,(ix+$sx)
42B6:  96 4F        pre     iz,$15
42B8:  81 2F        sbcw    $15,$sy
42BA:  B5 14        jr      c,&H42CF
42BC:  77 C3 00     cal     &H00C3
42BF:  B0 17        jr      z,&H42D7
42C1:  2D 21        ldd     $1,(iz+$sy)
42C3:  41 00 80     sbc     $0,&H80
42C6:  B0 10        jr      z,&H42D7
42C8:  00 00        adc     $0,$sx
42CA:  B0 09        jr      z,&H42D4
42CC:  37 70 2B     jp      &H2B70
42CF:  77 EE 33     cal     &H33EE
42D2:  96 59        pre     iz,$25
42D4:  77 AC 0B     cal     &H0BAC
42D7:  02 21        ld      $1,$sy
42D9:  77 9D 12     cal     &H129D
42DC:  9E 4F        gre     iz,$15
42DE:  77 13 43     cal     &H4313
42E1:  AE 00        ppsw    $0
42E3:  96 40        pre     iz,$0
42E5:  77 C3 00     cal     &H00C3
42E8:  B0 C0        jr      z,&H42A9
42EA:  F7           rtn   
42EB:  77 44 50     cal     &H5044
42EE:  77 CD 00     cal     &H00CD
42F1:  30 EA 56     jp      z,&H56EA
42F4:  77 49 00     cal     &H0049
42F7:  41 00 03     sbc     $0,&H03
42FA:  B5 23        jr      c,&H431E
42FC:  B0 1D        jr      z,&H431A
42FE:  77 0D 0F     cal     &H0F0D
4301:  77 E2 0E     cal     &H0EE2
4304:  9E 57        gre     iz,$23
4306:  77 76 51     cal     &H5176
4309:  31 AC 2B     jp      nc,&H2BAC
430C:  77 AC 0B     cal     &H0BAC
430F:  89 2F        sbw     $15,$sy
4311:  96 57        pre     iz,$23
4313:  D6 00 DB 16  pre     ix,&H16DB
4317:  A0 0F        stw     $15,(ix+$sx)
4319:  F7           rtn   
431A:  AB 2F        ldiw    $15,(iz+$sy)
431C:  B7 99        jr      &H42B6
431E:  89 EF 0F 8E  sbw     $15,$15,jr &H42AF
4322:  77 3C 00     cal     &H003C
4325:  B5 31        jr      c,&H4357
4327:  42 02 6A     ld      $2,&H6A
432A:  77 EF 00     cal     &H00EF
432D:  B4 0C        jr      nz,&H433A
432F:  D1 00 F1 16  ldw     $0,&H16F1
4333:  D1 02 48 00  ldw     $2,&H0048
4337:  37 57 01     jp      &H0157
433A:  77 3C 00     cal     &H003C
433D:  B0 19        jr      z,&H4357
433F:  77 C3 00     cal     &H00C3
4342:  B0 5E        jr      z,&H43A1
4344:  77 2F 11     cal     &H112F
4347:  77 ED 1B     cal     &H1BED
434A:  77 B4 51     cal     &H51B4
434D:  77 C3 00     cal     &H00C3
4350:  B0 50        jr      z,&H43A1
4352:  77 CB 00     cal     &H00CB
4355:  B0 50        jr      z,&H43A6
4357:  77 69 06     cal     &H0669
435A:  77 B8 06     cal     &H06B8
435D:  77 93 00     cal     &H0093
4360:  D6 00 5E 16  pre     ix,&H165E
4364:  E2 0A E0     stim    $10,(ix+$sx),8
4367:  24 12        std     $18,(ix+$sx)
4369:  02 1D        ld      $29,$sx
436B:  42 1C 13     ld      $28,&H13
436E:  D6 00 5E 16  pre     ix,&H165E
4372:  EA 0A E0     ldim    $10,(ix+$sx),8
4375:  2C 12        ldd     $18,(ix+$sx)
4377:  41 1C 13     sbc     $28,&H13
437A:  B0 0C        jr      z,&H4387
437C:  04 3C        anc     $28,$sy
437E:  77 B6 43     cal     &H43B6
4381:  41 1C 2E     sbc     $28,&H2E
4384:  71 B6 43     cal     nc,&H43B6
4387:  77 0B 1C     cal     &H1C0B
438A:  77 DA 05     cal     &H05DA
438D:  41 1D 80     sbc     $29,&H80
4390:  70 B1 51     cal     z,&H51B1
4393:  48 1C 09     ad      $28,&H09
4396:  41 1C 41     sbc     $28,&H41
4399:  B5 AC        jr      c,&H4346
439B:  48 1D 80     ad      $29,&H80
439E:  B1 B4        jr      nc,&H4353
43A0:  F7           rtn   
43A1:  77 CB 00     cal     &H00CB
43A4:  B4 06        jr      nz,&H43AB
43A6:  77 2F 11     cal     &H112F
43A9:  B7 CD        jr      &H4377
43AB:  77 2F 11     cal     &H112F
43AE:  77 F0 1B     cal     &H1BF0
43B1:  77 B4 51     cal     &H51B4
43B4:  B7 E3        jr      &H4398
43B6:  26 1C        phs     $28
43B8:  02 3C        ld      $28,$sy
43BA:  B0 04        jr      z,&H43BF
43BC:  42 1C 0A     ld      $28,&H0A
43BF:  77 0B 1C     cal     &H1C0B
43C2:  2E 1C        pps     $28
43C4:  37 07 06     jp      &H0607
43C7:  77 3C 00     cal     &H003C
43CA:  B5 0C        jr      c,&H43D7
43CC:  77 C3 0E     cal     &H0EC3
43CF:  81 2F        sbcw    $15,$sy
43D1:  30 B3 33     jp      z,&H33B3
43D4:  31 A4 2B     jp      nc,&H2BA4
43D7:  37 BA 33     jp      &H33BA
43DA:  77 53 50     cal     &H5053
43DD:  D1 0F 0A 00  ldw     $15,&H000A
43E1:  89 71 11     sbw     $17,$17
43E4:  D1 13 0A 00  ldw     $19,&H000A
43E8:  77 3C 00     cal     &H003C
43EB:  B5 4A        jr      c,&H4436
43ED:  77 C3 00     cal     &H00C3
43F0:  B0 18        jr      z,&H4409
43F2:  E6 12 60     phsm    $18,4
43F5:  77 2F 11     cal     &H112F
43F8:  77 E8 0E     cal     &H0EE8
43FB:  82 73 0F     ldw     $19,$15
43FE:  EE 0F 60     ppsm    $15,4
4401:  77 3C 00     cal     &H003C
4404:  B5 31        jr      c,&H4436
4406:  77 DB 00     cal     &H00DB
4409:  77 C3 00     cal     &H00C3
440C:  B0 1A        jr      z,&H4427
440E:  A6 14        phsw    $20
4410:  A6 10        phsw    $16
4412:  77 2F 11     cal     &H112F
4415:  77 E8 0E     cal     &H0EE8
4418:  82 71 0F     ldw     $17,$15
441B:  AE 0F        ppsw    $15
441D:  AE 13        ppsw    $19
441F:  77 3C 00     cal     &H003C
4422:  B5 13        jr      c,&H4436
4424:  77 DB 00     cal     &H00DB
4427:  E6 14 60     phsm    $20,4
442A:  77 2F 11     cal     &H112F
442D:  77 E8 0E     cal     &H0EE8
4430:  EE 11 60     ppsm    $17,4
4433:  77 93 00     cal     &H0093
4436:  9E 57        gre     iz,$23
4438:  77 EE 33     cal     &H33EE
443B:  77 FA 33     cal     &H33FA
443E:  30 B9 1F     jp      z,&H1FB9
4441:  96 59        pre     iz,$25
4443:  81 31        sbcw    $17,$sy
4445:  82 23        ldw     $3,$sy
4447:  B5 13        jr      c,&H445B
4449:  89 61 01     sbw     $1,$1
444C:  82 65 11     ldw     $5,$17
444F:  77 35 45     cal     &H4535
4452:  31 AC 2B     jp      nc,&H2BAC
4455:  81 61 13     sbcw    $1,$19
4458:  31 A8 2B     jp      nc,&H2BA8
445B:  89 23        sbw     $3,$sy
445D:  A7 04        phuw    $4
445F:  9E 55        gre     iz,$21
4461:  89 65 05     sbw     $5,$5
4464:  77 35 45     cal     &H4535
4467:  89 23        sbw     $3,$sy
4469:  77 4A 45     cal     &H454A
446C:  80 53        adcw    $19,$sz
446E:  35 98 2B     jp      c,&H2B98
4471:  02 1D        ld      $29,$sx
4473:  96 59        pre     iz,$25
4475:  89 6D 0D     sbw     $13,$13
4478:  3B 1F        sbc     (iz+$sx),$31
447A:  B0 6B        jr      z,&H44E6
447C:  EB 00 40     ldim    $0,(iz+$sx),3
447F:  D6 00 CB 16  pre     ix,&H16CB
4483:  A0 01        stw     $1,(ix+$sx)
4485:  D6 00 95 17  pre     ix,&H1795
4489:  81 61 11     sbcw    $1,$17
448C:  B5 0A        jr      c,&H4497
448E:  82 61 13     ldw     $1,$19
4491:  88 61 0D     adw     $1,$13
4494:  88 6D 0F     adw     $13,$15
4497:  E2 00 40     stim    $0,(ix+$sx),3
449A:  2B 00        ldi     $0,(iz+$sx)
449C:  22 00        sti     $0,(ix+$sx)
449E:  01 00        sbc     $0,$sx
44A0:  B0 2C        jr      z,&H44CD
44A2:  41 00 03     sbc     $0,&H03
44A5:  B4 8C        jr      nz,&H4432
44A7:  AB 05        ldiw    $5,(iz+$sx)
44A9:  9E 47        gre     iz,$7
44AB:  77 33 45     cal     &H4533
44AE:  B1 17        jr      nc,&H44C6
44B0:  81 65 11     sbcw    $5,$17
44B3:  B5 15        jr      c,&H44C9
44B5:  AF 00        ppuw    $0
44B7:  A7 01        phuw    $1
44B9:  89 43        sbw     $3,$sz
44BB:  77 4A 45     cal     &H454A
44BE:  88 60 13     adw     $0,$19
44C1:  A2 00        stiw    $0,(ix+$sx)
44C3:  96 C7 AB     pre     iz,$7,jr &H4470
44C6:  77 5E 45     cal     &H455E
44C9:  82 E0 05 8B  ldw     $0,$5,jr &H4457
44CD:  9E 4B        gre     iz,$11
44CF:  D6 40 95 17  pre     iz,&H1795
44D3:  E6 10 A0     phsm    $16,6
44D6:  77 C5 29     cal     &H29C5
44D9:  77 8B 50     cal     &H508B
44DC:  EE 0B A0     ppsm    $11,6
44DF:  96 4B        pre     iz,$11
44E1:  75 5A 45     cal     c,&H455A
44E4:  B7 ED        jr      &H44D2
44E6:  77 0F 34     cal     &H340F
44E9:  01 1D        sbc     $29,$sx
44EB:  34 B9 1F     jp      nz,&H1FB9
44EE:  96 59        pre     iz,$25
44F0:  3B 1F        sbc     (iz+$sx),$31
44F2:  B0 2B        jr      z,&H451E
44F4:  6D 00 03     ldd     $0,(iz+&H03)
44F7:  2B 00        ldi     $0,(iz+$sx)
44F9:  01 00        sbc     $0,$sx
44FB:  B0 8C        jr      z,&H4488
44FD:  41 00 03     sbc     $0,&H03
4500:  B4 8A        jr      nz,&H448B
4502:  A9 00        ldw     $0,(iz+$sx)
4504:  81 60 11     sbcw    $0,$17
4507:  B5 12        jr      c,&H451A
4509:  9E 47        gre     iz,$7
450B:  96 55        pre     iz,$21
450D:  82 45        ldw     $5,$sz
450F:  77 35 45     cal     &H4535
4512:  77 4A 45     cal     &H454A
4515:  88 60 13     adw     $0,$19
4518:  96 47        pre     iz,$7
451A:  A3 00        stiw    $0,(iz+$sx)
451C:  B7 A6        jr      &H44C3
451E:  96 55        pre     iz,$21
4520:  A1 33        stw     $19,(iz+$sy)
4522:  2D 00        ldd     $0,(iz+$sx)
4524:  2B 40        ldi     $0,(iz+$sz)
4526:  3B 1F        sbc     (iz+$sx),$31
4528:  B0 05        jr      z,&H452E
452A:  88 F3 0F 8D  adw     $19,$15,jr &H44BA
452E:  96 57        pre     iz,$23
4530:  37 B9 1F     jp      &H1FB9
4533:  96 59        pre     iz,$25
4535:  82 23        ldw     $3,$sy
4537:  3B 1F        sbc     (iz+$sx),$31
4539:  B0 0F        jr      z,&H4549
453B:  BB 25        sbcw    (iz+$sy),$5
453D:  B0 09        jr      z,&H4547
453F:  E9 00 40     ldm     $0,(iz+$sx),3
4542:  2B 40        ldi     $0,(iz+$sz)
4544:  88 A3 8F     adw     $3,$sy,jr &H44D5
4547:  01 3F        sbc     $31,$sy
4549:  F7           rtn   
454A:  A6 10        phsw    $16
454C:  82 65 03     ldw     $5,$3
454F:  89 25        sbw     $5,$sy
4551:  77 35 0A     cal     &H0A35
4554:  35 98 2B     jp      c,&H2B98
4557:  AE 0F        ppsw    $15
4559:  F7           rtn   
455A:  42 80 05 04  ld      $0,&H05,jr &H4561
455E:  42 00 12     ld      $0,&H12
4561:  02 3D        ld      $29,$sy
4563:  9E 01        gre     ix,$1
4565:  E6 08 E0     phsm    $8,8
4568:  E6 10 E0     phsm    $16,8
456B:  E6 18 E0     phsm    $24,8
456E:  02 52        ld      $18,$sz
4570:  D6 00 C6 16  pre     ix,&H16C6
4574:  24 1E        std     $30,(ix+$sx)
4576:  77 0A 2D     cal     &H2D0A
4579:  77 2E 03     cal     &H032E
457C:  77 C8 23     cal     &H23C8
457F:  77 2E 03     cal     &H032E
4582:  D6 00 C6 16  pre     ix,&H16C6
4586:  24 1F        std     $31,(ix+$sx)
4588:  EE 11 E0     ppsm    $17,8
458B:  EE 09 E0     ppsm    $9,8
458E:  EE 01 E0     ppsm    $1,8
4591:  96 01        pre     ix,$1
4593:  F7           rtn   
4594:  77 56 50     cal     &H5056
4597:  77 CD 00     cal     &H00CD
459A:  B0 15        jr      z,&H45B0
459C:  77 37 50     cal     &H5037
459F:  42 02 BB     ld      $2,&HBB
45A2:  77 E9 00     cal     &H00E9
45A5:  B0 16        jr      z,&H45BC
45A7:  77 93 00     cal     &H0093
45AA:  77 D1 45     cal     &H45D1
45AD:  37 31 24     jp      &H2431
45B0:  77 93 00     cal     &H0093
45B3:  42 0E 0A     ld      $14,&H0A
45B6:  77 DA 45     cal     &H45DA
45B9:  37 B9 1F     jp      &H1FB9
45BC:  77 93 00     cal     &H0093
45BF:  42 0E 09     ld      $14,&H09
45C2:  77 DA 45     cal     &H45DA
45C5:  09 2E        sb      $14,$sy
45C7:  B1 86        jr      nc,&H454E
45C9:  77 16 54     cal     &H5416
45CC:  77 02 34     cal     &H3402
45CF:  B7 A3        jr      &H4573
45D1:  77 EE 33     cal     &H33EE
45D4:  77 FA 33     cal     &H33FA
45D7:  37 EA 34     jp      &H34EA
45DA:  77 28 34     cal     &H3428
45DD:  B7 8A        jr      &H4568
45DF:  77 44 50     cal     &H5044
45E2:  77 43 4E     cal     &H4E43
45E5:  D6 00 70 17  pre     ix,&H1770
45E9:  BA 1E        sbcw    (ix+$sx),$30
45EB:  31 D7 2B     jp      nc,&H2BD7
45EE:  D1 02 81 31  ldw     $2,&H3181
45F2:  77 EF 00     cal     &H00EF
45F5:  B4 25        jr      nz,&H461B
45F7:  D1 02 9B 32  ldw     $2,&H329B
45FB:  77 EB 00     cal     &H00EB
45FE:  B0 1C        jr      z,&H461B
4600:  D1 02 BD 34  ldw     $2,&H34BD
4604:  77 E9 00     cal     &H00E9
4607:  B0 13        jr      z,&H461B
4609:  42 02 99     ld      $2,&H99
460C:  77 EF 00     cal     &H00EF
460F:  34 70 2B     jp      nz,&H2B70
4612:  D1 02 A5 30  ldw     $2,&H30A5
4616:  77 EF 00     cal     &H00EF
4619:  B4 8B        jr      nz,&H45A5
461B:  42 02 BC     ld      $2,&HBC
461E:  77 E9 00     cal     &H00E9
4621:  B4 93        jr      nz,&H45B5
4623:  02 6A 03     ld      $10,$3
4626:  E6 0D 60     phsm    $13,4
4629:  77 CD 4F     cal     &H4FCD
462C:  EE 0A 60     ppsm    $10,4
462F:  77 93 00     cal     &H0093
4632:  02 29        ld      $9,$sy
4634:  42 0E 24     ld      $14,&H24
4637:  D6 00 70 17  pre     ix,&H1770
463B:  D1 07 23 01  ldw     $7,&H0123
463F:  E2 07 80     stim    $7,(ix+$sx),5
4642:  77 A9 4F     cal     &H4FA9
4645:  D6 00 80 17  pre     ix,&H1780
4649:  D1 02 93 17  ldw     $2,&H1793
464D:  A2 02        stiw    $2,(ix+$sx)
464F:  C9 64 C4     sbbm    $4,$4,7
4652:  82 67 02     ldw     $7,$2
4655:  08 23        ad      $3,$sy
4657:  E2 02 C0     stim    $2,(ix+$sx),7
465A:  A2 09        stiw    $9,(ix+$sx)
465C:  02 6A 0E     ld      $10,$14
465F:  A2 09        stiw    $9,(ix+$sx)
4661:  D6 00 70 17  pre     ix,&H1770
4665:  42 00 03     ld      $0,&H03
4668:  A8 4A        ldw     $10,(ix+$sz)
466A:  41 0B 02     sbc     $11,&H02
466D:  30 92 84     jp      z,&H8492
4670:  31 DD 86     jp      nc,&H86DD
4673:  7A 1E 02     sbc     (ix+&H02),$30
4676:  B1 29        jr      nc,&H46A0
4678:  41 0A 30     sbc     $10,&H30
467B:  B0 1D        jr      z,&H4699
467D:  41 0E 10     sbc     $14,&H10
4680:  B4 27        jr      nz,&H46A8
4682:  77 9A 81     cal     &H819A
4685:  F4           rtn     nz
4686:  D6 00 8C 17  pre     ix,&H178C
468A:  42 0E 24     ld      $14,&H24
468D:  24 0E        std     $14,(ix+$sx)
468F:  6C 0F 03     ldd     $15,(ix+&H03)
4692:  0E 2F        or      $15,$sy
4694:  24 0F        std     $15,(ix+$sx)
4696:  37 A3 80     jp      &H80A3
4699:  04 2F        anc     $15,$sy
469B:  B4 86        jr      nz,&H4622
469D:  37 E0 80     jp      &H80E0
46A0:  41 0A 31     sbc     $10,&H31
46A3:  30 DB 2B     jp      z,&H2BDB
46A6:  B7 91        jr      &H4638
46A8:  77 46 81     cal     &H8146
46AB:  34 90 2B     jp      nz,&H2B90
46AE:  B7 99        jr      &H4648
46B0:  77 93 00     cal     &H0093
46B3:  77 4F 29     cal     &H294F
46B6:  4C 01 DF     an      $1,&HDF
46B9:  24 01        std     $1,(ix+$sx)
46BB:  D6 00 70 17  pre     ix,&H1770
46BF:  BA 1E        sbcw    (ix+$sx),$30
46C1:  B5 40        jr      c,&H4702
46C3:  02 00        ld      $0,$sx
46C5:  A0 1F        stw     $31,(ix+$sx)
46C7:  E8 00 80     ldm     $0,(ix+$sx),5
46CA:  44 03 02     anc     $3,&H02
46CD:  B4 0A        jr      nz,&H46D8
46CF:  68 05 1C     ld      $5,(ix+&H1C)
46D2:  41 05 24     sbc     $5,&H24
46D5:  70 23 47     cal     z,&H4723
46D8:  77 19 47     cal     &H4719
46DB:  D6 00 70 17  pre     ix,&H1770
46DF:  E8 00 80     ldm     $0,(ix+$sx),5
46E2:  00 24        adc     $4,$sy
46E4:  F5           rtn     c
46E5:  41 04 02     sbc     $4,&H02
46E8:  31 63 85     jp      nc,&H8563
46EB:  37 06 83     jp      &H8306
46EE:  D6 00 74 17  pre     ix,&H1774
46F2:  60 1F 18     st      $31,(ix+&H18)
46F5:  2C 00        ldd     $0,(ix+$sx)
46F7:  41 00 02     sbc     $0,&H02
46FA:  B1 C8        jr      nc,&H46C3
46FC:  0D 00        na      $0,$sx
46FE:  24 00        std     $0,(ix+$sx)
4700:  B7 CE        jr      &H46CF
4702:  77 79 01     cal     &H0179
4705:  1E 61        gst     ua,$1
4707:  9E 42        gre     iz,$2
4709:  E6 03 40     phsm    $3,3
470C:  56 60 D4     pst     ua,&HD4
470F:  77 42 83     cal     &H8342
4712:  EE 00 40     ppsm    $0,3
4715:  16 60        pst     ua,$0
4717:  96 41        pre     iz,$1
4719:  D6 00 8D 17  pre     ix,&H178D
471D:  89 40        sbw     $0,$sz
471F:  E0 1F 40     stm     $31,(ix+$sx),3
4722:  F7           rtn   
4723:  41 04 02     sbc     $4,&H02
4726:  F0           rtn     z
4727:  42 00 19     ld      $0,&H19
472A:  A8 45        ldw     $5,(ix+$sz)
472C:  35 E3 82     jp      c,&H82E3
472F:  D1 19 93 17  ldw     $25,&H1793
4733:  37 B1 49     jp      &H49B1
4736:  77 71 47     cal     &H4771
4739:  77 7D 47     cal     &H477D
473C:  77 4F 29     cal     &H294F
473F:  D1 00 00 02  ldw     $0,&H0200
4743:  BA 00        sbcw    (ix+$sx),$0
4745:  30 4F 6A     jp      z,&H6A4F
4748:  37 B9 1F     jp      &H1FB9
474B:  42 8F 30 08  ld      $15,&H30,jr &H4756
474F:  42 8F 40 04  ld      $15,&H40,jr &H4756
4753:  42 0F 10     ld      $15,&H10
4756:  26 0F        phs     $15
4758:  77 71 47     cal     &H4771
475B:  2E 0F        pps     $15
475D:  77 13 4A     cal     &H4A13
4760:  B7 A5        jr      &H4706
4762:  77 71 47     cal     &H4771
4765:  42 0F 20     ld      $15,&H20
4768:  77 13 4A     cal     &H4A13
476B:  77 0F 34     cal     &H340F
476E:  37 D6 24     jp      &H24D6
4771:  77 05 7F     cal     &H7F05
4774:  77 B3 46     cal     &H46B3
4777:  C9 71 71     sbbm    $17,$17,4
477A:  37 69 3B     jp      &H3B69
477D:  02 0F        ld      $15,$sx
477F:  77 B9 48     cal     &H48B9
4782:  41 0E 24     sbc     $14,&H24
4785:  70 9B 52     cal     z,&H529B
4788:  41 0E 24     sbc     $14,&H24
478B:  B0 1B        jr      z,&H47A7
478D:  44 0F 02     anc     $15,&H02
4790:  B4 31        jr      nz,&H47C2
4792:  D1 00 C9 16  ldw     $0,&H16C9
4796:  91 40        ldw     $0,($sz)
4798:  96 00        pre     ix,$0
479A:  E8 00 60     ldm     $0,(ix+$sx),4
479D:  89 22        sbw     $2,$sy
479F:  89 42        sbw     $2,$sz
47A1:  D6 00 8D 17  pre     ix,&H178D
47A5:  A0 02        stw     $2,(ix+$sx)
47A7:  E6 0F 80     phsm    $15,5
47AA:  77 5F 49     cal     &H495F
47AD:  EE 11 80     ppsm    $17,5
47B0:  01 31        sbc     $17,$sy
47B2:  B4 1D        jr      nz,&H47D0
47B4:  04 35        anc     $21,$sy
47B6:  B4 19        jr      nz,&H47D0
47B8:  D6 00 70 17  pre     ix,&H1770
47BC:  02 00        ld      $0,$sx
47BE:  A0 1F        stw     $31,(ix+$sx)
47C0:  B7 64        jr      &H4825
47C2:  D6 00 A7 18  pre     ix,&H18A7
47C6:  A8 00        ldw     $0,(ix+$sx)
47C8:  D6 00 BB 18  pre     ix,&H18BB
47CC:  A8 02        ldw     $2,(ix+$sx)
47CE:  B7 B0        jr      &H477F
47D0:  77 EE 33     cal     &H33EE
47D3:  96 59        pre     iz,$25
47D5:  41 11 03     sbc     $17,&H03
47D8:  B4 06        jr      nz,&H47DF
47DA:  41 14 24     sbc     $20,&H24
47DD:  B4 17        jr      nz,&H47F5
47DF:  04 35        anc     $21,$sy
47E1:  B4 18        jr      nz,&H47FA
47E3:  9E 40        gre     iz,$0
47E5:  88 20        adw     $0,$sy
47E7:  81 5B        sbcw    $27,$sz
47E9:  B0 25        jr      z,&H480F
47EB:  2B 10        ldi     $16,(iz+$sx)
47ED:  77 F1 2A     cal     &H2AF1
47F0:  77 C5 29     cal     &H29C5
47F3:  B7 91        jr      &H4785
47F5:  77 78 49     cal     &H4978
47F8:  B7 16        jr      &H480F
47FA:  26 11        phs     $17
47FC:  C9 64 64     sbbm    $4,$4,4
47FF:  89 26        sbw     $6,$sy
4801:  77 73 51     cal     &H5173
4804:  77 9D 3D     cal     &H3D9D
4807:  2E 11        pps     $17
4809:  41 11 03     sbc     $17,&H03
480C:  70 E8 2A     cal     z,&H2AE8
480F:  41 11 02     sbc     $17,&H02
4812:  B4 0F        jr      nz,&H4822
4814:  42 10 1A     ld      $16,&H1A
4817:  D6 00 3D 17  pre     ix,&H173D
481B:  28 00        ld      $0,(ix+$sx)
481D:  04 20        anc     $0,$sy
481F:  74 F1 2A     cal     nz,&H2AF1
4822:  77 B3 46     cal     &H46B3
4825:  77 0C 2A     cal     &H2A0C
4828:  77 B8 4E     cal     &H4EB8
482B:  37 91 29     jp      &H2991
482E:  D6 00 70 17  pre     ix,&H1770
4832:  68 07 04     ld      $7,(ix+&H04)
4835:  41 07 02     sbc     $7,&H02
4838:  30 C8 85     jp      z,&H85C8
483B:  42 00 17     ld      $0,&H17
483E:  A8 42        ldw     $2,(ix+$sz)
4840:  BC 5E        adw     (ix+$sz),$30
4842:  96 02        pre     ix,$2
4844:  22 10        sti     $16,(ix+$sx)
4846:  D6 00 70 17  pre     ix,&H1770
484A:  42 00 19     ld      $0,&H19
484D:  BC 5E        adw     (ix+$sz),$30
484F:  01 27        sbc     $7,$sy
4851:  B0 0C        jr      z,&H485E
4853:  7A 1F 02     sbc     (ix+&H02),$31
4856:  B4 07        jr      nz,&H485E
4858:  68 00 1F     ld      $0,(ix+&H1F)
485B:  04 20        anc     $0,$sy
485D:  F4           rtn     nz
485E:  7A 1E 1A     sbc     (ix+&H1A),$30
4861:  F5           rtn     c
4862:  77 77 48     cal     &H4877
4865:  77 82 48     cal     &H4882
4868:  01 27        sbc     $7,$sy
486A:  30 E3 82     jp      z,&H82E3
486D:  E6 1A 80     phsm    $26,5
4870:  77 B7 49     cal     &H49B7
4873:  EE 16 80     ppsm    $22,5
4876:  F7           rtn   
4877:  42 00 10     ld      $0,&H10
487A:  A8 41        ldw     $1,(ix+$sz)
487C:  42 00 17     ld      $0,&H17
487F:  A0 41        stw     $1,(ix+$sz)
4881:  F7           rtn   
4882:  D6 00 89 17  pre     ix,&H1789
4886:  A8 05        ldw     $5,(ix+$sx)
4888:  02 00        ld      $0,$sx
488A:  A0 1F        stw     $31,(ix+$sx)
488C:  F7           rtn   
488D:  77 3D 50     cal     &H503D
4890:  42 0E 24     ld      $14,&H24
4893:  4E 0F 08     or      $15,&H08
4896:  01 0F        sbc     $15,$sx
4898:  B3 34        jr      uz,&H48CD
489A:  44 0F 10     anc     $15,&H10
489D:  B4 2F        jr      nz,&H48CD
489F:  37 70 2B     jp      &H2B70
48A2:  42 0E 90     ld      $14,&H90
48A5:  4E 0F 02     or      $15,&H02
48A8:  41 0F 20     sbc     $15,&H20
48AB:  B5 21        jr      c,&H48CD
48AD:  B7 8F        jr      &H483D
48AF:  41 0F 18     sbc     $15,&H18
48B2:  B4 94        jr      nz,&H4847
48B4:  4E 0F 20     or      $15,&H20
48B7:  B7 42        jr      &H48FA
48B9:  77 CD 00     cal     &H00CD
48BC:  30 8D 48     jp      z,&H488D
48BF:  77 44 49     cal     &H4944
48C2:  42 02 BB     ld      $2,&HBB
48C5:  77 E9 00     cal     &H00E9
48C8:  B0 A7        jr      z,&H4870
48CA:  77 30 49     cal     &H4930
48CD:  A6 0F        phsw    $15
48CF:  77 43 4E     cal     &H4E43
48D2:  AE 0E        ppsw    $14
48D4:  41 0F 30     sbc     $15,&H30
48D7:  B1 24        jr      nc,&H48FC
48D9:  77 C3 00     cal     &H00C3
48DC:  B4 1F        jr      nz,&H48FC
48DE:  77 49 00     cal     &H0049
48E1:  77 B6 00     cal     &H00B6
48E4:  41 00 4D     sbc     $0,&H4D
48E7:  B0 B9        jr      z,&H48A1
48E9:  41 00 41     sbc     $0,&H41
48EC:  B4 CE        jr      nz,&H48BB
48EE:  01 0F        sbc     $15,$sx
48F0:  B6 D2        jr      nlz,&H48C3
48F2:  41 0E 10     sbc     $14,&H10
48F5:  B4 D7        jr      nz,&H48CD
48F7:  77 2D 49     cal     &H492D
48FA:  2D 20        ldd     $0,(iz+$sy)
48FC:  77 93 00     cal     &H0093
48FF:  77 20 49     cal     &H4920
4902:  9E 40        gre     iz,$0
4904:  A7 01        phuw    $1
4906:  44 0F 42     anc     $15,&H42
4909:  B0 07        jr      z,&H4911
490B:  41 0B 03     sbc     $11,&H03
490E:  34 88 2B     jp      nz,&H2B88
4911:  44 0F 08     anc     $15,&H08
4914:  F0           rtn     z
4915:  D1 04 BB 18  ldw     $4,&H18BB
4919:  D6 00 C9 16  pre     ix,&H16C9
491D:  A0 04        stw     $4,(ix+$sx)
491F:  F7           rtn   
4920:  41 0B 02     sbc     $11,&H02
4923:  B0 05        jr      z,&H4929
4925:  41 0F 30     sbc     $15,&H30
4928:  F4           rtn     nz
4929:  41 0E 10     sbc     $14,&H10
492C:  F4           rtn     nz
492D:  0E AF 11     or      $15,$sy,jr &H4940
4930:  D6 00 C9 16  pre     ix,&H16C9
4934:  A8 02        ldw     $2,(ix+$sx)
4936:  D1 00 BB 18  ldw     $0,&H18BB
493A:  81 42        sbcw    $2,$sz
493C:  42 0E 10     ld      $14,&H10
493F:  F5           rtn     c
4940:  42 0E 24     ld      $14,&H24
4943:  F7           rtn   
4944:  D6 00 C4 16  pre     ix,&H16C4
4948:  E8 01 40     ldm     $1,(ix+$sx),3
494B:  04 23        anc     $3,$sy
494D:  B4 0B        jr      nz,&H4959
494F:  01 21        sbc     $1,$sy
4951:  F0           rtn     z
4952:  44 02 02     anc     $2,&H02
4955:  F4           rtn     nz
4956:  37 A8 2B     jp      &H2BA8
4959:  41 0F 20     sbc     $15,&H20
495C:  F0           rtn     z
495D:  B7 88        jr      &H48E6
495F:  77 85 29     cal     &H2985
4962:  42 0A 30     ld      $10,&H30
4965:  02 09        ld      $9,$sx
4967:  D6 00 8F 17  pre     ix,&H178F
496B:  24 0F        std     $15,(ix+$sx)
496D:  77 4F 29     cal     &H294F
4970:  4E 01 20     or      $1,&H20
4973:  24 01        std     $1,(ix+$sx)
4975:  37 37 46     jp      &H4637
4978:  44 15 02     anc     $21,&H02
497B:  B0 29        jr      z,&H49A5
497D:  D6 00 14 10  pre     ix,&H1014
4981:  D6 40 A7 18  pre     iz,&H18A7
4985:  42 08 0A     ld      $8,&H0A
4988:  AB 00        ldiw    $0,(iz+$sx)
498A:  A9 02        ldw     $2,(iz+$sx)
498C:  89 42        sbw     $2,$sz
498E:  A4 A3        stdw    $3,(ix-$sy)
4990:  09 28        sb      $8,$sy
4992:  B4 8B        jr      nz,&H491E
4994:  D1 05 14 00  ldw     $5,&H0014
4998:  D1 19 00 10  ldw     $25,&H1000
499C:  77 BB 49     cal     &H49BB
499F:  D6 40 A7 18  pre     iz,&H18A7
49A3:  A9 19        ldw     $25,(iz+$sx)
49A5:  D6 00 8D 17  pre     ix,&H178D
49A9:  A8 05        ldw     $5,(ix+$sx)
49AB:  D1 16 FF 10  ldw     $22,&H10FF
49AF:  B7 0F        jr      &H49BF
49B1:  D1 16 FF 24  ldw     $22,&H24FF
49B5:  B7 09        jr      &H49BF
49B7:  D1 19 93 17  ldw     $25,&H1793
49BB:  D1 16 00 24  ldw     $22,&H2400
49BF:  77 81 85     cal     &H8581
49C2:  77 83 89     cal     &H8983
49C5:  42 04 78     ld      $4,&H78
49C8:  42 00 44     ld      $0,&H44
49CB:  77 E1 88     cal     &H88E1
49CE:  02 60 17     ld      $0,$23
49D1:  77 EA 88     cal     &H88EA
49D4:  02 60 16     ld      $0,$22
49D7:  77 EA 88     cal     &H88EA
49DA:  41 17 10     sbc     $23,&H10
49DD:  B0 0D        jr      z,&H49EB
49DF:  02 60 05     ld      $0,$5
49E2:  77 EA 88     cal     &H88EA
49E5:  02 60 06     ld      $0,$6
49E8:  77 EA 88     cal     &H88EA
49EB:  96 19        pre     ix,$25
49ED:  81 25        sbcw    $5,$sy
49EF:  71 FA 88     cal     nc,&H88FA
49F2:  37 8F 87     jp      &H878F
49F5:  D6 00 39 17  pre     ix,&H1739
49F9:  2C 00        ldd     $0,(ix+$sx)
49FB:  41 00 04     sbc     $0,&H04
49FE:  F4           rtn     nz
49FF:  D6 00 70 17  pre     ix,&H1770
4A03:  68 00 04     ld      $0,(ix+&H04)
4A06:  41 00 03     sbc     $0,&H03
4A09:  F4           rtn     nz
4A0A:  77 77 48     cal     &H4877
4A0D:  77 82 48     cal     &H4882
4A10:  37 B7 49     jp      &H49B7
4A13:  77 B9 48     cal     &H48B9
4A16:  77 30 29     cal     &H2930
4A19:  2C 20        ldd     $0,(ix+$sy)
4A1B:  4C 00 F8     an      $0,&HF8
4A1E:  24 00        std     $0,(ix+$sx)
4A20:  26 0B        phs     $11
4A22:  42 0A 32     ld      $10,&H32
4A25:  77 65 49     cal     &H4965
4A28:  2E 0B        pps     $11
4A2A:  D6 00 8C 17  pre     ix,&H178C
4A2E:  2C 05        ldd     $5,(ix+$sx)
4A30:  6C 06 03     ldd     $6,(ix+&H03)
4A33:  01 2B        sbc     $11,$sy
4A35:  B4 07        jr      nz,&H4A3D
4A37:  41 05 10     sbc     $5,&H10
4A3A:  30 C1 4A     jp      z,&H4AC1
4A3D:  44 06 40     anc     $6,&H40
4A40:  34 DE 4B     jp      nz,&H4BDE
4A43:  41 06 30     sbc     $6,&H30
4A46:  B3 0B        jr      uz,&H4A52
4A48:  A6 06        phsw    $6
4A4A:  77 BC 28     cal     &H28BC
4A4D:  77 D1 45     cal     &H45D1
4A50:  AE 05        ppsw    $5
4A52:  41 05 24     sbc     $5,&H24
4A55:  34 00 4B     jp      nz,&H4B00
4A58:  04 26        anc     $6,$sy
4A5A:  B4 6C        jr      nz,&H4AC7
4A5C:  77 36 4E     cal     &H4E36
4A5F:  B4 61        jr      nz,&H4AC1
4A61:  D6 00 D5 19  pre     ix,&H19D5
4A65:  77 28 4D     cal     &H4D28
4A68:  B5 2E        jr      c,&H4A97
4A6A:  9E 00        gre     ix,$0
4A6C:  D6 00 74 17  pre     ix,&H1774
4A70:  42 02 02     ld      $2,&H02
4A73:  3A 02        sbc     (ix+$sx),$2
4A75:  B0 3D        jr      z,&H4AB3
4A77:  96 00        pre     ix,$0
4A79:  D1 00 0D 0A  ldw     $0,&H0A0D
4A7D:  A0 00        stw     $0,(ix+$sx)
4A7F:  02 18        ld      $24,$sx
4A81:  88 37        adw     $23,$sy
4A83:  88 37        adw     $23,$sy
4A85:  77 EE 33     cal     &H33EE
4A88:  82 73 1B     ldw     $19,$27
4A8B:  89 33        sbw     $19,$sy
4A8D:  82 60 17     ldw     $0,$23
4A90:  96 53        pre     iz,$19
4A92:  77 01 59     cal     &H5901
4A95:  B7 BA        jr      &H4A50
4A97:  B4 0A        jr      nz,&H4AA2
4A99:  77 A8 4C     cal     &H4CA8
4A9C:  34 74 2B     jp      nz,&H2B74
4A9F:  02 B8 9C     ld      $24,$sy,jr &H4A3D
4AA2:  01 37        sbc     $23,$sy
4AA4:  B5 1C        jr      c,&H4AC1
4AA6:  02 18        ld      $24,$sx
4AA8:  D6 00 86 17  pre     ix,&H1786
4AAC:  42 00 FF     ld      $0,&HFF
4AAF:  24 00        std     $0,(ix+$sx)
4AB1:  B7 AD        jr      &H4A5F
4AB3:  42 00 0D     ld      $0,&H0D
4AB6:  77 E0 4C     cal     &H4CE0
4AB9:  42 00 0A     ld      $0,&H0A
4ABC:  77 E0 4C     cal     &H4CE0
4ABF:  B7 E4        jr      &H4AA4
4AC1:  77 B8 4E     cal     &H4EB8
4AC4:  37 B3 46     jp      &H46B3
4AC7:  77 36 4E     cal     &H4E36
4ACA:  B4 8A        jr      nz,&H4A55
4ACC:  D1 00 D3 1A  ldw     $0,&H1AD3
4AD0:  D0 40 00 00  stw     &H0000,($sz)
4AD4:  D6 00 D5 19  pre     ix,&H19D5
4AD8:  77 28 4D     cal     &H4D28
4ADB:  B5 9B        jr      c,&H4A77
4ADD:  77 53 97     cal     &H9753
4AE0:  89 6E 0E     sbw     $14,$14
4AE3:  D6 00 D3 1A  pre     ix,&H1AD3
4AE7:  D6 40 D5 19  pre     iz,&H19D5
4AEB:  42 00 20     ld      $0,&H20
4AEE:  3B 00        sbc     (iz+$sx),$0
4AF0:  B5 AA        jr      c,&H4A9B
4AF2:  77 F7 4A     cal     &H4AF7
4AF5:  B7 AF        jr      &H4AA5
4AF7:  77 2C 1D     cal     &H1D2C
4AFA:  77 EE 33     cal     &H33EE
4AFD:  37 44 34     jp      &H3444
4B00:  D6 00 6E 17  pre     ix,&H176E
4B04:  A8 02        ldw     $2,(ix+$sx)
4B06:  41 05 90     sbc     $5,&H90
4B09:  B4 4E        jr      nz,&H4B58
4B0B:  A6 03        phsw    $3
4B0D:  D1 19 93 17  ldw     $25,&H1793
4B11:  77 69 4B     cal     &H4B69
4B14:  D6 00 6E 17  pre     ix,&H176E
4B18:  A8 05        ldw     $5,(ix+$sx)
4B1A:  D1 00 14 00  ldw     $0,&H0014
4B1E:  81 45        sbcw    $5,$sz
4B20:  34 84 2B     jp      nz,&H2B84
4B23:  AE 04        ppsw    $4
4B25:  A0 04        stw     $4,(ix+$sx)
4B27:  D6 00 A7 18  pre     ix,&H18A7
4B2B:  A8 19        ldw     $25,(ix+$sx)
4B2D:  D6 00 BB 18  pre     ix,&H18BB
4B31:  A8 1B        ldw     $27,(ix+$sx)
4B33:  77 C2 4B     cal     &H4BC2
4B36:  D6 40 BB 18  pre     iz,&H18BB
4B3A:  A9 02        ldw     $2,(iz+$sx)
4B3C:  D6 00 93 17  pre     ix,&H1793
4B40:  42 06 0A     ld      $6,&H0A
4B43:  AA 00        ldiw    $0,(ix+$sx)
4B45:  89 42        sbw     $2,$sz
4B47:  A5 A3        stdw    $3,(iz-$sy)
4B49:  09 26        sb      $6,$sy
4B4B:  B4 89        jr      nz,&H4AD5
4B4D:  82 79 02     ldw     $25,$2
4B50:  77 6F 4B     cal     &H4B6F
4B53:  77 02 34     cal     &H3402
4B56:  B7 0F        jr      &H4B66
4B58:  82 64 02     ldw     $4,$2
4B5B:  88 24        adw     $4,$sy
4B5D:  77 EE 33     cal     &H33EE
4B60:  77 C2 4B     cal     &H4BC2
4B63:  77 6F 4B     cal     &H4B6F
4B66:  37 C1 4A     jp      &H4AC1
4B69:  D1 08 30 24  ldw     $8,&H2430
4B6D:  B7 05        jr      &H4B73
4B6F:  D1 08 10 10  ldw     $8,&H1010
4B73:  77 38 89     cal     &H8938
4B76:  77 05 89     cal     &H8905
4B79:  02 47        ld      $7,$sz
4B7B:  01 48        sbc     $8,$sz
4B7D:  B0 06        jr      z,&H4B84
4B7F:  01 49        sbc     $9,$sz
4B81:  34 84 2B     jp      nz,&H2B84
4B84:  77 05 89     cal     &H8905
4B87:  22 20        sti     $0,(ix+$sy)
4B89:  A8 05        ldw     $5,(ix+$sx)
4B8B:  44 07 20     anc     $7,&H20
4B8E:  B0 19        jr      z,&H4BA8
4B90:  77 05 89     cal     &H8905
4B93:  02 45        ld      $5,$sz
4B95:  77 05 89     cal     &H8905
4B98:  02 46        ld      $6,$sz
4B9A:  D1 00 01 01  ldw     $0,&H0101
4B9E:  81 45        sbcw    $5,$sz
4BA0:  31 7C 2B     jp      nc,&H2B7C
4BA3:  42 00 02     ld      $0,&H02
4BA6:  A0 45        stw     $5,(ix+$sz)
4BA8:  D6 00 8F 17  pre     ix,&H178F
4BAC:  2C 08        ldd     $8,(ix+$sx)
4BAE:  89 25        sbw     $5,$sy
4BB0:  35 84 88     jp      c,&H8884
4BB3:  77 05 89     cal     &H8905
4BB6:  44 08 40     anc     $8,&H40
4BB9:  B4 8C        jr      nz,&H4B46
4BBB:  10 60 19     st      $0,($25)
4BBE:  88 39        adw     $25,$sy
4BC0:  B7 93        jr      &H4B54
4BC2:  C2 60 79     ldm     $0,$25,4
4BC5:  89 42        sbw     $2,$sz
4BC7:  81 62 04     sbcw    $2,$4
4BCA:  F0           rtn     z
4BCB:  B1 0C        jr      nc,&H4BD8
4BCD:  89 64 02     sbw     $4,$2
4BD0:  82 42        ldw     $2,$sz
4BD2:  82 60 04     ldw     $0,$4
4BD5:  37 B1 34     jp      &H34B1
4BD8:  89 62 04     sbw     $2,$4
4BDB:  37 EA 34     jp      &H34EA
4BDE:  41 05 24     sbc     $5,&H24
4BE1:  B0 1E        jr      z,&H4C00
4BE3:  41 05 10     sbc     $5,&H10
4BE6:  B0 16        jr      z,&H4BFD
4BE8:  41 05 90     sbc     $5,&H90
4BEB:  34 84 2B     jp      nz,&H2B84
4BEE:  D6 00 6E 17  pre     ix,&H176E
4BF2:  A8 0F        ldw     $15,(ix+$sx)
4BF4:  77 69 4B     cal     &H4B69
4BF7:  D6 00 6E 17  pre     ix,&H176E
4BFB:  A0 0F        stw     $15,(ix+$sx)
4BFD:  37 63 4B     jp      &H4B63
4C00:  77 69 4B     cal     &H4B69
4C03:  D6 00 6D 17  pre     ix,&H176D
4C07:  3A 1F        sbc     (ix+$sx),$31
4C09:  B0 8A        jr      z,&H4B94
4C0B:  37 C1 4A     jp      &H4AC1
4C0E:  D6 00 70 17  pre     ix,&H1770
4C12:  42 00 02     ld      $0,&H02
4C15:  7A 00 04     sbc     (ix+&H04),$0
4C18:  30 90 85     jp      z,&H8590
4C1B:  42 00 16     ld      $0,&H16
4C1E:  E8 42 80     ldm     $2,(ix+$sz),5
4C21:  01 02        sbc     $2,$sx
4C23:  34 BC 2B     jp      nz,&H2BBC
4C26:  11 70 03     ld      $16,($3)
4C29:  88 23        adw     $3,$sy
4C2B:  89 25        sbw     $5,$sy
4C2D:  E0 42 80     stm     $2,(ix+$sz),5
4C30:  26 10        phs     $16
4C32:  B4 12        jr      nz,&H4C45
4C34:  02 20        ld      $0,$sy
4C36:  7A 00 04     sbc     (ix+&H04),$0
4C39:  B4 0E        jr      nz,&H4C48
4C3B:  42 00 12     ld      $0,&H12
4C3E:  BA 43        sbcw    (ix+$sz),$3
4C40:  B4 0E        jr      nz,&H4C4F
4C42:  77 54 4C     cal     &H4C54
4C45:  2E 00        pps     $0
4C47:  F7           rtn   
4C48:  42 00 14     ld      $0,&H14
4C4B:  3A 5F        sbc     (ix+$sz),$31
4C4D:  B7 8E        jr      &H4BDC
4C4F:  7E 1E 16     sb      (ix+&H16),$30
4C52:  B7 8E        jr      &H4BE1
4C54:  D6 00 70 17  pre     ix,&H1770
4C58:  42 00 02     ld      $0,&H02
4C5B:  7A 00 04     sbc     (ix+&H04),$0
4C5E:  F0           rtn     z
4C5F:  B5 2E        jr      c,&H4C8E
4C61:  7E 1E 16     sb      (ix+&H16),$30
4C64:  77 77 48     cal     &H4877
4C67:  82 79 01     ldw     $25,$1
4C6A:  77 69 4B     cal     &H4B69
4C6D:  D6 00 6D 17  pre     ix,&H176D
4C71:  E8 02 40     ldm     $2,(ix+$sx),3
4C74:  D6 00 70 17  pre     ix,&H1770
4C78:  60 02 14     st      $2,(ix+&H14)
4C7B:  42 00 19     ld      $0,&H19
4C7E:  A0 43        stw     $3,(ix+$sz)
4C80:  00 22        adc     $2,$sy
4C82:  B1 05        jr      nc,&H4C88
4C84:  81 23        sbcw    $3,$sy
4C86:  B5 03        jr      c,&H4C8A
4C88:  02 02        ld      $2,$sx
4C8A:  60 02 16     st      $2,(ix+&H16)
4C8D:  F7           rtn   
4C8E:  77 A5 82     cal     &H82A5
4C91:  D6 00 70 17  pre     ix,&H1770
4C95:  60 1F 16     st      $31,(ix+&H16)
4C98:  81 3A        sbcw    $26,$sy
4C9A:  B5 09        jr      c,&H4CA4
4C9C:  42 00 19     ld      $0,&H19
4C9F:  A0 5A        stw     $26,(ix+$sz)
4CA1:  37 77 48     jp      &H4877
4CA4:  7E 1E 16     sb      (ix+&H16),$30
4CA7:  F7           rtn   
4CA8:  9E 05        gre     ix,$5
4CAA:  D6 00 70 17  pre     ix,&H1770
4CAE:  E8 21 60     ldm     $1,(ix+$sy),4
4CB1:  96 05        pre     ix,$5
4CB3:  01 02        sbc     $2,$sx
4CB5:  F7           rtn   
4CB6:  9E 05        gre     ix,$5
4CB8:  D6 00 8F 17  pre     ix,&H178F
4CBC:  2C 01        ldd     $1,(ix+$sx)
4CBE:  96 05        pre     ix,$5
4CC0:  04 21        anc     $1,$sy
4CC2:  F7           rtn   
4CC3:  01 15        sbc     $21,$sx
4CC5:  F0           rtn     z
4CC6:  77 A8 4C     cal     &H4CA8
4CC9:  F4           rtn     nz
4CCA:  41 04 02     sbc     $4,&H02
4CCD:  F0           rtn     z
4CCE:  77 B6 4C     cal     &H4CB6
4CD1:  F4           rtn     nz
4CD2:  9E 05        gre     ix,$5
4CD4:  D6 00 86 17  pre     ix,&H1786
4CD8:  38 1E        adc     (ix+$sx),$30
4CDA:  96 05        pre     ix,$5
4CDC:  F7           rtn   
4CDD:  01 1E        sbc     $30,$sx
4CDF:  F7           rtn   
4CE0:  9E 01        gre     ix,$1
4CE2:  E6 17 40     phsm    $23,3
4CE5:  E6 02 40     phsm    $2,3
4CE8:  77 EE 33     cal     &H33EE
4CEB:  82 73 1B     ldw     $19,$27
4CEE:  89 33        sbw     $19,$sy
4CF0:  82 20        ldw     $0,$sy
4CF2:  82 62 13     ldw     $2,$19
4CF5:  77 B1 34     cal     &H34B1
4CF8:  EE 00 40     ppsm    $0,3
4CFB:  10 60 13     st      $0,($19)
4CFE:  EE 15 40     ppsm    $21,3
4D01:  96 01        pre     ix,$1
4D03:  F7           rtn   
4D04:  77 B6 4C     cal     &H4CB6
4D07:  B4 2A        jr      nz,&H4D32
4D09:  B7 1B        jr      &H4D25
4D0B:  01 15        sbc     $21,$sx
4D0D:  B0 24        jr      z,&H4D32
4D0F:  77 A8 4C     cal     &H4CA8
4D12:  B4 1F        jr      nz,&H4D32
4D14:  41 04 02     sbc     $4,&H02
4D17:  B4 94        jr      nz,&H4CAC
4D19:  D1 00 3D 17  ldw     $0,&H173D
4D1D:  11 42        ld      $2,($sz)
4D1F:  04 22        anc     $2,$sy
4D21:  B0 10        jr      z,&H4D32
4D23:  02 17        ld      $23,$sx
4D25:  01 3F        sbc     $31,$sy
4D27:  F7           rtn   
4D28:  0D 95 03     na      $21,$sx,jr &H4D2D
4D2B:  02 15        ld      $21,$sx
4D2D:  9E 5C        gre     iz,$28
4D2F:  89 76 16     sbw     $22,$22
4D32:  77 C3 4C     cal     &H4CC3
4D35:  B5 91        jr      c,&H4CC7
4D37:  77 DC 4D     cal     &H4DDC
4D3A:  41 00 1A     sbc     $0,&H1A
4D3D:  B0 B3        jr      z,&H4CF1
4D3F:  41 00 0D     sbc     $0,&H0D
4D42:  30 CA 4D     jp      z,&H4DCA
4D45:  01 15        sbc     $21,$sx
4D47:  B4 10        jr      nz,&H4D58
4D49:  41 00 22     sbc     $0,&H22
4D4C:  B0 56        jr      z,&H4DA3
4D4E:  41 00 2C     sbc     $0,&H2C
4D51:  B0 4B        jr      z,&H4D9D
4D53:  41 00 20     sbc     $0,&H20
4D56:  B0 36        jr      z,&H4D8D
4D58:  41 00 7F     sbc     $0,&H7F
4D5B:  B0 AA        jr      z,&H4D06
4D5D:  41 00 20     sbc     $0,&H20
4D60:  B5 AF        jr      c,&H4D10
4D62:  77 A8 4C     cal     &H4CA8
4D65:  B4 10        jr      nz,&H4D76
4D67:  41 04 02     sbc     $4,&H02
4D6A:  B4 0B        jr      nz,&H4D76
4D6C:  77 B6 4C     cal     &H4CB6
4D6F:  B4 06        jr      nz,&H4D76
4D71:  77 E0 4C     cal     &H4CE0
4D74:  B7 C3        jr      &H4D38
4D76:  22 00        sti     $0,(ix+$sx)
4D78:  08 37        ad      $23,$sy
4D7A:  B4 C9        jr      nz,&H4D44
4D7C:  77 A8 4C     cal     &H4CA8
4D7F:  34 74 2B     jp      nz,&H2B74
4D82:  77 B6 4C     cal     &H4CB6
4D85:  34 74 2B     jp      nz,&H2B74
4D88:  09 37        sb      $23,$sy
4D8A:  08 37        ad      $23,$sy
4D8C:  F7           rtn   
4D8D:  01 17        sbc     $23,$sx
4D8F:  B0 DE        jr      z,&H4D6E
4D91:  D6 40 7F 16  pre     iz,&H167F
4D95:  29 01        ld      $1,(iz+$sx)
4D97:  01 01        sbc     $1,$sx
4D99:  B2 B8        jr      lz,&H4D52
4D9B:  B7 0F        jr      &H4DAB
4D9D:  01 16        sbc     $22,$sx
4D9F:  B4 BE        jr      nz,&H4D5E
4DA1:  B7 35        jr      &H4DD7
4DA3:  01 17        sbc     $23,$sx
4DA5:  B0 14        jr      z,&H4DBA
4DA7:  01 16        sbc     $22,$sx
4DA9:  B0 C8        jr      z,&H4D72
4DAB:  77 E5 4D     cal     &H4DE5
4DAE:  B4 28        jr      nz,&H4DD7
4DB0:  41 00 20     sbc     $0,&H20
4DB3:  B4 09        jr      nz,&H4DBD
4DB5:  77 DC 4D     cal     &H4DDC
4DB8:  B7 8E        jr      &H4D47
4DBA:  09 B6 DA     sb      $22,$sy,jr &H4D96
4DBD:  41 00 2C     sbc     $0,&H2C
4DC0:  B0 13        jr      z,&H4DD4
4DC2:  41 00 0D     sbc     $0,&H0D
4DC5:  B4 11        jr      nz,&H4DD7
4DC7:  77 DC 4D     cal     &H4DDC
4DCA:  77 ED 4D     cal     &H4DED
4DCD:  B4 09        jr      nz,&H4DD7
4DCF:  41 00 0A     sbc     $0,&H0A
4DD2:  B4 04        jr      nz,&H4DD7
4DD4:  77 DC 4D     cal     &H4DDC
4DD7:  24 1F        std     $31,(ix+$sx)
4DD9:  01 1F        sbc     $31,$sx
4DDB:  F7           rtn   
4DDC:  9E 01        gre     ix,$1
4DDE:  A6 02        phsw    $2
4DE0:  77 0E 4C     cal     &H4C0E
4DE3:  B7 21        jr      &H4E05
4DE5:  9E 01        gre     ix,$1
4DE7:  A6 02        phsw    $2
4DE9:  02 21        ld      $1,$sy
4DEB:  B7 07        jr      &H4DF3
4DED:  9E 01        gre     ix,$1
4DEF:  A6 02        phsw    $2
4DF1:  02 01        ld      $1,$sx
4DF3:  D6 00 70 17  pre     ix,&H1770
4DF7:  42 00 02     ld      $0,&H02
4DFA:  7A 00 04     sbc     (ix+&H04),$0
4DFD:  B0 0C        jr      z,&H4E0A
4DFF:  77 3A 4E     cal     &H4E3A
4E02:  11 60 05     ld      $0,($5)
4E05:  AE 01        ppsw    $1
4E07:  96 01        pre     ix,$1
4E09:  F7           rtn   
4E0A:  26 01        phs     $1
4E0C:  77 6E 50     cal     &H506E
4E0F:  D6 00 59 15  pre     ix,&H1559
4E13:  78 9F 02     adc     (ix-&H02),$31
4E16:  34 2F 4E     jp      nz,&H4E2F
4E19:  38 1F        adc     (ix+$sx),$31
4E1B:  2E 01        pps     $1
4E1D:  B0 0B        jr      z,&H4E29
4E1F:  AA 00        ldiw    $0,(ix+$sx)
4E21:  09 41        sb      $1,$sz
4E23:  28 60 01     ld      $0,(ix+$1)
4E26:  01 C0 A3     sbc     $0,$sz,jr &H4DCB
4E29:  01 21        sbc     $1,$sy
4E2B:  B0 A2        jr      z,&H4DCE
4E2D:  B7 A9        jr      &H4DD7
4E2F:  D6 00 58 15  pre     ix,&H1558
4E33:  37 E7 85     jp      &H85E7
4E36:  D6 00 70 17  pre     ix,&H1770
4E3A:  42 00 14     ld      $0,&H14
4E3D:  E8 42 80     ldm     $2,(ix+$sz),5
4E40:  01 04        sbc     $4,$sx
4E42:  F7           rtn   
4E43:  77 3C 00     cal     &H003C
4E46:  35 88 2B     jp      c,&H2B88
4E49:  77 99 4F     cal     &H4F99
4E4C:  26 11        phs     $17
4E4E:  77 D9 4F     cal     &H4FD9
4E51:  2E 11        pps     $17
4E53:  09 71 14     sb      $17,$20
4E56:  41 0B 02     sbc     $11,&H02
4E59:  B0 63        jr      z,&H4EBD
4E5B:  B5 4B        jr      c,&H4EA7
4E5D:  D6 00 3D 17  pre     ix,&H173D
4E61:  28 10        ld      $16,(ix+$sx)
4E63:  82 2C        ldw     $12,$sy
4E65:  04 36        anc     $22,$sy
4E67:  B0 3B        jr      z,&H4EA3
4E69:  4C 16 FE     an      $22,&HFE
4E6C:  4C 10 FD     an      $16,&HFD
4E6F:  0E 76 10     or      $22,$16
4E72:  D6 00 90 17  pre     ix,&H1790
4E76:  24 16        std     $22,(ix+$sx)
4E78:  42 00 60     ld      $0,&H60
4E7B:  44 16 04     anc     $22,&H04
4E7E:  B0 04        jr      z,&H4E83
4E80:  42 00 A0     ld      $0,&HA0
4E83:  0E 4C        or      $12,$sz
4E85:  77 BE 4F     cal     &H4FBE
4E88:  42 01 08     ld      $1,&H08
4E8B:  D6 00 5E 16  pre     ix,&H165E
4E8F:  09 31        sb      $17,$sy
4E91:  B5 26        jr      c,&H4EB8
4E93:  2B 00        ldi     $0,(iz+$sx)
4E95:  41 00 3A     sbc     $0,&H3A
4E98:  30 88 2B     jp      z,&H2B88
4E9B:  22 00        sti     $0,(ix+$sx)
4E9D:  09 21        sb      $1,$sy
4E9F:  B4 91        jr      nz,&H4E31
4EA1:  B7 16        jr      &H4EB8
4EA3:  4C 90 F9 B7  an      $16,&HF9,jr &H4E5D
4EA7:  02 2A        ld      $10,$sy
4EA9:  9E 4F        gre     iz,$15
4EAB:  26 0B        phs     $11
4EAD:  D1 00 5E 16  ldw     $0,&H165E
4EB1:  96 0F        pre     ix,$15
4EB3:  77 13 7E     cal     &H7E13
4EB6:  2E 0B        pps     $11
4EB8:  AF 00        ppuw    $0
4EBA:  96 40        pre     iz,$0
4EBC:  F7           rtn   
4EBD:  D6 00 3E 17  pre     ix,&H173E
4EC1:  A8 0C        ldw     $12,(ix+$sx)
4EC3:  77 8E 4F     cal     &H4F8E
4EC6:  B5 7B        jr      c,&H4F42
4EC8:  B0 1A        jr      z,&H4EE3
4ECA:  77 2B 00     cal     &H002B
4ECD:  B1 31        jr      nc,&H4EFF
4ECF:  41 00 37     sbc     $0,&H37
4ED2:  B1 2C        jr      nc,&H4EFF
4ED4:  40 00 CF     adc     $0,&HCF
4ED7:  B1 27        jr      nc,&H4EFF
4ED9:  1B 40        inv     $0
4EDB:  1A 20        diu     $0
4EDD:  77 83 4F     cal     &H4F83
4EE0:  77 76 4F     cal     &H4F76
4EE3:  77 8E 4F     cal     &H4F8E
4EE6:  B5 5B        jr      c,&H4F42
4EE8:  B0 1C        jr      z,&H4F05
4EEA:  4C 0C F9     an      $12,&HF9
4EED:  41 00 45     sbc     $0,&H45
4EF0:  B0 11        jr      z,&H4F02
4EF2:  4E 0C 02     or      $12,&H02
4EF5:  49 00 4F     sb      $0,&H4F
4EF8:  B0 09        jr      z,&H4F02
4EFA:  4E 0C 04     or      $12,&H04
4EFD:  00 20        adc     $0,$sy
4EFF:  31 70 2B     jp      nc,&H2B70
4F02:  77 76 4F     cal     &H4F76
4F05:  42 02 F7     ld      $2,&HF7
4F08:  D1 03 37 38  ldw     $3,&H3837
4F0C:  77 4E 4F     cal     &H4F4E
4F0F:  42 02 EF     ld      $2,&HEF
4F12:  D1 03 31 32  ldw     $3,&H3231
4F16:  77 4E 4F     cal     &H4F4E
4F19:  42 04 4E     ld      $4,&H4E
4F1C:  D1 02 FB 43  ldw     $2,&H43FB
4F20:  77 4E 4F     cal     &H4F4E
4F23:  D1 02 F7 44  ldw     $2,&H44F7
4F27:  77 4E 4F     cal     &H4F4E
4F2A:  D1 02 EF 43  ldw     $2,&H43EF
4F2E:  77 4E 4F     cal     &H4F4E
4F31:  D1 02 FD 42  ldw     $2,&H42FD
4F35:  77 4E 4F     cal     &H4F4E
4F38:  D1 02 FE 53  ldw     $2,&H53FE
4F3C:  77 4E 4F     cal     &H4F4E
4F3F:  77 93 00     cal     &H0093
4F42:  E6 0D 40     phsm    $13,3
4F45:  77 BE 4F     cal     &H4FBE
4F48:  EE 0B 40     ppsm    $11,3
4F4B:  37 B8 4E     jp      &H4EB8
4F4E:  77 8E 4F     cal     &H4F8E
4F51:  B5 2D        jr      c,&H4F7F
4F53:  F0           rtn     z
4F54:  41 04 4E     sbc     $4,&H4E
4F57:  B0 05        jr      z,&H4F5D
4F59:  0C EC 02 04  an      $12,$2,jr &H4F60
4F5D:  0C 6D 02     an      $13,$2
4F60:  01 44        sbc     $4,$sz
4F62:  B0 13        jr      z,&H4F76
4F64:  1B 42        inv     $2
4F66:  41 04 4E     sbc     $4,&H4E
4F69:  B0 05        jr      z,&H4F6F
4F6B:  0E EC 02 04  or      $12,$2,jr &H4F72
4F6F:  0E 6D 02     or      $13,$2
4F72:  01 43        sbc     $3,$sz
4F74:  B4 07        jr      nz,&H4F7C
4F76:  2D 20        ldd     $0,(iz+$sy)
4F78:  77 C3 00     cal     &H00C3
4F7B:  F0           rtn     z
4F7C:  37 93 00     jp      &H0093
4F7F:  AE 00        ppsw    $0
4F81:  B7 C0        jr      &H4F42
4F83:  18 60        biu     $0
4F85:  4C 00 E0     an      $0,&HE0
4F88:  4C 0C 1F     an      $12,&H1F
4F8B:  0E 4C        or      $12,$sz
4F8D:  F7           rtn   
4F8E:  77 C3 00     cal     &H00C3
4F91:  F0           rtn     z
4F92:  77 B6 00     cal     &H00B6
4F95:  41 00 03     sbc     $0,&H03
4F98:  F7           rtn   
4F99:  77 D2 11     cal     &H11D2
4F9C:  77 5D 12     cal     &H125D
4F9F:  77 B3 28     cal     &H28B3
4FA2:  9E 40        gre     iz,$0
4FA4:  A7 01        phuw    $1
4FA6:  96 4F        pre     iz,$15
4FA8:  F7           rtn   
4FA9:  D6 00 75 17  pre     ix,&H1775
4FAD:  D1 00 5E 16  ldw     $0,&H165E
4FB1:  42 03 0C     ld      $3,&H0C
4FB4:  09 23        sb      $3,$sy
4FB6:  F0           rtn     z
4FB7:  11 42        ld      $2,($sz)
4FB9:  22 02        sti     $2,(ix+$sx)
4FBB:  88 A0 89     adw     $0,$sy,jr &H4F46
4FBE:  D1 02 93 14  ldw     $2,&H1493
4FC2:  D1 00 5E 16  ldw     $0,&H165E
4FC6:  D1 04 0B 00  ldw     $4,&H000B
4FCA:  37 BB 0E     jp      &H0EBB
4FCD:  77 CD 00     cal     &H00CD
4FD0:  77 C3 0E     cal     &H0EC3
4FD3:  01 2F        sbc     $15,$sy
4FD5:  F0           rtn     z
4FD6:  37 8C 2B     jp      &H2B8C
4FD9:  1E 64        gst     ua,$4
4FDB:  56 60 64     pst     ua,&H64
4FDE:  D1 05 62 15  ldw     $5,&H1562
4FE2:  D1 16 04 00  ldw     $22,&H0004
4FE6:  42 07 06     ld      $7,&H06
4FE9:  02 71 07     ld      $17,$7
4FEC:  9E 4F        gre     iz,$15
4FEE:  77 82 0A     cal     &H0A82
4FF1:  B0 0D        jr      z,&H4FFF
4FF3:  D1 00 06 00  ldw     $0,&H0006
4FF7:  88 45        adw     $5,$sz
4FF9:  09 36        sb      $22,$sy
4FFB:  B4 96        jr      nz,&H4F92
4FFD:  B7 03        jr      &H5001
4FFF:  02 37        ld      $23,$sy
5001:  D6 00 9E 14  pre     ix,&H149E
5005:  EA 13 60     ldim    $19,(ix+$sx),4
5008:  02 6B 15     ld      $11,$21
500B:  01 13        sbc     $19,$sx
500D:  B0 1E        jr      z,&H502C
500F:  02 67 14     ld      $7,$20
5012:  02 71 14     ld      $17,$20
5015:  9E 05        gre     ix,$5
5017:  9E 4F        gre     iz,$15
5019:  77 82 0A     cal     &H0A82
501C:  B0 0C        jr      z,&H5029
501E:  96 05        pre     ix,$5
5020:  2C 60 14     ldd     $0,(ix+$20)
5023:  09 33        sb      $19,$sy
5025:  B0 A1        jr      z,&H4FC7
5027:  B7 99        jr      &H4FC1
5029:  2D 60 14     ldd     $0,(iz+$20)
502C:  16 64        pst     ua,$4
502E:  04 37        anc     $23,$sy
5030:  F0           rtn     z
5031:  04 36        anc     $22,$sy
5033:  34 70 2B     jp      nz,&H2B70
5036:  F7           rtn   
5037:  77 72 29     cal     &H2972
503A:  F4           rtn     nz
503B:  B7 05        jr      &H5041
503D:  77 4A 50     cal     &H504A
5040:  F0           rtn     z
5041:  37 A8 2B     jp      &H2BA8
5044:  77 4A 50     cal     &H504A
5047:  F4           rtn     nz
5048:  B7 88        jr      &H4FD1
504A:  D6 00 C6 16  pre     ix,&H16C6
504E:  2C 01        ldd     $1,(ix+$sx)
5050:  04 21        anc     $1,$sy
5052:  F7           rtn   
5053:  77 37 50     cal     &H5037
5056:  77 3D 50     cal     &H503D
5059:  37 9B 52     jp      &H529B
505C:  77 6E 50     cal     &H506E
505F:  F4           rtn     nz
5060:  77 2E 03     cal     &H032E
5063:  77 C8 23     cal     &H23C8
5066:  41 00 E9     sbc     $0,&HE9
5069:  B0 87        jr      z,&H4FF1
506B:  37 1B 03     jp      &H031B
506E:  77 C5 29     cal     &H29C5
5071:  42 00 46     ld      $0,&H46
5074:  77 81 03     cal     &H0381
5077:  01 02        sbc     $2,$sx
5079:  F4           rtn     nz
507A:  41 01 04     sbc     $1,&H04
507D:  F4           rtn     nz
507E:  D6 00 15 11  pre     ix,&H1115
5082:  E0 20 40     stm     $0,(ix+$sy),3
5085:  77 58 04     cal     &H0458
5088:  01 1F        sbc     $31,$sx
508A:  F7           rtn   
508B:  02 0D        ld      $13,$sx
508D:  D6 00 00 10  pre     ix,&H1000
5091:  2D 20        ldd     $0,(iz+$sy)
5093:  77 B2 50     cal     &H50B2
5096:  42 05 20     ld      $5,&H20
5099:  3B 05        sbc     (iz+$sx),$5
509B:  B4 11        jr      nz,&H50AD
509D:  2B 05        ldi     $5,(iz+$sx)
509F:  01 05        sbc     $5,$sx
50A1:  F0           rtn     z
50A2:  41 05 20     sbc     $5,&H20
50A5:  B1 07        jr      nc,&H50AD
50A7:  77 DB 50     cal     &H50DB
50AA:  B1 8E        jr      nc,&H5039
50AC:  F7           rtn   
50AD:  22 05        sti     $5,(ix+$sx)
50AF:  08 AD 87     ad      $13,$sy,jr &H5038
50B2:  AB 03        ldiw    $3,(iz+$sx)
50B4:  C9 6E 4E     sbbm    $14,$14,3
50B7:  77 B4 0A     cal     &H0AB4
50BA:  D1 0B 05 00  ldw     $11,&H0005
50BE:  4C 10 0F     an      $16,&H0F
50C1:  B4 0D        jr      nz,&H50CF
50C3:  01 0C        sbc     $12,$sx
50C5:  B4 0B        jr      nz,&H50D1
50C7:  DA 2E 40     dium    $14,3
50CA:  09 2B        sb      $11,$sy
50CC:  B4 8F        jr      nz,&H505C
50CE:  F7           rtn   
50CF:  02 2C        ld      $12,$sy
50D1:  48 10 30     ad      $16,&H30
50D4:  22 10        sti     $16,(ix+$sx)
50D6:  08 2D        ad      $13,$sy
50D8:  B1 92        jr      nc,&H506B
50DA:  F7           rtn   
50DB:  41 05 02     sbc     $5,&H02
50DE:  B1 19        jr      nc,&H50F8
50E0:  A9 05        ldw     $5,(iz+$sx)
50E2:  41 05 07     sbc     $5,&H07
50E5:  B4 06        jr      nz,&H50EC
50E7:  41 06 48     sbc     $6,&H48
50EA:  B0 09        jr      z,&H50F4
50EC:  42 05 3A     ld      $5,&H3A
50EF:  22 05        sti     $5,(ix+$sx)
50F1:  08 2D        ad      $13,$sy
50F3:  F7           rtn   
50F4:  AB 05        ldiw    $5,(iz+$sx)
50F6:  B7 0E        jr      &H5105
50F8:  B4 05        jr      nz,&H50FE
50FA:  42 85 27 8E  ld      $5,&H27,jr &H508B
50FE:  41 05 03     sbc     $5,&H03
5101:  B0 D0        jr      z,&H50D2
5103:  2B 06        ldi     $6,(iz+$sx)
5105:  41 05 05     sbc     $5,&H05
5108:  B4 19        jr      nz,&H5122
510A:  41 06 71     sbc     $6,&H71
510D:  B5 14        jr      c,&H5122
510F:  41 06 77     sbc     $6,&H77
5112:  B1 0F        jr      nc,&H5122
5114:  49 06 06     sb      $6,&H06
5117:  A6 06        phsw    $6
5119:  42 06 9B     ld      $6,&H9B
511C:  77 22 51     cal     &H5122
511F:  AE 05        ppsw    $5
5121:  F5           rtn     c
5122:  1E 63        gst     ua,$3
5124:  9E 4E        gre     iz,$14
5126:  56 60 94     pst     ua,&H94
5129:  41 05 08     sbc     $5,&H08
512C:  B1 40        jr      nc,&H516D
512E:  41 06 C8     sbc     $6,&HC8
5131:  B1 3B        jr      nc,&H516D
5133:  49 05 04     sb      $5,&H04
5136:  B5 36        jr      c,&H516D
5138:  18 65        biu     $5
513A:  D6 40 A1 0F  pre     iz,&H0FA1
513E:  A9 67 05     ldw     $7,(iz+$5)
5141:  02 60 06     ld      $0,$6
5144:  49 00 47     sb      $0,&H47
5147:  B5 25        jr      c,&H516D
5149:  02 01        ld      $1,$sx
514B:  98 60        biuw    $0
514D:  88 47        adw     $7,$sz
514F:  96 47        pre     iz,$7
5151:  A9 07        ldw     $7,(iz+$sx)
5153:  96 47        pre     iz,$7
5155:  2B 05        ldi     $5,(iz+$sx)
5157:  4C 05 7F     an      $5,&H7F
515A:  22 05        sti     $5,(ix+$sx)
515C:  08 2D        ad      $13,$sy
515E:  B5 09        jr      c,&H5168
5160:  29 A5        ld      $5,(iz-$sy)
5162:  18 65        biu     $5
5164:  B1 90        jr      nc,&H50F5
5166:  01 1E        sbc     $30,$sx
5168:  96 4E        pre     iz,$14
516A:  16 63        pst     ua,$3
516C:  F7           rtn   
516D:  D6 40 AE 0E  pre     iz,&H0EAE
5171:  B7 9D        jr      &H510F
5173:  82 6F 04     ldw     $15,$4
5176:  77 EE 33     cal     &H33EE
5179:  37 8C 0B     jp      &H0B8C
517C:  D6 00 39 17  pre     ix,&H1739
5180:  2C 00        ldd     $0,(ix+$sx)
5182:  44 00 06     anc     $0,&H06
5185:  30 E8 2A     jp      z,&H2AE8
5188:  77 44 2B     cal     &H2B44
518B:  02 11        ld      $17,$sx
518D:  48 11 0E     ad      $17,&H0E
5190:  B5 0B        jr      c,&H519C
5192:  01 60 11     sbc     $0,$17
5195:  B1 89        jr      nc,&H511F
5197:  09 51        sb      $17,$sz
5199:  37 AE 3F     jp      &H3FAE
519C:  02 91 87     ld      $17,$sx,jr &H5125
519F:  42 01 F0     ld      $1,&HF0
51A2:  48 01 10     ad      $1,&H10
51A5:  49 00 0A     sb      $0,&H0A
51A8:  B1 87        jr      nc,&H5130
51AA:  48 00 0A     ad      $0,&H0A
51AD:  08 60 01     ad      $0,$1
51B0:  F7           rtn   
51B1:  77 B8 06     cal     &H06B8
51B4:  E4 08 E0     stdm    $8,(ix+$sx),8
51B7:  24 A0        std     $0,(ix-$sy)
51B9:  F7           rtn   
51BA:  42 01 2A     ld      $1,&H2A
51BD:  77 D1 00     cal     &H00D1
51C0:  30 2E 8A     jp      z,&H8A2E
51C3:  77 93 00     cal     &H0093
51C6:  77 DB 2A     cal     &H2ADB
51C9:  D6 00 3B 17  pre     ix,&H173B
51CD:  2C 01        ldd     $1,(ix+$sx)
51CF:  D6 00 E9 16  pre     ix,&H16E9
51D3:  2C 00        ldd     $0,(ix+$sx)
51D5:  D6 00 10 25  pre     ix,&H2510
51D9:  77 12 65     cal     &H6512
51DC:  77 31 52     cal     &H5231
51DF:  77 C6 7C     cal     &H7CC6
51E2:  77 86 7B     cal     &H7B86
51E5:  77 29 52     cal     &H5229
51E8:  77 C6 7C     cal     &H7CC6
51EB:  D1 11 28 25  ldw     $17,&H2528
51EF:  77 20 65     cal     &H6520
51F2:  77 23 52     cal     &H5223
51F5:  77 C6 7C     cal     &H7CC6
51F8:  77 20 65     cal     &H6520
51FB:  77 3F 52     cal     &H523F
51FE:  77 C6 7C     cal     &H7CC6
5201:  77 20 65     cal     &H6520
5204:  77 45 52     cal     &H5245
5207:  77 C6 7C     cal     &H7CC6
520A:  37 E8 2A     jp      &H2AE8
520D:  41 0F 05     sbc     $15,&H05
5210:  B0 34        jr      z,&H5245
5212:  31 A4 2B     jp      nc,&H2BA4
5215:  41 0F 03     sbc     $15,&H03
5218:  B0 18        jr      z,&H5231
521A:  B1 24        jr      nc,&H523F
521C:  09 2F        sb      $15,$sy
521E:  35 A4 2B     jp      c,&H2BA4
5221:  B4 07        jr      nz,&H5229
5223:  D6 00 CF 18  pre     ix,&H18CF
5227:  B7 21        jr      &H5249
5229:  D6 00 97 18  pre     ix,&H1897
522D:  A8 0D        ldw     $13,(ix+$sx)
522F:  B7 07        jr      &H5237
5231:  D6 00 A3 18  pre     ix,&H18A3
5235:  A8 0D        ldw     $13,(ix+$sx)
5237:  D6 00 A7 18  pre     ix,&H18A7
523B:  A8 0F        ldw     $15,(ix+$sx)
523D:  B7 0E        jr      &H524C
523F:  D6 00 99 18  pre     ix,&H1899
5243:  B7 05        jr      &H5249
5245:  D6 00 A5 18  pre     ix,&H18A5
5249:  E8 0D 60     ldm     $13,(ix+$sx),4
524C:  89 6F 0D     sbw     $15,$13
524F:  82 63 0F     ldw     $3,$15
5252:  F7           rtn   
5253:  77 C6 0E     cal     &H0EC6
5256:  77 0D 52     cal     &H520D
5259:  37 7E 18     jp      &H187E
525C:  77 D2 11     cal     &H11D2
525F:  96 0F        pre     ix,$15
5261:  C9 68 E8     sbbm    $8,$8,8
5264:  42 80 08 04  ld      $0,&H08,jr &H526B
5268:  DA 4F E0     bydm    $15,8
526B:  01 11        sbc     $17,$sx
526D:  B0 05        jr      z,&H5273
526F:  09 31        sb      $17,$sy
5271:  2A 0F        ldi     $15,(ix+$sx)
5273:  09 20        sb      $0,$sy
5275:  B4 8E        jr      nz,&H5204
5277:  01 08        sbc     $8,$sx
5279:  30 70 2B     jp      z,&H2B70
527C:  DB 48 E0     invm    $8,8
527F:  77 94 52     cal     &H5294
5282:  B0 0D        jr      z,&H5290
5284:  E8 00 E0     ldm     $0,(ix+$sx),8
5287:  CF 48 E0     xrm     $8,$sz,8
528A:  34 B8 2B     jp      nz,&H2BB8
528D:  DB 48 E0     invm    $8,8
5290:  E0 08 E0     stm     $8,(ix+$sx),8
5293:  F7           rtn   
5294:  D6 00 83 16  pre     ix,&H1683
5298:  38 1E        adc     (ix+$sx),$30
529A:  F7           rtn   
529B:  77 94 52     cal     &H5294
529E:  34 B8 2B     jp      nz,&H2BB8
52A1:  F7           rtn   
52A2:  77 C3 0E     cal     &H0EC3
52A5:  41 0F 04     sbc     $15,&H04
52A8:  B5 4A        jr      c,&H52F3
52AA:  41 0F 09     sbc     $15,&H09
52AD:  B1 24        jr      nc,&H52D2
52AF:  77 93 00     cal     &H0093
52B2:  02 60 0F     ld      $0,$15
52B5:  41 00 02     sbc     $0,&H02
52B8:  B5 14        jr      c,&H52CD
52BA:  41 00 07     sbc     $0,&H07
52BD:  B5 08        jr      c,&H52C6
52BF:  D6 00 3B 17  pre     ix,&H173B
52C3:  0C A0 08     an      $0,$sy,jr &H52CD
52C6:  D6 00 32 11  pre     ix,&H1132
52CA:  49 00 04     sb      $0,&H04
52CD:  24 00        std     $0,(ix+$sx)
52CF:  37 8A 92     jp      &H928A
52D2:  49 0F 0A     sb      $15,&H0A
52D5:  B5 1D        jr      c,&H52F3
52D7:  41 0F 02     sbc     $15,&H02
52DA:  B1 08        jr      nc,&H52E3
52DC:  D6 00 33 11  pre     ix,&H1133
52E0:  0C AF B3     an      $15,$sy,jr &H5295
52E3:  41 0F 64     sbc     $15,&H64
52E6:  B0 0F        jr      z,&H52F6
52E8:  49 0F BE     sb      $15,&HBE
52EB:  30 3A 82     jp      z,&H823A
52EE:  09 2F        sb      $15,$sy
52F0:  30 3E 82     jp      z,&H823E
52F3:  37 A4 2B     jp      &H2BA4
52F6:  77 E1 00     cal     &H00E1
52F9:  77 DF 0E     cal     &H0EDF
52FC:  77 C7 00     cal     &H00C7
52FF:  1F 20        gst     ie,$0
5301:  9E 41        gre     iz,$1
5303:  E6 02 40     phsm    $2,3
5306:  17 3F        pst     ie,$31
5308:  D1 00 12 53  ldw     $0,&H5312
530C:  A6 01        phsw    $1
530E:  56 60 55     pst     ua,&H55
5311:  DE 0F        jp      $15
5313:  EE 00 40     ppsm    $0,3
5316:  96 41        pre     iz,$1
5318:  17 20        pst     ie,$0
531A:  D6 60 D0 1C  pre     us,&H1CD0
531E:  F7           rtn   
531F:  9E 3C        gre     iy,$28
5321:  77 28 53     cal     &H5328
5324:  56 60 55     pst     ua,&H55
5327:  F7           rtn   
5328:  DE 1C        jp      $28
532A:  77 49 00     cal     &H0049
532D:  77 B6 00     cal     &H00B6
5330:  82 0F        ldw     $15,$sx
5332:  77 4D 00     cal     &H004D
5335:  41 10 4E     sbc     $16,&H4E
5338:  B0 20        jr      z,&H5359
533A:  49 10 45     sb      $16,&H45
533D:  42 01 20     ld      $1,&H20
5340:  B0 09        jr      z,&H534A
5342:  42 01 10     ld      $1,&H10
5345:  09 30        sb      $16,$sy
5347:  34 70 2B     jp      nz,&H2B70
534A:  26 01        phs     $1
534C:  77 C3 0E     cal     &H0EC3
534F:  2E 00        pps     $0
5351:  41 0F 0A     sbc     $15,&H0A
5354:  31 A4 2B     jp      nc,&H2BA4
5357:  0E 4F        or      $15,$sz
5359:  77 93 00     cal     &H0093
535C:  D6 00 C3 16  pre     ix,&H16C3
5360:  24 0F        std     $15,(ix+$sx)
5362:  F7           rtn   
5363:  D6 00 97 18  pre     ix,&H1897
5367:  A8 00        ldw     $0,(ix+$sx)
5369:  D6 00 A7 18  pre     ix,&H18A7
536D:  A8 08        ldw     $8,(ix+$sx)
536F:  A8 02        ldw     $2,(ix+$sx)
5371:  D6 00 CF 18  pre     ix,&H18CF
5375:  E8 04 60     ldm     $4,(ix+$sx),4
5378:  89 66 04     sbw     $6,$4
537B:  89 64 02     sbw     $4,$2
537E:  89 48        sbw     $8,$sz
5380:  89 6F 08     sbw     $15,$8
5383:  F0           rtn     z
5384:  B5 07        jr      c,&H538C
5386:  89 66 0F     sbw     $6,$15
5389:  35 6D 2B     jp      c,&H2B6D
538C:  82 60 02     ldw     $0,$2
538F:  88 60 0F     adw     $0,$15
5392:  A6 10        phsw    $16
5394:  77 F9 00     cal     &H00F9
5397:  AE 01        ppsw    $1
5399:  42 00 28     ld      $0,&H28
539C:  D6 00 A7 18  pre     ix,&H18A7
53A0:  BC 41        adw     (ix+$sz),$1
53A2:  09 20        sb      $0,$sy
53A4:  F5           rtn     c
53A5:  09 A0 87     sb      $0,$sy,jr &H532E
53A8:  77 B3 46     cal     &H46B3
53AB:  D6 00 A3 18  pre     ix,&H18A3
53AF:  EA 10 A0     ldim    $16,(ix+$sx),6
53B2:  82 72 14     ldw     $18,$20
53B5:  D6 00 97 18  pre     ix,&H1897
53B9:  A8 00        ldw     $0,(ix+$sx)
53BB:  89 54        sbw     $20,$sz
53BD:  89 72 10     sbw     $18,$16
53C0:  02 1C        ld      $28,$sx
53C2:  77 3C 00     cal     &H003C
53C5:  B5 50        jr      c,&H5416
53C7:  77 C3 00     cal     &H00C3
53CA:  B0 17        jr      z,&H53E2
53CC:  A6 15        phsw    $21
53CE:  26 1C        phs     $28
53D0:  77 DF 0E     cal     &H0EDF
53D3:  2E 1C        pps     $28
53D5:  82 72 0F     ldw     $18,$15
53D8:  AE 0F        ppsw    $15
53DA:  77 3C 00     cal     &H003C
53DD:  B5 17        jr      c,&H53F5
53DF:  77 DB 00     cal     &H00DB
53E2:  77 3D 50     cal     &H503D
53E5:  A6 13        phsw    $19
53E7:  77 DF 0E     cal     &H0EDF
53EA:  77 93 00     cal     &H0093
53ED:  AE 12        ppsw    $18
53EF:  02 3C        ld      $28,$sy
53F1:  81 2F        sbcw    $15,$sy
53F3:  B5 04        jr      c,&H53F8
53F5:  81 6F 12     sbcw    $15,$18
53F8:  35 A4 2B     jp      c,&H2BA4
53FB:  77 63 53     cal     &H5363
53FE:  D6 00 A7 18  pre     ix,&H18A7
5402:  A8 10        ldw     $16,(ix+$sx)
5404:  89 70 12     sbw     $16,$18
5407:  D6 00 A3 18  pre     ix,&H18A3
540B:  A0 10        stw     $16,(ix+$sx)
540D:  77 16 54     cal     &H5416
5410:  01 1C        sbc     $28,$sx
5412:  F0           rtn     z
5413:  37 B9 1F     jp      &H1FB9
5416:  D6 00 A3 18  pre     ix,&H18A3
541A:  A8 10        ldw     $16,(ix+$sx)
541C:  42 00 06     ld      $0,&H06
541F:  D6 00 9B 18  pre     ix,&H189B
5423:  A2 10        stiw    $16,(ix+$sx)
5425:  09 20        sb      $0,$sy
5427:  B4 85        jr      nz,&H53AD
5429:  37 B3 28     jp      &H28B3
542C:  77 72 29     cal     &H2972
542F:  34 A8 2B     jp      nz,&H2BA8
5432:  77 93 00     cal     &H0093
5435:  77 30 29     cal     &H2930
5438:  24 3F        std     $31,(ix+$sy)
543A:  37 B8 2D     jp      &H2DB8
543D:  77 01 2F     cal     &H2F01
5440:  9E 40        gre     iz,$0
5442:  A6 01        phsw    $1
5444:  77 60 54     cal     &H5460
5447:  96 4F        pre     iz,$15
5449:  77 74 54     cal     &H5474
544C:  9E 4F        gre     iz,$15
544E:  D6 00 D9 16  pre     ix,&H16D9
5452:  A0 0F        stw     $15,(ix+$sx)
5454:  AE 00        ppsw    $0
5456:  96 40        pre     iz,$0
5458:  77 C3 00     cal     &H00C3
545B:  B0 9F        jr      z,&H53FB
545D:  37 93 00     jp      &H0093
5460:  D1 02 D9 16  ldw     $2,&H16D9
5464:  91 6F 02     ldw     $15,($2)
5467:  81 2F        sbcw    $15,$sy
5469:  F1           rtn     nc
546A:  D6 00 D5 16  pre     ix,&H16D5
546E:  A8 0F        ldw     $15,(ix+$sx)
5470:  90 6F 02     stw     $15,($2)
5473:  F7           rtn   
5474:  77 49 00     cal     &H0049
5477:  41 00 1A     sbc     $0,&H1A
547A:  30 BC 2B     jp      z,&H2BBC
547D:  D6 00 7F 16  pre     ix,&H167F
5481:  38 1F        adc     (ix+$sx),$31
5483:  B2 39        jr      lz,&H54BD
5485:  41 00 0D     sbc     $0,&H0D
5488:  B0 2F        jr      z,&H54B8
548A:  41 00 2C     sbc     $0,&H2C
548D:  B0 2A        jr      z,&H54B8
548F:  77 8A 12     cal     &H128A
5492:  31 B0 2B     jp      nc,&H2BB0
5495:  41 00 0D     sbc     $0,&H0D
5498:  B0 06        jr      z,&H549F
549A:  77 DB 00     cal     &H00DB
549D:  2D A0        ldd     $0,(iz-$sy)
549F:  77 AD 31     cal     &H31AD
54A2:  77 49 00     cal     &H0049
54A5:  41 00 1A     sbc     $0,&H1A
54A8:  F0           rtn     z
54A9:  41 00 0D     sbc     $0,&H0D
54AC:  34 DB 00     jp      nz,&H00DB
54AF:  2D 20        ldd     $0,(iz+$sy)
54B1:  41 00 0A     sbc     $0,&H0A
54B4:  F4           rtn     nz
54B5:  2D 20        ldd     $0,(iz+$sy)
54B7:  F7           rtn   
54B8:  77 36 06     cal     &H0636
54BB:  B7 9D        jr      &H5459
54BD:  77 DC 54     cal     &H54DC
54C0:  B7 A2        jr      &H5463
54C2:  2D 00        ldd     $0,(iz+$sx)
54C4:  9E 4F        gre     iz,$15
54C6:  02 11        ld      $17,$sx
54C8:  41 00 1A     sbc     $0,&H1A
54CB:  F0           rtn     z
54CC:  41 00 0D     sbc     $0,&H0D
54CF:  F0           rtn     z
54D0:  01 41        sbc     $1,$sz
54D2:  2D 20        ldd     $0,(iz+$sy)
54D4:  F0           rtn     z
54D5:  08 31        ad      $17,$sy
54D7:  35 74 2B     jp      c,&H2B74
54DA:  B7 93        jr      &H546E
54DC:  42 01 22     ld      $1,&H22
54DF:  77 D1 00     cal     &H00D1
54E2:  B0 A1        jr      z,&H5484
54E4:  9E 4F        gre     iz,$15
54E6:  02 11        ld      $17,$sx
54E8:  2D 00        ldd     $0,(iz+$sx)
54EA:  41 00 1A     sbc     $0,&H1A
54ED:  F0           rtn     z
54EE:  41 00 0D     sbc     $0,&H0D
54F1:  F0           rtn     z
54F2:  41 00 2C     sbc     $0,&H2C
54F5:  F0           rtn     z
54F6:  41 00 20     sbc     $0,&H20
54F9:  35 70 2B     jp      c,&H2B70
54FC:  2D 20        ldd     $0,(iz+$sy)
54FE:  08 31        ad      $17,$sy
5500:  35 74 2B     jp      c,&H2B74
5503:  B7 9A        jr      &H549E
5505:  02 61 11     ld      $1,$17
5508:  96 0F        pre     ix,$15
550A:  09 21        sb      $1,$sy
550C:  F5           rtn     c
550D:  2A 00        ldi     $0,(ix+$sx)
550F:  41 00 20     sbc     $0,&H20
5512:  B1 89        jr      nc,&H549C
5514:  37 A8 2B     jp      &H2BA8
5517:  77 44 50     cal     &H5044
551A:  77 60 54     cal     &H5460
551D:  77 3C 00     cal     &H003C
5520:  35 53 56     jp      c,&H5653
5523:  77 88 10     cal     &H1088
5526:  9E 40        gre     iz,$0
5528:  A6 01        phsw    $1
552A:  75 05 55     cal     c,&H5505
552D:  71 A7 13     cal     nc,&H13A7
5530:  02 12        ld      $18,$sx
5532:  D6 00 D9 16  pre     ix,&H16D9
5536:  A8 04        ldw     $4,(ix+$sx)
5538:  96 44        pre     iz,$4
553A:  2B 00        ldi     $0,(iz+$sx)
553C:  41 00 1A     sbc     $0,&H1A
553F:  B0 0B        jr      z,&H554B
5541:  41 00 0D     sbc     $0,&H0D
5544:  B0 06        jr      z,&H554B
5546:  41 00 2C     sbc     $0,&H2C
5549:  B4 90        jr      nz,&H54DA
554B:  2D A0        ldd     $0,(iz-$sy)
554D:  9E 40        gre     iz,$0
554F:  89 60 04     sbw     $0,$4
5552:  A6 01        phsw    $1
5554:  77 80 56     cal     &H5680
5557:  9E 40        gre     iz,$0
5559:  D6 00 8E 16  pre     ix,&H168E
555D:  E0 1E 60     stm     $30,(ix+$sx),4
5560:  2B 02        ldi     $2,(iz+$sx)
5562:  41 02 1A     sbc     $2,&H1A
5565:  B0 06        jr      z,&H556C
5567:  41 02 0D     sbc     $2,&H0D
556A:  B4 8B        jr      nz,&H54F6
556C:  2D A2        ldd     $2,(iz-$sy)
556E:  9E 42        gre     iz,$2
5570:  89 42        sbw     $2,$sz
5572:  AE 00        ppsw    $0
5574:  89 42        sbw     $2,$sz
5576:  88 62 11     adw     $2,$17
5579:  01 03        sbc     $3,$sx
557B:  34 74 2B     jp      nz,&H2B74
557E:  81 51        sbcw    $17,$sz
5580:  B0 69        jr      z,&H55EA
5582:  E6 12 60     phsm    $18,4
5585:  B5 25        jr      c,&H55AB
5587:  89 51        sbw     $17,$sz
5589:  82 60 11     ldw     $0,$17
558C:  D6 00 D9 16  pre     ix,&H16D9
5590:  A8 02        ldw     $2,(ix+$sx)
5592:  11 64 02     ld      $4,($2)
5595:  41 04 1A     sbc     $4,&H1A
5598:  B4 0B        jr      nz,&H55A4
559A:  D6 00 8E 16  pre     ix,&H168E
559E:  24 1F        std     $31,(ix+$sx)
55A0:  88 20        adw     $0,$sy
55A2:  88 20        adw     $0,$sy
55A4:  A6 03        phsw    $3
55A6:  77 B1 34     cal     &H34B1
55A9:  B7 39        jr      &H55E3
55AB:  82 42        ldw     $2,$sz
55AD:  89 62 11     sbw     $2,$17
55B0:  D6 00 D9 16  pre     ix,&H16D9
55B4:  A8 00        ldw     $0,(ix+$sx)
55B6:  01 11        sbc     $17,$sx
55B8:  B4 25        jr      nz,&H55DE
55BA:  D6 00 90 16  pre     ix,&H1690
55BE:  BA 00        sbcw    (ix+$sx),$0
55C0:  B4 1D        jr      nz,&H55DE
55C2:  82 44        ldw     $4,$sz
55C4:  88 64 02     adw     $4,$2
55C7:  91 64 04     ldw     $4,($4)
55CA:  41 04 0D     sbc     $4,&H0D
55CD:  B4 10        jr      nz,&H55DE
55CF:  D6 00 8F 16  pre     ix,&H168F
55D3:  24 1E        std     $30,(ix+$sx)
55D5:  88 22        adw     $2,$sy
55D7:  41 05 0A     sbc     $5,&H0A
55DA:  B4 03        jr      nz,&H55DE
55DC:  88 22        adw     $2,$sy
55DE:  A6 01        phsw    $1
55E0:  77 EA 34     cal     &H34EA
55E3:  AE 00        ppsw    $0
55E5:  EE 0F 60     ppsm    $15,4
55E8:  B7 07        jr      &H55F0
55EA:  D6 00 D9 16  pre     ix,&H16D9
55EE:  A8 00        ldw     $0,(ix+$sx)
55F0:  01 11        sbc     $17,$sx
55F2:  82 46        ldw     $6,$sz
55F4:  B0 23        jr      z,&H5618
55F6:  C2 62 6F     ldm     $2,$15,4
55F9:  E6 05 A0     phsm    $5,6
55FC:  77 F9 00     cal     &H00F9
55FF:  EE 00 A0     ppsm    $0,6
5602:  82 46        ldw     $6,$sz
5604:  88 66 04     adw     $6,$4
5607:  D6 00 8E 16  pre     ix,&H168E
560B:  3A 1F        sbc     (ix+$sx),$31
560D:  B4 0A        jr      nz,&H5618
560F:  88 44        adw     $4,$sz
5611:  D1 02 0D 0A  ldw     $2,&H0A0D
5615:  90 62 04     stw     $2,($4)
5618:  96 46        pre     iz,$6
561A:  D6 00 8F 16  pre     ix,&H168F
561E:  3A 1F        sbc     (ix+$sx),$31
5620:  B4 12        jr      nz,&H5633
5622:  2B 00        ldi     $0,(iz+$sx)
5624:  41 00 1A     sbc     $0,&H1A
5627:  B0 27        jr      z,&H564F
5629:  41 00 0D     sbc     $0,&H0D
562C:  B0 1B        jr      z,&H5648
562E:  41 00 2C     sbc     $0,&H2C
5631:  B4 90        jr      nz,&H55C2
5633:  9E 4F        gre     iz,$15
5635:  D6 00 D9 16  pre     ix,&H16D9
5639:  A0 0F        stw     $15,(ix+$sx)
563B:  AE 00        ppsw    $0
563D:  96 40        pre     iz,$0
563F:  77 C3 00     cal     &H00C3
5642:  30 23 55     jp      z,&H5523
5645:  37 93 00     jp      &H0093
5648:  2B 00        ldi     $0,(iz+$sx)
564A:  41 00 0A     sbc     $0,&H0A
564D:  B0 9B        jr      z,&H55E9
564F:  2D A0        ldd     $0,(iz-$sy)
5651:  B7 9F        jr      &H55F1
5653:  9E 40        gre     iz,$0
5655:  A6 01        phsw    $1
5657:  D6 00 D9 16  pre     ix,&H16D9
565B:  A8 00        ldw     $0,(ix+$sx)
565D:  96 40        pre     iz,$0
565F:  77 80 56     cal     &H5680
5662:  9E 44        gre     iz,$4
5664:  77 7E 0B     cal     &H0B7E
5667:  82 60 04     ldw     $0,$4
566A:  9E 42        gre     iz,$2
566C:  89 42        sbw     $2,$sz
566E:  A6 01        phsw    $1
5670:  77 EA 34     cal     &H34EA
5673:  AE 0F        ppsw    $15
5675:  D6 00 D9 16  pre     ix,&H16D9
5679:  A0 0F        stw     $15,(ix+$sx)
567B:  AE 00        ppsw    $0
567D:  96 40        pre     iz,$0
567F:  F7           rtn   
5680:  D6 00 D5 16  pre     ix,&H16D5
5684:  E8 19 60     ldm     $25,(ix+$sx),4
5687:  9E 40        gre     iz,$0
5689:  81 59        sbcw    $25,$sz
568B:  F0           rtn     z
568C:  2D A0        ldd     $0,(iz-$sy)
568E:  41 00 0D     sbc     $0,&H0D
5691:  B4 8B        jr      nz,&H561D
5693:  2D 20        ldd     $0,(iz+$sy)
5695:  41 00 0A     sbc     $0,&H0A
5698:  F4           rtn     nz
5699:  2D 20        ldd     $0,(iz+$sy)
569B:  F7           rtn   
569C:  77 C5 00     cal     &H00C5
569F:  02 0E        ld      $14,$sx
56A1:  B4 3F        jr      nz,&H56E1
56A3:  77 D2 11     cal     &H11D2
56A6:  77 C7 00     cal     &H00C7
56A9:  B4 1A        jr      nz,&H56C4
56AB:  41 11 02     sbc     $17,&H02
56AE:  B4 15        jr      nz,&H56C4
56B0:  91 60 0F     ldw     $0,($15)
56B3:  41 00 46     sbc     $0,&H46
56B6:  B0 06        jr      z,&H56BD
56B8:  41 00 66     sbc     $0,&H66
56BB:  B4 08        jr      nz,&H56C4
56BD:  9A 41        bydw    $1
56BF:  77 2B 00     cal     &H002B
56C2:  B5 04        jr      c,&H56C7
56C4:  37 88 2B     jp      &H2B88
56C7:  02 4E        ld      $14,$sz
56C9:  49 0E 30     sb      $14,&H30
56CC:  9E 43        gre     iz,$3
56CE:  77 25 34     cal     &H3425
56D1:  96 43        pre     iz,$3
56D3:  D6 00 D9 16  pre     ix,&H16D9
56D7:  A0 19        stw     $25,(ix+$sx)
56D9:  D6 00 D5 16  pre     ix,&H16D5
56DD:  E0 19 60     stm     $25,(ix+$sx),4
56E0:  F7           rtn   
56E1:  D6 00 D9 16  pre     ix,&H16D9
56E5:  BA 1E        sbcw    (ix+$sx),$30
56E7:  F1           rtn     nc
56E8:  B7 9D        jr      &H5686
56EA:  77 9C 56     cal     &H569C
56ED:  77 3C 00     cal     &H003C
56F0:  35 6A 57     jp      c,&H576A
56F3:  77 D2 11     cal     &H11D2
56F6:  77 78 57     cal     &H5778
56F9:  B1 46        jr      nc,&H5740
56FB:  77 C3 00     cal     &H00C3
56FE:  B4 3E        jr      nz,&H573D
5700:  77 C3 00     cal     &H00C3
5703:  B0 36        jr      z,&H573A
5705:  77 49 00     cal     &H0049
5708:  2D 21        ldd     $1,(iz+$sy)
570A:  41 00 30     sbc     $0,&H30
570D:  B0 27        jr      z,&H5735
570F:  41 00 31     sbc     $0,&H31
5712:  34 70 2B     jp      nz,&H2B70
5715:  96 17        pre     ix,$23
5717:  9E 00        gre     ix,$0
5719:  81 59        sbcw    $25,$sz
571B:  B0 11        jr      z,&H572D
571D:  2C A0        ldd     $0,(ix-$sy)
571F:  41 00 0D     sbc     $0,&H0D
5722:  B4 8C        jr      nz,&H56AF
5724:  2C 20        ldd     $0,(ix+$sy)
5726:  41 00 0A     sbc     $0,&H0A
5729:  B4 03        jr      nz,&H572D
572B:  2C 20        ldd     $0,(ix+$sy)
572D:  9E 17        gre     ix,$23
572F:  D6 00 D9 16  pre     ix,&H16D9
5733:  A0 17        stw     $23,(ix+$sx)
5735:  77 C3 00     cal     &H00C3
5738:  B4 04        jr      nz,&H573D
573A:  77 99 0B     cal     &H0B99
573D:  37 93 00     jp      &H0093
5740:  77 C3 00     cal     &H00C3
5743:  34 BC 2B     jp      nz,&H2BBC
5746:  77 C3 00     cal     &H00C3
5749:  B0 17        jr      z,&H5761
574B:  77 49 00     cal     &H0049
574E:  2D 21        ldd     $1,(iz+$sy)
5750:  41 00 30     sbc     $0,&H30
5753:  B0 07        jr      z,&H575B
5755:  41 00 31     sbc     $0,&H31
5758:  34 70 2B     jp      nz,&H2B70
575B:  77 C3 00     cal     &H00C3
575E:  34 BC 2B     jp      nz,&H2BBC
5761:  42 02 49     ld      $2,&H49
5764:  77 EF 00     cal     &H00EF
5767:  37 8A 36     jp      &H368A
576A:  D6 00 D5 16  pre     ix,&H16D5
576E:  EA 00 60     ldim    $0,(ix+$sx),4
5771:  D6 00 D9 16  pre     ix,&H16D9
5775:  A0 00        stw     $0,(ix+$sx)
5777:  F7           rtn   
5778:  9E 40        gre     iz,$0
577A:  A6 01        phsw    $1
577C:  D6 00 D5 16  pre     ix,&H16D5
5780:  EA 19 60     ldim    $25,(ix+$sx),4
5783:  D6 00 D9 16  pre     ix,&H16D9
5787:  A8 17        ldw     $23,(ix+$sx)
5789:  01 31        sbc     $17,$sy
578B:  B5 48        jr      c,&H57D4
578D:  96 17        pre     ix,$23
578F:  9E 17        gre     ix,$23
5791:  96 4F        pre     iz,$15
5793:  02 62 11     ld      $2,$17
5796:  2A 00        ldi     $0,(ix+$sx)
5798:  41 00 1A     sbc     $0,&H1A
579B:  B0 0D        jr      z,&H57A9
579D:  2B 01        ldi     $1,(iz+$sx)
579F:  01 41        sbc     $1,$sz
57A1:  B4 12        jr      nz,&H57B4
57A3:  09 22        sb      $2,$sy
57A5:  B4 90        jr      nz,&H5736
57A7:  01 3F        sbc     $31,$sy
57A9:  D6 00 D9 16  pre     ix,&H16D9
57AD:  A0 17        stw     $23,(ix+$sx)
57AF:  AE 00        ppsw    $0
57B1:  96 40        pre     iz,$0
57B3:  F7           rtn   
57B4:  96 17        pre     ix,$23
57B6:  2A 00        ldi     $0,(ix+$sx)
57B8:  41 00 1A     sbc     $0,&H1A
57BB:  B0 93        jr      z,&H574F
57BD:  41 00 0D     sbc     $0,&H0D
57C0:  B0 08        jr      z,&H57C9
57C2:  41 00 2C     sbc     $0,&H2C
57C5:  B4 90        jr      nz,&H5756
57C7:  B7 B9        jr      &H5781
57C9:  2A 00        ldi     $0,(ix+$sx)
57CB:  41 00 0A     sbc     $0,&H0A
57CE:  B0 C0        jr      z,&H578F
57D0:  2C A0        ldd     $0,(ix-$sy)
57D2:  B7 C4        jr      &H5797
57D4:  11 60 17     ld      $0,($23)
57D7:  41 00 1A     sbc     $0,&H1A
57DA:  B0 AC        jr      z,&H5787
57DC:  B7 B6        jr      &H5793
57DE:  8A 36        adbw    $22,$sy
57E0:  20 36        st      $22,(ix+$sy)
57E2:  63 36 CB     sti     $22,(iz+&HCB)
57E5:  3A EB 42     sbc     (ix-$2),$11
57E8:  17 55        pst     ??,$21
57EA:  3E 39        sb      (ix+$sy),$25
57EC:  AD 35        lddw    $21,(iz+$sy)
57EE:  A8 2B        ldw     $11,(ix+$sy)
57F0:  BA 51        sbcw    (ix+$sz),$17
57F2:  5C 52        sup     &H52
57F4:  A8 2B        ldw     $11,(ix+$sy)
57F6:  DD 3C        sdn     $28
57F8:  A8 2B        ldw     $11,(ix+$sy)
57FA:  26 3D        phs     $29
57FC:  21 3D        st      $29,(iz+$sy)
57FE:  53           ****  
57FF:  47 4B 47     xrc     $11,&H47
5802:  A8 2B        ldw     $11,(ix+$sy)
5804:  DA 43 17     bydm    $3,1
5807:  36 A8 2B     jp      nlz,&H2BA8
580A:  14           ****  
580B:  36 4F 47     jp      nlz,&H474F
580E:  A8 2B        ldw     $11,(ix+$sy)
5810:  A8 2B        ldw     $11,(ix+$sy)
5812:  23 3A        sti     $26,(iz+$sy)
5814:  A8 2B        ldw     $11,(ix+$sy)
5816:  A8 2B        ldw     $11,(ix+$sy)
5818:  A8 2B        ldw     $11,(ix+$sy)
581A:  A8 2B        ldw     $11,(ix+$sy)
581C:  A8 2B        ldw     $11,(ix+$sy)
581E:  62 47 A8     sti     $7,(ix+&HA8)
5821:  53           ****  
5822:  94           ****  
5823:  45 36 47     nac     $22,&H47
5826:  2C 35        ldd     $21,(ix+$sy)
5828:  29 39        ld      $25,(iz+$sy)
582A:  B8 58        adcw    (ix+$sz),$24
582C:  C7 43 DF     xrcm    $3,$sz,7
582F:  2A B0        ldi     $16,(ix-$sy)
5831:  46 A8 2B A8  orc     $8,&H2B,jr &H57DC
5835:  2B A8        ldi     $8,(iz-$sy)
5837:  2B 7D 39     ldi     $29,(iz+$25)
583A:  A8 2B        ldw     $11,(ix+$sy)
583C:  3A 3A        sbc     (ix+$sy),$26
583E:  A8 2B        ldw     $11,(ix+$sy)
5840:  A8 2B        ldw     $11,(ix+$sy)
5842:  A8 2B        ldw     $11,(ix+$sy)
5844:  4A 3A A8     adb     $26,&HA8
5847:  2B A8        ldi     $8,(iz-$sy)
5849:  2B A8        ldi     $8,(iz-$sy)
584B:  2B 9B        ldi     $27,(iz-$sx)
584D:  0B F9 36 3B  sbb     $25,$22,jr &H588B
5851:  38 A8        adc     (ix-$sy),$8
5853:  2B A8        ldi     $8,(iz-$sy)
5855:  2B 81        ldi     $1,(iz-$sx)
5857:  3A A8        sbc     (ix-$sy),$8
5859:  2B 20        ldi     $0,(iz+$sy)
585B:  35 A8 2B     jp      c,&H2BA8
585E:  A8 2B        ldw     $11,(ix+$sy)
5860:  A8 2B        ldw     $11,(ix+$sy)
5862:  0F 7F A8     xr      $31,$8
5865:  2B BB        ldi     $27,(iz-$sy)
5867:  38 1E        adc     (ix+$sx),$30
5869:  7F A2 2E     sb      (iz-&H2E),$2
586C:  26 3E        phs     $30
586E:  FA           fst   
586F:  39 A8        adc     (iz-$sy),$8
5871:  2B A8        ldi     $8,(iz-$sy)
5873:  2B A8        ldi     $8,(iz-$sy)
5875:  2B A8        ldi     $8,(iz-$sy)
5877:  2B 35        ldi     $21,(iz+$sy)
5879:  7F DF 45     sb      (iz-&H45),$31
587C:  A8 2B        ldw     $11,(ix+$sy)
587E:  A8 2B        ldw     $11,(ix+$sy)
5880:  71 3B A8     cal     nc,&HA83B
5883:  2B A8        ldi     $8,(iz-$sy)
5885:  2B A8        ldi     $8,(iz-$sy)
5887:  2B A8        ldi     $8,(iz-$sy)
5889:  2B 2C        ldi     $12,(iz+$sy)
588B:  54           ****  
588C:  A8 2B        ldw     $11,(ix+$sy)
588E:  A8 2B        ldw     $11,(ix+$sy)
5890:  A8 2B        ldw     $11,(ix+$sy)
5892:  F1           rtn     nc
5893:  3E EC 3E     sb      (ix-$30),$12
5896:  A8 2B        ldw     $11,(ix+$sy)
5898:  A8 2B        ldw     $11,(ix+$sy)
589A:  A8 2B        ldw     $11,(ix+$sy)
589C:  A0 42        stw     $2,(ix+$sz)
589E:  9B 0B        cmpw    $11
58A0:  A8 2B        ldw     $11,(ix+$sy)
58A2:  A8 2B        ldw     $11,(ix+$sy)
58A4:  2A 53        ldi     $19,(ix+$sz)
58A6:  22 43        sti     $3,(ix+$sz)
58A8:  00 35        adc     $21,$sy
58AA:  A8 2B        ldw     $11,(ix+$sy)
58AC:  A2 52        stiw    $18,(ix+$sz)
58AE:  A8 2B        ldw     $11,(ix+$sy)
58B0:  EB 3B A8     ldim    $27,(iz+$sy),6
58B3:  2B A8        ldi     $8,(iz-$sy)
58B5:  2B 87        ldi     $7,(iz-$sx)
58B7:  7F 77 53     sb      (iz+&H53),$23
58BA:  50 77 8D     st      &H8D,($??)
58BD:  27 77        phu     $23
58BF:  3C 00        ad      (ix+$sx),$0
58C1:  B5 27        jr      c,&H58E9
58C3:  77 CF 00     cal     &H00CF
58C6:  B0 33        jr      z,&H58FA
58C8:  77 DF 1E     cal     &H1EDF
58CB:  82 6F 11     ldw     $15,$17
58CE:  77 93 00     cal     &H0093
58D1:  77 76 51     cal     &H5176
58D4:  39 1F        adc     (iz+$sx),$31
58D6:  30 B9 1F     jp      z,&H1FB9
58D9:  77 9B 52     cal     &H529B
58DC:  42 1D 03     ld      $29,&H03
58DF:  D1 02 F1 5B  ldw     $2,&H5BF1
58E3:  77 B7 5A     cal     &H5AB7
58E6:  37 88 5B     jp      &H5B88
58E9:  77 EE 33     cal     &H33EE
58EC:  82 66 01     ldw     $6,$1
58EF:  82 73 19     ldw     $19,$25
58F2:  77 FA 33     cal     &H33FA
58F5:  30 B9 1F     jp      z,&H1FB9
58F8:  B7 A0        jr      &H5899
58FA:  D1 00 CB 16  ldw     $0,&H16CB
58FE:  91 CF B2     ldw     $15,($sz),jr &H58B2
5901:  A6 01        phsw    $1
5903:  B7 08        jr      &H590C
5905:  A6 01        phsw    $1
5907:  96 53        pre     iz,$19
5909:  77 7E 0B     cal     &H0B7E
590C:  9E 42        gre     iz,$2
590E:  89 62 13     sbw     $2,$19
5911:  AE 00        ppsw    $0
5913:  81 42        sbcw    $2,$sz
5915:  B0 24        jr      z,&H593A
5917:  A6 01        phsw    $1
5919:  B5 15        jr      c,&H592F
591B:  89 42        sbw     $2,$sz
591D:  82 60 13     ldw     $0,$19
5920:  77 EA 34     cal     &H34EA
5923:  AE 04        ppsw    $4
5925:  82 60 13     ldw     $0,$19
5928:  D1 02 D5 19  ldw     $2,&H19D5
592C:  37 F9 00     jp      &H00F9
592F:  89 60 02     sbw     $0,$2
5932:  82 62 13     ldw     $2,$19
5935:  77 B1 34     cal     &H34B1
5938:  B7 96        jr      &H58CF
593A:  82 C4 97     ldw     $4,$sz,jr &H58D3
593D:  96 53        pre     iz,$19
593F:  04 3D        anc     $29,$sy
5941:  B4 10        jr      nz,&H5952
5943:  77 18 5A     cal     &H5A18
5946:  B0 12        jr      z,&H5959
5948:  77 7E 0B     cal     &H0B7E
594B:  3B 04        sbc     (iz+$sx),$4
594D:  B0 0B        jr      z,&H5959
594F:  00 1E        adc     $30,$sx
5951:  F7           rtn   
5952:  2B 00        ldi     $0,(iz+$sx)
5954:  2D 41        ldd     $1,(iz+$sz)
5956:  01 01        sbc     $1,$sx
5958:  F4           rtn     nz
5959:  01 3F        sbc     $31,$sy
595B:  F7           rtn   
595C:  81 73 19     sbcw    $19,$25
595F:  B0 87        jr      z,&H58E7
5961:  96 59        pre     iz,$25
5963:  04 3D        anc     $29,$sy
5965:  B4 23        jr      nz,&H5989
5967:  D1 00 02 00  ldw     $0,&H0002
596B:  81 51        sbcw    $17,$sz
596D:  F0           rtn     z
596E:  96 13        pre     ix,$19
5970:  D1 00 0D 0A  ldw     $0,&H0A0D
5974:  96 39        pre     iy,$25
5976:  2C A2        ldd     $2,(ix-$sy)
5978:  DD 00        sdn     $0
597A:  2C A2        ldd     $2,(ix-$sy)
597C:  DD 00        sdn     $0
597E:  2C 22        ldd     $2,(ix+$sy)
5980:  9E 02        gre     ix,$2
5982:  96 42        pre     iz,$2
5984:  77 88 0B     cal     &H0B88
5987:  B7 B9        jr      &H5941
5989:  2B 00        ldi     $0,(iz+$sx)
598B:  2D 41        ldd     $1,(iz+$sz)
598D:  9E 42        gre     iz,$2
598F:  81 73 02     sbcw    $19,$2
5992:  B4 8A        jr      nz,&H591D
5994:  2D C1        ldd     $1,(iz-$sz)
5996:  2D A0        ldd     $0,(iz-$sy)
5998:  F7           rtn   
5999:  81 31        sbcw    $17,$sy
599B:  B1 03        jr      nc,&H599F
599D:  82 31        ldw     $17,$sy
599F:  89 63 03     sbw     $3,$3
59A2:  96 59        pre     iz,$25
59A4:  88 23        adw     $3,$sy
59A6:  81 71 03     sbcw    $17,$3
59A9:  B0 13        jr      z,&H59BD
59AB:  42 00 1A     ld      $0,&H1A
59AE:  3B 00        sbc     (iz+$sx),$0
59B0:  B0 0C        jr      z,&H59BD
59B2:  77 7E 0B     cal     &H0B7E
59B5:  9E 40        gre     iz,$0
59B7:  88 20        adw     $0,$sy
59B9:  81 5B        sbcw    $27,$sz
59BB:  B4 98        jr      nz,&H5954
59BD:  9E 53        gre     iz,$19
59BF:  F7           rtn   
59C0:  82 73 1B     ldw     $19,$27
59C3:  89 33        sbw     $19,$sy
59C5:  77 CA 59     cal     &H59CA
59C8:  B7 8C        jr      &H5955
59CA:  82 2F        ldw     $15,$sy
59CC:  96 59        pre     iz,$25
59CE:  9E 42        gre     iz,$2
59D0:  81 73 02     sbcw    $19,$2
59D3:  F0           rtn     z
59D4:  77 18 5A     cal     &H5A18
59D7:  B0 9B        jr      z,&H5973
59D9:  77 7E 0B     cal     &H0B7E
59DC:  88 AF 90     adw     $15,$sy,jr &H596E
59DF:  02 64 15     ld      $4,$21
59E2:  02 60 17     ld      $0,$23
59E5:  09 60 16     sb      $0,$22
59E8:  D6 00 E0 1B  pre     ix,&H1BE0
59EC:  A0 B7        stw     $23,(ix-$sy)
59EE:  77 F7 01     cal     &H01F7
59F1:  96 02        pre     ix,$2
59F3:  00 04        adc     $4,$sx
59F5:  B4 03        jr      nz,&H59F9
59F7:  02 24        ld      $4,$sy
59F9:  02 60 04     ld      $0,$4
59FC:  77 79 6E     cal     &H6E79
59FF:  37 0F 93     jp      &H930F
5A02:  77 F7 01     cal     &H01F7
5A05:  42 00 0F     ld      $0,&H0F
5A08:  37 77 6E     jp      &H6E77
5A0B:  42 00 02     ld      $0,&H02
5A0E:  D1 01 0D 0A  ldw     $1,&H0A0D
5A12:  BB C1        sbcw    (iz-$sz),$1
5A14:  F0           rtn     z
5A15:  3B A1        sbc     (iz-$sy),$1
5A17:  F7           rtn   
5A18:  42 04 1A     ld      $4,&H1A
5A1B:  3B 04        sbc     (iz+$sx),$4
5A1D:  F7           rtn   
5A1E:  EE 24 61     ppsm    $4,4
5A21:  EF 24 61     ppum    $4,4
5A24:  E9 9E 5F     ldm     $30,(iz-$sx),3
5A27:  E2 A9 5F     stim    $9,(ix-$sy),3
5A2A:  E7 93 5F     phum    $19,3
5A2D:  E6 3A 5F     phsm    $26,3
5A30:  E0 B4 5F     stm     $20,(ix-$sy),3
5A33:  E1 B4 5F     stm     $20,(iz-$sy),3
5A36:  FD           rtni  
5A37:  CD 5F 00     nam     $31,$sz,1
5A3A:  A3 5B        stiw    $27,(iz+$sz)
5A3C:  EE 24 61     ppsm    $4,4
5A3F:  EF 24 61     ppum    $4,4
5A42:  E9 A1 5F     ldm     $1,(iz-$sy),3
5A45:  E2 AC 5F     stim    $12,(ix-$sy),3
5A48:  E0 B7 5F     stm     $23,(ix-$sy),3
5A4B:  E1 B7 5F     stm     $23,(iz-$sy),3
5A4E:  E7 96 5F     phum    $22,3
5A51:  E6 65 5F     phsm    $5,3
5A54:  FD           rtni  
5A55:  CD 5F 00     nam     $31,$sz,1
5A58:  A3 5B        stiw    $27,(iz+$sz)
5A5A:  02 50        ld      $16,$sz
5A5C:  41 10 E8     sbc     $16,&HE8
5A5F:  30 B8 2D     jp      z,&H2DB8
5A62:  41 10 80     sbc     $16,&H80
5A65:  B5 07        jr      c,&H5A6D
5A67:  41 10 A6     sbc     $16,&HA6
5A6A:  35 7A 5F     jp      c,&H5F7A
5A6D:  41 10 FD     sbc     $16,&HFD
5A70:  30 A6 5D     jp      z,&H5DA6
5A73:  41 10 20     sbc     $16,&H20
5A76:  31 F9 5E     jp      nc,&H5EF9
5A79:  D6 00 80 5A  pre     ix,&H5A80
5A7D:  37 66 01     jp      &H0166
5A80:  01 2A        sbc     $10,$sy
5A82:  5E           ****  
5A83:  02 7C 5E     ld      $28,$30
5A86:  05 DD 5E     nac     $29,$sz,jr &H5AE6
5A89:  06 7C 5E     orc     $28,$30
5A8C:  0C DD 5E     an      $29,$sz,jr &H5AEC
5A8F:  0D 62 5D     na      $2,$29
5A92:  10 1C        st      $28,($sx)
5A94:  5E           ****  
5A95:  1C           ****  
5A96:  7C 5E 1D     ad      (ix+&H1D),$30
5A99:  7C 5E 1E     ad      (ix+&H1E),$30
5A9C:  F0           rtn     z
5A9D:  5D 1F        sdn     &H1F
5A9F:  C7 5D 00     xrcm    $29,$sz,1
5AA2:  DB 5D 02     invm    $29,1
5AA5:  0E 77 25     or      $23,$5
5AA8:  34 82 31     jp      nz,&H3182
5AAB:  82 73 19     ldw     $19,$25
5AAE:  89 76 16     sbw     $22,$22
5AB1:  F7           rtn   
5AB2:  77 5D 5B     cal     &H5B5D
5AB5:  B7 04        jr      &H5ABA
5AB7:  77 57 5B     cal     &H5B57
5ABA:  C9 75 55     sbbm    $21,$21,3
5ABD:  77 30 5C     cal     &H5C30
5AC0:  04 3D        anc     $29,$sy
5AC2:  30 6E 97     jp      z,&H976E
5AC5:  37 74 97     jp      &H9774
5AC8:  77 19 34     cal     &H3419
5ACB:  37 FE 97     jp      &H97FE
5ACE:  77 6A 29     cal     &H296A
5AD1:  B0 32        jr      z,&H5B04
5AD3:  3A 3F        sbc     (ix+$sy),$31
5AD5:  B4 2E        jr      nz,&H5B04
5AD7:  42 1D 06     ld      $29,&H06
5ADA:  D1 02 23 5B  ldw     $2,&H5B23
5ADE:  77 57 5B     cal     &H5B57
5AE1:  77 6E 97     cal     &H976E
5AE4:  04 38        anc     $24,$sy
5AE6:  B4 1A        jr      nz,&H5B01
5AE8:  44 18 02     anc     $24,&H02
5AEB:  B4 0F        jr      nz,&H5AFB
5AED:  81 73 19     sbcw    $19,$25
5AF0:  B0 53        jr      z,&H5B44
5AF2:  82 60 1B     ldw     $0,$27
5AF5:  89 20        sbw     $0,$sy
5AF7:  81 53        sbcw    $19,$sz
5AF9:  B0 29        jr      z,&H5B23
5AFB:  77 37 5C     cal     &H5C37
5AFE:  77 70 5C     cal     &H5C70
5B01:  37 9E 5B     jp      &H5B9E
5B04:  77 7E 27     cal     &H277E
5B07:  77 71 27     cal     &H2771
5B0A:  77 94 52     cal     &H5294
5B0D:  34 C6 6C     jp      nz,&H6CC6
5B10:  77 6E 24     cal     &H246E
5B13:  77 A4 5A     cal     &H5AA4
5B16:  42 1D 06     ld      $29,&H06
5B19:  D1 02 23 5B  ldw     $2,&H5B23
5B1D:  42 18 02     ld      $24,&H02
5B20:  77 B7 5A     cal     &H5AB7
5B23:  77 23 03     cal     &H0323
5B26:  77 C0 5A     cal     &H5AC0
5B29:  04 3D        anc     $29,$sy
5B2B:  B4 1D        jr      nz,&H5B49
5B2D:  77 C0 59     cal     &H59C0
5B30:  82 71 0F     ldw     $17,$15
5B33:  81 31        sbcw    $17,$sy
5B35:  B0 13        jr      z,&H5B49
5B37:  77 0B 5A     cal     &H5A0B
5B3A:  B0 0E        jr      z,&H5B49
5B3C:  89 31        sbw     $17,$sy
5B3E:  77 99 59     cal     &H5999
5B41:  37 71 5E     jp      &H5E71
5B44:  82 31        ldw     $17,$sy
5B46:  82 73 19     ldw     $19,$25
5B49:  77 26 5C     cal     &H5C26
5B4C:  89 76 16     sbw     $22,$22
5B4F:  42 18 08     ld      $24,&H08
5B52:  77 1B 03     cal     &H031B
5B55:  B7 48        jr      &H5B9E
5B57:  D6 00 C5 16  pre     ix,&H16C5
5B5B:  24 1F        std     $31,(ix+$sx)
5B5D:  D6 00 C4 16  pre     ix,&H16C4
5B61:  24 1D        std     $29,(ix+$sx)
5B63:  77 7A 29     cal     &H297A
5B66:  D6 60 D0 1C  pre     us,&H1CD0
5B6A:  E7 1D E0     phum    $29,8
5B6D:  E7 15 80     phum    $21,5
5B70:  F7           rtn   
5B71:  41 18 08     sbc     $24,&H08
5B74:  B4 13        jr      nz,&H5B88
5B76:  04 3D        anc     $29,$sy
5B78:  B4 0F        jr      nz,&H5B88
5B7A:  81 73 19     sbcw    $19,$25
5B7D:  B0 BA        jr      z,&H5B38
5B7F:  82 60 1B     ldw     $0,$27
5B82:  89 20        sbw     $0,$sy
5B84:  81 53        sbcw    $19,$sz
5B86:  B0 E4        jr      z,&H5B6B
5B88:  04 3D        anc     $29,$sy
5B8A:  B4 08        jr      nz,&H5B93
5B8C:  96 53        pre     iz,$19
5B8E:  77 18 5A     cal     &H5A18
5B91:  B0 EF        jr      z,&H5B81
5B93:  77 FA 33     cal     &H33FA
5B96:  B0 55        jr      z,&H5BEC
5B98:  77 37 5C     cal     &H5C37
5B9B:  77 70 5C     cal     &H5C70
5B9E:  04 3D        anc     $29,$sy
5BA0:  70 18 5D     cal     z,&H5D18
5BA3:  D7 00 D7 1B  pre     ss,&H1BD7
5BA7:  77 66 5B     cal     &H5B66
5BAA:  77 C8 23     cal     &H23C8
5BAD:  41 00 F0     sbc     $0,&HF0
5BB0:  B5 12        jr      c,&H5BC3
5BB2:  41 00 FA     sbc     $0,&HFA
5BB5:  B1 0D        jr      nc,&H5BC3
5BB7:  77 72 29     cal     &H2972
5BBA:  02 60 10     ld      $0,$16
5BBD:  34 BE 24     jp      nz,&H24BE
5BC0:  4C 00 3F     an      $0,&H3F
5BC3:  D6 00 80 5A  pre     ix,&H5A80
5BC7:  02 50        ld      $16,$sz
5BC9:  01 38        sbc     $24,$sy
5BCB:  B0 42        jr      z,&H5C0E
5BCD:  D6 00 3C 5A  pre     ix,&H5A3C
5BD1:  41 10 E0     sbc     $16,&HE0
5BD4:  B1 36        jr      nc,&H5C0B
5BD6:  41 10 0D     sbc     $16,&H0D
5BD9:  30 DB 5F     jp      z,&H5FDB
5BDC:  41 10 80     sbc     $16,&H80
5BDF:  B5 07        jr      c,&H5BE7
5BE1:  41 10 A6     sbc     $16,&HA6
5BE4:  35 7D 5F     jp      c,&H5F7D
5BE7:  77 E3 2A     cal     &H2AE3
5BEA:  B7 C8        jr      &H5BB3
5BEC:  04 3D        anc     $29,$sy
5BEE:  30 44 5B     jp      z,&H5B44
5BF1:  96 53        pre     iz,$19
5BF3:  A9 25        ldw     $5,(iz+$sy)
5BF5:  77 12 34     cal     &H3412
5BF8:  77 23 03     cal     &H0323
5BFB:  77 71 27     cal     &H2771
5BFE:  D6 00 C4 16  pre     ix,&H16C4
5C02:  A0 1E        stw     $30,(ix+$sx)
5C04:  37 B9 1F     jp      &H1FB9
5C07:  D6 00 1E 5A  pre     ix,&H5A1E
5C0B:  37 66 01     jp      &H0166
5C0E:  41 10 80     sbc     $16,&H80
5C11:  B5 07        jr      c,&H5C19
5C13:  41 10 A6     sbc     $16,&HA6
5C16:  35 7A 5F     jp      c,&H5F7A
5C19:  41 10 E0     sbc     $16,&HE0
5C1C:  B1 96        jr      nc,&H5BB3
5C1E:  41 10 20     sbc     $16,&H20
5C21:  B5 97        jr      c,&H5BB9
5C23:  37 DD 5E     jp      &H5EDD
5C26:  26 10        phs     $16
5C28:  77 53 97     cal     &H9753
5C2B:  77 DF 2A     cal     &H2ADF
5C2E:  2E 10        pps     $16
5C30:  D6 00 E0 1B  pre     ix,&H1BE0
5C34:  24 1F        std     $31,(ix+$sx)
5C36:  F7           rtn   
5C37:  89 76 16     sbw     $22,$22
5C3A:  77 53 97     cal     &H9753
5C3D:  96 53        pre     iz,$19
5C3F:  04 3D        anc     $29,$sy
5C41:  B0 04        jr      z,&H5C46
5C43:  37 8B 50     jp      &H508B
5C46:  D6 00 00 10  pre     ix,&H1000
5C4A:  D1 00 0D 00  ldw     $0,&H000D
5C4E:  2B 02        ldi     $2,(iz+$sx)
5C50:  01 42        sbc     $2,$sz
5C52:  F0           rtn     z
5C53:  41 02 1A     sbc     $2,&H1A
5C56:  F0           rtn     z
5C57:  08 21        ad      $1,$sy
5C59:  B5 0D        jr      c,&H5C67
5C5B:  41 02 20     sbc     $2,&H20
5C5E:  B1 04        jr      nc,&H5C63
5C60:  42 02 20     ld      $2,&H20
5C63:  22 02        sti     $2,(ix+$sx)
5C65:  B7 98        jr      &H5BFE
5C67:  41 1D 04     sbc     $29,&H04
5C6A:  70 DF 2A     cal     z,&H2ADF
5C6D:  37 7C 2B     jp      &H2B7C
5C70:  77 38 93     cal     &H9338
5C73:  04 3D        anc     $29,$sy
5C75:  30 59 62     jp      z,&H6259
5C78:  02 60 16     ld      $0,$22
5C7B:  77 C9 5C     cal     &H5CC9
5C7E:  09 4D        sb      $13,$sz
5C80:  42 0C 80     ld      $12,&H80
5C83:  08 6D 0C     ad      $13,$12
5C86:  B5 18        jr      c,&H5C9F
5C88:  77 3D 59     cal     &H593D
5C8B:  B5 13        jr      c,&H5C9F
5C8D:  77 B4 5C     cal     &H5CB4
5C90:  B5 0E        jr      c,&H5C9F
5C92:  26 0C        phs     $12
5C94:  77 91 50     cal     &H5091
5C97:  2E 0C        pps     $12
5C99:  B5 05        jr      c,&H5C9F
5C9B:  39 1F        adc     (iz+$sx),$31
5C9D:  B4 91        jr      nz,&H5C2F
5C9F:  D1 0A 00 5F  ldw     $10,&H5F00
5CA3:  77 43 93     cal     &H9343
5CA6:  77 2E 03     cal     &H032E
5CA9:  77 30 5C     cal     &H5C30
5CAC:  02 38        ld      $24,$sy
5CAE:  77 7F 97     cal     &H977F
5CB1:  37 F5 92     jp      &H92F5
5CB4:  4C 0D E0     an      $13,&HE0
5CB7:  48 0D 20     ad      $13,&H20
5CBA:  F5           rtn     c
5CBB:  D6 00 3B 11  pre     ix,&H113B
5CBF:  02 62 0D     ld      $2,$13
5CC2:  09 62 0C     sb      $2,$12
5CC5:  2C 63 02     ldd     $3,(ix+$2)
5CC8:  F7           rtn   
5CC9:  D6 00 00 10  pre     ix,&H1000
5CCD:  2C 40        ldd     $0,(ix+$sz)
5CCF:  9E 00        gre     ix,$0
5CD1:  D6 20 FF 10  pre     iy,&H10FF
5CD5:  DC 1F        sup     $31
5CD7:  9E 0D        gre     ix,$13
5CD9:  96 2D        pre     iy,$13
5CDB:  96 00        pre     ix,$0
5CDD:  D6 40 3B 11  pre     iz,&H113B
5CE1:  D8           bup   
5CE2:  F7           rtn   
5CE3:  D6 00 34 15  pre     ix,&H1534
5CE7:  D1 0E 00 3C  ldw     $14,&H3C00
5CEB:  A2 0E        stiw    $14,(ix+$sx)
5CED:  89 6F 0F     sbw     $15,$15
5CF0:  82 63 11     ldw     $3,$17
5CF3:  77 B4 0A     cal     &H0AB4
5CF6:  D1 00 05 00  ldw     $0,&H0005
5CFA:  4C 10 0F     an      $16,&H0F
5CFD:  B4 14        jr      nz,&H5D12
5CFF:  01 01        sbc     $1,$sx
5D01:  B4 12        jr      nz,&H5D14
5D03:  22 10        sti     $16,(ix+$sx)
5D05:  DA 2E 40     dium    $14,3
5D08:  09 20        sb      $0,$sy
5D0A:  B4 91        jr      nz,&H5C9C
5D0C:  42 10 3E     ld      $16,&H3E
5D0F:  24 10        std     $16,(ix+$sx)
5D11:  F7           rtn   
5D12:  02 21        ld      $1,$sy
5D14:  48 90 30 94  ad      $16,&H30,jr &H5CAB
5D18:  77 57 5D     cal     &H5D57
5D1B:  77 E3 5C     cal     &H5CE3
5D1E:  D6 00 1C 15  pre     ix,&H151C
5D22:  1E 6B        gst     ua,$11
5D24:  9E 0C        gre     ix,$12
5D26:  D1 02 7C 14  ldw     $2,&H147C
5D2A:  42 0A 20     ld      $10,&H20
5D2D:  11 70 0C     ld      $16,($12)
5D30:  88 2C        adw     $12,$sy
5D32:  77 3A 03     cal     &H033A
5D35:  E8 04 A0     ldm     $4,(ix+$sx),6
5D38:  16 60        pst     ua,$0
5D3A:  96 02        pre     ix,$2
5D3C:  E2 04 A0     stim    $4,(ix+$sx),6
5D3F:  9E 02        gre     ix,$2
5D41:  09 2A        sb      $10,$sy
5D43:  B4 97        jr      nz,&H5CDB
5D45:  16 6B        pst     ua,$11
5D47:  D6 00 7C 14  pre     ix,&H147C
5D4B:  42 04 03     ld      $4,&H03
5D4E:  37 05 02     jp      &H0205
5D51:  D6 40 C6 16  pre     iz,&H16C6
5D55:  25 1E        std     $30,(iz+$sx)
5D57:  D1 00 1C 15  ldw     $0,&H151C
5D5B:  D1 02 20 00  ldw     $2,&H0020
5D5F:  37 57 01     jp      &H0157
5D62:  77 3D 59     cal     &H593D
5D65:  B5 1E        jr      c,&H5D84
5D67:  41 18 08     sbc     $24,&H08
5D6A:  B0 07        jr      z,&H5D72
5D6C:  88 31        adw     $17,$sy
5D6E:  9E 53        gre     iz,$19
5D70:  02 16        ld      $22,$sx
5D72:  41 1D 04     sbc     $29,&H04
5D75:  34 88 5B     jp      nz,&H5B88
5D78:  02 77 16     ld      $23,$22
5D7B:  77 3A 5C     cal     &H5C3A
5D7E:  77 20 62     cal     &H6220
5D81:  37 02 20     jp      &H2002
5D84:  41 1D 04     sbc     $29,&H04
5D87:  B0 87        jr      z,&H5D0F
5D89:  04 3D        anc     $29,$sy
5D8B:  B4 13        jr      nz,&H5D9F
5D8D:  41 18 08     sbc     $24,&H08
5D90:  34 23 5B     jp      nz,&H5B23
5D93:  82 60 1B     ldw     $0,$27
5D96:  89 20        sbw     $0,$sy
5D98:  81 53        sbcw    $19,$sz
5D9A:  B4 A9        jr      nz,&H5D44
5D9C:  37 A3 5B     jp      &H5BA3
5D9F:  41 18 08     sbc     $24,&H08
5DA2:  B4 87        jr      nz,&H5D2A
5DA4:  B7 B3        jr      &H5D58
5DA6:  00 16        adc     $22,$sx
5DA8:  B4 B9        jr      nz,&H5D62
5DAA:  77 5C 59     cal     &H595C
5DAD:  B5 08        jr      c,&H5DB6
5DAF:  04 3D        anc     $29,$sy
5DB1:  B4 CB        jr      nz,&H5D7D
5DB3:  89 B1 C7     sbw     $17,$sy,jr &H5D7C
5DB6:  41 1D 04     sbc     $29,&H04
5DB9:  B0 B9        jr      z,&H5D73
5DBB:  04 3D        anc     $29,$sy
5DBD:  B4 9F        jr      nz,&H5D5D
5DBF:  41 18 08     sbc     $24,&H08
5DC2:  B0 A7        jr      z,&H5D6A
5DC4:  37 44 5B     jp      &H5B44
5DC7:  77 97 03     cal     &H0397
5DCA:  D6 00 00 10  pre     ix,&H1000
5DCE:  2C 60 16     ldd     $0,(ix+$22)
5DD1:  78 1F 1F     adc     (ix+&H1F),$31
5DD4:  B4 0D        jr      nz,&H5DE2
5DD6:  77 3D 59     cal     &H593D
5DD9:  B1 F3        jr      nc,&H5DCD
5DDB:  41 1D 04     sbc     $29,&H04
5DDE:  B0 DE        jr      z,&H5DBD
5DE0:  B7 C5        jr      &H5DA6
5DE2:  48 16 20     ad      $22,&H20
5DE5:  41 1D 04     sbc     $29,&H04
5DE8:  B0 F7        jr      z,&H5DE0
5DEA:  02 77 16     ld      $23,$22
5DED:  37 9B 5B     jp      &H5B9B
5DF0:  77 97 03     cal     &H0397
5DF3:  00 16        adc     $22,$sx
5DF5:  B4 22        jr      nz,&H5E18
5DF7:  77 5C 59     cal     &H595C
5DFA:  B5 A0        jr      c,&H5D9B
5DFC:  9E 53        gre     iz,$19
5DFE:  77 37 5C     cal     &H5C37
5E01:  D6 00 00 10  pre     ix,&H1000
5E05:  42 16 DF     ld      $22,&HDF
5E08:  38 7F 16     adc     (ix+$22),$31
5E0B:  B4 06        jr      nz,&H5E12
5E0D:  49 16 20     sb      $22,&H20
5E10:  B1 89        jr      nc,&H5D9A
5E12:  4C 16 E0     an      $22,&HE0
5E15:  89 B1 B5     sbw     $17,$sy,jr &H5DCC
5E18:  49 96 20 B6  sb      $22,&H20,jr &H5DD1
5E1C:  89 76 16     sbw     $22,$22
5E1F:  96 59        pre     iz,$25
5E21:  9E 53        gre     iz,$19
5E23:  82 31        ldw     $17,$sy
5E25:  77 37 5C     cal     &H5C37
5E28:  B7 C4        jr      &H5DED
5E2A:  04 3D        anc     $29,$sy
5E2C:  B4 17        jr      nz,&H5E44
5E2E:  77 C0 59     cal     &H59C0
5E31:  82 71 0F     ldw     $17,$15
5E34:  81 31        sbcw    $17,$sy
5E36:  B0 1D        jr      z,&H5E54
5E38:  77 0B 5A     cal     &H5A0B
5E3B:  B0 0F        jr      z,&H5E4B
5E3D:  89 31        sbw     $17,$sy
5E3F:  77 99 59     cal     &H5999
5E42:  B7 11        jr      &H5E54
5E44:  77 3D 59     cal     &H593D
5E47:  9E 53        gre     iz,$19
5E49:  B1 86        jr      nc,&H5DD0
5E4B:  77 5C 59     cal     &H595C
5E4E:  04 3D        anc     $29,$sy
5E50:  B4 03        jr      nz,&H5E54
5E52:  89 31        sbw     $17,$sy
5E54:  89 76 16     sbw     $22,$22
5E57:  9E 53        gre     iz,$19
5E59:  B7 B5        jr      &H5E0F
5E5B:  04 3D        anc     $29,$sy
5E5D:  F4           rtn     nz
5E5E:  41 1D 04     sbc     $29,&H04
5E61:  F0           rtn     z
5E62:  01 38        sbc     $24,$sy
5E64:  F4           rtn     nz
5E65:  77 3D 59     cal     &H593D
5E68:  77 0B 5A     cal     &H5A0B
5E6B:  F0           rtn     z
5E6C:  AE 00        ppsw    $0
5E6E:  77 6A 03     cal     &H036A
5E71:  77 30 5C     cal     &H5C30
5E74:  77 37 5C     cal     &H5C37
5E77:  77 18 5D     cal     &H5D18
5E7A:  B7 0A        jr      &H5E85
5E7C:  41 1D 04     sbc     $29,&H04
5E7F:  30 02 20     jp      z,&H2002
5E82:  77 97 03     cal     &H0397
5E85:  77 38 93     cal     &H9338
5E88:  02 00        ld      $0,$sx
5E8A:  77 C9 5C     cal     &H5CC9
5E8D:  02 0A        ld      $10,$sx
5E8F:  02 6B 0D     ld      $11,$13
5E92:  41 0B 7F     sbc     $11,&H7F
5E95:  B5 04        jr      c,&H5E9A
5E97:  42 0B 7F     ld      $11,&H7F
5E9A:  77 7F 97     cal     &H977F
5E9D:  02 60 16     ld      $0,$22
5EA0:  D6 00 E0 1B  pre     ix,&H1BE0
5EA4:  38 1F        adc     (ix+$sx),$31
5EA6:  B0 05        jr      z,&H5EAC
5EA8:  24 1F        std     $31,(ix+$sx)
5EAA:  28 A0        ld      $0,(ix-$sy)
5EAC:  02 61 16     ld      $1,$22
5EAF:  04 3D        anc     $29,$sy
5EB1:  B4 22        jr      nz,&H5ED4
5EB3:  41 01 C0     sbc     $1,&HC0
5EB6:  B5 04        jr      c,&H5EBB
5EB8:  42 01 A0     ld      $1,&HA0
5EBB:  D6 00 01 11  pre     ix,&H1101
5EBF:  A0 00        stw     $0,(ix+$sx)
5EC1:  77 1B 03     cal     &H031B
5EC4:  42 18 08     ld      $24,&H08
5EC7:  04 3D        anc     $29,$sy
5EC9:  B4 04        jr      nz,&H5ECE
5ECB:  42 18 02     ld      $24,&H02
5ECE:  77 14 96     cal     &H9614
5ED1:  37 A3 5B     jp      &H5BA3
5ED4:  41 01 A0     sbc     $1,&HA0
5ED7:  B5 9D        jr      c,&H5E75
5ED9:  42 81 80 A1  ld      $1,&H80,jr &H5E7D
5EDD:  77 26 5C     cal     &H5C26
5EE0:  41 1D 04     sbc     $29,&H04
5EE3:  B0 48        jr      z,&H5F2C
5EE5:  77 5B 5E     cal     &H5E5B
5EE8:  77 E3 2A     cal     &H2AE3
5EEB:  04 3D        anc     $29,$sy
5EED:  B4 08        jr      nz,&H5EF6
5EEF:  77 3D 59     cal     &H593D
5EF2:  88 31        adw     $17,$sy
5EF4:  9E 53        gre     iz,$19
5EF6:  37 4C 5B     jp      &H5B4C
5EF9:  41 10 E0     sbc     $16,&HE0
5EFC:  B5 29        jr      c,&H5F26
5EFE:  41 10 EE     sbc     $16,&HEE
5F01:  30 5C 60     jp      z,&H605C
5F04:  41 10 EF     sbc     $16,&HEF
5F07:  30 5C 60     jp      z,&H605C
5F0A:  31 9D 24     jp      nc,&H249D
5F0D:  41 10 E9     sbc     $16,&HE9
5F10:  30 9E 5F     jp      z,&H5F9E
5F13:  41 10 E2     sbc     $16,&HE2
5F16:  30 A9 5F     jp      z,&H5FA9
5F19:  41 10 E7     sbc     $16,&HE7
5F1C:  B0 76        jr      z,&H5F93
5F1E:  41 10 E6     sbc     $16,&HE6
5F21:  B0 18        jr      z,&H5F3A
5F23:  37 02 20     jp      &H2002
5F26:  77 26 5C     cal     &H5C26
5F29:  77 E3 2A     cal     &H2AE3
5F2C:  77 1B 03     cal     &H031B
5F2F:  77 74 97     cal     &H9774
5F32:  37 49 24     jp      &H2449
5F35:  77 26 5C     cal     &H5C26
5F38:  B7 8D        jr      &H5EC6
5F3A:  D6 00 00 10  pre     ix,&H1000
5F3E:  D6 20 FF 10  pre     iy,&H10FF
5F42:  D6 40 D3 18  pre     iz,&H18D3
5F46:  D8           bup   
5F47:  77 3D 59     cal     &H593D
5F4A:  B1 0B        jr      nc,&H5F56
5F4C:  04 3D        anc     $29,$sy
5F4E:  34 23 5B     jp      nz,&H5B23
5F51:  41 1D 04     sbc     $29,&H04
5F54:  B0 A0        jr      z,&H5EF5
5F56:  88 31        adw     $17,$sy
5F58:  9E 53        gre     iz,$19
5F5A:  41 1D 04     sbc     $29,&H04
5F5D:  34 7F 5B     jp      nz,&H5B7F
5F60:  02 16        ld      $22,$sx
5F62:  37 78 5D     jp      &H5D78
5F65:  77 BF 5F     cal     &H5FBF
5F68:  77 F2 22     cal     &H22F2
5F6B:  41 18 04     sbc     $24,&H04
5F6E:  B4 06        jr      nz,&H5F75
5F70:  77 DB 2A     cal     &H2ADB
5F73:  B7 1C        jr      &H5F90
5F75:  77 D3 95     cal     &H95D3
5F78:  B7 17        jr      &H5F90
5F7A:  77 26 5C     cal     &H5C26
5F7D:  77 5B 5E     cal     &H5E5B
5F80:  02 60 10     ld      $0,$16
5F83:  77 43 21     cal     &H2143
5F86:  41 1D 04     sbc     $29,&H04
5F89:  B0 DE        jr      z,&H5F68
5F8B:  01 38        sbc     $24,$sy
5F8D:  30 EB 5E     jp      z,&H5EEB
5F90:  37 A3 5B     jp      &H5BA3
5F93:  77 26 5C     cal     &H5C26
5F96:  77 5B 5E     cal     &H5E5B
5F99:  77 54 23     cal     &H2354
5F9C:  B7 97        jr      &H5F34
5F9E:  77 26 5C     cal     &H5C26
5FA1:  77 5B 5E     cal     &H5E5B
5FA4:  77 AA 21     cal     &H21AA
5FA7:  B7 A2        jr      &H5F4A
5FA9:  77 26 5C     cal     &H5C26
5FAC:  77 5B 5E     cal     &H5E5B
5FAF:  77 A7 21     cal     &H21A7
5FB2:  B7 AD        jr      &H5F60
5FB4:  77 26 5C     cal     &H5C26
5FB7:  77 5B 5E     cal     &H5E5B
5FBA:  77 DD 7B     cal     &H7BDD
5FBD:  B7 B8        jr      &H5F76
5FBF:  D6 00 03 11  pre     ix,&H1103
5FC3:  D1 00 FF 00  ldw     $0,&H00FF
5FC7:  E0 1F 40     stm     $31,(ix+$sx),3
5FCA:  37 5E 97     jp      &H975E
5FCD:  04 38        anc     $24,$sy
5FCF:  B4 08        jr      nz,&H5FD8
5FD1:  77 BF 5F     cal     &H5FBF
5FD4:  01 21        sbc     $1,$sy
5FD6:  B1 07        jr      nc,&H5FDE
5FD8:  37 A6 5D     jp      &H5DA6
5FDB:  77 BF 5F     cal     &H5FBF
5FDE:  04 3D        anc     $29,$sy
5FE0:  B4 3D        jr      nz,&H601E
5FE2:  D6 00 D5 19  pre     ix,&H19D5
5FE6:  89 40        sbw     $0,$sz
5FE8:  2B 02        ldi     $2,(iz+$sx)
5FEA:  00 02        adc     $2,$sx
5FEC:  B0 0A        jr      z,&H5FF7
5FEE:  22 02        sti     $2,(ix+$sx)
5FF0:  08 20        ad      $0,$sy
5FF2:  B1 8B        jr      nc,&H5F7E
5FF4:  37 7C 2B     jp      &H2B7C
5FF7:  00 00        adc     $0,$sx
5FF9:  B0 43        jr      z,&H603D
5FFB:  D1 02 0D 0A  ldw     $2,&H0A0D
5FFF:  A0 02        stw     $2,(ix+$sx)
6001:  88 20        adw     $0,$sy
6003:  88 20        adw     $0,$sy
6005:  41 18 08     sbc     $24,&H08
6008:  B4 3A        jr      nz,&H6043
600A:  82 62 13     ldw     $2,$19
600D:  77 B1 34     cal     &H34B1
6010:  82 44        ldw     $4,$sz
6012:  82 60 02     ldw     $0,$2
6015:  D1 02 D5 19  ldw     $2,&H19D5
6019:  77 F9 00     cal     &H00F9
601C:  B7 29        jr      &H6046
601E:  39 1F        adc     (iz+$sx),$31
6020:  B0 35        jr      z,&H6056
6022:  26 17        phs     $23
6024:  77 07 1D     cal     &H1D07
6027:  2E 17        pps     $23
6029:  00 0F        adc     $15,$sx
602B:  30 AC 2B     jp      z,&H2BAC
602E:  77 41 34     cal     &H3441
6031:  96 53        pre     iz,$19
6033:  39 1F        adc     (iz+$sx),$31
6035:  B4 20        jr      nz,&H6056
6037:  77 5C 59     cal     &H595C
603A:  9E D3 1A     gre     iz,$19,jr &H6056
603D:  41 18 08     sbc     $24,&H08
6040:  30 7F 5B     jp      z,&H5B7F
6043:  77 05 59     cal     &H5905
6046:  96 53        pre     iz,$19
6048:  77 18 5A     cal     &H5A18
604B:  B4 0A        jr      nz,&H6056
604D:  77 5C 59     cal     &H595C
6050:  B5 05        jr      c,&H6056
6052:  89 31        sbw     $17,$sy
6054:  9E 53        gre     iz,$19
6056:  37 88 5B     jp      &H5B88
6059:  08 B7 17     ad      $23,$sy,jr &H6072
605C:  04 3D        anc     $29,$sy
605E:  70 3A 5C     cal     z,&H5C3A
6061:  D6 00 E2 1B  pre     ix,&H1BE2
6065:  E8 00 E0     ldm     $0,(ix+$sx),8
6068:  96 53        pre     iz,$19
606A:  D1 09 20 2C  ldw     $9,&H2C20
606E:  D1 0B 1A 0D  ldw     $11,&H0D1A
6072:  3B 6B 17     sbc     (iz+$23),$11
6075:  B0 5D        jr      z,&H60D3
6077:  D6 00 8E 16  pre     ix,&H168E
607B:  BA 1E        sbcw    (ix+$sx),$30
607D:  B5 09        jr      c,&H6087
607F:  BA 11        sbcw    (ix+$sx),$17
6081:  B0 74        jr      z,&H60F6
6083:  B5 72        jr      c,&H60F6
6085:  B7 4D        jr      &H60D3
6087:  3B 69 17     sbc     (iz+$23),$9
608A:  B0 B2        jr      z,&H603D
608C:  3B 6A 17     sbc     (iz+$23),$10
608F:  B0 B7        jr      z,&H6047
6091:  3B 6C 17     sbc     (iz+$23),$12
6094:  B0 3E        jr      z,&H60D3
6096:  E9 69 F7     ldm     $9,(iz+$23),8
6099:  02 68 15     ld      $8,$21
609C:  01 28        sbc     $8,$sy
609E:  B5 46        jr      c,&H60E5
60A0:  77 25 9F     cal     &H9F25
60A3:  B4 28        jr      nz,&H60CC
60A5:  41 15 09     sbc     $21,&H09
60A8:  B5 3C        jr      c,&H60E5
60AA:  26 17        phs     $23
60AC:  48 17 08     ad      $23,&H08
60AF:  E9 69 F7     ldm     $9,(iz+$23),8
60B2:  E6 07 E0     phsm    $7,8
60B5:  D6 00 EA 1B  pre     ix,&H1BEA
60B9:  E8 00 E0     ldm     $0,(ix+$sx),8
60BC:  02 68 15     ld      $8,$21
60BF:  49 08 08     sb      $8,&H08
60C2:  77 25 9F     cal     &H9F25
60C5:  EE 00 E0     ppsm    $0,8
60C8:  2E 17        pps     $23
60CA:  B0 1A        jr      z,&H60E5
60CC:  08 37        ad      $23,$sy
60CE:  77 03 62     cal     &H6203
60D1:  B7 E0        jr      &H60B2
60D3:  77 C5 29     cal     &H29C5
60D6:  77 3D 59     cal     &H593D
60D9:  B5 31        jr      c,&H610B
60DB:  9E 53        gre     iz,$19
60DD:  89 76 16     sbw     $22,$22
60E0:  88 31        adw     $17,$sy
60E2:  37 5C 60     jp      &H605C
60E5:  02 76 17     ld      $22,$23
60E8:  4C 16 E0     an      $22,&HE0
60EB:  77 20 62     cal     &H6220
60EE:  77 DF 59     cal     &H59DF
60F1:  08 37        ad      $23,$sy
60F3:  77 03 62     cal     &H6203
60F6:  41 1D 04     sbc     $29,&H04
60F9:  30 02 20     jp      z,&H2002
60FC:  77 3A 5C     cal     &H5C3A
60FF:  D6 00 8E 16  pre     ix,&H168E
6103:  BA 1E        sbcw    (ix+$sx),$30
6105:  31 9B 5B     jp      nc,&H5B9B
6108:  37 9E 5B     jp      &H5B9E
610B:  41 1D 04     sbc     $29,&H04
610E:  30 35 5F     jp      z,&H5F35
6111:  37 23 5B     jp      &H5B23
6114:  44 01 08     anc     $1,&H08
6117:  F0           rtn     z
6118:  D1 00 5C 17  ldw     $0,&H175C
611C:  11 41        ld      $1,($sz)
611E:  04 21        anc     $1,$sy
6120:  F4           rtn     nz
6121:  20 01        st      $1,(ix+$sx)
6123:  F7           rtn   
6124:  41 1D 06     sbc     $29,&H06
6127:  34 A3 5B     jp      nz,&H5BA3
612A:  02 00        ld      $0,$sx
612C:  D6 00 8E 16  pre     ix,&H168E
6130:  A0 1F        stw     $31,(ix+$sx)
6132:  77 10 03     cal     &H0310
6135:  B0 64        jr      z,&H619A
6137:  77 A9 5A     cal     &H5AA9
613A:  77 5E 97     cal     &H975E
613D:  D6 00 3A 12  pre     ix,&H123A
6141:  3A 1F        sbc     (ix+$sx),$31
6143:  34 7C 2B     jp      nz,&H2B7C
6146:  77 A0 61     cal     &H61A0
6149:  B7 50        jr      &H619A
614B:  56 60 54     pst     ua,&H54
614E:  77 6A 29     cal     &H296A
6151:  B4 23        jr      nz,&H6175
6153:  77 72 29     cal     &H2972
6156:  B4 46        jr      nz,&H619D
6158:  77 14 61     cal     &H6114
615B:  B4 41        jr      nz,&H619D
615D:  3A 3F        sbc     (ix+$sy),$31
615F:  B4 3D        jr      nz,&H619D
6161:  77 BC 28     cal     &H28BC
6164:  77 7E 27     cal     &H277E
6167:  77 9B 52     cal     &H529B
616A:  D6 00 8E 16  pre     ix,&H168E
616E:  89 40        sbw     $0,$sz
6170:  A0 00        stw     $0,(ix+$sx)
6172:  77 AA 29     cal     &H29AA
6175:  42 04 24     ld      $4,&H24
6178:  77 A4 5A     cal     &H5AA4
617B:  77 23 03     cal     &H0323
617E:  D1 02 35 5F  ldw     $2,&H5F35
6182:  77 7A 29     cal     &H297A
6185:  D6 00 C4 16  pre     ix,&H16C4
6189:  42 1D 04     ld      $29,&H04
618C:  22 1D        sti     $29,(ix+$sx)
618E:  20 3F        st      $31,(ix+$sy)
6190:  77 74 97     cal     &H9774
6193:  77 10 03     cal     &H0310
6196:  B4 DD        jr      nz,&H6174
6198:  02 15        ld      $21,$sx
619A:  37 5C 60     jp      &H605C
619D:  37 02 20     jp      &H2002
61A0:  D6 00 8E 16  pre     ix,&H168E
61A4:  89 40        sbw     $0,$sz
61A6:  A0 00        stw     $0,(ix+$sx)
61A8:  2D 00        ldd     $0,(iz+$sx)
61AA:  41 00 2A     sbc     $0,&H2A
61AD:  B4 31        jr      nz,&H61DF
61AF:  D1 00 C5 16  ldw     $0,&H16C5
61B3:  11 40        ld      $0,($sz)
61B5:  44 00 0C     anc     $0,&H0C
61B8:  B0 26        jr      z,&H61DF
61BA:  2D 20        ldd     $0,(iz+$sy)
61BC:  A6 12        phsw    $18
61BE:  77 E6 1E     cal     &H1EE6
61C1:  B5 08        jr      c,&H61CA
61C3:  01 00        sbc     $0,$sx
61C5:  34 70 2B     jp      nz,&H2B70
61C8:  01 31        sbc     $17,$sy
61CA:  35 A4 2B     jp      c,&H2BA4
61CD:  A0 11        stw     $17,(ix+$sx)
61CF:  D6 00 E2 1B  pre     ix,&H1BE2
61D3:  C9 40 E0     sbbm    $0,$sz,8
61D6:  E2 00 E0     stim    $0,(ix+$sx),8
61D9:  E0 00 E0     stm     $0,(ix+$sx),8
61DC:  AE 11        ppsw    $17
61DE:  F7           rtn   
61DF:  D6 00 E2 1B  pre     ix,&H1BE2
61E3:  EB 00 E0     ldim    $0,(iz+$sx),8
61E6:  E2 00 E0     stim    $0,(ix+$sx),8
61E9:  E9 00 E0     ldm     $0,(iz+$sx),8
61EC:  E0 00 E0     stm     $0,(ix+$sx),8
61EF:  6D 95 08     ldd     $21,(iz-&H08)
61F2:  02 15        ld      $21,$sx
61F4:  42 01 10     ld      $1,&H10
61F7:  2B 00        ldi     $0,(iz+$sx)
61F9:  00 00        adc     $0,$sx
61FB:  F0           rtn     z
61FC:  08 35        ad      $21,$sy
61FE:  09 21        sb      $1,$sy
6200:  B4 8A        jr      nz,&H618B
6202:  F7           rtn   
6203:  96 53        pre     iz,$19
6205:  D1 09 20 2C  ldw     $9,&H2C20
6209:  D1 0B 1A 0D  ldw     $11,&H0D1A
620D:  3B 69 17     sbc     (iz+$23),$9
6210:  F0           rtn     z
6211:  3B 6A 17     sbc     (iz+$23),$10
6214:  F0           rtn     z
6215:  3B 6B 17     sbc     (iz+$23),$11
6218:  F0           rtn     z
6219:  3B 6C 17     sbc     (iz+$23),$12
621C:  F0           rtn     z
621D:  08 B7 92     ad      $23,$sy,jr &H61B1
6220:  77 38 93     cal     &H9338
6223:  D6 00 09 11  pre     ix,&H1109
6227:  2C 00        ldd     $0,(ix+$sx)
6229:  18 40        bid     $0
622B:  B5 2D        jr      c,&H6259
622D:  D1 0C 80 80  ldw     $12,&H8080
6231:  42 0B 7F     ld      $11,&H7F
6234:  02 0A        ld      $10,$sx
6236:  96 53        pre     iz,$19
6238:  2D 60 16     ldd     $0,(iz+$22)
623B:  D6 00 3B 11  pre     ix,&H113B
623F:  D1 00 0D 0A  ldw     $0,&H0A0D
6243:  2B 05        ldi     $5,(iz+$sx)
6245:  01 45        sbc     $5,$sz
6247:  B4 19        jr      nz,&H6261
6249:  77 88 0B     cal     &H0B88
624C:  77 18 5A     cal     &H5A18
624F:  B0 06        jr      z,&H6256
6251:  77 B4 5C     cal     &H5CB4
6254:  B1 92        jr      nc,&H61E7
6256:  37 A3 5C     jp      &H5CA3
6259:  D1 0C A0 A0  ldw     $12,&HA0A0
625D:  42 8B 5F AC  ld      $11,&H5F,jr &H620C
6261:  41 05 1A     sbc     $5,&H1A
6264:  B0 8F        jr      z,&H61F4
6266:  22 05        sti     $5,(ix+$sx)
6268:  08 AD 96     ad      $13,$sy,jr &H6200
626B:  D7 00 D7 1B  pre     ss,&H1BD7
626F:  02 02        ld      $2,$sx
6271:  77 86 66     cal     &H6686
6274:  D6 00 B4 16  pre     ix,&H16B4
6278:  24 1F        std     $31,(ix+$sx)
627A:  D1 11 1E 18  ldw     $17,&H181E
627E:  77 14 83     cal     &H8314
6281:  B5 05        jr      c,&H6287
6283:  D1 11 5B 18  ldw     $17,&H185B
6287:  77 3D 65     cal     &H653D
628A:  77 5F 65     cal     &H655F
628D:  41 00 31     sbc     $0,&H31
6290:  B5 87        jr      c,&H6218
6292:  30 26 64     jp      z,&H6426
6295:  41 00 33     sbc     $0,&H33
6298:  35 26 64     jp      c,&H6426
629B:  B4 92        jr      nz,&H622E
629D:  77 14 83     cal     &H8314
62A0:  B1 97        jr      nc,&H6238
62A2:  D1 11 45 26  ldw     $17,&H2645
62A6:  77 3D 65     cal     &H653D
62A9:  77 30 29     cal     &H2930
62AC:  42 01 10     ld      $1,&H10
62AF:  24 01        std     $1,(ix+$sx)
62B1:  77 2E 8B     cal     &H8B2E
62B4:  D6 00 58 15  pre     ix,&H1558
62B8:  3A BF        sbc     (ix-$sy),$31
62BA:  B0 05        jr      z,&H62C0
62BC:  24 BF        std     $31,(ix-$sy)
62BE:  B7 8B        jr      &H624A
62C0:  3A 3F        sbc     (ix+$sy),$31
62C2:  74 93 85     cal     nz,&H8593
62C5:  D6 00 58 15  pre     ix,&H1558
62C9:  3A BF        sbc     (ix-$sy),$31
62CB:  B4 90        jr      nz,&H625C
62CD:  3A 3F        sbc     (ix+$sy),$31
62CF:  B0 0C        jr      z,&H62DC
62D1:  77 93 85     cal     &H8593
62D4:  77 90 85     cal     &H8590
62D7:  77 90 85     cal     &H8590
62DA:  B7 A7        jr      &H6282
62DC:  42 10 0D     ld      $16,&H0D
62DF:  77 C8 85     cal     &H85C8
62E2:  77 7C 01     cal     &H017C
62E5:  77 90 85     cal     &H8590
62E8:  41 00 0D     sbc     $0,&H0D
62EB:  B4 06        jr      nz,&H62F2
62ED:  77 E8 2A     cal     &H2AE8
62F0:  B7 8F        jr      &H6280
62F2:  41 00 1A     sbc     $0,&H1A
62F5:  30 98 63     jp      z,&H6398
62F8:  41 00 1B     sbc     $0,&H1B
62FB:  B0 72        jr      z,&H636E
62FD:  41 00 20     sbc     $0,&H20
6300:  B1 60        jr      nc,&H6361
6302:  D6 00 0F 11  pre     ix,&H110F
6306:  28 20        ld      $0,(ix+$sy)
6308:  24 00        std     $0,(ix+$sx)
630A:  77 71 01     cal     &H0171
630D:  77 F3 03     cal     &H03F3
6310:  42 03 03     ld      $3,&H03
6313:  42 00 41     ld      $0,&H41
6316:  77 81 03     cal     &H0381
6319:  01 01        sbc     $1,$sx
631B:  B0 0E        jr      z,&H632A
631D:  09 23        sb      $3,$sy
631F:  B4 8D        jr      nz,&H62AD
6321:  77 7C 01     cal     &H017C
6324:  42 01 80     ld      $1,&H80
6327:  37 E3 29     jp      &H29E3
632A:  D6 00 58 15  pre     ix,&H1558
632E:  3A BF        sbc     (ix-$sy),$31
6330:  B4 37        jr      nz,&H6368
6332:  3A 3F        sbc     (ix+$sy),$31
6334:  B4 D3        jr      nz,&H6308
6336:  D6 00 1B 11  pre     ix,&H111B
633A:  3A 1F        sbc     (ix+$sx),$31
633C:  B0 B3        jr      z,&H62F0
633E:  77 7C 01     cal     &H017C
6341:  77 6C 03     cal     &H036C
6344:  02 50        ld      $16,$sz
6346:  41 10 E0     sbc     $16,&HE0
6349:  B1 C8        jr      nc,&H6312
634B:  77 8F 19     cal     &H198F
634E:  B5 CD        jr      c,&H631C
6350:  77 C8 85     cal     &H85C8
6353:  42 10 0D     ld      $16,&H0D
6356:  77 C8 85     cal     &H85C8
6359:  42 10 0A     ld      $16,&H0A
635C:  77 C8 85     cal     &H85C8
635F:  B7 FE        jr      &H635E
6361:  02 50        ld      $16,$sz
6363:  77 F1 2A     cal     &H2AF1
6366:  B7 88        jr      &H62EF
6368:  77 7C 01     cal     &H017C
636B:  37 E7 85     jp      &H85E7
636E:  D6 00 01 11  pre     ix,&H1101
6372:  28 00        ld      $0,(ix+$sx)
6374:  02 41        ld      $1,$sz
6376:  77 51 68     cal     &H6851
6379:  77 17 03     cal     &H0317
637C:  77 02 20     cal     &H2002
637F:  77 28 03     cal     &H0328
6382:  77 FC 63     cal     &H63FC
6385:  77 0F 64     cal     &H640F
6388:  2B 10        ldi     $16,(iz+$sx)
638A:  01 10        sbc     $16,$sx
638C:  B0 06        jr      z,&H6393
638E:  77 C8 85     cal     &H85C8
6391:  B7 8A        jr      &H631C
6393:  77 D3 95     cal     &H95D3
6396:  B7 C4        jr      &H635B
6398:  D1 11 55 26  ldw     $17,&H2655
639C:  77 20 65     cal     &H6520
639F:  D6 00 01 11  pre     ix,&H1101
63A3:  28 00        ld      $0,(ix+$sx)
63A5:  02 41        ld      $1,$sz
63A7:  77 51 68     cal     &H6851
63AA:  77 17 03     cal     &H0317
63AD:  77 02 20     cal     &H2002
63B0:  77 FC 63     cal     &H63FC
63B3:  77 0F 64     cal     &H640F
63B6:  77 28 03     cal     &H0328
63B9:  2B 00        ldi     $0,(iz+$sx)
63BB:  77 2B 00     cal     &H002B
63BE:  02 51        ld      $17,$sz
63C0:  B1 30        jr      nc,&H63F1
63C2:  77 3C 00     cal     &H003C
63C5:  B1 2B        jr      nc,&H63F1
63C7:  77 D3 95     cal     &H95D3
63CA:  77 9B 52     cal     &H529B
63CD:  02 6E 11     ld      $14,$17
63D0:  4C 0E 0F     an      $14,&H0F
63D3:  77 25 34     cal     &H3425
63D6:  89 7B 19     sbw     $27,$25
63D9:  96 D9 04     pre     iz,$25,jr &H63DF
63DC:  77 C8 85     cal     &H85C8
63DF:  2B 10        ldi     $16,(iz+$sx)
63E1:  89 3B        sbw     $27,$sy
63E3:  B4 88        jr      nz,&H636C
63E5:  42 10 0D     ld      $16,&H0D
63E8:  77 C8 85     cal     &H85C8
63EB:  77 90 85     cal     &H8590
63EE:  37 DC 62     jp      &H62DC
63F1:  77 D3 95     cal     &H95D3
63F4:  42 10 0D     ld      $16,&H0D
63F7:  77 C8 85     cal     &H85C8
63FA:  B7 8D        jr      &H6388
63FC:  77 4D 97     cal     &H974D
63FF:  D6 40 06 11  pre     iz,&H1106
6403:  2D 00        ldd     $0,(iz+$sx)
6405:  D6 40 3B 11  pre     iz,&H113B
6409:  2D 41        ldd     $1,(iz+$sz)
640B:  F7           rtn   
640C:  77 93 85     cal     &H8593
640F:  D6 00 58 15  pre     ix,&H1558
6413:  3A BF        sbc     (ix-$sy),$31
6415:  34 E7 85     jp      nz,&H85E7
6418:  3A 3F        sbc     (ix+$sy),$31
641A:  B4 8F        jr      nz,&H63AA
641C:  F7           rtn   
641D:  D6 00 D1 16  pre     ix,&H16D1
6421:  2C 01        ldd     $1,(ix+$sx)
6423:  04 21        anc     $1,$sy
6425:  F7           rtn   
6426:  D6 00 D1 16  pre     ix,&H16D1
642A:  24 00        std     $0,(ix+$sx)
642C:  B7 1D        jr      &H644A
642E:  77 70 65     cal     &H6570
6431:  B7 18        jr      &H644A
6433:  D1 11 0C 1A  ldw     $17,&H1A0C
6437:  04 22        anc     $2,$sy
6439:  B0 05        jr      z,&H643F
643B:  D1 11 7B 1C  ldw     $17,&H1C7B
643F:  77 00 65     cal     &H6500
6442:  B7 07        jr      &H644A
6444:  D6 00 B4 16  pre     ix,&H16B4
6448:  3C 1E        ad      (ix+$sx),$30
644A:  D7 00 D7 1B  pre     ss,&H1BD7
644E:  77 80 66     cal     &H6680
6451:  D1 02 4A 64  ldw     $2,&H644A
6455:  77 B3 66     cal     &H66B3
6458:  D1 11 E1 18  ldw     $17,&H18E1
645C:  77 1D 64     cal     &H641D
645F:  B4 05        jr      nz,&H6465
6461:  D1 11 4B 1B  ldw     $17,&H1B4B
6465:  D6 00 B4 16  pre     ix,&H16B4
6469:  2C 00        ldd     $0,(ix+$sx)
646B:  04 20        anc     $0,$sy
646D:  B0 0D        jr      z,&H647B
646F:  D1 11 88 18  ldw     $17,&H1888
6473:  04 21        anc     $1,$sy
6475:  B4 05        jr      nz,&H647B
6477:  D1 11 EF 1A  ldw     $17,&H1AEF
647B:  77 3D 65     cal     &H653D
647E:  D7 00 D7 1B  pre     ss,&H1BD7
6482:  77 5F 65     cal     &H655F
6485:  D1 14 BB 69  ldw     $20,&H69BB
6489:  D1 19 D8 1E  ldw     $25,&H1ED8
648D:  42 16 06     ld      $22,&H06
6490:  D1 11 39 1A  ldw     $17,&H1A39
6494:  77 1D 64     cal     &H641D
6497:  B4 10        jr      nz,&H64A8
6499:  D1 14 C7 69  ldw     $20,&H69C7
649D:  D1 19 20 1F  ldw     $25,&H1F20
64A1:  42 16 0F     ld      $22,&H0F
64A4:  D1 11 A9 1C  ldw     $17,&H1CA9
64A8:  04 21        anc     $1,$sy
64AA:  B0 07        jr      z,&H64B2
64AC:  41 00 54     sbc     $0,&H54
64AF:  30 74 68     jp      z,&H6874
64B2:  41 00 50     sbc     $0,&H50
64B5:  30 2E 64     jp      z,&H642E
64B8:  D1 19 D4 1F  ldw     $25,&H1FD4
64BC:  04 21        anc     $1,$sy
64BE:  B4 05        jr      nz,&H64C4
64C0:  D1 19 E0 1F  ldw     $25,&H1FE0
64C4:  41 00 4C     sbc     $0,&H4C
64C7:  B0 93        jr      z,&H645B
64C9:  04 21        anc     $1,$sy
64CB:  82 21        ldw     $1,$sy
64CD:  B4 05        jr      nz,&H64D3
64CF:  D1 01 01 01  ldw     $1,&H0101
64D3:  41 00 49     sbc     $0,&H49
64D6:  B0 23        jr      z,&H64FA
64D8:  41 00 46     sbc     $0,&H46
64DB:  30 44 64     jp      z,&H6444
64DE:  04 22        anc     $2,$sy
64E0:  B0 0D        jr      z,&H64EE
64E2:  41 00 58     sbc     $0,&H58
64E5:  30 14 69     jp      z,&H6914
64E8:  41 00 59     sbc     $0,&H59
64EB:  30 59 69     jp      z,&H6959
64EE:  49 00 43     sb      $0,&H43
64F1:  30 33 64     jp      z,&H6433
64F4:  02 01        ld      $1,$sx
64F6:  01 20        sbc     $0,$sy
64F8:  B4 FB        jr      nz,&H64F4
64FA:  77 C8 66     cal     &H66C8
64FD:  37 4A 64     jp      &H644A
6500:  77 3D 65     cal     &H653D
6503:  77 5F 65     cal     &H655F
6506:  41 00 0D     sbc     $0,&H0D
6509:  B0 05        jr      z,&H650F
650B:  41 00 59     sbc     $0,&H59
650E:  F4           rtn     nz
650F:  37 2F 43     jp      &H432F
6512:  04 21        anc     $1,$sy
6514:  B0 04        jr      z,&H6519
6516:  4E 00 02     or      $0,&H02
6519:  08 40        ad      $0,$sz
651B:  56 60 A4     pst     ua,&HA4
651E:  A8 51        ldw     $17,(ix+$sz)
6520:  9E 40        gre     iz,$0
6522:  96 D1 08     pre     iz,$17,jr &H652C
6525:  A6 01        phsw    $1
6527:  77 F1 2A     cal     &H2AF1
652A:  AE 00        ppsw    $0
652C:  56 60 A4     pst     ua,&HA4
652F:  2B 10        ldi     $16,(iz+$sx)
6531:  56 60 54     pst     ua,&H54
6534:  01 30        sbc     $16,$sy
6536:  B4 92        jr      nz,&H64C9
6538:  9E 51        gre     iz,$17
653A:  96 40        pre     iz,$0
653C:  F7           rtn   
653D:  77 49 65     cal     &H6549
6540:  77 20 65     cal     &H6520
6543:  77 91 29     cal     &H2991
6546:  37 F5 92     jp      &H92F5
6549:  77 8D 29     cal     &H298D
654C:  37 DF 2A     jp      &H2ADF
654F:  77 49 65     cal     &H6549
6552:  D1 11 DD 16  ldw     $17,&H16DD
6556:  77 20 65     cal     &H6520
6559:  77 94 7B     cal     &H7B94
655C:  77 43 65     cal     &H6543
655F:  77 2E 03     cal     &H032E
6562:  77 C8 23     cal     &H23C8
6565:  77 B6 00     cal     &H00B6
6568:  26 00        phs     $0
656A:  77 1B 03     cal     &H031B
656D:  2E 00        pps     $0
656F:  F7           rtn   
6570:  89 77 17     sbw     $23,$23
6573:  41 00 4C     sbc     $0,&H4C
6576:  B0 20        jr      z,&H6597
6578:  77 3D 65     cal     &H653D
657B:  77 89 29     cal     &H2989
657E:  77 E8 2A     cal     &H2AE8
6581:  82 71 19     ldw     $17,$25
6584:  77 20 65     cal     &H6520
6587:  77 4E 66     cal     &H664E
658A:  77 E8 2A     cal     &H2AE8
658D:  08 38        ad      $24,$sy
658F:  01 78 16     sbc     $24,$22
6592:  B4 8F        jr      nz,&H6522
6594:  37 91 29     jp      &H2991
6597:  89 77 17     sbw     $23,$23
659A:  49 16 04     sb      $22,&H04
659D:  02 78 17     ld      $24,$23
65A0:  77 49 65     cal     &H6549
65A3:  96 19        pre     ix,$25
65A5:  56 60 A4     pst     ua,&HA4
65A8:  77 25 66     cal     &H6625
65AB:  82 71 02     ldw     $17,$2
65AE:  77 38 92     cal     &H9238
65B1:  B4 08        jr      nz,&H65BA
65B3:  D1 02 0F 00  ldw     $2,&H000F
65B7:  88 71 02     adw     $17,$2
65BA:  77 20 65     cal     &H6520
65BD:  77 4E 66     cal     &H664E
65C0:  02 60 18     ld      $0,$24
65C3:  09 60 17     sb      $0,$23
65C6:  41 00 03     sbc     $0,&H03
65C9:  B0 07        jr      z,&H65D1
65CB:  77 E8 2A     cal     &H2AE8
65CE:  08 B8 AD     ad      $24,$sy,jr &H657D
65D1:  D6 40 4E 15  pre     iz,&H154E
65D5:  E9 06 A0     ldm     $6,(iz+$sx),6
65D8:  C9 40 A0     sbbm    $0,$sz,6
65DB:  D1 00 08 08  ldw     $0,&H0808
65DF:  42 03 3E     ld      $3,&H3E
65E2:  E1 00 A0     stm     $0,(iz+$sx),6
65E5:  E6 0B A0     phsm    $11,6
65E8:  77 43 65     cal     &H6543
65EB:  EE 00 A0     ppsm    $0,6
65EE:  E1 00 A0     stm     $0,(iz+$sx),6
65F1:  77 5F 65     cal     &H655F
65F4:  41 00 0D     sbc     $0,&H0D
65F7:  B0 1E        jr      z,&H6616
65F9:  41 00 1C     sbc     $0,&H1C
65FC:  B5 8C        jr      c,&H6589
65FE:  41 00 1E     sbc     $0,&H1E
6601:  F5           rtn     c
6602:  B0 1B        jr      z,&H661E
6604:  41 00 1F     sbc     $0,&H1F
6607:  B4 97        jr      nz,&H659F
6609:  01 77 16     sbc     $23,$22
660C:  B0 9C        jr      z,&H65A9
660E:  08 37        ad      $23,$sy
6610:  77 97 03     cal     &H0397
6613:  37 9D 65     jp      &H659D
6616:  08 37        ad      $23,$sy
6618:  01 76 17     sbc     $22,$23
661B:  B1 89        jr      nc,&H65A5
661D:  F7           rtn   
661E:  01 37        sbc     $23,$sy
6620:  B5 B0        jr      c,&H65D1
6622:  09 B7 94     sb      $23,$sy,jr &H65B8
6625:  02 60 18     ld      $0,$24
6628:  08 40        ad      $0,$sz
662A:  A8 42        ldw     $2,(ix+$sz)
662C:  56 60 54     pst     ua,&H54
662F:  F7           rtn   
6630:  77 EF 2C     cal     &H2CEF
6633:  82 70 08     ldw     $16,$8
6636:  77 F1 2A     cal     &H2AF1
6639:  9A 51        bydw    $17
663B:  77 F1 2A     cal     &H2AF1
663E:  37 2C 2D     jp      &H2D2C
6641:  97 02        pre     ss,$2
6643:  77 BA 66     cal     &H66BA
6646:  77 D7 2A     cal     &H2AD7
6649:  77 30 66     cal     &H6630
664C:  B7 20        jr      &H666D
664E:  A6 12        phsw    $18
6650:  E6 1A E0     phsm    $26,8
6653:  9F 04        gre     ss,$4
6655:  D1 02 41 66  ldw     $2,&H6641
6659:  77 B3 66     cal     &H66B3
665C:  96 14        pre     ix,$20
665E:  56 60 04     pst     ua,&H04
6661:  77 25 66     cal     &H6625
6664:  77 81 7D     cal     &H7D81
6667:  77 1F 13     cal     &H131F
666A:  77 D5 97     cal     &H97D5
666D:  EE 13 E0     ppsm    $19,8
6670:  AE 11        ppsw    $17
6672:  F7           rtn   
6673:  42 02 08     ld      $2,&H08
6676:  42 81 40 16  ld      $1,&H40,jr &H668F
667A:  42 02 04     ld      $2,&H04
667D:  02 81 10     ld      $1,$sx,jr &H668F
6680:  02 A2 13     ld      $2,$sy,jr &H6695
6683:  42 02 02     ld      $2,&H02
6686:  D6 00 13 11  pre     ix,&H1113
668A:  2C 01        ldd     $1,(ix+$sx)
668C:  4C 01 40     an      $1,&H40
668F:  D6 00 13 11  pre     ix,&H1113
6693:  24 01        std     $1,(ix+$sx)
6695:  56 60 54     pst     ua,&H54
6698:  26 02        phs     $2
669A:  77 7E 27     cal     &H277E
669D:  2E 02        pps     $2
669F:  02 03        ld      $3,$sx
66A1:  02 01        ld      $1,$sx
66A3:  77 71 24     cal     &H2471
66A6:  77 74 97     cal     &H9774
66A9:  77 23 03     cal     &H0323
66AC:  D1 02 C2 66  ldw     $2,&H66C2
66B0:  77 7A 29     cal     &H297A
66B3:  D6 00 BA 16  pre     ix,&H16BA
66B7:  E0 02 60     stm     $2,(ix+$sx),4
66BA:  D6 60 D0 1C  pre     us,&H1CD0
66BE:  56 60 54     pst     ua,&H54
66C1:  F7           rtn   
66C2:  77 91 29     cal     &H2991
66C5:  37 46 24     jp      &H2446
66C8:  D6 00 B5 16  pre     ix,&H16B5
66CC:  A0 01        stw     $1,(ix+$sx)
66CE:  77 49 65     cal     &H6549
66D1:  D6 00 B5 16  pre     ix,&H16B5
66D5:  A8 00        ldw     $0,(ix+$sx)
66D7:  D6 00 B4 16  pre     ix,&H16B4
66DB:  2C 02        ldd     $2,(ix+$sx)
66DD:  04 22        anc     $2,$sy
66DF:  B0 04        jr      z,&H66E4
66E1:  4E 00 04     or      $0,&H04
66E4:  D6 00 FE 1F  pre     ix,&H1FFE
66E8:  77 12 65     cal     &H6512
66EB:  A6 12        phsw    $18
66ED:  D1 11 0E 20  ldw     $17,&H200E
66F1:  77 20 65     cal     &H6520
66F4:  02 10        ld      $16,$sx
66F6:  77 A9 67     cal     &H67A9
66F9:  D1 11 13 20  ldw     $17,&H2013
66FD:  D6 00 B4 16  pre     ix,&H16B4
6701:  2C 00        ldd     $0,(ix+$sx)
6703:  04 20        anc     $0,$sy
6705:  B4 05        jr      nz,&H670B
6707:  D1 11 1E 20  ldw     $17,&H201E
670B:  77 20 65     cal     &H6520
670E:  AE 11        ppsw    $17
6710:  77 20 65     cal     &H6520
6713:  77 43 65     cal     &H6543
6716:  D1 00 42 4D  ldw     $0,&H4D42
671A:  77 E0 67     cal     &H67E0
671D:  F0           rtn     z
671E:  D6 00 F1 16  pre     ix,&H16F1
6722:  E2 0A E0     stim    $10,(ix+$sx),8
6725:  24 12        std     $18,(ix+$sx)
6727:  C9 6A EA     sbbm    $10,$10,8
672A:  02 12        ld      $18,$sx
672C:  D1 00 52 5D  ldw     $0,&H5D52
6730:  D6 00 B5 16  pre     ix,&H16B5
6734:  3A 3E        sbc     (ix+$sy),$30
6736:  70 E0 67     cal     z,&H67E0
6739:  F0           rtn     z
673A:  D6 00 FA 16  pre     ix,&H16FA
673E:  E2 0A E0     stim    $10,(ix+$sx),8
6741:  24 12        std     $18,(ix+$sx)
6743:  77 69 06     cal     &H0669
6746:  77 B8 06     cal     &H06B8
6749:  D6 00 B4 16  pre     ix,&H16B4
674D:  2C 00        ldd     $0,(ix+$sx)
674F:  04 20        anc     $0,$sy
6751:  B0 17        jr      z,&H6769
6753:  D1 00 62 6D  ldw     $0,&H6D62
6757:  77 51 68     cal     &H6851
675A:  42 10 31     ld      $16,&H31
675D:  77 F1 2A     cal     &H2AF1
6760:  D1 00 62 6D  ldw     $0,&H6D62
6764:  77 E0 67     cal     &H67E0
6767:  B0 95        jr      z,&H66FD
6769:  D6 00 B5 16  pre     ix,&H16B5
676D:  3A 1F        sbc     (ix+$sx),$31
676F:  70 B2 05     cal     z,&H05B2
6772:  9F 04        gre     ss,$4
6774:  D1 02 81 67  ldw     $2,&H6781
6778:  77 B3 66     cal     &H66B3
677B:  77 5D 43     cal     &H435D
677E:  37 CE 66     jp      &H66CE
6781:  97 02        pre     ss,$2
6783:  77 BA 66     cal     &H66BA
6786:  D1 00 01 11  ldw     $0,&H1101
678A:  50 40 40     st      &H40,($sz)
678D:  D1 11 29 20  ldw     $17,&H2029
6791:  77 20 65     cal     &H6520
6794:  77 08 69     cal     &H6908
6797:  B7 9A        jr      &H6732
6799:  97 02        pre     ss,$2
679B:  77 BA 66     cal     &H66BA
679E:  77 8D 29     cal     &H298D
67A1:  77 D7 2A     cal     &H2AD7
67A4:  77 30 66     cal     &H6630
67A7:  B7 1C        jr      &H67C4
67A9:  A6 12        phsw    $18
67AB:  E6 1A E0     phsm    $26,8
67AE:  9F 04        gre     ss,$4
67B0:  D1 02 99 67  ldw     $2,&H6799
67B4:  77 B3 66     cal     &H66B3
67B7:  01 10        sbc     $16,$sx
67B9:  B0 17        jr      z,&H67D1
67BB:  77 AB 1C     cal     &H1CAB
67BE:  77 A7 13     cal     &H13A7
67C1:  77 D5 97     cal     &H97D5
67C4:  EE 13 E0     ppsm    $19,8
67C7:  AE 11        ppsw    $17
67C9:  D1 00 01 11  ldw     $0,&H1101
67CD:  50 40 35     st      &H35,($sz)
67D0:  F7           rtn   
67D1:  77 F4 1B     cal     &H1BF4
67D4:  B7 97        jr      &H676C
67D6:  97 02        pre     ss,$2
67D8:  42 10 02     ld      $16,&H02
67DB:  77 F1 2A     cal     &H2AF1
67DE:  B7 07        jr      &H67E6
67E0:  77 51 68     cal     &H6851
67E3:  77 17 03     cal     &H0317
67E6:  D1 02 D6 67  ldw     $2,&H67D6
67EA:  9F 04        gre     ss,$4
67EC:  77 B3 66     cal     &H66B3
67EF:  77 17 68     cal     &H6817
67F2:  77 53 97     cal     &H9753
67F5:  77 07 1D     cal     &H1D07
67F8:  D6 40 00 10  pre     iz,&H1000
67FC:  02 22        ld      $2,$sy
67FE:  3B 1F        sbc     (iz+$sx),$31
6800:  B0 09        jr      z,&H680A
6802:  77 2F 11     cal     &H112F
6805:  77 93 00     cal     &H0093
6808:  02 02        ld      $2,$sx
680A:  77 23 03     cal     &H0323
680D:  01 22        sbc     $2,$sy
680F:  F7           rtn   
6810:  42 00 43     ld      $0,&H43
6813:  26 00        phs     $0
6815:  B7 03        jr      &H6819
6817:  26 1F        phs     $31
6819:  77 02 20     cal     &H2002
681C:  2E 02        pps     $2
681E:  D6 00 06 11  pre     ix,&H1106
6822:  A8 00        ldw     $0,(ix+$sx)
6824:  01 02        sbc     $2,$sx
6826:  B0 04        jr      z,&H682B
6828:  02 60 02     ld      $0,$2
682B:  D6 00 3B 11  pre     ix,&H113B
682F:  D6 40 5E 16  pre     iz,&H165E
6833:  09 41        sb      $1,$sz
6835:  2C 40        ldd     $0,(ix+$sz)
6837:  42 02 21     ld      $2,&H21
683A:  2A 00        ldi     $0,(ix+$sx)
683C:  01 60 02     sbc     $0,$2
683F:  B5 06        jr      c,&H6846
6841:  42 02 20     ld      $2,&H20
6844:  23 00        sti     $0,(iz+$sx)
6846:  09 21        sb      $1,$sy
6848:  B1 8F        jr      nc,&H67D8
684A:  23 1F        sti     $31,(iz+$sx)
684C:  D6 40 5E 16  pre     iz,&H165E
6850:  F7           rtn   
6851:  D6 00 01 11  pre     ix,&H1101
6855:  24 00        std     $0,(ix+$sx)
6857:  6C 02 05     ldd     $2,(ix+&H05)
685A:  A0 00        stw     $0,(ix+$sx)
685C:  F7           rtn   
685D:  77 49 65     cal     &H6549
6860:  77 20 65     cal     &H6520
6863:  02 30        ld      $16,$sy
6865:  77 A9 67     cal     &H67A9
6868:  77 20 65     cal     &H6520
686B:  77 91 29     cal     &H2991
686E:  37 F5 92     jp      &H92F5
6871:  77 E8 68     cal     &H68E8
6874:  D7 00 D7 1B  pre     ss,&H1BD7
6878:  D1 11 CF 19  ldw     $17,&H19CF
687C:  77 3D 65     cal     &H653D
687F:  D1 00 62 6B  ldw     $0,&H6B62
6883:  77 E0 67     cal     &H67E0
6886:  30 4A 64     jp      z,&H644A
6889:  D1 02 71 68  ldw     $2,&H6871
688D:  77 B3 66     cal     &H66B3
6890:  77 54 00     cal     &H0054
6893:  77 65 1C     cal     &H1C65
6896:  77 6C 00     cal     &H006C
6899:  77 CE 05     cal     &H05CE
689C:  77 54 00     cal     &H0054
689F:  77 59 1C     cal     &H1C59
68A2:  77 6C 00     cal     &H006C
68A5:  77 44 06     cal     &H0644
68A8:  77 69 06     cal     &H0669
68AB:  02 27        ld      $7,$sy
68AD:  77 07 06     cal     &H0607
68B0:  77 69 06     cal     &H0669
68B3:  D1 06 05 01  ldw     $6,&H0105
68B7:  77 DA 05     cal     &H05DA
68BA:  77 54 00     cal     &H0054
68BD:  D1 00 01 11  ldw     $0,&H1101
68C1:  50 40 6C     st      &H6C,($sz)
68C4:  D1 11 61 20  ldw     $17,&H2061
68C8:  77 20 65     cal     &H6520
68CB:  77 5C 00     cal     &H005C
68CE:  D1 1C 98 05  ldw     $28,&H0598
68D2:  41 12 05     sbc     $18,&H05
68D5:  B1 03        jr      nc,&H68D9
68D7:  02 1D        ld      $29,$sx
68D9:  77 1B 09     cal     &H091B
68DC:  77 A7 13     cal     &H13A7
68DF:  77 D5 97     cal     &H97D5
68E2:  77 08 69     cal     &H6908
68E5:  37 74 68     jp      &H6874
68E8:  77 57 5D     cal     &H5D57
68EB:  77 EF 2C     cal     &H2CEF
68EE:  56 60 04     pst     ua,&H04
68F1:  D6 00 47 2D  pre     ix,&H2D47
68F5:  E8 0A A0     ldm     $10,(ix+$sx),6
68F8:  56 60 54     pst     ua,&H54
68FB:  D6 00 1C 15  pre     ix,&H151C
68FF:  E0 08 E0     stm     $8,(ix+$sx),8
6902:  77 1E 5D     cal     &H5D1E
6905:  77 79 03     cal     &H0379
6908:  77 2E 03     cal     &H032E
690B:  77 A4 03     cal     &H03A4
690E:  37 1B 03     jp      &H031B
6911:  77 E8 68     cal     &H68E8
6914:  D7 00 D7 1B  pre     ss,&H1BD7
6918:  D1 11 38 1E  ldw     $17,&H1E38
691C:  77 5D 68     cal     &H685D
691F:  D1 00 62 6B  ldw     $0,&H6B62
6923:  77 E0 67     cal     &H67E0
6926:  30 4A 64     jp      z,&H644A
6929:  D1 02 11 69  ldw     $2,&H6911
692D:  77 B3 66     cal     &H66B3
6930:  77 C9 1C     cal     &H1CC9
6933:  77 54 00     cal     &H0054
6936:  D1 00 01 11  ldw     $0,&H1101
693A:  50 40 6C     st      &H6C,($sz)
693D:  D1 11 D0 1E  ldw     $17,&H1ED0
6941:  D6 00 65 20  pre     ix,&H2065
6945:  77 9B 69     cal     &H699B
6948:  77 5C 00     cal     &H005C
694B:  77 A7 13     cal     &H13A7
694E:  77 D5 97     cal     &H97D5
6951:  77 08 69     cal     &H6908
6954:  B7 C1        jr      &H6916
6956:  77 E8 68     cal     &H68E8
6959:  D7 00 D7 1B  pre     ss,&H1BD7
695D:  D1 11 84 1E  ldw     $17,&H1E84
6961:  77 5D 68     cal     &H685D
6964:  D1 00 62 6B  ldw     $0,&H6B62
6968:  77 E0 67     cal     &H67E0
696B:  30 4A 64     jp      z,&H644A
696E:  D1 02 56 69  ldw     $2,&H6956
6972:  77 B3 66     cal     &H66B3
6975:  77 E1 1C     cal     &H1CE1
6978:  77 54 00     cal     &H0054
697B:  D1 00 01 11  ldw     $0,&H1101
697F:  50 40 6C     st      &H6C,($sz)
6982:  D1 11 D4 1E  ldw     $17,&H1ED4
6986:  D6 00 6B 20  pre     ix,&H206B
698A:  77 9B 69     cal     &H699B
698D:  77 5C 00     cal     &H005C
6990:  77 A7 13     cal     &H13A7
6993:  77 D5 97     cal     &H97D5
6996:  77 08 69     cal     &H6908
6999:  B7 C1        jr      &H695B
699B:  D6 40 4E 15  pre     iz,&H154E
699F:  E9 00 A0     ldm     $0,(iz+$sx),6
69A2:  E6 05 A0     phsm    $5,6
69A5:  56 60 A4     pst     ua,&HA4
69A8:  E8 00 A0     ldm     $0,(ix+$sx),6
69AB:  56 60 54     pst     ua,&H54
69AE:  E1 00 A0     stm     $0,(iz+$sx),6
69B1:  77 20 65     cal     &H6520
69B4:  EE 00 A0     ppsm    $0,6
69B7:  E1 00 A0     stm     $0,(iz+$sx),6
69BA:  F7           rtn   
69BB:  F4           rtn     nz
69BC:  1B           ****  
69BD:  F8           nop   
69BE:  1B 00        cmp     $0
69C0:  1C           ****  
69C1:  65 1C 59     std     $28,(iz+&H59)
69C4:  1C           ****  
69C5:  3F 1C        sb      (iz+$sx),$28
69C7:  F4           rtn     nz
69C8:  1B           ****  
69C9:  F8           nop   
69CA:  1B           ****  
69CB:  FC           cani  
69CC:  1B 00        cmp     $0
69CE:  1C 04        gpo     $4
69D0:  1C 08        gpo     $8
69D2:  1C           ****  
69D3:  65 1C 6A     std     $28,(iz+&H6A)
69D6:  1C 59        gfl     $25
69D8:  1C 5F        gfl     $31
69DA:  1C           ****  
69DB:  3F 1C        sb      (iz+$sx),$28
69DD:  43 1C 9B     ldc     $28,&H9B
69E0:  1C           ****  
69E1:  A6 1C        phsw    $28
69E3:  AB 1C        ldiw    $28,(iz+$sx)
69E5:  43 9E 8E 44  ldc     $30,&H8E,jr &H6A2C
69E9:  21 6A 45     st      $10,(iz+$5)
69EC:  7F 6C 4C     sb      (iz+&H4C),$12
69EF:  D4 6B 4D     ppom    $11,3
69F2:  E9 6B 4E     ldm     $11,(iz+$14),3
69F5:  34 6B 50     jp      nz,&H506B
69F8:  6D 6B 53     ldd     $11,(iz+&H53)
69FB:  DD 6B        sdn     $11
69FD:  00 61 6A     adc     $1,$10
6A00:  0D 4F        na      $15,$sz
6A02:  6A 44 43     ldi     $4,(ix+&H43)
6A05:  6A 4D 46     ldi     $13,(ix+&H46)
6A08:  6A 52 40     ldi     $18,(ix+&H40)
6A0B:  6A 53 D7     ldi     $19,(ix+&HD7)
6A0E:  6C 00 61     ldd     $0,(ix+&H61)
6A11:  6A 0D 4F     ldi     $13,(ix+&H4F)
6A14:  6A 4D 46     ldi     $13,(ix+&H46)
6A17:  6A 52 40     ldi     $18,(ix+&H40)
6A1A:  6A 53 D7     ldi     $19,(ix+&HD7)
6A1D:  6C 00 61     ldd     $0,(ix+&H61)
6A20:  6A D1 11     ldi     $17,(ix-&H11)
6A23:  AD 20        lddw    $0,(iz+$sy)
6A25:  77 14 83     cal     &H8314
6A28:  B5 05        jr      c,&H6A2E
6A2A:  D1 11 CA 20  ldw     $17,&H20CA
6A2E:  77 CB 6A     cal     &H6ACB
6A31:  D1 11 00 6A  ldw     $17,&H6A00
6A35:  77 14 83     cal     &H8314
6A38:  B5 28        jr      c,&H6A61
6A3A:  D1 11 12 6A  ldw     $17,&H6A12
6A3E:  B7 22        jr      &H6A61
6A40:  02 81 07     ld      $1,$sx,jr &H6A49
6A43:  02 A1 04     ld      $1,$sy,jr &H6A49
6A46:  42 01 02     ld      $1,&H02
6A49:  D6 00 B7 16  pre     ix,&H16B7
6A4D:  24 01        std     $1,(ix+$sx)
6A4F:  D7 00 D7 1B  pre     ss,&H1BD7
6A53:  77 83 66     cal     &H6683
6A56:  D1 11 71 20  ldw     $17,&H2071
6A5A:  77 CB 6A     cal     &H6ACB
6A5D:  D1 11 E5 69  ldw     $17,&H69E5
6A61:  A6 12        phsw    $18
6A63:  77 5F 65     cal     &H655F
6A66:  AE 11        ppsw    $17
6A68:  41 00 10     sbc     $0,&H10
6A6B:  B3 08        jr      uz,&H6A74
6A6D:  96 11        pre     ix,$17
6A6F:  02 50        ld      $16,$sz
6A71:  37 66 01     jp      &H0166
6A74:  41 00 1C     sbc     $0,&H1C
6A77:  B5 97        jr      c,&H6A0F
6A79:  A6 12        phsw    $18
6A7B:  D6 00 B8 16  pre     ix,&H16B8
6A7F:  A8 10        ldw     $16,(ix+$sx)
6A81:  82 72 10     ldw     $18,$16
6A84:  B0 3D        jr      z,&H6AC2
6A86:  41 00 1E     sbc     $0,&H1E
6A89:  B1 0B        jr      nc,&H6A95
6A8B:  0B 33        sbb     $19,$sy
6A8D:  44 13 F0     anc     $19,&HF0
6A90:  B0 0F        jr      z,&H6AA0
6A92:  4C 13 0F     an      $19,&H0F
6A95:  42 12 50     ld      $18,&H50
6A98:  41 10 50     sbc     $16,&H50
6A9B:  B4 04        jr      nz,&H6AA0
6A9D:  42 12 46     ld      $18,&H46
6AA0:  A0 12        stw     $18,(ix+$sx)
6AA2:  77 F2 6A     cal     &H6AF2
6AA5:  82 70 12     ldw     $16,$18
6AA8:  42 00 40     ld      $0,&H40
6AAB:  77 C5 6A     cal     &H6AC5
6AAE:  42 00 41     ld      $0,&H41
6AB1:  02 70 11     ld      $16,$17
6AB4:  4E 10 30     or      $16,&H30
6AB7:  77 C5 6A     cal     &H6AC5
6ABA:  77 97 03     cal     &H0397
6ABD:  77 DC 6A     cal     &H6ADC
6AC0:  B7 DE        jr      &H6A9F
6AC2:  0A B3 B7     adb     $19,$sy,jr &H6A7B
6AC5:  77 F7 01     cal     &H01F7
6AC8:  37 36 03     jp      &H0336
6ACB:  A6 12        phsw    $18
6ACD:  77 07 6B     cal     &H6B07
6AD0:  AE 11        ppsw    $17
6AD2:  77 20 65     cal     &H6520
6AD5:  D1 0A 00 7F  ldw     $10,&H7F00
6AD9:  77 7F 97     cal     &H977F
6ADC:  77 5A 6B     cal     &H6B5A
6ADF:  D6 00 B8 16  pre     ix,&H16B8
6AE3:  A8 10        ldw     $16,(ix+$sx)
6AE5:  77 F2 6A     cal     &H6AF2
6AE8:  77 91 29     cal     &H2991
6AEB:  37 0F 93     jp      &H930F
6AEE:  4E 9C 20 0C  or      $28,&H20,jr &H6AFD
6AF2:  02 7C 11     ld      $28,$17
6AF5:  41 10 50     sbc     $16,&H50
6AF8:  B0 04        jr      z,&H6AFD
6AFA:  4E 1C 10     or      $28,&H10
6AFD:  08 3C        ad      $28,$sy
6AFF:  08 7C 1C     ad      $28,$28
6B02:  02 3D        ld      $29,$sy
6B04:  37 6B 6E     jp      &H6E6B
6B07:  77 18 6B     cal     &H6B18
6B0A:  D6 00 B8 16  pre     ix,&H16B8
6B0E:  A8 10        ldw     $16,(ix+$sx)
6B10:  77 F1 2A     cal     &H2AF1
6B13:  9A 51        bydw    $17
6B15:  37 D7 7B     jp      &H7BD7
6B18:  77 49 65     cal     &H6549
6B1B:  77 AC 20     cal     &H20AC
6B1E:  D6 00 B7 16  pre     ix,&H16B7
6B22:  2C 00        ldd     $0,(ix+$sx)
6B24:  D6 00 33 21  pre     ix,&H2133
6B28:  77 19 65     cal     &H6519
6B2B:  77 A5 20     cal     &H20A5
6B2E:  77 D7 2A     cal     &H2AD7
6B31:  37 E2 20     jp      &H20E2
6B34:  77 07 6B     cal     &H6B07
6B37:  D1 11 F6 20  ldw     $17,&H20F6
6B3B:  77 20 65     cal     &H6520
6B3E:  77 43 65     cal     &H6543
6B41:  77 5F 65     cal     &H655F
6B44:  41 00 0D     sbc     $0,&H0D
6B47:  B0 06        jr      z,&H6B4E
6B49:  41 00 59     sbc     $0,&H59
6B4C:  B4 07        jr      nz,&H6B54
6B4E:  77 9B 52     cal     &H529B
6B51:  77 D1 45     cal     &H45D1
6B54:  37 4F 6A     jp      &H6A4F
6B57:  01 9F 0A     sbc     $31,$sx,jr &H6B63
6B5A:  D6 00 B8 16  pre     ix,&H16B8
6B5E:  A8 0D        ldw     $13,(ix+$sx)
6B60:  41 0D 50     sbc     $13,&H50
6B63:  77 23 34     cal     &H3423
6B66:  D6 00 C9 16  pre     ix,&H16C9
6B6A:  A0 01        stw     $1,(ix+$sx)
6B6C:  F7           rtn   
6B6D:  77 5A 6B     cal     &H6B5A
6B70:  77 FA 33     cal     &H33FA
6B73:  B0 1F        jr      z,&H6B93
6B75:  77 07 6B     cal     &H6B07
6B78:  D1 11 03 21  ldw     $17,&H2103
6B7C:  77 20 65     cal     &H6520
6B7F:  77 43 65     cal     &H6543
6B82:  77 9B 52     cal     &H529B
6B85:  77 89 29     cal     &H2989
6B88:  77 5A 6B     cal     &H6B5A
6B8B:  41 0D 50     sbc     $13,&H50
6B8E:  B4 09        jr      nz,&H6B98
6B90:  77 8C 3D     cal     &H3D8C
6B93:  77 91 29     cal     &H2991
6B96:  B7 C3        jr      &H6B5A
6B98:  77 9D 6B     cal     &H6B9D
6B9B:  B7 89        jr      &H6B25
6B9D:  82 33        ldw     $19,$sy
6B9F:  96 59        pre     iz,$25
6BA1:  89 3B        sbw     $27,$sy
6BA3:  77 E8 2A     cal     &H2AE8
6BA6:  9E 59        gre     iz,$25
6BA8:  81 79 1B     sbcw    $25,$27
6BAB:  F0           rtn     z
6BAC:  77 D1 2A     cal     &H2AD1
6BAF:  2B 10        ldi     $16,(iz+$sx)
6BB1:  41 10 0D     sbc     $16,&H0D
6BB4:  B4 11        jr      nz,&H6BC6
6BB6:  2D 00        ldd     $0,(iz+$sx)
6BB8:  41 00 0A     sbc     $0,&H0A
6BBB:  B4 03        jr      nz,&H6BBF
6BBD:  2D 20        ldd     $0,(iz+$sy)
6BBF:  77 E8 2A     cal     &H2AE8
6BC2:  88 33        adw     $19,$sy
6BC4:  B7 9F        jr      &H6B64
6BC6:  41 10 1A     sbc     $16,&H1A
6BC9:  B0 06        jr      z,&H6BD0
6BCB:  77 CB 3D     cal     &H3DCB
6BCE:  B7 A0        jr      &H6B6F
6BD0:  2D B0        ldd     $16,(iz-$sy)
6BD2:  B7 94        jr      &H6B67
6BD4:  77 07 6B     cal     &H6B07
6BD7:  D1 11 E0 20  ldw     $17,&H20E0
6BDB:  B7 08        jr      &H6BE4
6BDD:  77 07 6B     cal     &H6B07
6BE0:  D1 11 E7 20  ldw     $17,&H20E7
6BE4:  77 08 6C     cal     &H6C08
6BE7:  B7 0F        jr      &H6BF7
6BE9:  77 07 6B     cal     &H6B07
6BEC:  D1 11 EE 20  ldw     $17,&H20EE
6BF0:  D1 16 49 5F  ldw     $22,&H5F49
6BF4:  77 0C 6C     cal     &H6C0C
6BF7:  77 53 97     cal     &H9753
6BFA:  D6 00 00 10  pre     ix,&H1000
6BFE:  77 F9 1C     cal     &H1CF9
6C01:  D6 40 00 10  pre     iz,&H1000
6C05:  37 2D 26     jp      &H262D
6C08:  D1 16 48 5F  ldw     $22,&H5F48
6C0C:  77 20 65     cal     &H6520
6C0F:  77 2A 6C     cal     &H6C2A
6C12:  82 60 16     ldw     $0,$22
6C15:  77 51 68     cal     &H6851
6C18:  77 17 03     cal     &H0317
6C1B:  77 91 29     cal     &H2991
6C1E:  42 10 06     ld      $16,&H06
6C21:  77 F1 2A     cal     &H2AF1
6C24:  77 10 68     cal     &H6810
6C27:  37 23 03     jp      &H0323
6C2A:  D6 00 B7 16  pre     ix,&H16B7
6C2E:  D1 11 63 21  ldw     $17,&H2163
6C32:  3A 1E        sbc     (ix+$sx),$30
6C34:  B5 14        jr      c,&H6C49
6C36:  30 20 65     jp      z,&H6520
6C39:  D6 00 3D 17  pre     ix,&H173D
6C3D:  2C 00        ldd     $0,(ix+$sx)
6C3F:  4C 00 06     an      $0,&H06
6C42:  D6 00 2B 21  pre     ix,&H212B
6C46:  37 1B 65     jp      &H651B
6C49:  D1 11 39 21  ldw     $17,&H2139
6C4D:  77 20 65     cal     &H6520
6C50:  D6 00 3E 17  pre     ix,&H173E
6C54:  A8 14        ldw     $20,(ix+$sx)
6C56:  02 70 14     ld      $16,$20
6C59:  4C 10 E0     an      $16,&HE0
6C5C:  1B 50        inv     $16
6C5E:  1A 10        did     $16
6C60:  18 50        bid     $16
6C62:  77 D7 7B     cal     &H7BD7
6C65:  02 60 14     ld      $0,$20
6C68:  4C 00 1E     an      $0,&H1E
6C6B:  D6 00 E6 21  pre     ix,&H21E6
6C6F:  77 1B 65     cal     &H651B
6C72:  4C 15 1F     an      $21,&H1F
6C75:  02 60 15     ld      $0,$21
6C78:  D6 00 46 23  pre     ix,&H2346
6C7C:  37 19 65     jp      &H6519
6C7F:  D6 00 B8 16  pre     ix,&H16B8
6C83:  A8 0D        ldw     $13,(ix+$sx)
6C85:  82 33        ldw     $19,$sy
6C87:  41 0D 50     sbc     $13,&H50
6C8A:  B4 28        jr      nz,&H6CB3
6C8C:  02 00        ld      $0,$sx
6C8E:  D6 00 C4 16  pre     ix,&H16C4
6C92:  E0 1E 40     stm     $30,(ix+$sx),3
6C95:  77 04 34     cal     &H3404
6C98:  77 65 24     cal     &H2465
6C9B:  77 9B 52     cal     &H529B
6C9E:  77 72 92     cal     &H9272
6CA1:  37 E9 58     jp      &H58E9
6CA4:  82 33        ldw     $19,$sy
6CA6:  77 3F 29     cal     &H293F
6CA9:  D6 00 8B 16  pre     ix,&H168B
6CAD:  B4 03        jr      nz,&H6CB1
6CAF:  2C 2E        ldd     $14,(ix+$sy)
6CB1:  2C 0E        ldd     $14,(ix+$sx)
6CB3:  77 65 24     cal     &H2465
6CB6:  D6 00 8E 16  pre     ix,&H168E
6CBA:  A0 13        stw     $19,(ix+$sx)
6CBC:  D1 02 46 24  ldw     $2,&H2446
6CC0:  77 94 52     cal     &H5294
6CC3:  30 C8 5A     jp      z,&H5AC8
6CC6:  D6 00 C5 16  pre     ix,&H16C5
6CCA:  3A 1F        sbc     (ix+$sx),$31
6CCC:  B0 07        jr      z,&H6CD4
6CCE:  77 6E 24     cal     &H246E
6CD1:  77 65 24     cal     &H2465
6CD4:  37 B8 2B     jp      &H2BB8
6CD7:  D6 00 01 11  pre     ix,&H1101
6CDB:  02 00        ld      $0,$sx
6CDD:  A0 1F        stw     $31,(ix+$sx)
6CDF:  77 9C 02     cal     &H029C
6CE2:  77 2E 03     cal     &H032E
6CE5:  D1 00 3B 11  ldw     $0,&H113B
6CE9:  D1 02 F7 13  ldw     $2,&H13F7
6CED:  D1 04 80 00  ldw     $4,&H0080
6CF1:  77 BB 0E     cal     &H0EBB
6CF4:  D6 00 3D 17  pre     ix,&H173D
6CF8:  E8 19 40     ldm     $25,(ix+$sx),3
6CFB:  77 87 6E     cal     &H6E87
6CFE:  77 B3 6E     cal     &H6EB3
6D01:  77 CA 6E     cal     &H6ECA
6D04:  77 D4 6E     cal     &H6ED4
6D07:  77 F0 6E     cal     &H6EF0
6D0A:  77 F7 6E     cal     &H6EF7
6D0D:  77 FE 6E     cal     &H6EFE
6D10:  77 05 6F     cal     &H6F05
6D13:  77 0C 6F     cal     &H6F0C
6D16:  77 23 6F     cal     &H6F23
6D19:  77 29 6F     cal     &H6F29
6D1C:  77 37 6F     cal     &H6F37
6D1F:  D1 1C 05 04  ldw     $28,&H0405
6D23:  77 40 6E     cal     &H6E40
6D26:  B5 27        jr      c,&H6D4E
6D28:  30 2C 6E     jp      z,&H6E2C
6D2B:  41 00 1E     sbc     $0,&H1E
6D2E:  42 00 20     ld      $0,&H20
6D31:  B0 0D        jr      z,&H6D3F
6D33:  41 1A C0     sbc     $26,&HC0
6D36:  42 00 A0     ld      $0,&HA0
6D39:  B1 05        jr      nc,&H6D3F
6D3B:  48 9A 20 0B  ad      $26,&H20,jr &H6D49
6D3F:  09 5A        sb      $26,$sz
6D41:  44 1A E0     anc     $26,&HE0
6D44:  B4 04        jr      nz,&H6D49
6D46:  4E 1A C0     or      $26,&HC0
6D49:  77 87 6E     cal     &H6E87
6D4C:  B7 AE        jr      &H6CFB
6D4E:  D1 1C 13 01  ldw     $28,&H0113
6D52:  77 40 6E     cal     &H6E40
6D55:  B5 2D        jr      c,&H6D83
6D57:  B0 B9        jr      z,&H6D11
6D59:  02 61 1A     ld      $1,$26
6D5C:  4C 01 06     an      $1,&H06
6D5F:  41 00 1F     sbc     $0,&H1F
6D62:  B5 0A        jr      c,&H6D6D
6D64:  49 01 02     sb      $1,&H02
6D67:  B1 10        jr      nc,&H6D78
6D69:  42 81 04 0C  ld      $1,&H04,jr &H6D78
6D6D:  44 01 04     anc     $1,&H04
6D70:  B4 05        jr      nz,&H6D76
6D72:  48 81 02 03  ad      $1,&H02,jr &H6D78
6D76:  02 01        ld      $1,$sx
6D78:  4C 1A F9     an      $26,&HF9
6D7B:  0E 7A 01     or      $26,$1
6D7E:  77 B3 6E     cal     &H6EB3
6D81:  B7 B4        jr      &H6D36
6D83:  D1 1C 1E 01  ldw     $28,&H011E
6D87:  77 40 6E     cal     &H6E40
6D8A:  B5 0B        jr      c,&H6D96
6D8C:  B0 BF        jr      z,&H6D4C
6D8E:  4F 1A 08     xr      $26,&H08
6D91:  77 CA 6E     cal     &H6ECA
6D94:  B7 92        jr      &H6D27
6D96:  D1 1C 28 01  ldw     $28,&H0128
6D9A:  77 40 6E     cal     &H6E40
6D9D:  B5 0B        jr      c,&H6DA9
6D9F:  B0 9D        jr      z,&H6D3D
6DA1:  4F 1A 10     xr      $26,&H10
6DA4:  77 D4 6E     cal     &H6ED4
6DA7:  B7 92        jr      &H6D3A
6DA9:  D1 1C 31 03  ldw     $28,&H0331
6DAD:  77 40 6E     cal     &H6E40
6DB0:  B5 0B        jr      c,&H6DBC
6DB2:  B0 9D        jr      z,&H6D50
6DB4:  4F 1B 04     xr      $27,&H04
6DB7:  77 F0 6E     cal     &H6EF0
6DBA:  B7 92        jr      &H6D4D
6DBC:  D1 1C 3C 03  ldw     $28,&H033C
6DC0:  77 40 6E     cal     &H6E40
6DC3:  B5 0B        jr      c,&H6DCF
6DC5:  B0 9D        jr      z,&H6D63
6DC7:  4F 1B 08     xr      $27,&H08
6DCA:  77 F7 6E     cal     &H6EF7
6DCD:  B7 92        jr      &H6D60
6DCF:  D1 1C 46 03  ldw     $28,&H0346
6DD3:  77 40 6E     cal     &H6E40
6DD6:  B5 0B        jr      c,&H6DE2
6DD8:  B0 9D        jr      z,&H6D76
6DDA:  4F 1B 10     xr      $27,&H10
6DDD:  77 FE 6E     cal     &H6EFE
6DE0:  B7 92        jr      &H6D73
6DE2:  D1 1C 51 03  ldw     $28,&H0351
6DE6:  77 40 6E     cal     &H6E40
6DE9:  B5 0B        jr      c,&H6DF5
6DEB:  B0 9D        jr      z,&H6D89
6DED:  4F 1B 02     xr      $27,&H02
6DF0:  77 05 6F     cal     &H6F05
6DF3:  B7 92        jr      &H6D86
6DF5:  D1 1C 5C 03  ldw     $28,&H035C
6DF9:  77 40 6E     cal     &H6E40
6DFC:  B5 0A        jr      c,&H6E07
6DFE:  B0 9D        jr      z,&H6D9C
6E00:  0F 3B        xr      $27,$sy
6E02:  77 0C 6F     cal     &H6F0C
6E05:  B7 91        jr      &H6D97
6E07:  D1 1C 66 03  ldw     $28,&H0366
6E0B:  77 40 6E     cal     &H6E40
6E0E:  B5 0A        jr      c,&H6E19
6E10:  B0 9C        jr      z,&H6DAD
6E12:  0F 39        xr      $25,$sy
6E14:  77 23 6F     cal     &H6F23
6E17:  B7 91        jr      &H6DA9
6E19:  D1 1C 73 01  ldw     $28,&H0173
6E1D:  77 40 6E     cal     &H6E40
6E20:  B5 0B        jr      c,&H6E2C
6E22:  B0 9C        jr      z,&H6DBF
6E24:  4F 19 02     xr      $25,&H02
6E27:  77 29 6F     cal     &H6F29
6E2A:  B7 92        jr      &H6DBD
6E2C:  D1 1C 7E 01  ldw     $28,&H017E
6E30:  77 40 6E     cal     &H6E40
6E33:  35 1F 6D     jp      c,&H6D1F
6E36:  B0 9E        jr      z,&H6DD5
6E38:  4F 19 04     xr      $25,&H04
6E3B:  77 37 6F     cal     &H6F37
6E3E:  B7 93        jr      &H6DD2
6E40:  D1 0A 00 7F  ldw     $10,&H7F00
6E44:  77 7F 97     cal     &H977F
6E47:  77 6B 6E     cal     &H6E6B
6E4A:  77 0F 93     cal     &H930F
6E4D:  77 C8 23     cal     &H23C8
6E50:  41 00 0D     sbc     $0,&H0D
6E53:  30 4F 6A     jp      z,&H6A4F
6E56:  41 00 1C     sbc     $0,&H1C
6E59:  B5 8D        jr      c,&H6DE7
6E5B:  41 00 20     sbc     $0,&H20
6E5E:  B1 92        jr      nc,&H6DF1
6E60:  26 00        phs     $0
6E62:  77 97 03     cal     &H0397
6E65:  2E 00        pps     $0
6E67:  41 00 1D     sbc     $0,&H1D
6E6A:  F7           rtn   
6E6B:  D6 00 01 11  pre     ix,&H1101
6E6F:  24 1C        std     $28,(ix+$sx)
6E71:  77 F2 01     cal     &H01F2
6E74:  02 60 1D     ld      $0,$29
6E77:  96 02        pre     ix,$2
6E79:  E8 01 A0     ldm     $1,(ix+$sx),6
6E7C:  DB 41 A0     invm    $1,6
6E7F:  E2 01 A0     stim    $1,(ix+$sx),6
6E82:  09 20        sb      $0,$sy
6E84:  B4 8C        jr      nz,&H6E11
6E86:  F7           rtn   
6E87:  42 1C 05     ld      $28,&H05
6E8A:  02 60 1A     ld      $0,$26
6E8D:  4C 00 E0     an      $0,&HE0
6E90:  18 40        bid     $0
6E92:  18 40        bid     $0
6E94:  18 40        bid     $0
6E96:  1E 64        gst     ua,$4
6E98:  56 60 94     pst     ua,&H94
6E9B:  D6 40 73 14  pre     iz,&H1473
6E9F:  E9 40 60     ldm     $0,(iz+$sz),4
6EA2:  16 64        pst     ua,$4
6EA4:  D6 00 3B 11  pre     ix,&H113B
6EA8:  E0 60 7C     stm     $0,(ix+$28),4
6EAB:  D6 00 3D 17  pre     ix,&H173D
6EAF:  E0 19 40     stm     $25,(ix+$sx),3
6EB2:  F7           rtn   
6EB3:  42 1C 13     ld      $28,&H13
6EB6:  44 1A 04     anc     $26,&H04
6EB9:  42 00 4E     ld      $0,&H4E
6EBC:  B4 24        jr      nz,&H6EE1
6EBE:  44 1A 02     anc     $26,&H02
6EC1:  42 00 4F     ld      $0,&H4F
6EC4:  B4 1C        jr      nz,&H6EE1
6EC6:  42 80 45 18  ld      $0,&H45,jr &H6EE1
6ECA:  42 1C 1E     ld      $28,&H1E
6ECD:  44 1A 08     anc     $26,&H08
6ED0:  42 80 37 0A  ld      $0,&H37,jr &H6EDD
6ED4:  42 1C 28     ld      $28,&H28
6ED7:  44 1A 10     anc     $26,&H10
6EDA:  42 00 31     ld      $0,&H31
6EDD:  B4 03        jr      nz,&H6EE1
6EDF:  08 20        ad      $0,$sy
6EE1:  D6 00 3B 11  pre     ix,&H113B
6EE5:  20 60 1C     st      $0,(ix+$28)
6EE8:  D6 00 3D 17  pre     ix,&H173D
6EEC:  E0 19 40     stm     $25,(ix+$sx),3
6EEF:  F7           rtn   
6EF0:  42 1C 31     ld      $28,&H31
6EF3:  44 9B 04 1B  anc     $27,&H04,jr &H6F11
6EF7:  42 1C 3C     ld      $28,&H3C
6EFA:  44 9B 08 14  anc     $27,&H08,jr &H6F11
6EFE:  42 1C 46     ld      $28,&H46
6F01:  44 9B 10 0D  anc     $27,&H10,jr &H6F11
6F05:  42 1C 51     ld      $28,&H51
6F08:  44 9B 02 06  anc     $27,&H02,jr &H6F11
6F0C:  42 1C 5C     ld      $28,&H5C
6F0F:  04 3B        anc     $27,$sy
6F11:  D1 00 20 4F  ldw     $0,&H4F20
6F15:  D1 02 4E 5D  ldw     $2,&H5D4E
6F19:  B4 F6        jr      nz,&H6F10
6F1B:  D1 00 4F 46  ldw     $0,&H464F
6F1F:  42 82 46 FE  ld      $2,&H46,jr &H6F20
6F23:  42 1C 66     ld      $28,&H66
6F26:  04 B9 97     anc     $25,$sy,jr &H6EBF
6F29:  42 1C 73     ld      $28,&H73
6F2C:  44 19 02     anc     $25,&H02
6F2F:  42 00 30     ld      $0,&H30
6F32:  B0 D2        jr      z,&H6F05
6F34:  08 A0 D5     ad      $0,$sy,jr &H6F0B
6F37:  42 1C 7E     ld      $28,&H7E
6F3A:  44 19 04     anc     $25,&H04
6F3D:  42 00 46     ld      $0,&H46
6F40:  B0 E0        jr      z,&H6F21
6F42:  42 80 53 E4  ld      $0,&H53,jr &H6F29
6F46:  D7 00 D7 1B  pre     ss,&H1BD7
6F4A:  77 73 66     cal     &H6673
6F4D:  77 49 65     cal     &H6549
6F50:  D1 11 21 17  ldw     $17,&H1721
6F54:  77 3F 29     cal     &H293F
6F57:  B4 05        jr      nz,&H6F5D
6F59:  D1 11 F4 17  ldw     $17,&H17F4
6F5D:  77 20 65     cal     &H6520
6F60:  A6 12        phsw    $18
6F62:  77 A5 20     cal     &H20A5
6F65:  77 D7 2A     cal     &H2AD7
6F68:  77 E2 20     cal     &H20E2
6F6B:  42 10 46     ld      $16,&H46
6F6E:  77 F1 2A     cal     &H2AF1
6F71:  AE 11        ppsw    $17
6F73:  77 05 70     cal     &H7005
6F76:  26 10        phs     $16
6F78:  77 D7 7B     cal     &H7BD7
6F7B:  77 20 65     cal     &H6520
6F7E:  D1 0A 00 7F  ldw     $10,&H7F00
6F82:  77 7F 97     cal     &H977F
6F85:  2E 1C        pps     $28
6F87:  77 EE 6A     cal     &H6AEE
6F8A:  77 91 29     cal     &H2991
6F8D:  77 0F 93     cal     &H930F
6F90:  77 5F 65     cal     &H655F
6F93:  02 51        ld      $17,$sz
6F95:  77 05 70     cal     &H7005
6F98:  2C 1C        ldd     $28,(ix+$sx)
6F9A:  41 11 1C     sbc     $17,&H1C
6F9D:  B0 64        jr      z,&H7002
6F9F:  41 11 1D     sbc     $17,&H1D
6FA2:  B0 41        jr      z,&H6FE4
6FA4:  41 11 43     sbc     $17,&H43
6FA7:  30 46 24     jp      z,&H2446
6FAA:  41 11 53     sbc     $17,&H53
6FAD:  30 A4 6C     jp      z,&H6CA4
6FB0:  77 3F 29     cal     &H293F
6FB3:  B0 09        jr      z,&H6FBD
6FB5:  41 11 41     sbc     $17,&H41
6FB8:  30 28 70     jp      z,&H7028
6FBB:  B7 AC        jr      &H6F68
6FBD:  02 6E 1C     ld      $14,$28
6FC0:  48 0E 0A     ad      $14,&H0A
6FC3:  41 11 52     sbc     $17,&H52
6FC6:  B0 11        jr      z,&H6FD8
6FC8:  41 11 4C     sbc     $17,&H4C
6FCB:  B4 BC        jr      nz,&H6F88
6FCD:  77 63 6B     cal     &H6B63
6FD0:  77 FA 33     cal     &H33FA
6FD3:  B0 0D        jr      z,&H6FE1
6FD5:  37 DB A0     jp      &HA0DB
6FD8:  77 63 6B     cal     &H6B63
6FDB:  77 FA 33     cal     &H33FA
6FDE:  34 00 A1     jp      nz,&HA100
6FE1:  37 4D 6F     jp      &H6F4D
6FE4:  0B 30        sbb     $16,$sy
6FE6:  4C 10 0F     an      $16,&H0F
6FE9:  24 10        std     $16,(ix+$sx)
6FEB:  77 EE 6A     cal     &H6AEE
6FEE:  42 00 61     ld      $0,&H61
6FF1:  4E 10 30     or      $16,&H30
6FF4:  77 C5 6A     cal     &H6AC5
6FF7:  77 97 03     cal     &H0397
6FFA:  77 05 70     cal     &H7005
6FFD:  02 7C 10     ld      $28,$16
7000:  B7 FA        jr      &H6FFB
7002:  0A B0 9E     adb     $16,$sy,jr &H6FA2
7005:  77 3F 29     cal     &H293F
7008:  D6 00 8B 16  pre     ix,&H168B
700C:  B4 03        jr      nz,&H7010
700E:  2C 30        ldd     $16,(ix+$sy)
7010:  2C 10        ldd     $16,(ix+$sx)
7012:  F7           rtn   
7013:  D7 00 D7 1B  pre     ss,&H1BD7
7017:  77 7A 66     cal     &H667A
701A:  D1 00 8E 16  ldw     $0,&H168E
701E:  D1 02 29 00  ldw     $2,&H0029
7022:  77 57 01     cal     &H0157
7025:  37 4D 6F     jp      &H6F4D
7028:  26 10        phs     $16
702A:  77 05 7C     cal     &H7C05
702D:  2E 0E        pps     $14
702F:  77 25 34     cal     &H3425
7032:  D6 00 C9 16  pre     ix,&H16C9
7036:  A0 01        stw     $1,(ix+$sx)
7038:  82 60 1B     ldw     $0,$27
703B:  89 20        sbw     $0,$sy
703D:  81 59        sbcw    $25,$sz
703F:  B0 AD        jr      z,&H6FED
7041:  96 59        pre     iz,$25
7043:  D6 00 D0 18  pre     ix,&H18D0
7047:  E8 B7 60     ldm     $23,(ix-$sy),4
704A:  A8 3B        ldw     $27,(ix+$sy)
704C:  82 33        ldw     $19,$sy
704E:  89 75 15     sbw     $21,$21
7051:  D6 00 94 16  pre     ix,&H1694
7055:  E0 15 60     stm     $21,(ix+$sx),4
7058:  02 9D 09     ld      $29,$sx,jr &H7063
705B:  41 00 1A     sbc     $0,&H1A
705E:  B0 6F        jr      z,&H70CE
7060:  77 DB 7A     cal     &H7ADB
7063:  4C 1D 0F     an      $29,&H0F
7066:  77 B9 79     cal     &H79B9
7069:  B0 8F        jr      z,&H6FF9
706B:  44 1D 04     anc     $29,&H04
706E:  B0 5F        jr      z,&H70CE
7070:  77 76 7A     cal     &H7A76
7073:  41 0B 02     sbc     $11,&H02
7076:  B4 57        jr      nz,&H70CE
7078:  4E 1D 30     or      $29,&H30
707B:  77 6A 73     cal     &H736A
707E:  B0 1A        jr      z,&H7099
7080:  77 EB 72     cal     &H72EB
7083:  44 1D 04     anc     $29,&H04
7086:  B0 47        jr      z,&H70CE
7088:  77 67 73     cal     &H7367
708B:  B4 42        jr      nz,&H70CE
708D:  4E 1D 40     or      $29,&H40
7090:  D6 00 5E 16  pre     ix,&H165E
7094:  22 1D        sti     $29,(ix+$sx)
7096:  77 60 73     cal     &H7360
7099:  77 DB 7A     cal     &H7ADB
709C:  77 B9 79     cal     &H79B9
709F:  B0 29        jr      z,&H70C9
70A1:  77 76 7A     cal     &H7A76
70A4:  01 2B        sbc     $11,$sy
70A6:  B4 8E        jr      nz,&H7035
70A8:  77 6A 73     cal     &H736A
70AB:  B4 22        jr      nz,&H70CE
70AD:  44 1D 44     anc     $29,&H44
70B0:  B4 1D        jr      nz,&H70CE
70B2:  77 DB 7A     cal     &H7ADB
70B5:  77 49 00     cal     &H0049
70B8:  41 00 1A     sbc     $0,&H1A
70BB:  B0 1B        jr      z,&H70D7
70BD:  41 00 3B     sbc     $0,&H3B
70C0:  B0 8F        jr      z,&H7050
70C2:  41 00 0D     sbc     $0,&H0D
70C5:  B0 94        jr      z,&H705A
70C7:  B7 E5        jr      &H70AD
70C9:  41 00 1A     sbc     $0,&H1A
70CC:  B4 B4        jr      nz,&H7081
70CE:  42 02 02     ld      $2,&H02
70D1:  77 80 72     cal     &H7280
70D4:  37 13 70     jp      &H7013
70D7:  04 3D        anc     $29,$sy
70D9:  B4 86        jr      nz,&H7060
70DB:  81 35        sbcw    $21,$sy
70DD:  B5 8A        jr      c,&H7068
70DF:  D6 00 90 16  pre     ix,&H1690
70E3:  E0 19 60     stm     $25,(ix+$sx),4
70E6:  77 EE 33     cal     &H33EE
70E9:  96 59        pre     iz,$25
70EB:  D6 00 90 16  pre     ix,&H1690
70EF:  A8 19        ldw     $25,(ix+$sx)
70F1:  82 33        ldw     $19,$sy
70F3:  89 75 15     sbw     $21,$21
70F6:  02 1D        ld      $29,$sx
70F8:  4E 1D 10     or      $29,&H10
70FB:  82 7B 19     ldw     $27,$25
70FE:  D6 00 6E 16  pre     ix,&H166E
7102:  9E 51        gre     iz,$17
7104:  E0 11 A0     stm     $17,(ix+$sx),6
7107:  77 B9 79     cal     &H79B9
710A:  B0 13        jr      z,&H711E
710C:  77 76 7A     cal     &H7A76
710F:  41 0B 02     sbc     $11,&H02
7112:  B5 20        jr      c,&H7133
7114:  B4 04        jr      nz,&H7119
7116:  4C 1D 0F     an      $29,&H0F
7119:  77 DB 7A     cal     &H7ADB
711C:  B7 96        jr      &H70B3
711E:  41 00 1A     sbc     $0,&H1A
7121:  B4 89        jr      nz,&H70AB
7123:  04 3D        anc     $29,$sy
7125:  B4 D2        jr      nz,&H70F8
7127:  37 A5 73     jp      &H73A5
712A:  01 2B        sbc     $11,$sy
712C:  B4 63        jr      nz,&H7190
712E:  77 DB 7A     cal     &H7ADB
7131:  B7 BA        jr      &H70EC
7133:  4E 1D 10     or      $29,&H10
7136:  D6 00 6E 16  pre     ix,&H166E
713A:  E8 11 A0     ldm     $17,(ix+$sx),6
713D:  96 51        pre     iz,$17
713F:  D6 00 68 16  pre     ix,&H1668
7143:  E2 15 60     stim    $21,(ix+$sx),4
7146:  9E 40        gre     iz,$0
7148:  A0 20        stw     $0,(ix+$sy)
714A:  77 B9 79     cal     &H79B9
714D:  B0 42        jr      z,&H7190
714F:  D6 00 6C 16  pre     ix,&H166C
7153:  24 0B        std     $11,(ix+$sx)
7155:  77 76 7A     cal     &H7A76
7158:  35 EF 71     jp      c,&H71EF
715B:  89 6C 0C     sbw     $12,$12
715E:  02 0A        ld      $10,$sx
7160:  41 0B 03     sbc     $11,&H03
7163:  B5 BA        jr      c,&H711E
7165:  B4 05        jr      nz,&H716B
7167:  42 8B 90 1E  ld      $11,&H90,jr &H7188
716B:  41 0B 06     sbc     $11,&H06
716E:  30 15 72     jp      z,&H7215
7171:  35 F8 71     jp      c,&H71F8
7174:  41 0B 07     sbc     $11,&H07
7177:  B0 64        jr      z,&H71DC
7179:  41 0B 60     sbc     $11,&H60
717C:  B5 18        jr      c,&H7195
717E:  41 0B 71     sbc     $11,&H71
7181:  B0 13        jr      z,&H7195
7183:  41 0B 81     sbc     $11,&H81
7186:  B4 21        jr      nz,&H71A8
7188:  77 67 73     cal     &H7367
718B:  B4 48        jr      nz,&H71D4
718D:  77 66 72     cal     &H7266
7190:  77 DB 7A     cal     &H7ADB
7193:  B7 D5        jr      &H7169
7195:  77 FD 77     cal     &H77FD
7198:  B1 3B        jr      nc,&H71D4
719A:  02 4A        ld      $10,$sz
719C:  1A 2A        diu     $10
719E:  41 0B 71     sbc     $11,&H71
71A1:  B0 9A        jr      z,&H713C
71A3:  77 C3 00     cal     &H00C3
71A6:  B4 2D        jr      nz,&H71D4
71A8:  77 A9 00     cal     &H00A9
71AB:  B1 10        jr      nc,&H71BC
71AD:  A6 0B        phsw    $11
71AF:  77 CF 72     cal     &H72CF
71B2:  82 6C 06     ldw     $12,$6
71B5:  AE 0A        ppsw    $10
71B7:  B4 0C        jr      nz,&H71C4
71B9:  02 82 1C     ld      $2,$sx,jr &H71D7
71BC:  77 1E 78     cal     &H781E
71BF:  B1 14        jr      nc,&H71D4
71C1:  82 6C 11     ldw     $12,$17
71C4:  77 C3 00     cal     &H00C3
71C7:  B4 C0        jr      nz,&H7188
71C9:  77 FD 77     cal     &H77FD
71CC:  B1 07        jr      nc,&H71D4
71CE:  0E 4A        or      $10,$sz
71D0:  01 00        sbc     $0,$sx
71D2:  B4 CB        jr      nz,&H719E
71D4:  42 02 06     ld      $2,&H06
71D7:  77 80 72     cal     &H7280
71DA:  B7 CB        jr      &H71A6
71DC:  77 6A 73     cal     &H736A
71DF:  B4 8C        jr      nz,&H716C
71E1:  98 71        biuw    $17
71E3:  B5 09        jr      c,&H71ED
71E5:  88 77 11     adw     $23,$17
71E8:  B5 04        jr      c,&H71ED
71EA:  81 79 17     sbcw    $25,$23
71ED:  B1 DE        jr      nc,&H71CC
71EF:  42 02 04     ld      $2,&H04
71F2:  77 80 72     cal     &H7280
71F5:  37 46 24     jp      &H2446
71F8:  49 0B 73     sb      $11,&H73
71FB:  77 66 72     cal     &H7266
71FE:  2D 00        ldd     $0,(iz+$sx)
7200:  77 CF 72     cal     &H72CF
7203:  B0 CB        jr      z,&H71CF
7205:  77 C3 00     cal     &H00C3
7208:  B4 B5        jr      nz,&H71BE
720A:  77 49 00     cal     &H0049
720D:  77 6F 72     cal     &H726F
7210:  77 CF 72     cal     &H72CF
7213:  B7 13        jr      &H7227
7215:  2D 00        ldd     $0,(iz+$sx)
7217:  41 00 27     sbc     $0,&H27
721A:  B0 25        jr      z,&H7240
721C:  77 EB 72     cal     &H72EB
721F:  44 1D 04     anc     $29,&H04
7222:  B0 13        jr      z,&H7236
7224:  77 D6 72     cal     &H72D6
7227:  30 B9 71     jp      z,&H71B9
722A:  77 67 73     cal     &H7367
722D:  34 D4 71     jp      nz,&H71D4
7230:  77 6F 72     cal     &H726F
7233:  37 90 71     jp      &H7190
7236:  77 19 78     cal     &H7819
7239:  31 D4 71     jp      nc,&H71D4
723C:  82 E6 11 95  ldw     $6,$17,jr &H71D4
7240:  02 07        ld      $7,$sx
7242:  2D 20        ldd     $0,(iz+$sy)
7244:  41 00 27     sbc     $0,&H27
7247:  B0 8F        jr      z,&H71D7
7249:  41 00 27     sbc     $0,&H27
724C:  B0 0F        jr      z,&H725C
724E:  77 70 73     cal     &H7370
7251:  B0 99        jr      z,&H71EB
7253:  02 46        ld      $6,$sz
7255:  77 6F 72     cal     &H726F
7258:  2D 20        ldd     $0,(iz+$sy)
725A:  B7 92        jr      &H71ED
725C:  77 4D 00     cal     &H004D
725F:  77 6A 73     cal     &H736A
7262:  B4 B6        jr      nz,&H7219
7264:  B7 B2        jr      &H7217
7266:  82 66 0A     ldw     $6,$10
7269:  77 6F 72     cal     &H726F
726C:  82 66 0C     ldw     $6,$12
726F:  96 17        pre     ix,$23
7271:  88 37        adw     $23,$sy
7273:  88 37        adw     $23,$sy
7275:  81 79 17     sbcw    $25,$23
7278:  35 EF 71     jp      c,&H71EF
727B:  A0 06        stw     $6,(ix+$sx)
727D:  F7           rtn   
727E:  02 02        ld      $2,$sx
7280:  0E 3D        or      $29,$sy
7282:  77 B5 72     cal     &H72B5
7285:  77 A6 72     cal     &H72A6
7288:  82 63 13     ldw     $3,$19
728B:  77 C6 7C     cal     &H7CC6
728E:  77 E8 2A     cal     &H2AE8
7291:  77 91 29     cal     &H2991
7294:  9E 40        gre     iz,$0
7296:  A6 01        phsw    $1
7298:  77 5F 65     cal     &H655F
729B:  AE 01        ppsw    $1
729D:  41 00 53     sbc     $0,&H53
72A0:  30 A6 6C     jp      z,&H6CA6
72A3:  96 41        pre     iz,$1
72A5:  F7           rtn   
72A6:  E6 13 40     phsm    $19,3
72A9:  D1 11 D7 16  ldw     $17,&H16D7
72AD:  77 20 65     cal     &H6520
72B0:  EE 11 40     ppsm    $17,3
72B3:  B7 18        jr      &H72CC
72B5:  D6 00 9F 16  pre     ix,&H169F
72B9:  56 60 A4     pst     ua,&HA4
72BC:  A8 6F 02     ldw     $15,(ix+$2)
72BF:  56 60 54     pst     ua,&H54
72C2:  26 0F        phs     $15
72C4:  77 F1 2A     cal     &H2AF1
72C7:  2E 10        pps     $16
72C9:  77 F1 2A     cal     &H2AF1
72CC:  37 D7 2A     jp      &H2AD7
72CF:  77 EB 72     cal     &H72EB
72D2:  44 1D 04     anc     $29,&H04
72D5:  F0           rtn     z
72D6:  77 28 73     cal     &H7328
72D9:  F5           rtn     c
72DA:  E6 1C 60     phsm    $28,4
72DD:  D6 00 90 16  pre     ix,&H1690
72E1:  E8 19 60     ldm     $25,(ix+$sx),4
72E4:  77 28 73     cal     &H7328
72E7:  EE 19 60     ppsm    $25,4
72EA:  F7           rtn   
72EB:  4C 1D FB     an      $29,&HFB
72EE:  C9 68 E8     sbbm    $8,$8,8
72F1:  41 00 20     sbc     $0,&H20
72F4:  F0           rtn     z
72F5:  41 00 41     sbc     $0,&H41
72F8:  F5           rtn     c
72F9:  41 00 5B     sbc     $0,&H5B
72FC:  B1 3F        jr      nc,&H733C
72FE:  4E 1D 04     or      $29,&H04
7301:  40 08 FF     adc     $8,&HFF
7304:  F5           rtn     c
7305:  DA 4D A0     bydm    $13,6
7308:  02 4D        ld      $13,$sz
730A:  2D 20        ldd     $0,(iz+$sy)
730C:  77 2B 00     cal     &H002B
730F:  B1 9B        jr      nc,&H72AB
7311:  B7 94        jr      &H72A6
7313:  42 1D 08     ld      $29,&H08
7316:  D6 00 90 16  pre     ix,&H1690
731A:  E8 19 60     ldm     $25,(ix+$sx),4
731D:  77 28 73     cal     &H7328
7320:  F4           rtn     nz
7321:  D6 00 8E 16  pre     ix,&H168E
7325:  E8 19 60     ldm     $25,(ix+$sx),4
7328:  96 1B        pre     ix,$27
732A:  9E 00        gre     ix,$0
732C:  81 59        sbcw    $25,$sz
732E:  F0           rtn     z
732F:  EC A7 E0     lddm    $7,(ix-$sy),8
7332:  44 1D 08     anc     $29,&H08
7335:  B4 09        jr      nz,&H733F
7337:  C7 48 A0     xrcm    $8,$sz,6
733A:  B4 91        jr      nz,&H72CC
733C:  01 3F        sbc     $31,$sy
733E:  F7           rtn   
733F:  81 71 06     sbcw    $17,$6
7342:  B1 89        jr      nc,&H72CC
7344:  01 1F        sbc     $31,$sx
7346:  F7           rtn   
7347:  77 28 73     cal     &H7328
734A:  B0 07        jr      z,&H7352
734C:  77 7E 72     cal     &H727E
734F:  C9 68 E8     sbbm    $8,$8,8
7352:  D1 00 08 00  ldw     $0,&H0008
7356:  89 59        sbw     $25,$sz
7358:  81 79 17     sbcw    $25,$23
735B:  35 EF 71     jp      c,&H71EF
735E:  96 19        pre     ix,$25
7360:  82 6E 15     ldw     $14,$21
7363:  E0 08 E0     stm     $8,(ix+$sx),8
7366:  F7           rtn   
7367:  77 49 00     cal     &H0049
736A:  2D 00        ldd     $0,(iz+$sx)
736C:  41 00 3B     sbc     $0,&H3B
736F:  F0           rtn     z
7370:  41 00 0D     sbc     $0,&H0D
7373:  F0           rtn     z
7374:  41 00 1A     sbc     $0,&H1A
7377:  F7           rtn   
7378:  D7 00 D7 1B  pre     ss,&H1BD7
737C:  77 23 03     cal     &H0323
737F:  77 FF 7A     cal     &H7AFF
7382:  B4 07        jr      nz,&H738A
7384:  77 4F 65     cal     &H654F
7387:  37 72 76     jp      &H7672
738A:  77 4F 65     cal     &H654F
738D:  77 05 7C     cal     &H7C05
7390:  77 89 29     cal     &H2989
7393:  D1 11 DD 16  ldw     $17,&H16DD
7397:  77 20 65     cal     &H6520
739A:  77 94 7B     cal     &H7B94
739D:  77 E8 2A     cal     &H2AE8
73A0:  77 91 29     cal     &H2991
73A3:  B7 9D        jr      &H7341
73A5:  D6 00 9C 16  pre     ix,&H169C
73A9:  22 1F        sti     $31,(ix+$sx)
73AB:  02 00        ld      $0,$sx
73AD:  A0 1F        stw     $31,(ix+$sx)
73AF:  6C 80 0F     ldd     $0,(ix-&H0F)
73B2:  A0 19        stw     $25,(ix+$sx)
73B4:  6C 00 0A     ldd     $0,(ix+&H0A)
73B7:  89 35        sbw     $21,$sy
73B9:  A0 15        stw     $21,(ix+$sx)
73BB:  D6 00 A7 16  pre     ix,&H16A7
73BF:  C9 40 E0     sbbm    $0,$sz,8
73C2:  E2 00 E0     stim    $0,(ix+$sx),8
73C5:  89 20        sbw     $0,$sy
73C7:  E0 00 40     stm     $0,(ix+$sx),3
73CA:  D6 00 94 16  pre     ix,&H1694
73CE:  A8 01        ldw     $1,(ix+$sx)
73D0:  77 7B 7B     cal     &H7B7B
73D3:  A0 01        stw     $1,(ix+$sx)
73D5:  D7 00 D7 1B  pre     ss,&H1BD7
73D9:  77 BA 66     cal     &H66BA
73DC:  77 23 03     cal     &H0323
73DF:  D1 02 D5 73  ldw     $2,&H73D5
73E3:  77 7A 29     cal     &H297A
73E6:  77 49 65     cal     &H6549
73E9:  D1 11 4D 17  ldw     $17,&H174D
73ED:  77 20 65     cal     &H6520
73F0:  77 18 7B     cal     &H7B18
73F3:  D1 00 01 11  ldw     $0,&H1101
73F7:  50 40 74     st      &H74,($sz)
73FA:  D6 00 9C 16  pre     ix,&H169C
73FE:  2C 00        ldd     $0,(ix+$sx)
7400:  68 01 17     ld      $1,(ix+&H17)
7403:  D6 00 BE 17  pre     ix,&H17BE
7407:  77 12 65     cal     &H6512
740A:  77 43 65     cal     &H6543
740D:  77 5F 65     cal     &H655F
7410:  41 00 0D     sbc     $0,&H0D
7413:  30 72 76     jp      z,&H7672
7416:  49 00 43     sb      $0,&H43
7419:  30 46 24     jp      z,&H2446
741C:  09 20        sb      $0,$sy
741E:  B0 29        jr      z,&H7448
7420:  49 00 03     sb      $0,&H03
7423:  30 4F 76     jp      z,&H764F
7426:  D6 00 B3 16  pre     ix,&H16B3
742A:  49 00 09     sb      $0,&H09
742D:  B0 0F        jr      z,&H743D
742F:  49 00 03     sb      $0,&H03
7432:  30 A4 6C     jp      z,&H6CA4
7435:  D6 00 9C 16  pre     ix,&H169C
7439:  09 20        sb      $0,$sy
743B:  B4 AF        jr      nz,&H73EB
743D:  2C 00        ldd     $0,(ix+$sx)
743F:  08 20        ad      $0,$sy
7441:  0C 20        an      $0,$sy
7443:  24 00        std     $0,(ix+$sx)
7445:  37 D5 73     jp      &H73D5
7448:  D1 11 89 17  ldw     $17,&H1789
744C:  77 3D 65     cal     &H653D
744F:  77 5F 65     cal     &H655F
7452:  41 00 52     sbc     $0,&H52
7455:  30 99 74     jp      z,&H7499
7458:  41 00 4F     sbc     $0,&H4F
745B:  30 4E 75     jp      z,&H754E
745E:  41 00 42     sbc     $0,&H42
7461:  B4 93        jr      nz,&H73F5
7463:  77 49 65     cal     &H6549
7466:  D1 11 DD 16  ldw     $17,&H16DD
746A:  77 20 65     cal     &H6520
746D:  D6 00 9D 16  pre     ix,&H169D
7471:  E8 11 60     ldm     $17,(ix+$sx),4
7474:  04 32        anc     $18,$sy
7476:  74 1D 7B     cal     nz,&H7B1D
7479:  77 F9 75     cal     &H75F9
747C:  B0 19        jr      z,&H7496
747E:  D6 00 98 16  pre     ix,&H1698
7482:  89 64 04     sbw     $4,$4
7485:  80 26        adcw    $6,$sy
7487:  B5 07        jr      c,&H748F
7489:  BA 06        sbcw    (ix+$sx),$6
748B:  B5 93        jr      c,&H741F
748D:  02 25        ld      $5,$sy
748F:  D6 00 9D 16  pre     ix,&H169D
7493:  E2 04 60     stim    $4,(ix+$sx),4
7496:  37 D5 73     jp      &H73D5
7499:  D6 00 A6 16  pre     ix,&H16A6
749D:  24 1F        std     $31,(ix+$sx)
749F:  77 49 65     cal     &H6549
74A2:  02 1C        ld      $28,$sx
74A4:  77 8A 7B     cal     &H7B8A
74A7:  02 70 1C     ld      $16,$28
74AA:  77 D7 7B     cal     &H7BD7
74AD:  77 80 7B     cal     &H7B80
74B0:  D6 00 A7 16  pre     ix,&H16A7
74B4:  02 60 1C     ld      $0,$28
74B7:  08 40        ad      $0,$sz
74B9:  2C 40        ldd     $0,(ix+$sz)
74BB:  A8 00        ldw     $0,(ix+$sx)
74BD:  A6 01        phsw    $1
74BF:  82 4E        ldw     $14,$sz
74C1:  77 BC 7A     cal     &H7ABC
74C4:  77 D7 2A     cal     &H2AD7
74C7:  AE 03        ppsw    $3
74C9:  77 C6 7C     cal     &H7CC6
74CC:  77 DD 7B     cal     &H7BDD
74CF:  08 3C        ad      $28,$sy
74D1:  41 1C 05     sbc     $28,&H05
74D4:  B4 B1        jr      nz,&H7486
74D6:  42 10 46     ld      $16,&H46
74D9:  77 8D 7B     cal     &H7B8D
74DC:  77 D7 2A     cal     &H2AD7
74DF:  77 80 7B     cal     &H7B80
74E2:  D6 40 B1 16  pre     iz,&H16B1
74E6:  77 D2 7B     cal     &H7BD2
74E9:  D6 00 A6 16  pre     ix,&H16A6
74ED:  2C 00        ldd     $0,(ix+$sx)
74EF:  08 40        ad      $0,$sz
74F1:  D6 00 17 17  pre     ix,&H1717
74F5:  56 60 A4     pst     ua,&HA4
74F8:  A8 51        ldw     $17,(ix+$sz)
74FA:  56 60 54     pst     ua,&H54
74FD:  77 FD 75     cal     &H75FD
7500:  D6 00 A7 16  pre     ix,&H16A7
7504:  B0 07        jr      z,&H750C
7506:  28 A0        ld      $0,(ix-$sy)
7508:  18 60        biu     $0
750A:  A0 46        stw     $6,(ix+$sz)
750C:  2C A0        ldd     $0,(ix-$sy)
750E:  08 20        ad      $0,$sy
7510:  41 00 05     sbc     $0,&H05
7513:  B5 03        jr      c,&H7517
7515:  02 00        ld      $0,$sx
7517:  24 00        std     $0,(ix+$sx)
7519:  B7 FB        jr      &H7515
751B:  77 05 7C     cal     &H7C05
751E:  77 89 29     cal     &H2989
7521:  77 E8 2A     cal     &H2AE8
7524:  AE 11        ppsw    $17
7526:  81 75 11     sbcw    $21,$17
7529:  B5 1E        jr      c,&H7548
752B:  77 B6 7A     cal     &H7AB6
752E:  77 4D 7B     cal     &H7B4D
7531:  77 45 7B     cal     &H7B45
7534:  77 50 7B     cal     &H7B50
7537:  82 60 11     ldw     $0,$17
753A:  98 60        biuw    $0
753C:  88 60 13     adw     $0,$19
753F:  77 BA 7A     cal     &H7ABA
7542:  77 E8 2A     cal     &H2AE8
7545:  88 B1 A1     adw     $17,$sy,jr &H74E8
7548:  77 91 29     cal     &H2991
754B:  37 F0 29     jp      &H29F0
754E:  89 66 06     sbw     $6,$6
7551:  77 06 7B     cal     &H7B06
7554:  77 F9 75     cal     &H75F9
7557:  82 71 06     ldw     $17,$6
755A:  D6 00 96 16  pre     ix,&H1696
755E:  E8 13 60     ldm     $19,(ix+$sx),4
7561:  81 75 11     sbcw    $21,$17
7564:  B5 97        jr      c,&H74FC
7566:  A6 12        phsw    $18
7568:  77 FF 7A     cal     &H7AFF
756B:  B4 D1        jr      nz,&H753D
756D:  77 49 65     cal     &H6549
7570:  42 97 04 04  ld      $23,&H04,jr &H7577
7574:  77 E8 2A     cal     &H2AE8
7577:  81 75 11     sbcw    $21,$17
757A:  B5 1E        jr      c,&H7599
757C:  77 B6 7A     cal     &H7AB6
757F:  77 DD 7B     cal     &H7BDD
7582:  77 26 7B     cal     &H7B26
7585:  77 DD 7B     cal     &H7BDD
7588:  82 60 11     ldw     $0,$17
758B:  98 60        biuw    $0
758D:  88 60 13     adw     $0,$19
7590:  77 BA 7A     cal     &H7ABA
7593:  88 31        adw     $17,$sy
7595:  09 37        sb      $23,$sy
7597:  B4 A4        jr      nz,&H753C
7599:  AE 11        ppsw    $17
759B:  77 43 65     cal     &H6543
759E:  77 5F 65     cal     &H655F
75A1:  41 00 0D     sbc     $0,&H0D
75A4:  B0 11        jr      z,&H75B6
75A6:  49 00 1C     sb      $0,&H1C
75A9:  B0 1F        jr      z,&H75C9
75AB:  49 00 02     sb      $0,&H02
75AE:  B5 1A        jr      c,&H75C9
75B0:  B0 0D        jr      z,&H75BE
75B2:  09 20        sb      $0,$sy
75B4:  B4 97        jr      nz,&H754C
75B6:  81 71 15     sbcw    $17,$21
75B9:  B0 9C        jr      z,&H7556
75BB:  88 B1 07     adw     $17,$sy,jr &H75C4
75BE:  81 31        sbcw    $17,$sy
75C0:  B5 A3        jr      c,&H7564
75C2:  89 31        sbw     $17,$sy
75C4:  77 97 03     cal     &H0397
75C7:  B7 2E        jr      &H75F6
75C9:  D1 13 10 65  ldw     $19,&H6510
75CD:  A6 12        phsw    $18
75CF:  D1 11 F4 16  ldw     $17,&H16F4
75D3:  D1 00 01 11  ldw     $0,&H1101
75D7:  50 40 60     st      &H60,($sz)
75DA:  77 20 65     cal     &H6520
75DD:  D1 00 65 7F  ldw     $0,&H7F65
75E1:  77 51 68     cal     &H6851
75E4:  77 17 03     cal     &H0317
75E7:  77 19 76     cal     &H7619
75EA:  AE 13        ppsw    $19
75EC:  B0 06        jr      z,&H75F3
75EE:  77 DE 77     cal     &H77DE
75F1:  A0 06        stw     $6,(ix+$sx)
75F3:  82 71 13     ldw     $17,$19
75F6:  37 5A 75     jp      &H755A
75F9:  D1 11 EB 16  ldw     $17,&H16EB
75FD:  D1 00 01 11  ldw     $0,&H1101
7601:  50 40 60     st      &H60,($sz)
7604:  77 20 65     cal     &H6520
7607:  77 43 65     cal     &H6543
760A:  D6 00 01 11  pre     ix,&H1101
760E:  28 00        ld      $0,(ix+$sx)
7610:  42 01 7F     ld      $1,&H7F
7613:  77 51 68     cal     &H6851
7616:  77 17 03     cal     &H0317
7619:  77 DB 2A     cal     &H2ADB
761C:  77 17 68     cal     &H6817
761F:  89 66 06     sbw     $6,$6
7622:  3B 1F        sbc     (iz+$sx),$31
7624:  B0 24        jr      z,&H7649
7626:  77 A9 00     cal     &H00A9
7629:  B5 0A        jr      c,&H7634
762B:  77 19 78     cal     &H7819
762E:  B1 96        jr      nc,&H75C5
7630:  82 E6 11 0B  ldw     $6,$17,jr &H763E
7634:  77 EB 72     cal     &H72EB
7637:  02 1D        ld      $29,$sx
7639:  77 16 73     cal     &H7316
763C:  B0 A4        jr      z,&H75E1
763E:  77 3C 00     cal     &H003C
7641:  B1 A9        jr      nc,&H75EB
7643:  77 23 03     cal     &H0323
7646:  01 3F        sbc     $31,$sy
7648:  F7           rtn   
7649:  77 23 03     cal     &H0323
764C:  01 1F        sbc     $31,$sx
764E:  F7           rtn   
764F:  77 06 7B     cal     &H7B06
7652:  D1 11 FA 16  ldw     $17,&H16FA
7656:  77 FD 75     cal     &H75FD
7659:  B0 18        jr      z,&H7672
765B:  D6 00 98 16  pre     ix,&H1698
765F:  BA 06        sbcw    (ix+$sx),$6
7661:  B5 93        jr      c,&H75F5
7663:  D1 00 AF 16  ldw     $0,&H16AF
7667:  D0 40 FF FF  stw     &HFFFF,($sz)
766B:  77 7B 7B     cal     &H7B7B
766E:  A2 06        stiw    $6,(ix+$sx)
7670:  24 3F        std     $31,(ix+$sy)
7672:  77 05 7C     cal     &H7C05
7675:  77 7B 7B     cal     &H7B7B
7678:  A8 13        ldw     $19,(ix+$sx)
767A:  D6 00 98 16  pre     ix,&H1698
767E:  BA 13        sbcw    (ix+$sx),$19
7680:  42 02 02     ld      $2,&H02
7683:  35 90 79     jp      c,&H7990
7686:  D6 00 9D 16  pre     ix,&H169D
768A:  E8 00 60     ldm     $0,(ix+$sx),4
768D:  04 20        anc     $0,$sy
768F:  02 00        ld      $0,$sx
7691:  B4 0C        jr      nz,&H769E
7693:  01 21        sbc     $1,$sy
7695:  B4 08        jr      nz,&H769E
7697:  81 62 13     sbcw    $2,$19
769A:  B4 03        jr      nz,&H769E
769C:  02 20        ld      $0,$sy
769E:  24 00        std     $0,(ix+$sx)
76A0:  30 78 73     jp      z,&H7378
76A3:  77 C5 29     cal     &H29C5
76A6:  77 DE 77     cal     &H77DE
76A9:  EA 11 60     ldim    $17,(ix+$sx),4
76AC:  41 12 90     sbc     $18,&H90
76AF:  30 CA 73     jp      z,&H73CA
76B2:  41 12 91     sbc     $18,&H91
76B5:  30 A6 77     jp      z,&H77A6
76B8:  41 12 92     sbc     $18,&H92
76BB:  30 55 77     jp      z,&H7755
76BE:  01 12        sbc     $18,$sx
76C0:  B3 6F        jr      uz,&H7730
76C2:  42 1D 08     ld      $29,&H08
76C5:  77 2F 7A     cal     &H7A2F
76C8:  B4 67        jr      nz,&H7730
76CA:  D6 00 A7 16  pre     ix,&H16A7
76CE:  9A 11        didw    $17
76D0:  1A 10        did     $16
76D2:  41 10 05     sbc     $16,&H05
76D5:  B1 5A        jr      nc,&H7730
76D7:  89 62 02     sbw     $2,$2
76DA:  01 10        sbc     $16,$sx
76DC:  B0 06        jr      z,&H76E3
76DE:  18 70        biu     $16
76E0:  A8 62 10     ldw     $2,(ix+$16)
76E3:  88 73 02     adw     $19,$2
76E6:  82 60 13     ldw     $0,$19
76E9:  88 40        adw     $0,$sz
76EB:  77 36 77     cal     &H7736
76EE:  B1 1B        jr      nc,&H770A
76F0:  41 01 FF     sbc     $1,&HFF
76F3:  B4 08        jr      nz,&H76FC
76F5:  D1 0E DF 1B  ldw     $14,&H1BDF
76F9:  02 81 0F     ld      $1,$sx,jr &H770A
76FC:  41 0B 11     sbc     $11,&H11
76FF:  B4 0A        jr      nz,&H770A
7701:  D6 40 98 16  pre     iz,&H1698
7705:  BB 13        sbcw    (iz+$sx),$19
7707:  35 80 76     jp      c,&H7680
770A:  88 4E        adw     $14,$sz
770C:  41 11 05     sbc     $17,&H05
770F:  B1 20        jr      nc,&H7730
7711:  18 71        biu     $17
7713:  2C 60 11     ldd     $0,(ix+$17)
7716:  9A 12        didw    $18
7718:  09 32        sb      $18,$sy
771A:  18 72        biu     $18
771C:  D6 40 F1 7C  pre     iz,&H7CF1
7720:  1E 62        gst     ua,$2
7722:  56 60 04     pst     ua,&H04
7725:  A9 60 12     ldw     $0,(iz+$18)
7728:  16 62        pst     ua,$2
772A:  96 4E        pre     iz,$14
772C:  1A 11        did     $17
772E:  DE 00        jp      $0
7730:  42 02 00     ld      $2,&H00
7733:  37 90 79     jp      &H7990
7736:  D6 40 8D 16  pre     iz,&H168D
773A:  25 1F        std     $31,(iz+$sx)
773C:  D1 04 70 FF  ldw     $4,&HFF70
7740:  81 73 04     sbcw    $19,$4
7743:  F5           rtn     c
7744:  D1 04 80 00  ldw     $4,&H0080
7748:  80 73 04     adcw    $19,$4
774B:  F5           rtn     c
774C:  25 1E        std     $30,(iz+$sx)
774E:  82 60 13     ldw     $0,$19
7751:  89 6E 0E     sbw     $14,$14
7754:  F7           rtn   
7755:  E8 13 60     ldm     $19,(ix+$sx),4
7758:  77 D3 77     cal     &H77D3
775B:  91 75 15     ldw     $21,($21)
775E:  77 FF 7A     cal     &H7AFF
7761:  B0 12        jr      z,&H7774
7763:  77 89 29     cal     &H2989
7766:  89 35        sbw     $21,$sy
7768:  B5 1C        jr      c,&H7785
776A:  AB 10        ldiw    $16,(iz+$sx)
776C:  77 F1 2A     cal     &H2AF1
776F:  77 C5 29     cal     &H29C5
7772:  B7 8D        jr      &H7700
7774:  89 35        sbw     $21,$sy
7776:  B5 0B        jr      c,&H7782
7778:  AB 10        ldiw    $16,(iz+$sx)
777A:  77 F1 2A     cal     &H2AF1
777D:  77 C5 29     cal     &H29C5
7780:  B7 8D        jr      &H770E
7782:  77 5F 65     cal     &H655F
7785:  77 E8 2A     cal     &H2AE8
7788:  77 91 29     cal     &H2991
778B:  77 7B 7B     cal     &H7B7B
778E:  A8 13        ldw     $19,(ix+$sx)
7790:  D1 00 04 00  ldw     $0,&H0004
7794:  88 53        adw     $19,$sz
7796:  77 7B 7B     cal     &H7B7B
7799:  A8 11        ldw     $17,(ix+$sx)
779B:  A0 13        stw     $19,(ix+$sx)
779D:  77 F8 7A     cal     &H7AF8
77A0:  71 E3 7A     cal     nc,&H7AE3
77A3:  37 75 76     jp      &H7675
77A6:  E8 00 60     ldm     $0,(ix+$sx),4
77A9:  E6 03 60     phsm    $3,4
77AC:  77 02 20     cal     &H2002
77AF:  77 5E 97     cal     &H975E
77B2:  9E 4C        gre     iz,$12
77B4:  EE 13 60     ppsm    $19,4
77B7:  77 D3 77     cal     &H77D3
77BA:  96 0C        pre     ix,$12
77BC:  C9 65 45     sbbm    $5,$5,3
77BF:  41 06 50     sbc     $6,&H50
77C2:  B0 0C        jr      z,&H77CF
77C4:  2A 04        ldi     $4,(ix+$sx)
77C6:  01 04        sbc     $4,$sx
77C8:  B0 06        jr      z,&H77CF
77CA:  A3 04        stiw    $4,(iz+$sx)
77CC:  08 A6 8F     ad      $6,$sy,jr &H775D
77CF:  90 E6 15 CD  stw     $6,($21),jr &H779F
77D3:  77 DE 77     cal     &H77DE
77D6:  98 75        biuw    $21
77D8:  88 75 0E     adw     $21,$14
77DB:  96 42        pre     iz,$2
77DD:  F7           rtn   
77DE:  D6 00 96 16  pre     ix,&H1696
77E2:  A8 02        ldw     $2,(ix+$sx)
77E4:  A8 0E        ldw     $14,(ix+$sx)
77E6:  82 60 13     ldw     $0,$19
77E9:  98 60        biuw    $0
77EB:  88 42        adw     $2,$sz
77ED:  96 02        pre     ix,$2
77EF:  F7           rtn   
77F0:  49 00 30     sb      $0,&H30
77F3:  B5 4D        jr      c,&H7841
77F5:  41 00 05     sbc     $0,&H05
77F8:  F1           rtn     nc
77F9:  2D 21        ldd     $1,(iz+$sy)
77FB:  B7 1A        jr      &H7816
77FD:  A9 00        ldw     $0,(iz+$sx)
77FF:  D1 02 47 52  ldw     $2,&H5247
7803:  81 42        sbcw    $2,$sz
7805:  B4 96        jr      nz,&H779C
7807:  69 00 02     ld      $0,(iz+&H02)
780A:  49 00 30     sb      $0,&H30
780D:  B5 33        jr      c,&H7841
780F:  41 00 05     sbc     $0,&H05
7812:  F1           rtn     nc
7813:  6D 01 03     ldd     $1,(iz+&H03)
7816:  01 3F        sbc     $31,$sy
7818:  F7           rtn   
7819:  77 CD 00     cal     &H00CD
781C:  B0 16        jr      z,&H7833
781E:  02 44        ld      $4,$sz
7820:  41 00 2D     sbc     $0,&H2D
7823:  70 4D 00     cal     z,&H004D
7826:  77 E6 1E     cal     &H1EE6
7829:  B5 17        jr      c,&H7841
782B:  41 04 2D     sbc     $4,&H2D
782E:  B4 99        jr      nz,&H77C8
7830:  9B 91 9C     cmpw    $17,jr &H77CE
7833:  89 71 11     sbw     $17,$17
7836:  77 49 00     cal     &H0049
7839:  77 9D 00     cal     &H009D
783C:  F1           rtn     nc
783D:  01 12        sbc     $18,$sx
783F:  B3 04        jr      uz,&H7844
7841:  01 1F        sbc     $31,$sx
7843:  F7           rtn   
7844:  9A 31        diuw    $17
7846:  0E 51        or      $17,$sz
7848:  2D 20        ldd     $0,(iz+$sy)
784A:  77 9D 00     cal     &H009D
784D:  B1 B8        jr      nc,&H7806
784F:  B7 93        jr      &H77E3
7851:  A8 13        ldw     $19,(ix+$sx)
7853:  A9 00        ldw     $0,(iz+$sx)
7855:  9E 02        gre     ix,$2
7857:  D6 00 8D 16  pre     ix,&H168D
785B:  3A 1E        sbc     (ix+$sx),$30
785D:  96 02        pre     ix,$2
785F:  F4           rtn     nz
7860:  56 60 F4     pst     ua,&HF4
7863:  2D 00        ldd     $0,(iz+$sx)
7865:  56 60 54     pst     ua,&H54
7868:  02 01        ld      $1,$sx
786A:  F7           rtn   
786B:  D6 00 B1 16  pre     ix,&H16B1
786F:  24 1E        std     $30,(ix+$sx)
7871:  81 33        sbcw    $19,$sy
7873:  F5           rtn     c
7874:  80 73 13     adcw    $19,$19
7877:  B5 04        jr      c,&H787C
7879:  24 1F        std     $31,(ix+$sx)
787B:  F7           rtn   
787C:  3C 1E        ad      (ix+$sx),$30
787E:  F7           rtn   
787F:  77 51 78     cal     &H7851
7882:  01 31        sbc     $17,$sy
7884:  B0 04        jr      z,&H7889
7886:  88 D3 63     adw     $19,$sz,jr &H78EB
7889:  89 D3 60     sbw     $19,$sz,jr &H78EB
788C:  77 51 78     cal     &H7851
788F:  01 31        sbc     $17,$sy
7891:  B5 06        jr      c,&H7898
7893:  B4 07        jr      nz,&H789B
7895:  8E D3 54     orw     $19,$sz,jr &H78EB
7898:  8C D3 51     anw     $19,$sz,jr &H78EB
789B:  8F D3 4E     xrw     $19,$sz,jr &H78EB
789E:  77 51 78     cal     &H7851
78A1:  01 31        sbc     $17,$sy
78A3:  B0 07        jr      z,&H78AB
78A5:  48 14 80     ad      $20,&H80
78A8:  48 01 80     ad      $1,&H80
78AB:  D6 00 B1 16  pre     ix,&H16B1
78AF:  24 1E        std     $30,(ix+$sx)
78B1:  89 53        sbw     $19,$sz
78B3:  74 77 78     cal     nz,&H7877
78B6:  B7 39        jr      &H78F0
78B8:  82 75 13     ldw     $21,$19
78BB:  77 5B 79     cal     &H795B
78BE:  01 31        sbc     $17,$sy
78C0:  B4 2F        jr      nz,&H78F0
78C2:  B7 06        jr      &H78C9
78C4:  77 51 78     cal     &H7851
78C7:  82 53        ldw     $19,$sz
78C9:  A0 13        stw     $19,(ix+$sx)
78CB:  B7 24        jr      &H78F0
78CD:  A8 00        ldw     $0,(ix+$sx)
78CF:  D6 00 8D 16  pre     ix,&H168D
78D3:  3A 1E        sbc     (ix+$sx),$30
78D5:  B4 0B        jr      nz,&H78E1
78D7:  56 60 F4     pst     ua,&HF4
78DA:  25 00        std     $0,(iz+$sx)
78DC:  56 60 54     pst     ua,&H54
78DF:  B7 10        jr      &H78F0
78E1:  A1 00        stw     $0,(iz+$sx)
78E3:  B7 0C        jr      &H78F0
78E5:  01 31        sbc     $17,$sy
78E7:  B5 A4        jr      c,&H788C
78E9:  B0 9D        jr      z,&H7887
78EB:  A0 13        stw     $19,(ix+$sx)
78ED:  77 6B 78     cal     &H786B
78F0:  77 7B 7B     cal     &H7B7B
78F3:  A8 13        ldw     $19,(ix+$sx)
78F5:  88 33        adw     $19,$sy
78F7:  88 B3 0D     adw     $19,$sy,jr &H7906
78FA:  77 7B 7B     cal     &H7B7B
78FD:  A8 15        ldw     $21,(ix+$sx)
78FF:  88 35        adw     $21,$sy
7901:  88 35        adw     $21,$sy
7903:  77 5B 79     cal     &H795B
7906:  37 96 77     jp      &H7796
7909:  01 34        sbc     $20,$sy
790B:  B5 03        jr      c,&H790F
790D:  0D 13        na      $19,$sx
790F:  9A 53        bydw    $19
7911:  A8 13        ldw     $19,(ix+$sx)
7913:  89 40        sbw     $0,$sz
7915:  8D 42        naw     $2,$sz
7917:  44 11 02     anc     $17,&H02
791A:  B4 09        jr      nz,&H7924
791C:  02 61 14     ld      $1,$20
791F:  4C 01 80     an      $1,&H80
7922:  98 43        bidw    $3
7924:  09 32        sb      $18,$sy
7926:  B5 BC        jr      c,&H78E3
7928:  04 31        anc     $17,$sy
792A:  B4 09        jr      nz,&H7934
792C:  98 73        biuw    $19
792E:  8C 73 02     anw     $19,$2
7931:  8E D3 8F     orw     $19,$sz,jr &H78C2
7934:  98 D4 88     bidw    $20,jr &H78BE
7937:  D6 00 B1 16  pre     ix,&H16B1
793B:  2C 00        ldd     $0,(ix+$sx)
793D:  41 11 03     sbc     $17,&H03
7940:  B0 10        jr      z,&H7951
7942:  B1 0C        jr      nc,&H794F
7944:  01 31        sbc     $17,$sy
7946:  B5 0D        jr      c,&H7954
7948:  B4 0F        jr      nz,&H7958
794A:  41 00 02     sbc     $0,&H02
794D:  B4 DE        jr      nz,&H792C
794F:  B7 CA        jr      &H791A
7951:  01 A0 86     sbc     $0,$sy,jr &H78D9
7954:  44 80 02 8A  anc     $0,&H02,jr &H78E1
7958:  04 A0 8D     anc     $0,$sy,jr &H78E7
795B:  D6 40 AF 16  pre     iz,&H16AF
795F:  A9 00        ldw     $0,(iz+$sx)
7961:  82 44        ldw     $4,$sz
7963:  D1 02 80 FF  ldw     $2,&HFF80
7967:  89 60 02     sbw     $0,$2
796A:  B5 22        jr      c,&H798D
796C:  98 60        biuw    $0
796E:  D1 02 DF 1B  ldw     $2,&H1BDF
7972:  88 42        adw     $2,$sz
7974:  01 11        sbc     $17,$sx
7976:  B4 12        jr      nz,&H7989
7978:  09 24        sb      $4,$sy
797A:  41 04 80     sbc     $4,&H80
797D:  B5 0F        jr      c,&H798D
797F:  A1 04        stw     $4,(iz+$sx)
7981:  96 42        pre     iz,$2
7983:  6D 80 02     ldd     $0,(iz-&H02)
7986:  A1 15        stw     $21,(iz+$sx)
7988:  F7           rtn   
7989:  08 24        ad      $4,$sy
798B:  B1 1E        jr      nc,&H79AA
798D:  42 02 04     ld      $2,&H04
7990:  26 02        phs     $2
7992:  77 49 65     cal     &H6549
7995:  2E 00        pps     $0
7997:  D6 00 D1 16  pre     ix,&H16D1
799B:  77 1B 65     cal     &H651B
799E:  77 94 7B     cal     &H7B94
79A1:  77 43 65     cal     &H6543
79A4:  77 5F 65     cal     &H655F
79A7:  37 D5 73     jp      &H73D5
79AA:  A1 04        stw     $4,(iz+$sx)
79AC:  96 42        pre     iz,$2
79AE:  A9 13        ldw     $19,(iz+$sx)
79B0:  F7           rtn   
79B1:  4E 1D 02     or      $29,&H02
79B4:  77 47 73     cal     &H7347
79B7:  B7 50        jr      &H7A08
79B9:  4C 1D FD     an      $29,&HFD
79BC:  77 6A 73     cal     &H736A
79BF:  F0           rtn     z
79C0:  77 EB 72     cal     &H72EB
79C3:  30 29 7A     jp      z,&H7A29
79C6:  44 1D 04     anc     $29,&H04
79C9:  02 02        ld      $2,$sx
79CB:  B0 55        jr      z,&H7A21
79CD:  41 1D 10     sbc     $29,&H10
79D0:  B3 37        jr      uz,&H7A08
79D2:  B5 A2        jr      c,&H7975
79D4:  96 19        pre     ix,$25
79D6:  E8 00 A0     ldm     $0,(ix+$sx),6
79D9:  C7 48 A0     xrcm    $8,$sz,6
79DC:  B0 94        jr      z,&H7971
79DE:  41 1D 30     sbc     $29,&H30
79E1:  B3 26        jr      uz,&H7A08
79E3:  D6 00 5E 16  pre     ix,&H165E
79E7:  EA 00 C0     ldim    $0,(ix+$sx),7
79EA:  C7 68 A1     xrcm    $8,$1,6
79ED:  B4 1A        jr      nz,&H7A08
79EF:  BA 1E        sbcw    (ix+$sx),$30
79F1:  B1 07        jr      nc,&H79F9
79F3:  D6 00 94 16  pre     ix,&H1694
79F7:  A0 15        stw     $21,(ix+$sx)
79F9:  4C 1D 3F     an      $29,&H3F
79FC:  44 00 02     anc     $0,&H02
79FF:  B0 08        jr      z,&H7A08
7A01:  96 19        pre     ix,$25
7A03:  6C 00 06     ldd     $0,(ix+&H06)
7A06:  A0 15        stw     $21,(ix+$sx)
7A08:  77 A9 00     cal     &H00A9
7A0B:  B1 12        jr      nc,&H7A1E
7A0D:  E9 00 80     ldm     $0,(iz+$sx),5
7A10:  77 2F 7A     cal     &H7A2F
7A13:  B4 0A        jr      nz,&H7A1E
7A15:  2D 60 05     ldd     $0,(iz+$5)
7A18:  77 49 00     cal     &H0049
7A1B:  01 1E        sbc     $30,$sx
7A1D:  F7           rtn   
7A1E:  42 02 08     ld      $2,&H08
7A21:  AE 00        ppsw    $0
7A23:  77 80 72     cal     &H7280
7A26:  37 99 70     jp      &H7099
7A29:  77 67 73     cal     &H7367
7A2C:  F0           rtn     z
7A2D:  B7 A6        jr      &H79D4
7A2F:  D6 00 13 16  pre     ix,&H1613
7A33:  56 60 24     pst     ua,&H24
7A36:  C9 65 A5     sbbm    $5,$5,6
7A39:  DA 4A 80     bydm    $10,5
7A3C:  2A 0A        ldi     $10,(ix+$sx)
7A3E:  08 25        ad      $5,$sy
7A40:  44 0A 80     anc     $10,&H80
7A43:  B0 8B        jr      z,&H79CF
7A45:  49 0A 80     sb      $10,&H80
7A48:  2A 0B        ldi     $11,(ix+$sx)
7A4A:  44 1D 08     anc     $29,&H08
7A4D:  B4 24        jr      nz,&H7A72
7A4F:  41 05 04     sbc     $5,&H04
7A52:  B0 13        jr      z,&H7A66
7A54:  B1 15        jr      nc,&H7A6A
7A56:  04 25        anc     $5,$sy
7A58:  B4 15        jr      nz,&H7A6E
7A5A:  81 49        sbcw    $9,$sz
7A5C:  56 60 54     pst     ua,&H54
7A5F:  F0           rtn     z
7A60:  41 0B 02     sbc     $11,&H02
7A63:  B1 B1        jr      nc,&H7A15
7A65:  F7           rtn   
7A66:  C7 C7 60 8D  xrcm    $7,$sz,4,jr &H79F6
7A6A:  C7 C6 80 91  xrcm    $6,$sz,5,jr &H79FE
7A6E:  C7 C8 40 95  xrcm    $8,$sz,3,jr &H7A06
7A72:  01 EB 12 99  sbc     $11,$18,jr &H7A0E
7A76:  D1 11 02 00  ldw     $17,&H0002
7A7A:  41 0B 07     sbc     $11,&H07
7A7D:  B0 29        jr      z,&H7AA7
7A7F:  B1 2B        jr      nc,&H7AAB
7A81:  41 0B 03     sbc     $11,&H03
7A84:  B0 26        jr      z,&H7AAB
7A86:  B5 EC        jr      c,&H7A73
7A88:  41 0B 06     sbc     $11,&H06
7A8B:  B4 23        jr      nz,&H7AAF
7A8D:  41 00 27     sbc     $0,&H27
7A90:  82 31        ldw     $17,$sy
7A92:  B4 18        jr      nz,&H7AAB
7A94:  9E 42        gre     iz,$2
7A96:  02 11        ld      $17,$sx
7A98:  2D 20        ldd     $0,(iz+$sy)
7A9A:  41 00 27     sbc     $0,&H27
7A9D:  B0 15        jr      z,&H7AB3
7A9F:  77 70 73     cal     &H7370
7AA2:  B0 10        jr      z,&H7AB3
7AA4:  08 B1 8E     ad      $17,$sy,jr &H7A34
7AA7:  77 E6 1E     cal     &H1EE6
7AAA:  F5           rtn     c
7AAB:  88 75 11     adw     $21,$17
7AAE:  F7           rtn   
7AAF:  42 91 04 87  ld      $17,&H04,jr &H7A39
7AB3:  96 C2 8A     pre     iz,$2,jr &H7A3F
7AB6:  82 EE 11 03  ldw     $14,$17,jr &H7ABC
7ABA:  91 4E        ldw     $14,($sz)
7ABC:  42 0A 04     ld      $10,&H04
7ABF:  DA 2E 40     dium    $14,3
7AC2:  4C 10 0F     an      $16,&H0F
7AC5:  41 10 0A     sbc     $16,&H0A
7AC8:  B5 04        jr      c,&H7ACD
7ACA:  48 10 07     ad      $16,&H07
7ACD:  E6 0F A0     phsm    $15,6
7AD0:  77 D7 7B     cal     &H7BD7
7AD3:  EE 0A A0     ppsm    $10,6
7AD6:  09 2A        sb      $10,$sy
7AD8:  B4 9A        jr      nz,&H7A73
7ADA:  F7           rtn   
7ADB:  77 7E 0B     cal     &H0B7E
7ADE:  88 33        adw     $19,$sy
7AE0:  2D 00        ldd     $0,(iz+$sx)
7AE2:  F7           rtn   
7AE3:  74 89 29     cal     nz,&H2989
7AE6:  77 3F 7B     cal     &H7B3F
7AE9:  77 A7 7B     cal     &H7BA7
7AEC:  77 F8 7A     cal     &H7AF8
7AEF:  70 5F 65     cal     z,&H655F
7AF2:  77 E8 2A     cal     &H2AE8
7AF5:  37 91 29     jp      &H2991
7AF8:  D6 00 9C 16  pre     ix,&H169C
7AFC:  3A 1E        sbc     (ix+$sx),$30
7AFE:  F5           rtn     c
7AFF:  D6 00 B3 16  pre     ix,&H16B3
7B03:  3A 1F        sbc     (ix+$sx),$31
7B05:  F7           rtn   
7B06:  D1 11 85 17  ldw     $17,&H1785
7B0A:  77 49 65     cal     &H6549
7B0D:  77 20 65     cal     &H6520
7B10:  B7 07        jr      &H7B18
7B12:  42 02 10     ld      $2,&H10
7B15:  77 B5 72     cal     &H72B5
7B18:  77 7B 7B     cal     &H7B7B
7B1B:  A8 13        ldw     $19,(ix+$sx)
7B1D:  82 71 13     ldw     $17,$19
7B20:  77 B6 7A     cal     &H7AB6
7B23:  77 50 7B     cal     &H7B50
7B26:  77 13 73     cal     &H7313
7B29:  F0           rtn     z
7B2A:  42 0E 06     ld      $14,&H06
7B2D:  9E 00        gre     ix,$0
7B2F:  96 40        pre     iz,$0
7B31:  2B 10        ldi     $16,(iz+$sx)
7B33:  26 0E        phs     $14
7B35:  77 F1 2A     cal     &H2AF1
7B38:  2E 0E        pps     $14
7B3A:  09 2E        sb      $14,$sy
7B3C:  B4 8C        jr      nz,&H7AC9
7B3E:  F7           rtn   
7B3F:  77 B6 7A     cal     &H7AB6
7B42:  77 50 7B     cal     &H7B50
7B45:  77 13 73     cal     &H7313
7B48:  B4 0D        jr      nz,&H7B56
7B4A:  77 50 7B     cal     &H7B50
7B4D:  77 50 7B     cal     &H7B50
7B50:  77 D7 2A     cal     &H2AD7
7B53:  37 D7 2A     jp      &H2AD7
7B56:  D1 0E 06 00  ldw     $14,&H0006
7B5A:  9E 00        gre     ix,$0
7B5C:  96 40        pre     iz,$0
7B5E:  2B 10        ldi     $16,(iz+$sx)
7B60:  41 10 20     sbc     $16,&H20
7B63:  B1 04        jr      nc,&H7B68
7B65:  08 AF 08     ad      $15,$sy,jr &H7B6F
7B68:  A6 0F        phsw    $15
7B6A:  77 F1 2A     cal     &H2AF1
7B6D:  AE 0E        ppsw    $14
7B6F:  09 2E        sb      $14,$sy
7B71:  B4 94        jr      nz,&H7B06
7B73:  09 2F        sb      $15,$sy
7B75:  F5           rtn     c
7B76:  77 D7 2A     cal     &H2AD7
7B79:  B7 87        jr      &H7B01
7B7B:  D6 00 9A 16  pre     ix,&H169A
7B7F:  F7           rtn   
7B80:  42 90 3A 57  ld      $16,&H3A,jr &H7BDA
7B84:  09 3D        sb      $29,$sy
7B86:  42 90 2C 51  ld      $16,&H2C,jr &H7BDA
7B8A:  42 10 47     ld      $16,&H47
7B8D:  77 F1 2A     cal     &H2AF1
7B90:  42 90 52 47  ld      $16,&H52,jr &H7BDA
7B94:  D1 11 85 17  ldw     $17,&H1785
7B98:  77 20 65     cal     &H6520
7B9B:  77 18 7B     cal     &H7B18
7B9E:  77 E8 2A     cal     &H2AE8
7BA1:  77 4A 7B     cal     &H7B4A
7BA4:  77 4A 7B     cal     &H7B4A
7BA7:  77 16 7C     cal     &H7C16
7BAA:  77 D7 2A     cal     &H2AD7
7BAD:  09 3D        sb      $29,$sy
7BAF:  B4 86        jr      nz,&H7B36
7BB1:  77 9A 29     cal     &H299A
7BB4:  41 01 02     sbc     $1,&H02
7BB7:  B4 07        jr      nz,&H7BBF
7BB9:  77 4D 7B     cal     &H7B4D
7BBC:  77 4D 7B     cal     &H7B4D
7BBF:  42 1D 05     ld      $29,&H05
7BC2:  D6 40 A7 16  pre     iz,&H16A7
7BC6:  AB 0E        ldiw    $14,(iz+$sx)
7BC8:  77 BC 7A     cal     &H7ABC
7BCB:  77 D7 2A     cal     &H2AD7
7BCE:  09 3D        sb      $29,$sy
7BD0:  B4 8B        jr      nz,&H7B5C
7BD2:  2D 10        ldd     $16,(iz+$sx)
7BD4:  4C 10 03     an      $16,&H03
7BD7:  48 10 30     ad      $16,&H30
7BDA:  37 F1 2A     jp      &H2AF1
7BDD:  D1 02 0A 07  ldw     $2,&H070A
7BE1:  77 1D 03     cal     &H031D
7BE4:  77 3B 29     cal     &H293B
7BE7:  B0 04        jr      z,&H7BEC
7BE9:  42 03 03     ld      $3,&H03
7BEC:  09 22        sb      $2,$sy
7BEE:  F5           rtn     c
7BEF:  A6 03        phsw    $3
7BF1:  42 10 20     ld      $16,&H20
7BF4:  77 F4 2A     cal     &H2AF4
7BF7:  AE 02        ppsw    $2
7BF9:  D1 00 01 11  ldw     $0,&H1101
7BFD:  11 40        ld      $0,($sz)
7BFF:  0C 60 03     an      $0,$3
7C02:  B4 97        jr      nz,&H7B9A
7C04:  F7           rtn   
7C05:  77 38 93     cal     &H9338
7C08:  37 F5 92     jp      &H92F5
7C0B:  D1 00 8E 16  ldw     $0,&H168E
7C0F:  D1 02 2B 00  ldw     $2,&H002B
7C13:  37 57 01     jp      &H0157
7C16:  77 D7 2A     cal     &H2AD7
7C19:  82 73 11     ldw     $19,$17
7C1C:  77 DE 77     cal     &H77DE
7C1F:  EA 11 E0     ldim    $17,(ix+$sx),8
7C22:  56 60 24     pst     ua,&H24
7C25:  D6 00 8C 15  pre     ix,&H158C
7C29:  EA 19 80     ldim    $25,(ix+$sx),5
7C2C:  01 79 12     sbc     $25,$18
7C2F:  B0 05        jr      z,&H7C35
7C31:  01 19        sbc     $25,$sx
7C33:  B4 8B        jr      nz,&H7BBF
7C35:  56 60 54     pst     ua,&H54
7C38:  02 70 1A     ld      $16,$26
7C3B:  77 F1 2A     cal     &H2AF1
7C3E:  02 70 1B     ld      $16,$27
7C41:  77 F1 2A     cal     &H2AF1
7C44:  02 70 1C     ld      $16,$28
7C47:  77 F1 2A     cal     &H2AF1
7C4A:  02 70 1D     ld      $16,$29
7C4D:  77 F1 2A     cal     &H2AF1
7C50:  77 D7 2A     cal     &H2AD7
7C53:  42 1D 13     ld      $29,&H13
7C56:  41 12 90     sbc     $18,&H90
7C59:  F0           rtn     z
7C5A:  B5 13        jr      c,&H7C6E
7C5C:  82 6E 15     ldw     $14,$21
7C5F:  77 68 7C     cal     &H7C68
7C62:  77 84 7B     cal     &H7B84
7C65:  82 6E 17     ldw     $14,$23
7C68:  49 1D 04     sb      $29,&H04
7C6B:  37 BC 7A     jp      &H7ABC
7C6E:  41 12 81     sbc     $18,&H81
7C71:  F0           rtn     z
7C72:  41 12 71     sbc     $18,&H71
7C75:  B4 04        jr      nz,&H7C7A
7C77:  1A 91 25     did     $17,jr &H7C9E
7C7A:  41 12 60     sbc     $18,&H60
7C7D:  B1 14        jr      nc,&H7C92
7C7F:  41 11 50     sbc     $17,&H50
7C82:  B1 3E        jr      nc,&H7CC1
7C84:  77 8A 7B     cal     &H7B8A
7C87:  02 70 11     ld      $16,$17
7C8A:  1A 10        did     $16
7C8C:  77 AC 7C     cal     &H7CAC
7C8F:  77 84 7B     cal     &H7B84
7C92:  82 6E 13     ldw     $14,$19
7C95:  77 68 7C     cal     &H7C68
7C98:  01 11        sbc     $17,$sx
7C9A:  F2           rtn     lz
7C9B:  77 84 7B     cal     &H7B84
7C9E:  4C 11 0F     an      $17,&H0F
7CA1:  41 11 05     sbc     $17,&H05
7CA4:  B1 0D        jr      nc,&H7CB2
7CA6:  77 8A 7B     cal     &H7B8A
7CA9:  02 70 11     ld      $16,$17
7CAC:  49 1D 03     sb      $29,&H03
7CAF:  37 D7 7B     jp      &H7BD7
7CB2:  49 1D 03     sb      $29,&H03
7CB5:  42 10 2A     ld      $16,&H2A
7CB8:  77 F1 2A     cal     &H2AF1
7CBB:  77 F1 2A     cal     &H2AF1
7CBE:  37 F1 2A     jp      &H2AF1
7CC1:  77 B2 7C     cal     &H7CB2
7CC4:  B7 B6        jr      &H7C7B
7CC6:  77 B2 0A     cal     &H0AB2
7CC9:  02 2D        ld      $13,$sy
7CCB:  C6 6E 4E     orcm    $14,$14,3
7CCE:  B0 0E        jr      z,&H7CDD
7CD0:  42 0D 05     ld      $13,&H05
7CD3:  01 30        sbc     $16,$sy
7CD5:  B1 07        jr      nc,&H7CDD
7CD7:  DA 2E 40     dium    $14,3
7CDA:  09 AD 89     sb      $13,$sy,jr &H7C65
7CDD:  E6 10 60     phsm    $16,4
7CE0:  4C 10 0F     an      $16,&H0F
7CE3:  77 D7 7B     cal     &H7BD7
7CE6:  EE 0D 60     ppsm    $13,4
7CE9:  DA 2E 40     dium    $14,3
7CEC:  09 2D        sb      $13,$sy
7CEE:  B4 92        jr      nz,&H7C81
7CF0:  F7           rtn   
7CF1:  E5 78 7F     stdm    $24,(iz+$31),4
7CF4:  78 8C 78     adc     (ix-&H78),$12
7CF7:  9E 78        gre     us,$24
7CF9:  09 79 37     sb      $25,$23
7CFC:  79 B8 78     adc     (iz-&H78),$24
7CFF:  FA           fst   
7D00:  78 77 42     adc     (ix+&H42),$23
7D03:  7D 44 00     ad      (iz+&H00),$4
7D06:  08 B0 87     ad      $16,$sy,jr &H7C8F
7D09:  F7           rtn   
7D0A:  42 80 FF 0A  ld      $0,&HFF,jr &H7D17
7D0E:  02 60 08     ld      $0,$8
7D11:  77 17 7D     cal     &H7D17
7D14:  02 60 09     ld      $0,$9
7D17:  D6 00 FE FF  pre     ix,&HFFFE
7D1B:  1E 61        gst     ua,$1
7D1D:  56 60 34     pst     ua,&H34
7D20:  24 00        std     $0,(ix+$sx)
7D22:  16 61        pst     ua,$1
7D24:  77 42 7D     cal     &H7D42
7D27:  44 00 02     anc     $0,&H02
7D2A:  B0 87        jr      z,&H7CB2
7D2C:  F7           rtn   
7D2D:  77 42 7D     cal     &H7D42
7D30:  04 20        anc     $0,$sy
7D32:  B4 86        jr      nz,&H7CB9
7D34:  D6 00 FE FF  pre     ix,&HFFFE
7D38:  1E 61        gst     ua,$1
7D3A:  56 60 34     pst     ua,&H34
7D3D:  2C 00        ldd     $0,(ix+$sx)
7D3F:  16 61        pst     ua,$1
7D41:  F7           rtn   
7D42:  D6 00 FF FF  pre     ix,&HFFFF
7D46:  1E 61        gst     ua,$1
7D48:  56 60 34     pst     ua,&H34
7D4B:  2C 00        ldd     $0,(ix+$sx)
7D4D:  44 00 10     anc     $0,&H10
7D50:  B4 92        jr      nz,&H7CE3
7D52:  D6 00 FE FF  pre     ix,&HFFFE
7D56:  2C 00        ldd     $0,(ix+$sx)
7D58:  2C 20        ldd     $0,(ix+$sy)
7D5A:  04 20        anc     $0,$sy
7D5C:  B0 8B        jr      z,&H7CE8
7D5E:  42 00 02     ld      $0,&H02
7D61:  24 00        std     $0,(ix+$sx)
7D63:  16 61        pst     ua,$1
7D65:  77 2D 7D     cal     &H7D2D
7D68:  4C 00 0F     an      $0,&H0F
7D6B:  02 5D        ld      $29,$sz
7D6D:  77 01 7D     cal     &H7D01
7D70:  02 60 1D     ld      $0,$29
7D73:  D6 00 71 80  pre     ix,&H8071
7D77:  56 60 04     pst     ua,&H04
7D7A:  08 40        ad      $0,$sz
7D7C:  A8 42        ldw     $2,(ix+$sz)
7D7E:  56 60 54     pst     ua,&H54
7D81:  DE 02        jp      $2
7D83:  D1 0A 75 17  ldw     $10,&H1775
7D87:  B7 05        jr      &H7D8D
7D89:  D1 0A 5E 16  ldw     $10,&H165E
7D8D:  D1 08 0B 00  ldw     $8,&H000B
7D91:  96 0A        pre     ix,$10
7D93:  89 28        sbw     $8,$sy
7D95:  F5           rtn     c
7D96:  2A 00        ldi     $0,(ix+$sx)
7D98:  9E 0A        gre     ix,$10
7D9A:  77 17 7D     cal     &H7D17
7D9D:  B7 8D        jr      &H7D2B
7D9F:  89 28        sbw     $8,$sy
7DA1:  F5           rtn     c
7DA2:  77 2D 7D     cal     &H7D2D
7DA5:  96 0A        pre     ix,$10
7DA7:  22 00        sti     $0,(ix+$sx)
7DA9:  9E 8A 8C     gre     ix,$10,jr &H7D37
7DAC:  D6 00 BF 16  pre     ix,&H16BF
7DB0:  3A 1E        sbc     (ix+$sx),$30
7DB2:  B0 30        jr      z,&H7DE3
7DB4:  D6 00 FF FF  pre     ix,&HFFFF
7DB8:  1E 61        gst     ua,$1
7DBA:  56 60 34     pst     ua,&H34
7DBD:  2C 02        ldd     $2,(ix+$sx)
7DBF:  44 02 10     anc     $2,&H10
7DC2:  B0 20        jr      z,&H7DE3
7DC4:  24 1E        std     $30,(ix+$sx)
7DC6:  02 03        ld      $3,$sx
7DC8:  2C 02        ldd     $2,(ix+$sx)
7DCA:  09 23        sb      $3,$sy
7DCC:  B0 16        jr      z,&H7DE3
7DCE:  04 22        anc     $2,$sy
7DD0:  B4 89        jr      nz,&H7D5A
7DD2:  44 02 04     anc     $2,&H04
7DD5:  B0 8E        jr      z,&H7D64
7DD7:  28 A2        ld      $2,(ix-$sy)
7DD9:  00 22        adc     $2,$sy
7DDB:  B0 07        jr      z,&H7DE3
7DDD:  02 03        ld      $3,$sx
7DDF:  2C 02        ldd     $2,(ix+$sx)
7DE1:  09 23        sb      $3,$sy
7DE3:  30 80 2B     jp      z,&H2B80
7DE6:  44 02 10     anc     $2,&H10
7DE9:  B0 8B        jr      z,&H7D75
7DEB:  24 00        std     $0,(ix+$sx)
7DED:  16 61        pst     ua,$1
7DEF:  77 42 7D     cal     &H7D42
7DF2:  44 00 04     anc     $0,&H04
7DF5:  B0 87        jr      z,&H7D7D
7DF7:  F7           rtn   
7DF8:  96 0F        pre     ix,$15
7DFA:  D1 02 30 3A  ldw     $2,&H3A30
7DFE:  BA 02        sbcw    (ix+$sx),$2
7E00:  F4           rtn     nz
7E01:  49 11 02     sb      $17,&H02
7E04:  35 88 2B     jp      c,&H2B88
7E07:  AA 02        ldiw    $2,(ix+$sx)
7E09:  F7           rtn   
7E0A:  02 0A        ld      $10,$sx
7E0C:  D1 00 5E 16  ldw     $0,&H165E
7E10:  77 F8 7D     cal     &H7DF8
7E13:  A6 01        phsw    $1
7E15:  42 02 08     ld      $2,&H08
7E18:  77 4F 7E     cal     &H7E4F
7E1B:  42 02 03     ld      $2,&H03
7E1E:  77 4F 7E     cal     &H7E4F
7E21:  AE 04        ppsw    $4
7E23:  41 0A 02     sbc     $10,&H02
7E26:  B5 1D        jr      c,&H7E44
7E28:  96 04        pre     ix,$4
7E2A:  42 01 0B     ld      $1,&H0B
7E2D:  2A 00        ldi     $0,(ix+$sx)
7E2F:  41 00 20     sbc     $0,&H20
7E32:  B4 11        jr      nz,&H7E44
7E34:  09 21        sb      $1,$sy
7E36:  B4 8A        jr      nz,&H7DC1
7E38:  D1 00 3F 0B  ldw     $0,&H0B3F
7E3C:  96 04        pre     ix,$4
7E3E:  22 00        sti     $0,(ix+$sx)
7E40:  09 21        sb      $1,$sy
7E42:  B4 85        jr      nz,&H7DC8
7E44:  96 04        pre     ix,$4
7E46:  2C 00        ldd     $0,(ix+$sx)
7E48:  41 00 20     sbc     $0,&H20
7E4B:  30 88 2B     jp      z,&H2B88
7E4E:  F7           rtn   
7E4F:  42 04 20     ld      $4,&H20
7E52:  3A 1F        sbc     (ix+$sx),$31
7E54:  B0 3C        jr      z,&H7E91
7E56:  2A 05        ldi     $5,(ix+$sx)
7E58:  09 31        sb      $17,$sy
7E5A:  41 05 2E     sbc     $5,&H2E
7E5D:  B0 27        jr      z,&H7E85
7E5F:  04 2A        anc     $10,$sy
7E61:  B4 0B        jr      nz,&H7E6D
7E63:  41 05 2A     sbc     $5,&H2A
7E66:  B0 26        jr      z,&H7E8D
7E68:  41 05 3F     sbc     $5,&H3F
7E6B:  B0 04        jr      z,&H7E70
7E6D:  77 B7 7E     cal     &H7EB7
7E70:  10 45        st      $5,($sz)
7E72:  88 20        adw     $0,$sy
7E74:  09 22        sb      $2,$sy
7E76:  B4 A5        jr      nz,&H7E1C
7E78:  3A 1F        sbc     (ix+$sx),$31
7E7A:  B0 16        jr      z,&H7E91
7E7C:  2A 05        ldi     $5,(ix+$sx)
7E7E:  09 31        sb      $17,$sy
7E80:  41 05 2E     sbc     $5,&H2E
7E83:  B4 8C        jr      nz,&H7E10
7E85:  09 22        sb      $2,$sy
7E87:  F5           rtn     c
7E88:  10 44        st      $4,($sz)
7E8A:  88 A0 87     adw     $0,$sy,jr &H7E13
7E8D:  42 84 3F 98  ld      $4,&H3F,jr &H7E28
7E91:  01 11        sbc     $17,$sx
7E93:  B0 8F        jr      z,&H7E23
7E95:  37 88 2B     jp      &H2B88
7E98:  11 50        ld      $16,($sz)
7E9A:  88 20        adw     $0,$sy
7E9C:  41 10 20     sbc     $16,&H20
7E9F:  B5 06        jr      c,&H7EA6
7EA1:  41 10 7F     sbc     $16,&H7F
7EA4:  B4 04        jr      nz,&H7EA9
7EA6:  42 10 20     ld      $16,&H20
7EA9:  E6 02 40     phsm    $2,3
7EAC:  77 F1 2A     cal     &H2AF1
7EAF:  EE 00 40     ppsm    $0,3
7EB2:  09 22        sb      $2,$sy
7EB4:  B4 9D        jr      nz,&H7E52
7EB6:  F7           rtn   
7EB7:  41 05 E0     sbc     $5,&HE0
7EBA:  31 88 2B     jp      nc,&H2B88
7EBD:  44 05 60     anc     $5,&H60
7EC0:  B0 87        jr      z,&H7E48
7EC2:  26 00        phs     $0
7EC4:  02 60 05     ld      $0,$5
7EC7:  77 B6 00     cal     &H00B6
7ECA:  02 45        ld      $5,$sz
7ECC:  2E 00        pps     $0
7ECE:  9E 07        gre     ix,$7
7ED0:  1E 69        gst     ua,$9
7ED2:  56 60 24     pst     ua,&H24
7ED5:  D6 00 7A 15  pre     ix,&H157A
7ED9:  2A 0B        ldi     $11,(ix+$sx)
7EDB:  01 6B 05     sbc     $11,$5
7EDE:  B0 A5        jr      z,&H7E84
7EE0:  01 0B        sbc     $11,$sx
7EE2:  B4 8A        jr      nz,&H7E6D
7EE4:  16 69        pst     ua,$9
7EE6:  96 07        pre     ix,$7
7EE8:  F7           rtn   
7EE9:  42 00 10     ld      $0,&H10
7EEC:  77 AC 7D     cal     &H7DAC
7EEF:  77 2D 7D     cal     &H7D2D
7EF2:  02 4F        ld      $15,$sz
7EF4:  77 2D 7D     cal     &H7D2D
7EF7:  02 50        ld      $16,$sz
7EF9:  77 2D 7D     cal     &H7D2D
7EFC:  77 2D 7D     cal     &H7D2D
7EFF:  77 01 7D     cal     &H7D01
7F02:  37 97 0A     jp      &H0A97
7F05:  D6 00 70 17  pre     ix,&H1770
7F09:  BA 1E        sbcw    (ix+$sx),$30
7F0B:  31 D7 2B     jp      nc,&H2BD7
7F0E:  F7           rtn   
7F0F:  77 93 00     cal     &H0093
7F12:  77 05 7F     cal     &H7F05
7F15:  42 00 11     ld      $0,&H11
7F18:  77 AC 7D     cal     &H7DAC
7F1B:  37 01 7D     jp      &H7D01
7F1E:  77 D2 11     cal     &H11D2
7F21:  77 5D 12     cal     &H125D
7F24:  77 05 7F     cal     &H7F05
7F27:  77 0A 7E     cal     &H7E0A
7F2A:  77 93 00     cal     &H0093
7F2D:  42 00 16     ld      $0,&H16
7F30:  77 AC 7D     cal     &H7DAC
7F33:  B7 37        jr      &H7F6B
7F35:  77 D2 11     cal     &H11D2
7F38:  77 5D 12     cal     &H125D
7F3B:  77 05 7F     cal     &H7F05
7F3E:  D1 00 A7 16  ldw     $0,&H16A7
7F42:  02 2A        ld      $10,$sy
7F44:  77 10 7E     cal     &H7E10
7F47:  42 02 BC     ld      $2,&HBC
7F4A:  77 E9 00     cal     &H00E9
7F4D:  34 70 2B     jp      nz,&H2B70
7F50:  77 D2 11     cal     &H11D2
7F53:  77 5D 12     cal     &H125D
7F56:  02 2A        ld      $10,$sy
7F58:  77 0C 7E     cal     &H7E0C
7F5B:  77 93 00     cal     &H0093
7F5E:  42 00 15     ld      $0,&H15
7F61:  77 AC 7D     cal     &H7DAC
7F64:  D1 0A A7 16  ldw     $10,&H16A7
7F68:  77 8D 7D     cal     &H7D8D
7F6B:  77 89 7D     cal     &H7D89
7F6E:  37 01 7D     jp      &H7D01
7F71:  77 93 00     cal     &H0093
7F74:  77 05 7F     cal     &H7F05
7F77:  D6 00 5E 16  pre     ix,&H165E
7F7B:  D1 00 3F 0B  ldw     $0,&H0B3F
7F7F:  22 00        sti     $0,(ix+$sx)
7F81:  09 21        sb      $1,$sy
7F83:  B4 85        jr      nz,&H7F09
7F85:  B7 22        jr      &H7FA8
7F87:  77 3C 00     cal     &H003C
7F8A:  B5 9A        jr      c,&H7F25
7F8C:  77 D2 11     cal     &H11D2
7F8F:  77 5D 12     cal     &H125D
7F92:  77 05 7F     cal     &H7F05
7F95:  01 11        sbc     $17,$sx
7F97:  B0 A7        jr      z,&H7F3F
7F99:  77 F8 7D     cal     &H7DF8
7F9C:  B0 AC        jr      z,&H7F49
7F9E:  42 0A 02     ld      $10,&H02
7FA1:  D1 00 5E 16  ldw     $0,&H165E
7FA5:  77 13 7E     cal     &H7E13
7FA8:  77 93 00     cal     &H0093
7FAB:  42 00 12     ld      $0,&H12
7FAE:  77 AC 7D     cal     &H7DAC
7FB1:  77 89 7D     cal     &H7D89
7FB4:  77 2D 7D     cal     &H7D2D
7FB7:  02 58        ld      $24,$sz
7FB9:  77 01 7D     cal     &H7D01
7FBC:  09 38        sb      $24,$sy
7FBE:  F5           rtn     c
7FBF:  42 00 03     ld      $0,&H03
7FC2:  77 AC 7D     cal     &H7DAC
7FC5:  D1 0A 5E 16  ldw     $10,&H165E
7FC9:  D1 08 14 00  ldw     $8,&H0014
7FCD:  77 9F 82     cal     &H829F
7FD0:  D1 00 5E 16  ldw     $0,&H165E
7FD4:  42 02 08     ld      $2,&H08
7FD7:  77 98 7E     cal     &H7E98
7FDA:  A6 01        phsw    $1
7FDC:  42 10 2E     ld      $16,&H2E
7FDF:  77 F1 2A     cal     &H2AF1
7FE2:  AE 00        ppsw    $0
7FE4:  42 02 03     ld      $2,&H03
7FE7:  77 98 7E     cal     &H7E98
7FEA:  96 00        pre     ix,$0
7FEC:  EA 00 60     ldim    $0,(ix+$sx),4
7FEF:  EA 19 80     ldim    $25,(ix+$sx),5
7FF2:  77 D7 2A     cal     &H2AD7
7FF5:  44 1D E0     anc     $29,&HE0
7FF8:  42 10 20     ld      $16,&H20
7FFB:  B0 13        jr      z,&H800F
7FFD:  C6 7A 5A     orcm    $26,$26,3
8000:  B4 06        jr      nz,&H8007
8002:  41 19 10     sbc     $25,&H10
8005:  B5 09        jr      c,&H800F
8007:  41 1D 7F     sbc     $29,&H7F
800A:  B0 04        jr      z,&H800F
800C:  02 70 1D     ld      $16,$29
800F:  77 F1 2A     cal     &H2AF1
8012:  77 4D 7B     cal     &H7B4D
8015:  C9 6A CA     sbbm    $10,$10,7
8018:  02 2A        ld      $10,$sy
801A:  04 39        anc     $25,$sy
801C:  B0 04        jr      z,&H8021
801E:  C8 6D 4A     adbm    $13,$10,3
8021:  98 5B        bidw    $27
8023:  18 19        rod     $25
8025:  C8 6A 4A     adbm    $10,$10,3
8028:  C6 79 59     orcm    $25,$25,3
802B:  B4 92        jr      nz,&H7FBE
802D:  42 17 17     ld      $23,&H17
8030:  C6 6D 4D     orcm    $13,$13,3
8033:  B4 27        jr      nz,&H805B
8035:  42 8D 0F 23  ld      $13,&H0F,jr &H805B
8039:  4C 10 0F     an      $16,&H0F
803C:  00 30        adc     $16,$sy
803E:  B2 31        jr      lz,&H8070
8040:  01 17        sbc     $23,$sx
8042:  B3 09        jr      uz,&H804C
8044:  01 10        sbc     $16,$sx
8046:  B4 05        jr      nz,&H804C
8048:  42 90 20 07  ld      $16,&H20,jr &H8052
804C:  4C 17 0F     an      $23,&H0F
804F:  4E 10 30     or      $16,&H30
8052:  E6 0F 40     phsm    $15,3
8055:  77 F1 2A     cal     &H2AF1
8058:  EE 0D 40     ppsm    $13,3
805B:  DA 2D 60     dium    $13,4
805E:  09 37        sb      $23,$sy
8060:  B6 A8        jr      nlz,&H8009
8062:  77 5F 65     cal     &H655F
8065:  41 00 0D     sbc     $0,&H0D
8068:  B4 87        jr      nz,&H7FF0
806A:  77 E8 2A     cal     &H2AE8
806D:  37 BC 7F     jp      &H7FBC
8070:  02 90 A3     ld      $16,$sx,jr &H8015
8073:  94           ****  
8074:  2B 90        ldi     $16,(iz-$sx)
8076:  2B 80        ldi     $0,(iz-$sx)
8078:  2B 94        ldi     $20,(iz-$sx)
807A:  2B CC        ldi     $12,(iz-$sz)
807C:  2B 5E        ldi     $30,(iz+$sz)
807E:  2B B8        ldi     $24,(iz-$sy)
8080:  2B 90        ldi     $16,(iz-$sx)
8082:  2B CF        ldi     $15,(iz-$sz)
8084:  2B 94        ldi     $20,(iz-$sx)
8086:  2B E7 2B     ldi     $7,(iz-$11)
8089:  E7 2B 88     phum    $11,5
808C:  2B 56        ldi     $22,(iz+$sz)
808E:  60 34 D6     st      $20,(ix+&HD6)
8091:  00 FC FF D1  adc     $28,$31,jr &H8065
8095:  00 80 C0     adc     $0,$sx,jr &H8057
8098:  24 00        std     $0,(ix+$sx)
809A:  C2 40 E0     ldm     $0,$sz,8
809D:  24 01        std     $1,(ix+$sx)
809F:  56 60 54     pst     ua,&H54
80A2:  F7           rtn   
80A3:  42 00 19     ld      $0,&H19
80A6:  77 AC 7D     cal     &H7DAC
80A9:  77 83 7D     cal     &H7D83
80AC:  02 20        ld      $0,$sy
80AE:  77 17 7D     cal     &H7D17
80B1:  D6 00 73 17  pre     ix,&H1773
80B5:  42 00 57     ld      $0,&H57
80B8:  2C 01        ldd     $1,(ix+$sx)
80BA:  41 01 32     sbc     $1,&H32
80BD:  B5 09        jr      c,&H80C7
80BF:  42 00 52     ld      $0,&H52
80C2:  B0 04        jr      z,&H80C7
80C4:  42 00 41     ld      $0,&H41
80C7:  77 17 7D     cal     &H7D17
80CA:  42 07 04     ld      $7,&H04
80CD:  77 D6 80     cal     &H80D6
80D0:  77 01 7D     cal     &H7D01
80D3:  37 C2 84     jp      &H84C2
80D6:  02 00        ld      $0,$sx
80D8:  77 17 7D     cal     &H7D17
80DB:  09 27        sb      $7,$sy
80DD:  B4 88        jr      nz,&H8066
80DF:  F7           rtn   
80E0:  77 30 49     cal     &H4930
80E3:  42 00 14     ld      $0,&H14
80E6:  77 AC 7D     cal     &H7DAC
80E9:  77 83 7D     cal     &H7D83
80EC:  42 07 04     ld      $7,&H04
80EF:  77 D6 80     cal     &H80D6
80F2:  77 EE 33     cal     &H33EE
80F5:  77 FA 33     cal     &H33FA
80F8:  41 0E 24     sbc     $14,&H24
80FB:  82 68 02     ldw     $8,$2
80FE:  B0 08        jr      z,&H8107
8100:  D1 00 10 00  ldw     $0,&H0010
8104:  88 C8 05     adw     $8,$sz,jr &H810B
8107:  88 22        adw     $2,$sy
8109:  88 28        adw     $8,$sy
810B:  A6 03        phsw    $3
810D:  77 0E 7D     cal     &H7D0E
8110:  42 07 02     ld      $7,&H02
8113:  77 D6 80     cal     &H80D6
8116:  41 0E 24     sbc     $14,&H24
8119:  B0 24        jr      z,&H813E
811B:  77 0A 7D     cal     &H7D0A
811E:  42 00 FE     ld      $0,&HFE
8121:  77 17 7D     cal     &H7D17
8124:  42 00 42     ld      $0,&H42
8127:  77 17 7D     cal     &H7D17
812A:  77 0E 7D     cal     &H7D0E
812D:  42 07 03     ld      $7,&H03
8130:  77 D6 80     cal     &H80D6
8133:  D1 0A 83 16  ldw     $10,&H1683
8137:  D1 08 08 00  ldw     $8,&H0008
813B:  77 91 7D     cal     &H7D91
813E:  82 6A 19     ldw     $10,$25
8141:  AE 08        ppsw    $8
8143:  37 01 83     jp      &H8301
8146:  42 00 13     ld      $0,&H13
8149:  77 AC 7D     cal     &H7DAC
814C:  77 83 7D     cal     &H7D83
814F:  D1 0A 5E 16  ldw     $10,&H165E
8153:  D1 08 14 00  ldw     $8,&H0014
8157:  77 9F 7D     cal     &H7D9F
815A:  77 65 81     cal     &H8165
815D:  B4 36        jr      nz,&H8194
815F:  77 0A 7D     cal     &H7D0A
8162:  01 1E        sbc     $30,$sx
8164:  F7           rtn   
8165:  D6 00 5E 16  pre     ix,&H165E
8169:  EA 02 C0     ldim    $2,(ix+$sx),7
816C:  81 24        sbcw    $4,$sy
816E:  B1 22        jr      nc,&H8191
8170:  00 26        adc     $6,$sy
8172:  B1 1E        jr      nc,&H8191
8174:  41 07 FE     sbc     $7,&HFE
8177:  B4 19        jr      nz,&H8191
8179:  41 08 42     sbc     $8,&H42
817C:  B4 14        jr      nz,&H8191
817E:  D1 00 10 00  ldw     $0,&H0010
8182:  81 42        sbcw    $2,$sz
8184:  B5 0C        jr      c,&H8191
8186:  EA 06 80     ldim    $6,(ix+$sx),5
8189:  C6 66 66     orcm    $6,$6,4
818C:  F0           rtn     z
818D:  C7 62 66     xrcm    $2,$6,4
8190:  F7           rtn   
8191:  01 1E        sbc     $30,$sx
8193:  F7           rtn   
8194:  77 0A 7D     cal     &H7D0A
8197:  01 1F        sbc     $31,$sx
8199:  F7           rtn   
819A:  42 00 13     ld      $0,&H13
819D:  77 AC 7D     cal     &H7DAC
81A0:  77 83 7D     cal     &H7D83
81A3:  D1 0A 5E 16  ldw     $10,&H165E
81A7:  D1 08 14 00  ldw     $8,&H0014
81AB:  77 9F 7D     cal     &H7D9F
81AE:  77 65 81     cal     &H8165
81B1:  B4 9E        jr      nz,&H8150
81B3:  89 42        sbw     $2,$sz
81B5:  A6 03        phsw    $3
81B7:  EA 00 E0     ldim    $0,(ix+$sx),8
81BA:  00 20        adc     $0,$sy
81BC:  02 18        ld      $24,$sx
81BE:  B0 16        jr      z,&H81D5
81C0:  77 94 52     cal     &H5294
81C3:  B0 0F        jr      z,&H81D3
81C5:  E8 11 E0     ldm     $17,(ix+$sx),8
81C8:  C7 51 E0     xrcm    $17,$sz,8
81CB:  B0 09        jr      z,&H81D5
81CD:  77 0A 7D     cal     &H7D0A
81D0:  37 B8 2B     jp      &H2BB8
81D3:  02 38        ld      $24,$sy
81D5:  77 EE 33     cal     &H33EE
81D8:  77 FA 33     cal     &H33FA
81DB:  D6 00 CF 18  pre     ix,&H18CF
81DF:  E8 04 60     ldm     $4,(ix+$sx),4
81E2:  89 66 04     sbw     $6,$4
81E5:  82 64 02     ldw     $4,$2
81E8:  82 62 19     ldw     $2,$25
81EB:  AE 00        ppsw    $0
81ED:  82 48        ldw     $8,$sz
81EF:  89 60 04     sbw     $0,$4
81F2:  B5 31        jr      c,&H8224
81F4:  81 46        sbcw    $6,$sz
81F6:  B5 3D        jr      c,&H8234
81F8:  77 B1 34     cal     &H34B1
81FB:  D6 00 6A 16  pre     ix,&H166A
81FF:  E8 00 E0     ldm     $0,(ix+$sx),8
8202:  77 94 52     cal     &H5294
8205:  01 38        sbc     $24,$sy
8207:  B4 04        jr      nz,&H820C
8209:  E0 00 E0     stm     $0,(ix+$sx),8
820C:  02 00        ld      $0,$sx
820E:  77 17 7D     cal     &H7D17
8211:  42 07 10     ld      $7,&H10
8214:  77 2D 7D     cal     &H7D2D
8217:  09 27        sb      $7,$sy
8219:  B4 86        jr      nz,&H81A0
821B:  82 6A 19     ldw     $10,$25
821E:  77 9F 82     cal     &H829F
8221:  01 3F        sbc     $31,$sy
8223:  F7           rtn   
8224:  9B 40        invw    $0
8226:  88 20        adw     $0,$sy
8228:  A6 01        phsw    $1
822A:  82 60 02     ldw     $0,$2
822D:  AE 02        ppsw    $2
822F:  77 EA 34     cal     &H34EA
8232:  B7 B8        jr      &H81EB
8234:  77 0A 7D     cal     &H7D0A
8237:  37 6D 2B     jp      &H2B6D
823A:  42 80 17 04  ld      $0,&H17,jr &H8241
823E:  42 00 18     ld      $0,&H18
8241:  26 00        phs     $0
8243:  77 E1 00     cal     &H00E1
8246:  77 C3 0E     cal     &H0EC3
8249:  41 0F 50     sbc     $15,&H50
824C:  B1 19        jr      nc,&H8266
824E:  26 0F        phs     $15
8250:  77 DB 00     cal     &H00DB
8253:  77 C3 0E     cal     &H0EC3
8256:  41 0F 02     sbc     $15,&H02
8259:  B1 0C        jr      nc,&H8266
825B:  26 0F        phs     $15
825D:  77 DB 00     cal     &H00DB
8260:  77 C3 0E     cal     &H0EC3
8263:  41 0F 09     sbc     $15,&H09
8266:  31 A4 2B     jp      nc,&H2BA4
8269:  01 2F        sbc     $15,$sy
826B:  35 A4 2B     jp      c,&H2BA4
826E:  77 DF 00     cal     &H00DF
8271:  77 93 00     cal     &H0093
8274:  EE 10 40     ppsm    $16,3
8277:  02 60 12     ld      $0,$18
827A:  77 AC 7D     cal     &H7DAC
827D:  02 60 11     ld      $0,$17
8280:  77 17 7D     cal     &H7D17
8283:  02 60 10     ld      $0,$16
8286:  77 17 7D     cal     &H7D17
8289:  02 60 0F     ld      $0,$15
828C:  77 17 7D     cal     &H7D17
828F:  D6 00 D3 18  pre     ix,&H18D3
8293:  22 1F        sti     $31,(ix+$sx)
8295:  9E 0A        gre     ix,$10
8297:  D1 08 00 02  ldw     $8,&H0200
829B:  04 32        anc     $18,$sy
829D:  B0 63        jr      z,&H8301
829F:  77 9F 7D     cal     &H7D9F
82A2:  37 01 7D     jp      &H7D01
82A5:  42 00 1B     ld      $0,&H1B
82A8:  77 AC 7D     cal     &H7DAC
82AB:  02 20        ld      $0,$sy
82AD:  77 17 7D     cal     &H7D17
82B0:  42 00 52     ld      $0,&H52
82B3:  77 17 7D     cal     &H7D17
82B6:  77 2D 7D     cal     &H7D2D
82B9:  02 48        ld      $8,$sz
82BB:  77 2D 7D     cal     &H7D2D
82BE:  02 49        ld      $9,$sz
82C0:  D1 1A 01 01  ldw     $26,&H0101
82C4:  81 7A 08     sbcw    $26,$8
82C7:  82 7A 08     ldw     $26,$8
82CA:  B5 0B        jr      c,&H82D6
82CC:  D1 0A 93 17  ldw     $10,&H1793
82D0:  77 9F 82     cal     &H829F
82D3:  37 C5 29     jp      &H29C5
82D6:  77 2D 7D     cal     &H7D2D
82D9:  89 28        sbw     $8,$sy
82DB:  B4 86        jr      nz,&H8262
82DD:  77 01 7D     cal     &H7D01
82E0:  37 74 2B     jp      &H2B74
82E3:  81 25        sbcw    $5,$sy
82E5:  F5           rtn     c
82E6:  42 00 1B     ld      $0,&H1B
82E9:  77 AC 7D     cal     &H7DAC
82EC:  02 20        ld      $0,$sy
82EE:  77 17 7D     cal     &H7D17
82F1:  42 00 57     ld      $0,&H57
82F4:  77 17 7D     cal     &H7D17
82F7:  82 68 05     ldw     $8,$5
82FA:  77 0E 7D     cal     &H7D0E
82FD:  D1 0A 93 17  ldw     $10,&H1793
8301:  77 91 7D     cal     &H7D91
8304:  B7 E3        jr      &H82E8
8306:  42 00 1A     ld      $0,&H1A
8309:  77 AC 7D     cal     &H7DAC
830C:  02 20        ld      $0,$sy
830E:  77 17 7D     cal     &H7D17
8311:  37 01 7D     jp      &H7D01
8314:  A6 01        phsw    $1
8316:  1E 60        gst     ua,$0
8318:  56 60 34     pst     ua,&H34
831B:  D6 00 06 00  pre     ix,&H0006
831F:  2C 01        ldd     $1,(ix+$sx)
8321:  18 61        biu     $1
8323:  16 60        pst     ua,$0
8325:  AE 00        ppsw    $0
8327:  F7           rtn   
8328:  D6 40 04 00  pre     iz,&H0004
832C:  25 03        std     $3,(iz+$sx)
832E:  21 24        st      $4,(iz+$sy)
8330:  4E 04 02     or      $4,&H02
8333:  21 24        st      $4,(iz+$sy)
8335:  42 01 98     ld      $1,&H98
8338:  09 21        sb      $1,$sy
833A:  B4 83        jr      nz,&H82BE
833C:  4E 04 20     or      $4,&H20
833F:  21 24        st      $4,(iz+$sy)
8341:  F7           rtn   
8342:  D6 40 04 00  pre     iz,&H0004
8346:  61 1F 03     st      $31,(iz+&H03)
8349:  42 00 40     ld      $0,&H40
834C:  21 A0        st      $0,(iz-$sy)
834E:  21 BF        st      $31,(iz-$sy)
8350:  21 BF        st      $31,(iz-$sy)
8352:  21 BF        st      $31,(iz-$sy)
8354:  A9 00        ldw     $0,(iz+$sx)
8356:  4C 00 3F     an      $0,&H3F
8359:  25 00        std     $0,(iz+$sx)
835B:  4C 01 DF     an      $1,&HDF
835E:  21 21        st      $1,(iz+$sy)
8360:  4C 01 FD     an      $1,&HFD
8363:  21 01        st      $1,(iz+$sx)
8365:  02 00        ld      $0,$sx
8367:  A1 1F        stw     $31,(iz+$sx)
8369:  F7           rtn   
836A:  77 81 85     cal     &H8581
836D:  89 63 03     sbw     $3,$3
8370:  77 28 83     cal     &H8328
8373:  77 42 83     cal     &H8342
8376:  B7 18        jr      &H838F
8378:  77 79 01     cal     &H0179
837B:  77 81 85     cal     &H8581
837E:  D6 00 5B 16  pre     ix,&H165B
8382:  2C 02        ldd     $2,(ix+$sx)
8384:  D6 40 03 00  pre     iz,&H0003
8388:  4C 02 FB     an      $2,&HFB
838B:  25 02        std     $2,(iz+$sx)
838D:  24 02        std     $2,(ix+$sx)
838F:  37 79 85     jp      &H8579
8392:  42 80 08 0F  ld      $0,&H08,jr &H83A4
8396:  42 80 04 0B  ld      $0,&H04,jr &H83A4
839A:  42 80 02 07  ld      $0,&H02,jr &H83A4
839E:  D6 00 54 15  pre     ix,&H1554
83A2:  02 20        ld      $0,$sy
83A4:  60 00 03     st      $0,(ix+&H03)
83A7:  D6 00 5B 16  pre     ix,&H165B
83AB:  2C 00        ldd     $0,(ix+$sx)
83AD:  4E 00 10     or      $0,&H10
83B0:  D6 40 03 00  pre     iz,&H0003
83B4:  25 00        std     $0,(iz+$sx)
83B6:  37 4D 84     jp      &H844D
83B9:  E6 07 E0     phsm    $7,8
83BC:  E6 0B 60     phsm    $11,4
83BF:  1C 46        gfl     $6
83C1:  1E 67        gst     ua,$7
83C3:  9E 08        gre     ix,$8
83C5:  9E 4A        gre     iz,$10
83C7:  56 60 D4     pst     ua,&HD4
83CA:  D6 40 02 00  pre     iz,&H0002
83CE:  A9 01        ldw     $1,(iz+$sx)
83D0:  69 00 04     ld      $0,(iz+&H04)
83D3:  D6 00 56 15  pre     ix,&H1556
83D7:  EC 05 40     lddm    $5,(ix+$sx),3
83DA:  44 02 18     anc     $2,&H18
83DD:  B4 C4        jr      nz,&H83A2
83DF:  44 02 20     anc     $2,&H20
83E2:  B4 CD        jr      nz,&H83B0
83E4:  4F 00 1C     xr      $0,&H1C
83E7:  0C 60 05     an      $0,$5
83EA:  44 00 18     anc     $0,&H18
83ED:  B4 DC        jr      nz,&H83CA
83EF:  44 03 08     anc     $3,&H08
83F2:  B0 14        jr      z,&H8407
83F4:  04 25        anc     $5,$sy
83F6:  B0 10        jr      z,&H8407
83F8:  41 01 20     sbc     $1,&H20
83FB:  B1 6A        jr      nc,&H8466
83FD:  41 01 0F     sbc     $1,&H0F
8400:  B0 61        jr      z,&H8462
8402:  41 01 0E     sbc     $1,&H0E
8405:  B0 56        jr      z,&H845C
8407:  44 05 02     anc     $5,&H02
840A:  B0 6B        jr      z,&H8476
840C:  41 01 11     sbc     $1,&H11
840F:  B0 62        jr      z,&H8472
8411:  41 01 13     sbc     $1,&H13
8414:  B0 59        jr      z,&H846E
8416:  6C 04 05     ldd     $4,(ix+&H05)
8419:  AA 03        ldiw    $3,(ix+$sx)
841B:  20 61 04     st      $1,(ix+$4)
841E:  08 24        ad      $4,$sy
8420:  08 23        ad      $3,$sy
8422:  A4 A4        stdw    $4,(ix-$sy)
8424:  35 9E 83     jp      c,&H839E
8427:  24 BE        std     $30,(ix-$sy)
8429:  41 03 C0     sbc     $3,&HC0
842C:  B5 20        jr      c,&H844D
842E:  44 05 40     anc     $5,&H40
8431:  B4 1B        jr      nz,&H844D
8433:  44 00 0C     anc     $0,&H0C
8436:  B4 16        jr      nz,&H844D
8438:  29 20        ld      $0,(iz+$sy)
843A:  29 21        ld      $1,(iz+$sy)
843C:  0C 41        an      $1,$sz
843E:  18 41        bid     $1
8440:  B1 0C        jr      nc,&H844D
8442:  42 00 13     ld      $0,&H13
8445:  25 00        std     $0,(iz+$sx)
8447:  4E 05 40     or      $5,&H40
844A:  64 85 02     std     $5,(ix-&H02)
844D:  96 4A        pre     iz,$10
844F:  96 08        pre     ix,$8
8451:  16 67        pst     ua,$7
8453:  14 46        pfl     $6
8455:  EE 08 60     ppsm    $8,4
8458:  EE 00 E0     ppsm    $0,8
845B:  FD           rtni  
845C:  0E 24        or      $4,$sy
845E:  20 24        st      $4,(ix+$sy)
8460:  B7 94        jr      &H83F5
8462:  4C 84 FE 87  an      $4,&HFE,jr &H83EC
8466:  04 24        anc     $4,$sy
8468:  B0 E2        jr      z,&H844B
846A:  4E 81 80 E6  or      $1,&H80,jr &H8453
846E:  4E 84 02 93  or      $4,&H02,jr &H8404
8472:  4C 84 FD 97  an      $4,&HFD,jr &H840C
8476:  6C 04 05     ldd     $4,(ix+&H05)
8479:  AA 04        ldiw    $4,(ix+$sx)
847B:  20 61 05     st      $1,(ix+$5)
847E:  08 25        ad      $5,$sy
8480:  08 24        ad      $4,$sy
8482:  A4 A5        stdw    $5,(ix-$sy)
8484:  35 9E 83     jp      c,&H839E
8487:  04 23        anc     $3,$sy
8489:  B4 BD        jr      nz,&H8447
848B:  24 BE        std     $30,(ix-$sy)
848D:  B7 C1        jr      &H844F
848F:  09 A0 1D     sb      $0,$sy,jr &H84AE
8492:  42 00 02     ld      $0,&H02
8495:  D6 00 73 17  pre     ix,&H1773
8499:  2C 01        ldd     $1,(ix+$sx)
849B:  41 01 32     sbc     $1,&H32
849E:  B0 0F        jr      z,&H84AE
84A0:  31 DB 2B     jp      nc,&H2BDB
84A3:  01 01        sbc     $1,$sx
84A5:  B2 97        jr      lz,&H843D
84A7:  08 20        ad      $0,$sy
84A9:  42 01 41     ld      $1,&H41
84AC:  20 01        st      $1,(ix+$sx)
84AE:  D6 00 3E 17  pre     ix,&H173E
84B2:  A0 0C        stw     $12,(ix+$sx)
84B4:  D6 00 54 15  pre     ix,&H1554
84B8:  9A 4C        bydw    $12
84BA:  02 0E        ld      $14,$sx
84BC:  E0 0B 60     stm     $11,(ix+$sx),4
84BF:  77 EC 84     cal     &H84EC
84C2:  D6 00 70 17  pre     ix,&H1770
84C6:  9E 08        gre     ix,$8
84C8:  42 01 32     ld      $1,&H32
84CB:  7A 01 03     sbc     (ix+&H03),$1
84CE:  30 54 4C     jp      z,&H4C54
84D1:  F7           rtn   
84D2:  77 81 85     cal     &H8581
84D5:  D6 00 57 15  pre     ix,&H1557
84D9:  24 1F        std     $31,(ix+$sx)
84DB:  D6 00 5B 16  pre     ix,&H165B
84DF:  2C 02        ldd     $2,(ix+$sx)
84E1:  4E 02 14     or      $2,&H14
84E4:  D6 40 03 00  pre     iz,&H0003
84E8:  25 02        std     $2,(iz+$sx)
84EA:  B7 54        jr      &H853F
84EC:  D6 00 3A 17  pre     ix,&H173A
84F0:  44 0D 02     anc     $13,&H02
84F3:  B0 04        jr      z,&H84F8
84F5:  4E 00 03     or      $0,&H03
84F8:  24 00        std     $0,(ix+$sx)
84FA:  77 81 85     cal     &H8581
84FD:  02 63 0B     ld      $3,$11
8500:  1A 03        did     $3
8502:  18 43        bid     $3
8504:  42 04 08     ld      $4,&H08
8507:  77 28 83     cal     &H8328
850A:  02 61 0B     ld      $1,$11
850D:  18 41        bid     $1
850F:  42 02 4A     ld      $2,&H4A
8512:  18 41        bid     $1
8514:  B5 04        jr      c,&H8519
8516:  4E 02 20     or      $2,&H20
8519:  18 41        bid     $1
851B:  B5 04        jr      c,&H8520
851D:  4E 02 10     or      $2,&H10
8520:  18 41        bid     $1
8522:  B5 04        jr      c,&H8527
8524:  4E 02 04     or      $2,&H04
8527:  18 41        bid     $1
8529:  B5 04        jr      c,&H852E
852B:  4E 02 80     or      $2,&H80
852E:  21 A2        st      $2,(iz-$sy)
8530:  41 00 02     sbc     $0,&H02
8533:  B5 25        jr      c,&H8559
8535:  B0 1C        jr      z,&H8552
8537:  4E 03 C0     or      $3,&HC0
853A:  42 02 37     ld      $2,&H37
853D:  A1 A2        stw     $2,(iz-$sy)
853F:  D6 00 59 15  pre     ix,&H1559
8543:  24 1F        std     $31,(ix+$sx)
8545:  20 3F        st      $31,(ix+$sy)
8547:  77 74 01     cal     &H0174
854A:  D6 00 5B 16  pre     ix,&H165B
854E:  24 02        std     $2,(ix+$sx)
8550:  B7 28        jr      &H8579
8552:  4E 03 40     or      $3,&H40
8555:  42 82 36 9B  ld      $2,&H36,jr &H84F3
8559:  4E 03 80     or      $3,&H80
855C:  42 02 33     ld      $2,&H33
855F:  A1 A2        stw     $2,(iz-$sy)
8561:  B7 98        jr      &H84FA
8563:  D6 00 3A 17  pre     ix,&H173A
8567:  2C 00        ldd     $0,(ix+$sx)
8569:  77 81 85     cal     &H8581
856C:  04 20        anc     $0,$sy
856E:  74 A3 86     cal     nz,&H86A3
8571:  24 1F        std     $31,(ix+$sx)
8573:  77 79 01     cal     &H0179
8576:  77 42 83     cal     &H8342
8579:  EF 00 40     ppum    $0,3
857C:  96 41        pre     iz,$1
857E:  16 60        pst     ua,$0
8580:  F7           rtn   
8581:  77 88 85     cal     &H8588
8584:  56 60 D4     pst     ua,&HD4
8587:  F7           rtn   
8588:  1E 61        gst     ua,$1
858A:  9E 42        gre     iz,$2
858C:  E7 03 40     phum    $3,3
858F:  F7           rtn   
8590:  77 D0 85     cal     &H85D0
8593:  D6 00 59 15  pre     ix,&H1559
8597:  3E 1E        sb      (ix+$sx),$30
8599:  2C 01        ldd     $1,(ix+$sx)
859B:  41 01 20     sbc     $1,&H20
859E:  F1           rtn     nc
859F:  6C 84 03     ldd     $4,(ix-&H03)
85A2:  44 04 02     anc     $4,&H02
85A5:  F0           rtn     z
85A6:  44 04 40     anc     $4,&H40
85A9:  F0           rtn     z
85AA:  26 00        phs     $0
85AC:  77 81 85     cal     &H8581
85AF:  77 C5 29     cal     &H29C5
85B2:  77 62 86     cal     &H8662
85B5:  B4 87        jr      nz,&H853D
85B7:  42 00 11     ld      $0,&H11
85BA:  77 5C 86     cal     &H865C
85BD:  42 00 40     ld      $0,&H40
85C0:  3E 00        sb      (ix+$sx),$0
85C2:  77 79 85     cal     &H8579
85C5:  2E 00        pps     $0
85C7:  F7           rtn   
85C8:  77 81 85     cal     &H8581
85CB:  77 FB 85     cal     &H85FB
85CE:  B7 D6        jr      &H85A5
85D0:  77 C5 29     cal     &H29C5
85D3:  D6 00 58 15  pre     ix,&H1558
85D7:  3A BF        sbc     (ix-$sy),$31
85D9:  B4 0D        jr      nz,&H85E7
85DB:  3A 3F        sbc     (ix+$sy),$31
85DD:  B0 8E        jr      z,&H856C
85DF:  AA 20        ldiw    $0,(ix+$sy)
85E1:  09 41        sb      $1,$sz
85E3:  28 60 01     ld      $0,(ix+$1)
85E6:  F7           rtn   
85E7:  28 A0        ld      $0,(ix-$sy)
85E9:  18 40        bid     $0
85EB:  35 7C 2B     jp      c,&H2B7C
85EE:  18 40        bid     $0
85F0:  35 E3 2B     jp      c,&H2BE3
85F3:  18 40        bid     $0
85F5:  35 DF 2B     jp      c,&H2BDF
85F8:  37 80 2B     jp      &H2B80
85FB:  26 10        phs     $16
85FD:  77 C5 29     cal     &H29C5
8600:  D6 00 54 15  pre     ix,&H1554
8604:  E8 02 40     ldm     $2,(ix+$sx),3
8607:  77 62 86     cal     &H8662
860A:  B4 8E        jr      nz,&H8599
860C:  44 04 02     anc     $4,&H02
860F:  B0 06        jr      z,&H8616
8611:  44 03 02     anc     $3,&H02
8614:  B4 98        jr      nz,&H85AD
8616:  2E 00        pps     $0
8618:  44 02 08     anc     $2,&H08
861B:  B0 40        jr      z,&H865C
861D:  04 24        anc     $4,$sy
861F:  B0 39        jr      z,&H8659
8621:  41 00 A0     sbc     $0,&HA0
8624:  B1 23        jr      nc,&H8648
8626:  41 00 80     sbc     $0,&H80
8629:  B1 2F        jr      nc,&H8659
862B:  41 00 20     sbc     $0,&H20
862E:  B5 2A        jr      c,&H8659
8630:  44 04 20     anc     $4,&H20
8633:  B0 25        jr      z,&H8659
8635:  26 00        phs     $0
8637:  42 00 0F     ld      $0,&H0F
863A:  77 5C 86     cal     &H865C
863D:  42 04 E0     ld      $4,&HE0
8640:  D6 00 56 15  pre     ix,&H1556
8644:  3C 04        ad      (ix+$sx),$4
8646:  B7 CA        jr      &H8611
8648:  44 04 20     anc     $4,&H20
864B:  B4 0D        jr      nz,&H8659
864D:  26 00        phs     $0
864F:  42 00 0E     ld      $0,&H0E
8652:  77 5C 86     cal     &H865C
8655:  42 84 20 98  ld      $4,&H20,jr &H85F0
8659:  4C 00 7F     an      $0,&H7F
865C:  77 78 86     cal     &H8678
865F:  21 A0        st      $0,(iz-$sy)
8661:  F7           rtn   
8662:  D6 40 02 00  pre     iz,&H0002
8666:  69 00 04     ld      $0,(iz+&H04)
8669:  4F 00 0C     xr      $0,&H0C
866C:  0C 60 04     an      $0,$4
866F:  44 00 0C     anc     $0,&H0C
8672:  F7           rtn   
8673:  26 04        phs     $4
8675:  02 A4 05     ld      $4,$sy,jr &H867C
8678:  26 04        phs     $4
867A:  02 04        ld      $4,$sx
867C:  A6 01        phsw    $1
867E:  D6 40 03 00  pre     iz,&H0003
8682:  D1 02 90 08  ldw     $2,&H0890
8686:  89 22        sbw     $2,$sy
8688:  B0 11        jr      z,&H869A
868A:  2D 00        ldd     $0,(iz+$sx)
868C:  2D 01        ldd     $1,(iz+$sx)
868E:  01 41        sbc     $1,$sz
8690:  B4 87        jr      nz,&H8618
8692:  01 24        sbc     $4,$sy
8694:  B0 0A        jr      z,&H869F
8696:  04 20        anc     $0,$sy
8698:  B0 93        jr      z,&H862C
869A:  AE 00        ppsw    $0
869C:  2E 04        pps     $4
869E:  F7           rtn   
869F:  44 80 04 8A  anc     $0,&H04,jr &H862C
86A3:  77 73 86     cal     &H8673
86A6:  D1 02 54 15  ldw     $2,&H1554
86AA:  11 61 02     ld      $1,($2)
86AD:  02 23        ld      $3,$sy
86AF:  49 01 20     sb      $1,&H20
86B2:  B5 04        jr      c,&H86B7
86B4:  18 E3 87     biu     $3,jr &H863D
86B7:  42 02 0B     ld      $2,&H0B
86BA:  09 22        sb      $2,$sy
86BC:  B4 83        jr      nz,&H8640
86BE:  09 23        sb      $3,$sy
86C0:  B4 8A        jr      nz,&H864B
86C2:  F7           rtn   
86C3:  77 A1 87     cal     &H87A1
86C6:  77 79 85     cal     &H8579
86C9:  D6 00 8C 17  pre     ix,&H178C
86CD:  28 00        ld      $0,(ix+$sx)
86CF:  41 00 24     sbc     $0,&H24
86D2:  F4           rtn     nz
86D3:  68 00 03     ld      $0,(ix+&H03)
86D6:  44 00 40     anc     $0,&H40
86D9:  F4           rtn     nz
86DA:  37 C2 84     jp      &H84C2
86DD:  44 0A 05     anc     $10,&H05
86E0:  34 DB 2B     jp      nz,&H2BDB
86E3:  68 00 20     ld      $0,(ix+&H20)
86E6:  D6 00 3D 17  pre     ix,&H173D
86EA:  24 00        std     $0,(ix+$sx)
86EC:  77 79 01     cal     &H0179
86EF:  26 0A        phs     $10
86F1:  82 7B 0C     ldw     $27,$12
86F4:  D6 00 54 15  pre     ix,&H1554
86F8:  22 1B        sti     $27,(ix+$sx)
86FA:  89 40        sbw     $0,$sz
86FC:  E0 1F 40     stm     $31,(ix+$sx),3
86FF:  77 81 85     cal     &H8581
8702:  D1 03 00 0C  ldw     $3,&H0C00
8706:  D6 00 3D 17  pre     ix,&H173D
870A:  2C 00        ldd     $0,(ix+$sx)
870C:  44 00 02     anc     $0,&H02
870F:  B0 04        jr      z,&H8714
8711:  4E 04 10     or      $4,&H10
8714:  2E 0A        pps     $10
8716:  01 0A        sbc     $10,$sx
8718:  D6 00 3A 17  pre     ix,&H173A
871C:  B6 DA        jr      nlz,&H86F7
871E:  02 63 0C     ld      $3,$12
8721:  1A 03        did     $3
8723:  18 43        bid     $3
8725:  4E 03 10     or      $3,&H10
8728:  77 28 83     cal     &H8328
872B:  42 00 FE     ld      $0,&HFE
872E:  21 A0        st      $0,(iz-$sy)
8730:  42 00 11     ld      $0,&H11
8733:  21 A0        st      $0,(iz-$sy)
8735:  D6 00 5B 16  pre     ix,&H165B
8739:  24 00        std     $0,(ix+$sx)
873B:  4E 03 80     or      $3,&H80
873E:  25 03        std     $3,(iz+$sx)
8740:  D6 00 3A 17  pre     ix,&H173A
8744:  24 1E        std     $30,(ix+$sx)
8746:  77 83 89     cal     &H8983
8749:  42 04 C8     ld      $4,&HC8
874C:  42 00 48     ld      $0,&H48
874F:  77 E1 88     cal     &H88E1
8752:  D6 00 70 17  pre     ix,&H1770
8756:  42 00 1C     ld      $0,&H1C
8759:  E8 56 40     ldm     $22,(ix+$sz),3
875C:  02 60 16     ld      $0,$22
875F:  77 EA 88     cal     &H88EA
8762:  D1 05 0B 00  ldw     $5,&H000B
8766:  D6 00 75 17  pre     ix,&H1775
876A:  77 FA 88     cal     &H88FA
876D:  42 05 08     ld      $5,&H08
8770:  D6 00 83 16  pre     ix,&H1683
8774:  77 FA 88     cal     &H88FA
8777:  42 05 06     ld      $5,&H06
877A:  77 7A 88     cal     &H887A
877D:  02 60 17     ld      $0,$23
8780:  77 EA 88     cal     &H88EA
8783:  02 60 18     ld      $0,$24
8786:  77 EA 88     cal     &H88EA
8789:  42 05 04     ld      $5,&H04
878C:  77 7A 88     cal     &H887A
878F:  D6 00 6C 17  pre     ix,&H176C
8793:  2C 00        ldd     $0,(ix+$sx)
8795:  77 5C 86     cal     &H865C
8798:  77 A3 86     cal     &H86A3
879B:  77 75 89     cal     &H8975
879E:  37 79 85     jp      &H8579
87A1:  44 0C 80     anc     $12,&H80
87A4:  B0 04        jr      z,&H87A9
87A6:  4E 03 20     or      $3,&H20
87A9:  77 28 83     cal     &H8328
87AC:  42 00 10     ld      $0,&H10
87AF:  61 00 03     st      $0,(iz+&H03)
87B2:  42 00 FD     ld      $0,&HFD
87B5:  21 A0        st      $0,(iz-$sy)
87B7:  42 00 10     ld      $0,&H10
87BA:  21 A0        st      $0,(iz-$sy)
87BC:  D6 00 5B 16  pre     ix,&H165B
87C0:  24 00        std     $0,(ix+$sx)
87C2:  4E 03 40     or      $3,&H40
87C5:  25 03        std     $3,(iz+$sx)
87C7:  D6 00 3A 17  pre     ix,&H173A
87CB:  42 00 02     ld      $0,&H02
87CE:  24 00        std     $0,(ix+$sx)
87D0:  77 27 89     cal     &H8927
87D3:  D1 06 00 10  ldw     $6,&H1000
87D7:  42 05 20     ld      $5,&H20
87DA:  77 05 89     cal     &H8905
87DD:  96 06        pre     ix,$6
87DF:  22 00        sti     $0,(ix+$sx)
87E1:  9E 06        gre     ix,$6
87E3:  09 25        sb      $5,$sy
87E5:  B4 8C        jr      nz,&H8772
87E7:  77 84 88     cal     &H8884
87EA:  D6 00 00 10  pre     ix,&H1000
87EE:  2A 00        ldi     $0,(ix+$sx)
87F0:  41 00 30     sbc     $0,&H30
87F3:  B4 04        jr      nz,&H87F8
87F5:  42 00 24     ld      $0,&H24
87F8:  9E 01        gre     ix,$1
87FA:  E6 02 40     phsm    $2,3
87FD:  77 8F 88     cal     &H888F
8800:  D6 00 8C 17  pre     ix,&H178C
8804:  E8 12 60     ldm     $18,(ix+$sx),4
8807:  EE 00 40     ppsm    $0,3
880A:  44 15 40     anc     $21,&H40
880D:  B4 11        jr      nz,&H881F
880F:  01 52        sbc     $18,$sz
8811:  B0 0F        jr      z,&H8821
8813:  41 12 10     sbc     $18,&H10
8816:  B4 C7        jr      nz,&H87DE
8818:  41 00 24     sbc     $0,&H24
881B:  B4 CC        jr      nz,&H87E8
881D:  0E 35        or      $21,$sy
881F:  02 52        ld      $18,$sz
8821:  96 01        pre     ix,$1
8823:  EA 00 E0     ldim    $0,(ix+$sx),8
8826:  42 10 11     ld      $16,&H11
8829:  A8 70 10     ldw     $16,(ix+$16)
882C:  D6 00 75 17  pre     ix,&H1775
8830:  E8 08 E0     ldm     $8,(ix+$sx),8
8833:  41 08 20     sbc     $8,&H20
8836:  B0 06        jr      z,&H883D
8838:  C7 48 E0     xrcm    $8,$sz,8
883B:  B4 EC        jr      nz,&H8828
883D:  D6 00 8C 17  pre     ix,&H178C
8841:  E0 12 60     stm     $18,(ix+$sx),4
8844:  D6 00 6E 17  pre     ix,&H176E
8848:  A0 10        stw     $16,(ix+$sx)
884A:  88 30        adw     $16,$sy
884C:  D6 00 93 17  pre     ix,&H1793
8850:  89 6E 0E     sbw     $14,$14
8853:  E0 0E 60     stm     $14,(ix+$sx),4
8856:  44 15 40     anc     $21,&H40
8859:  F4           rtn     nz
885A:  D6 00 0C 10  pre     ix,&H100C
885E:  E8 00 E0     ldm     $0,(ix+$sx),8
8861:  D6 00 83 16  pre     ix,&H1683
8865:  E8 08 E0     ldm     $8,(ix+$sx),8
8868:  00 20        adc     $0,$sy
886A:  F5           rtn     c
886B:  00 28        adc     $8,$sy
886D:  B5 08        jr      c,&H8876
886F:  C7 48 E0     xrcm    $8,$sz,8
8872:  34 B8 2B     jp      nz,&H2BB8
8875:  F7           rtn   
8876:  E0 00 E0     stm     $0,(ix+$sx),8
8879:  F7           rtn   
887A:  02 00        ld      $0,$sx
887C:  77 EA 88     cal     &H88EA
887F:  09 25        sb      $5,$sy
8881:  B4 86        jr      nz,&H8808
8883:  F7           rtn   
8884:  77 05 89     cal     &H8905
8887:  3A 1F        sbc     (ix+$sx),$31
8889:  34 84 2B     jp      nz,&H2B84
888C:  37 75 89     jp      &H8975
888F:  D1 08 20 42  ldw     $8,&H4220
8893:  41 00 10     sbc     $0,&H10
8896:  B0 0C        jr      z,&H88A3
8898:  42 09 53     ld      $9,&H53
889B:  41 00 24     sbc     $0,&H24
889E:  B0 04        jr      z,&H88A3
88A0:  42 09 41     ld      $9,&H41
88A3:  E8 00 E0     ldm     $0,(ix+$sx),8
88A6:  27 1E        phu     $30
88A8:  A7 09        phuw    $9
88AA:  E7 07 E0     phum    $7,8
88AD:  D6 00 C5 16  pre     ix,&H16C5
88B1:  2C 0A        ldd     $10,(ix+$sx)
88B3:  41 0A 02     sbc     $10,&H02
88B6:  B0 0D        jr      z,&H88C4
88B8:  2F 10        ppu     $16
88BA:  01 30        sbc     $16,$sy
88BC:  30 E8 2A     jp      z,&H2AE8
88BF:  77 F1 2A     cal     &H2AF1
88C2:  B7 8B        jr      &H884E
88C4:  77 57 5D     cal     &H5D57
88C7:  D6 00 1C 15  pre     ix,&H151C
88CB:  2F 00        ppu     $0
88CD:  01 20        sbc     $0,$sy
88CF:  30 1E 5D     jp      z,&H5D1E
88D2:  22 00        sti     $0,(ix+$sx)
88D4:  B7 8A        jr      &H885F
88D6:  77 81 85     cal     &H8581
88D9:  02 60 10     ld      $0,$16
88DC:  77 EA 88     cal     &H88EA
88DF:  B7 55        jr      &H8935
88E1:  77 14 89     cal     &H8914
88E4:  D6 00 6C 17  pre     ix,&H176C
88E8:  24 1F        std     $31,(ix+$sx)
88EA:  D1 02 6C 17  ldw     $2,&H176C
88EE:  11 61 02     ld      $1,($2)
88F1:  09 41        sb      $1,$sz
88F3:  10 61 02     st      $1,($2)
88F6:  37 5C 86     jp      &H865C
88F9:  F0           rtn     z
88FA:  77 C5 29     cal     &H29C5
88FD:  2A 00        ldi     $0,(ix+$sx)
88FF:  77 EA 88     cal     &H88EA
8902:  89 A5 8B     sbw     $5,$sy,jr &H888F
8905:  77 90 85     cal     &H8590
8908:  D6 00 6C 17  pre     ix,&H176C
890C:  3C 00        ad      (ix+$sx),$0
890E:  F7           rtn   
890F:  42 84 14 02  ld      $4,&H14,jr &H8914
8913:  F0           rtn     z
8914:  42 03 3C     ld      $3,&H3C
8917:  E6 03 60     phsm    $3,4
891A:  77 C5 29     cal     &H29C5
891D:  EE 00 60     ppsm    $0,4
8920:  09 23        sb      $3,$sy
8922:  B4 8C        jr      nz,&H88AF
8924:  09 A4 93     sb      $4,$sy,jr &H88B9
8927:  77 81 85     cal     &H8581
892A:  77 78 83     cal     &H8378
892D:  77 46 89     cal     &H8946
8930:  41 00 48     sbc     $0,&H48
8933:  B4 8A        jr      nz,&H88BE
8935:  37 79 85     jp      &H8579
8938:  77 81 85     cal     &H8581
893B:  77 46 89     cal     &H8946
893E:  41 00 44     sbc     $0,&H44
8941:  34 84 2B     jp      nz,&H2B84
8944:  B7 90        jr      &H88D5
8946:  77 83 89     cal     &H8983
8949:  77 0F 89     cal     &H890F
894C:  42 05 E9     ld      $5,&HE9
894F:  77 C5 29     cal     &H29C5
8952:  D6 40 06 00  pre     iz,&H0006
8956:  2D 00        ldd     $0,(iz+$sx)
8958:  18 40        bid     $0
895A:  B1 8F        jr      nc,&H88EA
895C:  09 25        sb      $5,$sy
895E:  B4 90        jr      nz,&H88EF
8960:  77 D2 84     cal     &H84D2
8963:  77 90 85     cal     &H8590
8966:  D6 00 6C 17  pre     ix,&H176C
896A:  24 00        std     $0,(ix+$sx)
896C:  F7           rtn   
896D:  77 81 85     cal     &H8581
8970:  77 83 89     cal     &H8983
8973:  B7 BF        jr      &H8933
8975:  77 81 85     cal     &H8581
8978:  77 7D 89     cal     &H897D
897B:  B7 C7        jr      &H8943
897D:  77 78 83     cal     &H8378
8980:  02 81 03     ld      $1,$sx,jr &H8985
8983:  02 21        ld      $1,$sy
8985:  D6 00 5B 16  pre     ix,&H165B
8989:  2C 00        ldd     $0,(ix+$sx)
898B:  D6 40 03 00  pre     iz,&H0003
898F:  18 41        bid     $1
8991:  29 21        ld      $1,(iz+$sy)
8993:  B1 0E        jr      nc,&H89A2
8995:  4E 00 02     or      $0,&H02
8998:  4E 01 80     or      $1,&H80
899B:  21 21        st      $1,(iz+$sy)
899D:  24 00        std     $0,(ix+$sx)
899F:  25 00        std     $0,(iz+$sx)
89A1:  F7           rtn   
89A2:  4C 00 F9     an      $0,&HF9
89A5:  4C 81 7F 8D  an      $1,&H7F,jr &H8935
89A9:  1E 60        gst     ua,$0
89AB:  9E 41        gre     iz,$1
89AD:  E6 02 40     phsm    $2,3
89B0:  56 60 D4     pst     ua,&HD4
89B3:  D6 40 F0 FF  pre     iz,&HFFF0
89B7:  77 DB 89     cal     &H89DB
89BA:  25 10        std     $16,(iz+$sx)
89BC:  77 C7 89     cal     &H89C7
89BF:  EE 00 40     ppsm    $0,3
89C2:  96 41        pre     iz,$1
89C4:  16 60        pst     ua,$0
89C6:  F7           rtn   
89C7:  1E 20        gst     pd,$0
89C9:  4C 00 F7     an      $0,&HF7
89CC:  16 20        pst     pd,$0
89CE:  4E 00 08     or      $0,&H08
89D1:  16 20        pst     pd,$0
89D3:  77 DB 89     cal     &H89DB
89D6:  0D 00        na      $0,$sx
89D8:  25 00        std     $0,(iz+$sx)
89DA:  F7           rtn   
89DB:  77 9A 29     cal     &H299A
89DE:  1E 62        gst     ua,$2
89E0:  A6 02        phsw    $2
89E2:  56 60 54     pst     ua,&H54
89E5:  77 91 29     cal     &H2991
89E8:  77 C5 29     cal     &H29C5
89EB:  AE 00        ppsw    $0
89ED:  16 61        pst     ua,$1
89EF:  77 93 29     cal     &H2993
89F2:  1C 00        gpo     $0
89F4:  44 00 20     anc     $0,&H20
89F7:  B4 9D        jr      nz,&H8995
89F9:  1C 00        gpo     $0
89FB:  44 00 20     anc     $0,&H20
89FE:  B4 A4        jr      nz,&H89A3
8A00:  F7           rtn   
8A01:  9E 0E        gre     ix,$14
8A03:  A6 0F        phsw    $15
8A05:  77 DF 2A     cal     &H2ADF
8A08:  AE 0E        ppsw    $14
8A0A:  77 BC 7A     cal     &H7ABC
8A0D:  D1 11 3A 29  ldw     $17,&H293A
8A11:  77 20 65     cal     &H6520
8A14:  77 2E 03     cal     &H032E
8A17:  77 A4 03     cal     &H03A4
8A1A:  41 00 0D     sbc     $0,&H0D
8A1D:  B4 8A        jr      nz,&H89A8
8A1F:  77 1B 03     cal     &H031B
8A22:  D7 00 D7 1B  pre     ss,&H1BD7
8A26:  D6 00 EB 16  pre     ix,&H16EB
8A2A:  A8 00        ldw     $0,(ix+$sx)
8A2C:  DE 00        jp      $0
8A2E:  77 93 00     cal     &H0093
8A31:  77 72 92     cal     &H9272
8A34:  D7 00 D7 1B  pre     ss,&H1BD7
8A38:  77 BA 66     cal     &H66BA
8A3B:  D1 02 31 8A  ldw     $2,&H8A31
8A3F:  77 7A 29     cal     &H297A
8A42:  D1 11 6A 26  ldw     $17,&H266A
8A46:  77 83 8C     cal     &H8C83
8A49:  D1 01 0A 8B  ldw     $1,&H8B0A
8A4D:  E6 02 40     phsm    $2,3
8A50:  77 DF 2A     cal     &H2ADF
8A53:  EE 10 40     ppsm    $16,3
8A56:  96 11        pre     ix,$17
8A58:  77 66 01     cal     &H0166
8A5B:  B7 AB        jr      &H8A07
8A5D:  77 D4 28     cal     &H28D4
8A60:  02 0E        ld      $14,$sx
8A62:  D1 11 48 2E  ldw     $17,&H2E48
8A66:  77 57 6B     cal     &H6B57
8A69:  D6 00 D3 1A  pre     ix,&H1AD3
8A6D:  02 00        ld      $0,$sx
8A6F:  A0 1F        stw     $31,(ix+$sx)
8A71:  96 51        pre     iz,$17
8A73:  D6 00 D5 19  pre     ix,&H19D5
8A77:  56 60 94     pst     ua,&H94
8A7A:  2B 00        ldi     $0,(iz+$sx)
8A7C:  9E 51        gre     iz,$17
8A7E:  56 60 54     pst     ua,&H54
8A81:  01 20        sbc     $0,$sy
8A83:  B0 1E        jr      z,&H8AA2
8A85:  22 00        sti     $0,(ix+$sx)
8A87:  B1 91        jr      nc,&H8A19
8A89:  E6 12 80     phsm    $18,5
8A8C:  77 53 97     cal     &H9753
8A8F:  89 6E 0E     sbw     $14,$14
8A92:  D6 00 D3 1A  pre     ix,&H1AD3
8A96:  D6 40 D5 19  pre     iz,&H19D5
8A9A:  77 F7 4A     cal     &H4AF7
8A9D:  EE 0E 80     ppsm    $14,5
8AA0:  B7 B8        jr      &H8A59
8AA2:  0A 2E        adb     $14,$sy
8AA4:  B3 BF        jr      uz,&H8A64
8AA6:  D7 00 D7 1B  pre     ss,&H1BD7
8AAA:  D1 02 A6 8A  ldw     $2,&H8AA6
8AAE:  77 7A 29     cal     &H297A
8AB1:  D1 11 CF 26  ldw     $17,&H26CF
8AB5:  77 3D 65     cal     &H653D
8AB8:  77 5F 65     cal     &H655F
8ABB:  77 2B 00     cal     &H002B
8ABE:  B1 87        jr      nc,&H8A46
8AC0:  41 00 31     sbc     $0,&H31
8AC3:  B5 16        jr      c,&H8ADA
8AC5:  B0 35        jr      z,&H8AFB
8AC7:  02 4E        ld      $14,$sz
8AC9:  4C 0E 0F     an      $14,&H0F
8ACC:  77 57 6B     cal     &H6B57
8ACF:  77 30 29     cal     &H2930
8AD2:  24 3F        std     $31,(ix+$sy)
8AD4:  8B 71 11     sbbw    $17,$17
8AD7:  37 45 35     jp      &H3545
8ADA:  D1 02 F2 8A  ldw     $2,&H8AF2
8ADE:  77 7A 29     cal     &H297A
8AE1:  1E 24        gst     pd,$4
8AE3:  4C 04 3F     an      $4,&H3F
8AE6:  4E 04 40     or      $4,&H40
8AE9:  16 24        pst     pd,$4
8AEB:  77 C5 29     cal     &H29C5
8AEE:  4F 84 C0 88  xr      $4,&HC0,jr &H8A79
8AF2:  1E 24        gst     pd,$4
8AF4:  4E 04 C0     or      $4,&HC0
8AF7:  16 24        pst     pd,$4
8AF9:  B7 D4        jr      &H8ACE
8AFB:  D1 11 59 29  ldw     $17,&H2959
8AFF:  77 3D 65     cal     &H653D
8B02:  77 01 8E     cal     &H8E01
8B05:  77 C5 29     cal     &H29C5
8B08:  B7 87        jr      &H8A90
8B0A:  30 99 8C     jp      z,&H8C99
8B0D:  31 37 8C     jp      nc,&H8C37
8B10:  32 DB 8B     jp      lz,&H8BDB
8B13:  33 94 8D     jp      uz,&H8D94
8B16:  34 22 8D     jp      nz,&H8D22
8B19:  35 3A 8D     jp      c,&H8D3A
8B1C:  36 06 8D     jp      nlz,&H8D06
8B1F:  37 90 8B     jp      &H8B90
8B22:  38 48        adc     (ix+$sz),$8
8B24:  8E 39        orw     $25,$sy
8B26:  81 8B 0D     sbcw    $11,$sx,jr &H8B35
8B29:  5D 8A        sdn     &H8A
8B2B:  00 31        adc     $17,$sy
8B2D:  8A D1 0B     adbw    $17,$sz,jr &H8B3A
8B30:  50 00 D1     st      &HD1,($sx)
8B33:  0D 02        na      $2,$sx
8B35:  00 D6 00     adc     $22,$sz,jr &H8B37
8B38:  54 15 E0     ppo     &HE0
8B3B:  0B 60 42     sbb     $0,$2
8B3E:  00 03        adc     $3,$sx
8B40:  77 EC 84     cal     &H84EC
8B43:  D6 00 74 17  pre     ix,&H1774
8B47:  42 00 02     ld      $0,&H02
8B4A:  20 00        st      $0,(ix+$sx)
8B4C:  F7           rtn   
8B4D:  D1 04 00 40  ldw     $4,&H4000
8B51:  77 6D 8B     cal     &H8B6D
8B54:  D1 04 01 80  ldw     $4,&H8001
8B58:  77 6D 8B     cal     &H8B6D
8B5B:  D1 04 02 80  ldw     $4,&H8002
8B5F:  77 6D 8B     cal     &H8B6D
8B62:  D1 04 02 01  ldw     $4,&H0102
8B66:  77 6D 8B     cal     &H8B6D
8B69:  D1 04 03 02  ldw     $4,&H0203
8B6D:  77 CD 92     cal     &H92CD
8B70:  77 5F 65     cal     &H655F
8B73:  89 64 04     sbw     $4,$4
8B76:  77 CD 92     cal     &H92CD
8B79:  08 24        ad      $4,$sy
8B7B:  44 04 40     anc     $4,&H40
8B7E:  B0 89        jr      z,&H8B08
8B80:  F7           rtn   
8B81:  42 10 20     ld      $16,&H20
8B84:  77 F1 2A     cal     &H2AF1
8B87:  77 C5 29     cal     &H29C5
8B8A:  08 30        ad      $16,$sy
8B8C:  B1 89        jr      nc,&H8B16
8B8E:  B7 8E        jr      &H8B1D
8B90:  77 89 8C     cal     &H8C89
8B93:  D1 11 3A 27  ldw     $17,&H273A
8B97:  77 83 8C     cal     &H8C83
8B9A:  D1 00 01 11  ldw     $0,&H1101
8B9E:  50 40 20     st      &H20,($sz)
8BA1:  D1 10 FF 40  ldw     $16,&H40FF
8BA5:  77 F1 2A     cal     &H2AF1
8BA8:  77 C5 29     cal     &H29C5
8BAB:  09 31        sb      $17,$sy
8BAD:  B4 89        jr      nz,&H8B37
8BAF:  B7 96        jr      &H8B46
8BB1:  77 38 92     cal     &H9238
8BB4:  B4 09        jr      nz,&H8BBE
8BB6:  D1 00 B4 29  ldw     $0,&H29B4
8BBA:  81 51        sbcw    $17,$sz
8BBC:  B0 11        jr      z,&H8BCE
8BBE:  77 3D 65     cal     &H653D
8BC1:  96 51        pre     iz,$17
8BC3:  56 60 A4     pst     ua,&HA4
8BC6:  2B 10        ldi     $16,(iz+$sx)
8BC8:  56 60 54     pst     ua,&H54
8BCB:  9E 51        gre     iz,$17
8BCD:  F7           rtn   
8BCE:  D1 11 92 29  ldw     $17,&H2992
8BD2:  77 3D 65     cal     &H653D
8BD5:  D6 40 B6 29  pre     iz,&H29B6
8BD9:  B7 97        jr      &H8B71
8BDB:  D1 02 DB 8B  ldw     $2,&H8BDB
8BDF:  77 7A 29     cal     &H297A
8BE2:  D6 00 13 11  pre     ix,&H1113
8BE6:  24 1F        std     $31,(ix+$sx)
8BE8:  D1 11 A4 29  ldw     $17,&H29A4
8BEC:  77 38 92     cal     &H9238
8BEF:  B0 1F        jr      z,&H8C0F
8BF1:  77 B1 8B     cal     &H8BB1
8BF4:  77 1C 8C     cal     &H8C1C
8BF7:  01 50        sbc     $16,$sz
8BF9:  B4 86        jr      nz,&H8B80
8BFB:  41 00 20     sbc     $0,&H20
8BFE:  B0 06        jr      z,&H8C05
8C00:  77 BA 33     cal     &H33BA
8C03:  B7 93        jr      &H8B97
8C05:  77 B3 33     cal     &H33B3
8C08:  D1 02 B0 1F  ldw     $2,&H1FB0
8C0C:  37 7A 29     jp      &H297A
8C0F:  D1 11 94 29  ldw     $17,&H2994
8C13:  77 B1 8B     cal     &H8BB1
8C16:  D1 11 AA 29  ldw     $17,&H29AA
8C1A:  B7 A7        jr      &H8BC2
8C1C:  D1 00 0F 11  ldw     $0,&H110F
8C20:  50 40 07     st      &H07,($sz)
8C23:  77 71 01     cal     &H0171
8C26:  77 F3 03     cal     &H03F3
8C29:  D6 00 1B 11  pre     ix,&H111B
8C2D:  3A 1F        sbc     (ix+$sx),$31
8C2F:  B0 8A        jr      z,&H8BBA
8C31:  77 7C 01     cal     &H017C
8C34:  37 6C 03     jp      &H036C
8C37:  77 73 8B     cal     &H8B73
8C3A:  77 5F 65     cal     &H655F
8C3D:  77 4D 8B     cal     &H8B4D
8C40:  D6 00 D9 2A  pre     ix,&H2AD9
8C44:  D6 20 D8 2D  pre     iy,&H2DD8
8C48:  D6 40 3C 12  pre     iz,&H123C
8C4C:  56 60 64     pst     ua,&H64
8C4F:  D8           bup   
8C50:  56 60 54     pst     ua,&H54
8C53:  77 0F 93     cal     &H930F
8C56:  77 5F 65     cal     &H655F
8C59:  77 89 8C     cal     &H8C89
8C5C:  E6 05 A0     phsm    $5,6
8C5F:  D1 11 3A 27  ldw     $17,&H273A
8C63:  77 83 8C     cal     &H8C83
8C66:  EE 00 A0     ppsm    $0,6
8C69:  42 06 FF     ld      $6,&HFF
8C6C:  C2 67 A6     ldm     $7,$6,6
8C6F:  CF 60 A6     xrm     $0,$6,6
8C72:  77 7B 8C     cal     &H8C7B
8C75:  42 00 FF     ld      $0,&HFF
8C78:  C2 41 A0     ldm     $1,$sz,6
8C7B:  77 91 8C     cal     &H8C91
8C7E:  77 F5 92     cal     &H92F5
8C81:  B7 04        jr      &H8C86
8C83:  77 3D 65     cal     &H653D
8C86:  37 5F 65     jp      &H655F
8C89:  D1 00 AA 55  ldw     $0,&H55AA
8C8D:  82 42        ldw     $2,$sz
8C8F:  82 44        ldw     $4,$sz
8C91:  D6 00 4E 15  pre     ix,&H154E
8C95:  E0 00 A0     stm     $0,(ix+$sx),6
8C98:  F7           rtn   
8C99:  D1 00 99 8C  ldw     $0,&H8C99
8C9D:  77 41 8E     cal     &H8E41
8CA0:  D1 11 D4 27  ldw     $17,&H27D4
8CA4:  77 38 92     cal     &H9238
8CA7:  B4 05        jr      nz,&H8CAD
8CA9:  D1 11 16 28  ldw     $17,&H2816
8CAD:  77 83 8C     cal     &H8C83
8CB0:  77 DF 2A     cal     &H2ADF
8CB3:  D6 00 00 0C  pre     ix,&H0C00
8CB7:  56 60 04     pst     ua,&H04
8CBA:  89 6E 0E     sbw     $14,$14
8CBD:  77 CE 8C     cal     &H8CCE
8CC0:  56 60 A4     pst     ua,&HA4
8CC3:  77 CE 8C     cal     &H8CCE
8CC6:  56 60 54     pst     ua,&H54
8CC9:  77 BC 7A     cal     &H7ABC
8CCC:  B7 C7        jr      &H8C94
8CCE:  2A 00        ldi     $0,(ix+$sx)
8CD0:  08 4E        ad      $14,$sz
8CD2:  0F 4F        xr      $15,$sz
8CD4:  9E 00        gre     ix,$0
8CD6:  81 20        sbcw    $0,$sy
8CD8:  B1 8B        jr      nc,&H8C64
8CDA:  F7           rtn   
8CDB:  D6 00 95 18  pre     ix,&H1895
8CDF:  C9 40 A0     sbbm    $0,$sz,6
8CE2:  A8 02        ldw     $2,(ix+$sx)
8CE4:  D1 04 D1 18  ldw     $4,&H18D1
8CE8:  91 64 04     ldw     $4,($4)
8CEB:  88 24        adw     $4,$sy
8CED:  89 64 02     sbw     $4,$2
8CF0:  01 26        sbc     $6,$sy
8CF2:  F0           rtn     z
8CF3:  89 20        sbw     $0,$sy
8CF5:  F7           rtn   
8CF6:  08 60 06     ad      $0,$6
8CF9:  B1 07        jr      nc,&H8D01
8CFB:  08 61 06     ad      $1,$6
8CFE:  02 60 01     ld      $0,$1
8D01:  88 22        adw     $2,$sy
8D03:  89 24        sbw     $4,$sy
8D05:  F7           rtn   
8D06:  D1 00 06 8D  ldw     $0,&H8D06
8D0A:  77 41 8E     cal     &H8E41
8D0D:  77 66 8D     cal     &H8D66
8D10:  02 26        ld      $6,$sy
8D12:  77 DB 8C     cal     &H8CDB
8D15:  96 02        pre     ix,$2
8D17:  3A 00        sbc     (ix+$sx),$0
8D19:  34 01 8A     jp      nz,&H8A01
8D1C:  77 F6 8C     cal     &H8CF6
8D1F:  B4 8B        jr      nz,&H8CAB
8D21:  F7           rtn   
8D22:  77 DF 2A     cal     &H2ADF
8D25:  D1 00 22 8D  ldw     $0,&H8D22
8D29:  77 41 8E     cal     &H8E41
8D2C:  77 41 8D     cal     &H8D41
8D2F:  77 10 8D     cal     &H8D10
8D32:  42 06 FF     ld      $6,&HFF
8D35:  77 59 8D     cal     &H8D59
8D38:  B7 A7        jr      &H8CE0
8D3A:  D1 00 3A 8D  ldw     $0,&H8D3A
8D3E:  77 41 8E     cal     &H8E41
8D41:  D1 11 58 28  ldw     $17,&H2858
8D45:  77 14 83     cal     &H8314
8D48:  B5 05        jr      c,&H8D4E
8D4A:  D1 11 A4 28  ldw     $17,&H28A4
8D4E:  77 83 8C     cal     &H8C83
8D51:  77 D4 28     cal     &H28D4
8D54:  77 66 8D     cal     &H8D66
8D57:  02 26        ld      $6,$sy
8D59:  77 DB 8C     cal     &H8CDB
8D5C:  96 02        pre     ix,$2
8D5E:  24 00        std     $0,(ix+$sx)
8D60:  77 F6 8C     cal     &H8CF6
8D63:  B4 88        jr      nz,&H8CEC
8D65:  F7           rtn   
8D66:  77 DF 2A     cal     &H2ADF
8D69:  D6 00 D1 18  pre     ix,&H18D1
8D6D:  A8 00        ldw     $0,(ix+$sx)
8D6F:  44 01 10     anc     $1,&H10
8D72:  B4 04        jr      nz,&H8D77
8D74:  48 01 50     ad      $1,&H50
8D77:  49 01 7F     sb      $1,&H7F
8D7A:  41 01 20     sbc     $1,&H20
8D7D:  B5 0A        jr      c,&H8D88
8D7F:  B0 0E        jr      z,&H8D8E
8D81:  D1 11 F1 28  ldw     $17,&H28F1
8D85:  37 3D 65     jp      &H653D
8D88:  D1 11 22 29  ldw     $17,&H2922
8D8C:  B7 88        jr      &H8D15
8D8E:  D1 11 0A 29  ldw     $17,&H290A
8D92:  B7 8E        jr      &H8D21
8D94:  D1 00 94 8D  ldw     $0,&H8D94
8D98:  77 41 8E     cal     &H8E41
8D9B:  D1 11 66 29  ldw     $17,&H2966
8D9F:  77 3D 65     cal     &H653D
8DA2:  77 5F 65     cal     &H655F
8DA5:  49 00 30     sb      $0,&H30
8DA8:  B0 0A        jr      z,&H8DB3
8DAA:  09 20        sb      $0,$sy
8DAC:  B4 8B        jr      nz,&H8D38
8DAE:  77 01 8E     cal     &H8E01
8DB1:  B7 3F        jr      &H8DF1
8DB3:  56 60 D4     pst     ua,&HD4
8DB6:  D1 03 05 08  ldw     $3,&H0805
8DBA:  77 28 83     cal     &H8328
8DBD:  4E 03 C0     or      $3,&HC0
8DC0:  25 03        std     $3,(iz+$sx)
8DC2:  42 03 7E     ld      $3,&H7E
8DC5:  21 A3        st      $3,(iz-$sy)
8DC7:  D6 00 D9 2D  pre     ix,&H2DD9
8DCB:  56 60 E4     pst     ua,&HE4
8DCE:  EA 00 60     ldim    $0,(ix+$sx),4
8DD1:  16 22        pst     pd,$2
8DD3:  21 A3        st      $3,(iz-$sy)
8DD5:  1C 02        gpo     $2
8DD7:  69 03 02     ld      $3,(iz+&H02)
8DDA:  00 20        adc     $0,$sy
8DDC:  B5 14        jr      c,&H8DF1
8DDE:  4C 02 20     an      $2,&H20
8DE1:  4C 03 1C     an      $3,&H1C
8DE4:  81 42        sbcw    $2,$sz
8DE6:  B0 9C        jr      z,&H8D83
8DE8:  77 F7 8D     cal     &H8DF7
8DEB:  77 DF 2A     cal     &H2ADF
8DEE:  37 0D 8A     jp      &H8A0D
8DF1:  77 F7 8D     cal     &H8DF7
8DF4:  37 31 8A     jp      &H8A31
8DF7:  56 60 D4     pst     ua,&HD4
8DFA:  77 42 83     cal     &H8342
8DFD:  56 60 54     pst     ua,&H54
8E00:  F7           rtn   
8E01:  D6 00 D3 18  pre     ix,&H18D3
8E05:  02 00        ld      $0,$sx
8E07:  22 00        sti     $0,(ix+$sx)
8E09:  22 00        sti     $0,(ix+$sx)
8E0B:  08 20        ad      $0,$sy
8E0D:  B4 85        jr      nz,&H8D93
8E0F:  22 00        sti     $0,(ix+$sx)
8E11:  09 20        sb      $0,$sy
8E13:  B4 85        jr      nz,&H8D99
8E15:  D1 0F 05 00  ldw     $15,&H0005
8E19:  D1 11 28 18  ldw     $17,&H1828
8E1D:  77 77 82     cal     &H8277
8E20:  09 32        sb      $18,$sy
8E22:  77 77 82     cal     &H8277
8E25:  D6 00 D4 18  pre     ix,&H18D4
8E29:  02 00        ld      $0,$sx
8E2B:  2A 01        ldi     $1,(ix+$sx)
8E2D:  01 41        sbc     $1,$sz
8E2F:  34 3A 29     jp      nz,&H293A
8E32:  08 20        ad      $0,$sy
8E34:  B4 8A        jr      nz,&H8DBF
8E36:  2A 01        ldi     $1,(ix+$sx)
8E38:  01 41        sbc     $1,$sz
8E3A:  B4 8C        jr      nz,&H8DC7
8E3C:  09 20        sb      $0,$sy
8E3E:  B4 89        jr      nz,&H8DC8
8E40:  F7           rtn   
8E41:  D6 00 EB 16  pre     ix,&H16EB
8E45:  A0 00        stw     $0,(ix+$sx)
8E47:  F7           rtn   
8E48:  D1 11 1D 2E  ldw     $17,&H2E1D
8E4C:  77 83 8C     cal     &H8C83
8E4F:  77 DF 2A     cal     &H2ADF
8E52:  77 2E 8B     cal     &H8B2E
8E55:  42 10 21     ld      $16,&H21
8E58:  77 C8 85     cal     &H85C8
8E5B:  77 A6 86     cal     &H86A6
8E5E:  02 11        ld      $17,$sx
8E60:  77 C5 29     cal     &H29C5
8E63:  D6 00 58 15  pre     ix,&H1558
8E67:  3A BF        sbc     (ix-$sy),$31
8E69:  B4 24        jr      nz,&H8E8E
8E6B:  09 31        sb      $17,$sy
8E6D:  B0 20        jr      z,&H8E8E
8E6F:  3A 3F        sbc     (ix+$sy),$31
8E71:  B0 92        jr      z,&H8E04
8E73:  AA 20        ldiw    $0,(ix+$sy)
8E75:  09 41        sb      $1,$sz
8E77:  28 60 01     ld      $0,(ix+$1)
8E7A:  77 93 85     cal     &H8593
8E7D:  01 50        sbc     $16,$sz
8E7F:  B4 0E        jr      nz,&H8E8E
8E81:  08 30        ad      $16,$sy
8E83:  41 10 7F     sbc     $16,&H7F
8E86:  B4 AF        jr      nz,&H8E36
8E88:  77 63 85     cal     &H8563
8E8B:  37 31 8A     jp      &H8A31
8E8E:  77 63 85     cal     &H8563
8E91:  D1 00 48 8E  ldw     $0,&H8E48
8E95:  77 41 8E     cal     &H8E41
8E98:  77 DF 2A     cal     &H2ADF
8E9B:  37 0D 8A     jp      &H8A0D
8E9E:  D7 00 D7 1B  pre     ss,&H1BD7
8EA2:  D6 00 B8 16  pre     ix,&H16B8
8EA6:  A8 00        ldw     $0,(ix+$sx)
8EA8:  D6 00 D2 16  pre     ix,&H16D2
8EAC:  A0 00        stw     $0,(ix+$sx)
8EAE:  D1 11 60 38  ldw     $17,&H3860
8EB2:  77 54 8F     cal     &H8F54
8EB5:  77 D7 8E     cal     &H8ED7
8EB8:  77 5F 65     cal     &H655F
8EBB:  41 00 10     sbc     $0,&H10
8EBE:  B3 0C        jr      uz,&H8ECB
8EC0:  41 00 0D     sbc     $0,&H0D
8EC3:  B4 8C        jr      nz,&H8E50
8EC5:  77 89 8F     cal     &H8F89
8EC8:  37 4F 6A     jp      &H6A4F
8ECB:  77 D3 8E     cal     &H8ED3
8ECE:  77 EB 8E     cal     &H8EEB
8ED1:  B7 9A        jr      &H8E6C
8ED3:  42 10 4E     ld      $16,&H4E
8ED6:  F7           rtn   
8ED7:  42 90 46 04  ld      $16,&H46,jr &H8EDE
8EDB:  77 D3 8E     cal     &H8ED3
8EDE:  26 10        phs     $16
8EE0:  D6 00 D2 16  pre     ix,&H16D2
8EE4:  A8 12        ldw     $18,(ix+$sx)
8EE6:  82 70 12     ldw     $16,$18
8EE9:  B7 2E        jr      &H8F18
8EEB:  41 00 1C     sbc     $0,&H1C
8EEE:  F5           rtn     c
8EEF:  26 10        phs     $16
8EF1:  D6 00 D2 16  pre     ix,&H16D2
8EF5:  A8 10        ldw     $16,(ix+$sx)
8EF7:  82 72 10     ldw     $18,$16
8EFA:  B0 4B        jr      z,&H8F46
8EFC:  41 00 1E     sbc     $0,&H1E
8EFF:  B1 0B        jr      nc,&H8F0B
8F01:  0B 33        sbb     $19,$sy
8F03:  44 13 F0     anc     $19,&HF0
8F06:  B0 0F        jr      z,&H8F16
8F08:  4C 13 0F     an      $19,&H0F
8F0B:  42 12 50     ld      $18,&H50
8F0E:  41 10 50     sbc     $16,&H50
8F11:  B4 04        jr      nz,&H8F16
8F13:  42 12 46     ld      $18,&H46
8F16:  A0 12        stw     $18,(ix+$sx)
8F18:  77 F2 6A     cal     &H6AF2
8F1B:  D6 00 B8 16  pre     ix,&H16B8
8F1F:  A8 14        ldw     $20,(ix+$sx)
8F21:  81 72 14     sbcw    $18,$20
8F24:  82 70 12     ldw     $16,$18
8F27:  2E 00        pps     $0
8F29:  B0 1F        jr      z,&H8F49
8F2B:  26 00        phs     $0
8F2D:  77 C5 6A     cal     &H6AC5
8F30:  2E 00        pps     $0
8F32:  08 20        ad      $0,$sy
8F34:  02 70 11     ld      $16,$17
8F37:  4E 10 30     or      $16,&H30
8F3A:  26 00        phs     $0
8F3C:  77 C5 6A     cal     &H6AC5
8F3F:  2E 00        pps     $0
8F41:  77 97 03     cal     &H0397
8F44:  B7 20        jr      &H8F65
8F46:  0A B3 C5     adb     $19,$sy,jr &H8F0D
8F49:  41 00 46     sbc     $0,&H46
8F4C:  B0 A2        jr      z,&H8EEF
8F4E:  D1 10 3F 3F  ldw     $16,&H3F3F
8F52:  B7 A8        jr      &H8EFB
8F54:  A6 12        phsw    $18
8F56:  77 18 6B     cal     &H6B18
8F59:  AE 11        ppsw    $17
8F5B:  77 20 65     cal     &H6520
8F5E:  D1 0A 00 7F  ldw     $10,&H7F00
8F62:  77 7F 97     cal     &H977F
8F65:  77 7D 8F     cal     &H8F7D
8F68:  D6 00 D2 16  pre     ix,&H16D2
8F6C:  A8 10        ldw     $16,(ix+$sx)
8F6E:  77 F2 6A     cal     &H6AF2
8F71:  77 91 29     cal     &H2991
8F74:  37 0F 93     jp      &H930F
8F77:  D6 00 B8 16  pre     ix,&H16B8
8F7B:  B7 05        jr      &H8F81
8F7D:  D6 00 D2 16  pre     ix,&H16D2
8F81:  A8 0D        ldw     $13,(ix+$sx)
8F83:  41 0D 50     sbc     $13,&H50
8F86:  37 63 6B     jp      &H6B63
8F89:  D6 00 D2 16  pre     ix,&H16D2
8F8D:  A8 00        ldw     $0,(ix+$sx)
8F8F:  A6 01        phsw    $1
8F91:  D6 00 B8 16  pre     ix,&H16B8
8F95:  A8 00        ldw     $0,(ix+$sx)
8F97:  77 BE 90     cal     &H90BE
8F9A:  89 24        sbw     $4,$sy
8F9C:  81 62 04     sbcw    $2,$4
8F9F:  B1 3E        jr      nc,&H8FDE
8FA1:  89 64 02     sbw     $4,$2
8FA4:  AE 02        ppsw    $2
8FA6:  81 42        sbcw    $2,$sz
8FA8:  B0 37        jr      z,&H8FE0
8FAA:  E6 05 A0     phsm    $5,6
8FAD:  77 D1 45     cal     &H45D1
8FB0:  77 EE 33     cal     &H33EE
8FB3:  EE 00 A0     ppsm    $0,6
8FB6:  01 42        sbc     $2,$sz
8FB8:  B4 2A        jr      nz,&H8FE3
8FBA:  A6 01        phsw    $1
8FBC:  82 60 04     ldw     $0,$4
8FBF:  82 62 1B     ldw     $2,$27
8FC2:  89 22        sbw     $2,$sy
8FC4:  77 B1 34     cal     &H34B1
8FC7:  AE 00        ppsw    $0
8FC9:  77 BE 90     cal     &H90BE
8FCC:  82 60 19     ldw     $0,$25
8FCF:  89 64 02     sbw     $4,$2
8FD2:  89 24        sbw     $4,$sy
8FD4:  77 4C 01     cal     &H014C
8FD7:  01 1E        sbc     $30,$sx
8FD9:  F7           rtn   
8FDA:  AE 00        ppsw    $0
8FDC:  B7 86        jr      &H8F63
8FDE:  AE 00        ppsw    $0
8FE0:  01 3F        sbc     $31,$sy
8FE2:  F7           rtn   
8FE3:  B5 4B        jr      c,&H902F
8FE5:  C9 7B 5B     sbbm    $27,$27,3
8FE8:  A6 01        phsw    $1
8FEA:  E6 1D 40     phsm    $29,3
8FED:  77 C5 29     cal     &H29C5
8FF0:  EE 1B 40     ppsm    $27,3
8FF3:  AE 00        ppsw    $0
8FF5:  A6 01        phsw    $1
8FF7:  77 BE 90     cal     &H90BE
8FFA:  89 24        sbw     $4,$sy
8FFC:  88 62 1C     adw     $2,$28
8FFF:  D6 00 D3 1A  pre     ix,&H1AD3
9003:  02 00        ld      $0,$sx
9005:  A0 1F        stw     $31,(ix+$sx)
9007:  96 42        pre     iz,$2
9009:  D6 00 D5 19  pre     ix,&H19D5
900D:  77 01 91     cal     &H9101
9010:  B5 B7        jr      c,&H8FC8
9012:  E6 1D 40     phsm    $29,3
9015:  77 53 97     cal     &H9753
9018:  89 6E 0E     sbw     $14,$14
901B:  D6 00 D3 1A  pre     ix,&H1AD3
901F:  D6 40 D5 19  pre     iz,&H19D5
9023:  3B 1F        sbc     (iz+$sx),$31
9025:  74 F7 4A     cal     nz,&H4AF7
9028:  EE 1B 40     ppsm    $27,3
902B:  AE 00        ppsw    $0
902D:  B7 C6        jr      &H8FF4
902F:  A6 03        phsw    $3
9031:  77 77 8F     cal     &H8F77
9034:  AE 02        ppsw    $2
9036:  82 60 02     ldw     $0,$2
9039:  89 7C 1C     sbw     $28,$28
903C:  A6 01        phsw    $1
903E:  A6 1D        phsw    $29
9040:  C9 64 64     sbbm    $4,$4,4
9043:  89 26        sbw     $6,$sy
9045:  77 73 51     cal     &H5173
9048:  AE 1C        ppsw    $28
904A:  9E 44        gre     iz,$4
904C:  88 64 1C     adw     $4,$28
904F:  96 44        pre     iz,$4
9051:  3B 1F        sbc     (iz+$sx),$31
9053:  B0 65        jr      z,&H90B9
9055:  BB 26        sbcw    (iz+$sy),$6
9057:  B0 03        jr      z,&H905B
9059:  B1 5F        jr      nc,&H90B9
905B:  A6 1D        phsw    $29
905D:  A6 05        phsw    $5
905F:  77 8B 50     cal     &H508B
9062:  24 1F        std     $31,(ix+$sx)
9064:  AE 04        ppsw    $4
9066:  AE 1C        ppsw    $28
9068:  9E 46        gre     iz,$6
906A:  89 66 04     sbw     $6,$4
906D:  88 7C 06     adw     $28,$6
9070:  A6 1D        phsw    $29
9072:  D6 00 00 10  pre     ix,&H1000
9076:  89 6E 0E     sbw     $14,$14
9079:  2A 10        ldi     $16,(ix+$sx)
907B:  00 10        adc     $16,$sx
907D:  B4 2B        jr      nz,&H90A9
907F:  00 0E        adc     $14,$sx
9081:  B0 35        jr      z,&H90B7
9083:  AE 1C        ppsw    $28
9085:  AE 00        ppsw    $0
9087:  A6 01        phsw    $1
9089:  A6 1D        phsw    $29
908B:  77 33 91     cal     &H9133
908E:  D6 00 00 10  pre     ix,&H1000
9092:  D1 10 0D 0A  ldw     $16,&H0A0D
9096:  A0 10        stw     $16,(ix+$sx)
9098:  D1 0E 02 00  ldw     $14,&H0002
909C:  AE 1C        ppsw    $28
909E:  AE 00        ppsw    $0
90A0:  A6 01        phsw    $1
90A2:  A6 1D        phsw    $29
90A4:  77 33 91     cal     &H9133
90A7:  B7 E8        jr      &H9090
90A9:  88 2E        adw     $14,$sy
90AB:  9E 13        gre     ix,$19
90AD:  A6 0F        phsw    $15
90AF:  77 C5 29     cal     &H29C5
90B2:  AE 0E        ppsw    $14
90B4:  96 93 BD     pre     ix,$19,jr &H9073
90B7:  AE 1C        ppsw    $28
90B9:  AE 00        ppsw    $0
90BB:  01 1E        sbc     $30,$sx
90BD:  F7           rtn   
90BE:  D6 00 A7 18  pre     ix,&H18A7
90C2:  41 00 50     sbc     $0,&H50
90C5:  B0 05        jr      z,&H90CB
90C7:  D6 00 BB 18  pre     ix,&H18BB
90CB:  4C 01 0F     an      $1,&H0F
90CE:  26 01        phs     $1
90D0:  18 61        biu     $1
90D2:  E8 62 61     ldm     $2,(ix+$1),4
90D5:  2E 01        pps     $1
90D7:  F7           rtn   
90D8:  2B 00        ldi     $0,(iz+$sx)
90DA:  88 3C        adw     $28,$sy
90DC:  F7           rtn   
90DD:  22 00        sti     $0,(ix+$sx)
90DF:  08 21        ad      $1,$sy
90E1:  35 74 2B     jp      c,&H2B74
90E4:  F7           rtn   
90E5:  42 00 0A     ld      $0,&H0A
90E8:  3B 00        sbc     (iz+$sx),$0
90EA:  70 D8 90     cal     z,&H90D8
90ED:  02 00        ld      $0,$sx
90EF:  00 21        adc     $1,$sy
90F1:  71 DD 90     cal     nc,&H90DD
90F4:  01 1E        sbc     $30,$sx
90F6:  F7           rtn   
90F7:  77 ED 90     cal     &H90ED
90FA:  B7 03        jr      &H90FE
90FC:  01 3F        sbc     $31,$sy
90FE:  02 3B        ld      $27,$sy
9100:  F7           rtn   
9101:  04 3B        anc     $27,$sy
9103:  B4 88        jr      nz,&H908C
9105:  81 62 04     sbcw    $2,$4
9108:  B1 8D        jr      nc,&H9096
910A:  89 61 01     sbw     $1,$1
910D:  77 D8 90     cal     &H90D8
9110:  41 00 1A     sbc     $0,&H1A
9113:  B0 9D        jr      z,&H90B1
9115:  41 00 0D     sbc     $0,&H0D
9118:  B0 B4        jr      z,&H90CD
911A:  41 00 0A     sbc     $0,&H0A
911D:  B0 B1        jr      z,&H90CF
911F:  41 00 20     sbc     $0,&H20
9122:  B5 96        jr      c,&H90B9
9124:  B0 08        jr      z,&H912D
9126:  0E 22        or      $2,$sy
9128:  77 DD 90     cal     &H90DD
912B:  B7 9F        jr      &H90CB
912D:  04 22        anc     $2,$sy
912F:  B4 88        jr      nz,&H90B8
9131:  B7 A5        jr      &H90D7
9133:  77 BE 90     cal     &H90BE
9136:  C2 79 62     ldm     $25,$2,4
9139:  E6 05 60     phsm    $5,4
913C:  82 60 0E     ldw     $0,$14
913F:  82 62 1B     ldw     $2,$27
9142:  89 22        sbw     $2,$sy
9144:  77 B1 34     cal     &H34B1
9147:  EE 02 60     ppsm    $2,4
914A:  82 62 04     ldw     $2,$4
914D:  89 22        sbw     $2,$sy
914F:  82 44        ldw     $4,$sz
9151:  82 60 02     ldw     $0,$2
9154:  D1 02 00 10  ldw     $2,&H1000
9158:  37 4C 01     jp      &H014C
915B:  41 12 05     sbc     $18,&H05
915E:  B1 07        jr      nc,&H9166
9160:  01 08        sbc     $8,$sx
9162:  F4           rtn     nz
9163:  01 07        sbc     $7,$sx
9165:  F0           rtn     z
9166:  37 A4 2B     jp      &H2BA4
9169:  FF           trp   
916A:  FF           trp   
916B:  FF           trp   
916C:  FF           trp   
916D:  FF           trp   
916E:  FF           trp   
916F:  FF           trp   
9170:  FF           trp   
9171:  FF           trp   
9172:  FF           trp   
9173:  FF           trp   
9174:  FF           trp   
9175:  FF           trp   
9176:  FF           trp   
9177:  FF           trp   
9178:  FF           trp   
9179:  FF           trp   
917A:  FF           trp   
917B:  FF           trp   
917C:  FF           trp   
917D:  FF           trp   
917E:  FF           trp   
917F:  FF           trp   
9180:  FF           trp   
9181:  FF           trp   
9182:  FF           trp   
9183:  FF           trp   
9184:  FF           trp   
9185:  FF           trp   
9186:  FF           trp   
9187:  FF           trp   
9188:  FF           trp   
9189:  FF           trp   
918A:  FF           trp   
918B:  FF           trp   
918C:  FF           trp   
918D:  FF           trp   
918E:  FF           trp   
918F:  FF           trp   
9190:  FF           trp   
9191:  FF           trp   
9192:  FF           trp   
9193:  FF           trp   
9194:  FF           trp   
9195:  FF           trp   
9196:  FF           trp   
9197:  FF           trp   
9198:  FF           trp   
9199:  FF           trp   
919A:  FF           trp   
919B:  FF           trp   
919C:  FF           trp   
919D:  FF           trp   
919E:  FF           trp   
919F:  FF           trp   
91A0:  FF           trp   
91A1:  FF           trp   
91A2:  FF           trp   
91A3:  FF           trp   
91A4:  FF           trp   
91A5:  FF           trp   
91A6:  FF           trp   
91A7:  FF           trp   
91A8:  FF           trp   
91A9:  FF           trp   
91AA:  FF           trp   
91AB:  FF           trp   
91AC:  FF           trp   
91AD:  FF           trp   
91AE:  FF           trp   
91AF:  FF           trp   
91B0:  FF           trp   
91B1:  FF           trp   
91B2:  FF           trp   
91B3:  FF           trp   
91B4:  FF           trp   
91B5:  FF           trp   
91B6:  FF           trp   
91B7:  FF           trp   
91B8:  FF           trp   
91B9:  FF           trp   
91BA:  FF           trp   
91BB:  FF           trp   
91BC:  FF           trp   
91BD:  FF           trp   
91BE:  FF           trp   
91BF:  FF           trp   
91C0:  FF           trp   
91C1:  FF           trp   
91C2:  FF           trp   
91C3:  FF           trp   
91C4:  FF           trp   
91C5:  FF           trp   
91C6:  FF           trp   
91C7:  FF           trp   
91C8:  FF           trp   
91C9:  FF           trp   
91CA:  FF           trp   
91CB:  FF           trp   
91CC:  FF           trp   
91CD:  FF           trp   
91CE:  FF           trp   
91CF:  FF           trp   
91D0:  FF           trp   
91D1:  FF           trp   
91D2:  FF           trp   
91D3:  FF           trp   
91D4:  FF           trp   
91D5:  FF           trp   
91D6:  FF           trp   
91D7:  FF           trp   
91D8:  FF           trp   
91D9:  FF           trp   
91DA:  FF           trp   
91DB:  FF           trp   
91DC:  FF           trp   
91DD:  FF           trp   
91DE:  FF           trp   
91DF:  FF           trp   
91E0:  FF           trp   
91E1:  FF           trp   
91E2:  FF           trp   
91E3:  FF           trp   
91E4:  FF           trp   
91E5:  FF           trp   
91E6:  FF           trp   
91E7:  FF           trp   
91E8:  FF           trp   
91E9:  FF           trp   
91EA:  FF           trp   
91EB:  FF           trp   
91EC:  FF           trp   
91ED:  FF           trp   
91EE:  FF           trp   
91EF:  FF           trp   
91F0:  FF           trp   
91F1:  FF           trp   
91F2:  FF           trp   
91F3:  FF           trp   
91F4:  FF           trp   
91F5:  FF           trp   
91F6:  FF           trp   
91F7:  FF           trp   
91F8:  FF           trp   
91F9:  FF           trp   
91FA:  FF           trp   
91FB:  FF           trp   
91FC:  FF           trp   
91FD:  FF           trp   
91FE:  FF           trp   
91FF:  FF           trp   
9200:  FF           trp   
9201:  FF           trp   
9202:  FF           trp   
9203:  FF           trp   
9204:  FF           trp   
9205:  FF           trp   
9206:  FF           trp   
9207:  FF           trp   
9208:  FF           trp   
9209:  FF           trp   
920A:  FF           trp   
920B:  FF           trp   
920C:  FF           trp   
920D:  FF           trp   
920E:  FF           trp   
920F:  FF           trp   
9210:  FF           trp   
9211:  FF           trp   
9212:  FF           trp   
9213:  FF           trp   
9214:  FF           trp   
9215:  FF           trp   
9216:  FF           trp   
9217:  FF           trp   
9218:  FF           trp   
9219:  FF           trp   
921A:  FF           trp   
921B:  FF           trp   
921C:  FF           trp   
921D:  FF           trp   
921E:  FF           trp   
921F:  FF           trp   
9220:  FF           trp   
9221:  FF           trp   
9222:  FF           trp   
9223:  FF           trp   
9224:  FF           trp   
9225:  FF           trp   
9226:  FF           trp   
9227:  FF           trp   
9228:  FF           trp   
9229:  FF           trp   
922A:  FF           trp   
922B:  FF           trp   
922C:  FF           trp   
922D:  FF           trp   
922E:  FF           trp   
922F:  FF           trp   
9230:  FF           trp   
9231:  FF           trp   
9232:  FF           trp   
9233:  FF           trp   
9234:  FF           trp   
9235:  FF           trp   
9236:  FF           trp   
9237:  FF           trp   
9238:  A6 06        phsw    $6
923A:  1C 05        gpo     $5
923C:  1C 06        gpo     $6
923E:  01 65 06     sbc     $5,$6
9241:  B4 88        jr      nz,&H91CA
9243:  44 05 10     anc     $5,&H10
9246:  AE 05        ppsw    $5
9248:  F7           rtn   
9249:  26 00        phs     $0
924B:  77 37 99     cal     &H9937
924E:  2E 00        pps     $0
9250:  B0 1E        jr      z,&H926F
9252:  01 38        sbc     $24,$sy
9254:  B4 1A        jr      nz,&H926F
9256:  44 17 06     anc     $23,&H06
9259:  B4 15        jr      nz,&H926F
925B:  D6 00 13 11  pre     ix,&H1113
925F:  2C 01        ldd     $1,(ix+$sx)
9261:  42 00 FF     ld      $0,&HFF
9264:  44 01 20     anc     $1,&H20
9267:  B0 04        jr      z,&H926C
9269:  42 00 0F     ld      $0,&H0F
926C:  37 91 02     jp      &H0291
926F:  37 88 02     jp      &H0288
9272:  E6 05 60     phsm    $5,4
9275:  9E 02        gre     ix,$2
9277:  A6 03        phsw    $3
9279:  77 84 92     cal     &H9284
927C:  AE 02        ppsw    $2
927E:  96 02        pre     ix,$2
9280:  EE 02 60     ppsm    $2,4
9283:  F7           rtn   
9284:  77 BC 92     cal     &H92BC
9287:  77 AC 92     cal     &H92AC
928A:  D1 04 02 00  ldw     $4,&H0002
928E:  77 CD 92     cal     &H92CD
9291:  08 24        ad      $4,$sy
9293:  77 CD 92     cal     &H92CD
9296:  D6 00 32 11  pre     ix,&H1132
929A:  2C 05        ldd     $5,(ix+$sx)
929C:  4C 05 03     an      $5,&H03
929F:  41 05 02     sbc     $5,&H02
92A2:  B0 2A        jr      z,&H92CD
92A4:  09 24        sb      $4,$sy
92A6:  01 25        sbc     $5,$sy
92A8:  B0 24        jr      z,&H92CD
92AA:  B7 1F        jr      &H92CA
92AC:  D6 00 13 11  pre     ix,&H1113
92B0:  2C 05        ldd     $5,(ix+$sx)
92B2:  4C 05 40     an      $5,&H40
92B5:  4F 05 40     xr      $5,&H40
92B8:  02 04        ld      $4,$sx
92BA:  B7 12        jr      &H92CD
92BC:  02 05        ld      $5,$sx
92BE:  02 24        ld      $4,$sy
92C0:  D6 00 C4 16  pre     ix,&H16C4
92C4:  2C 03        ldd     $3,(ix+$sx)
92C6:  04 23        anc     $3,$sy
92C8:  B0 04        jr      z,&H92CD
92CA:  42 05 80     ld      $5,&H80
92CD:  D1 02 92 DE  ldw     $2,&HDE92
92D1:  54 00 FF     ppo     &HFF
92D4:  D2 02 40     stlm    $2,3
92D7:  54 00 FE     ppo     &HFE
92DA:  12 05        stl     $5
92DC:  F7           rtn   
92DD:  D1 05 00 00  ldw     $5,&H0000
92E1:  77 38 92     cal     &H9238
92E4:  F4           rtn     nz
92E5:  D1 05 40 05  ldw     $5,&H0540
92E9:  F7           rtn   
92EA:  D6 00 0B 11  pre     ix,&H110B
92EE:  D1 03 58 0D  ldw     $3,&H0D58
92F2:  A0 03        stw     $3,(ix+$sx)
92F4:  F7           rtn   
92F5:  D6 00 02 11  pre     ix,&H1102
92F9:  28 0A        ld      $10,(ix+$sx)
92FB:  D6 00 0A 11  pre     ix,&H110A
92FF:  2C 0B        ldd     $11,(ix+$sx)
9301:  08 6B 0A     ad      $11,$10
9304:  09 2B        sb      $11,$sy
9306:  E6 10 40     phsm    $16,3
9309:  77 7F 97     cal     &H977F
930C:  EE 0E 40     ppsm    $14,3
930F:  D1 00 09 11  ldw     $0,&H1109
9313:  11 40        ld      $0,($sz)
9315:  42 01 03     ld      $1,&H03
9318:  09 41        sb      $1,$sz
931A:  02 04        ld      $4,$sx
931C:  D6 00 3C 12  pre     ix,&H123C
9320:  77 05 02     cal     &H0205
9323:  08 24        ad      $4,$sy
9325:  01 61 04     sbc     $1,$4
9328:  B1 89        jr      nc,&H92B2
932A:  37 D8 01     jp      &H01D8
932D:  77 F2 01     cal     &H01F2
9330:  77 62 02     cal     &H0262
9333:  D6 00 01 11  pre     ix,&H1101
9337:  F7           rtn   
9338:  D1 00 3B 11  ldw     $0,&H113B
933C:  D1 02 01 04  ldw     $2,&H0401
9340:  77 57 01     cal     &H0157
9343:  D6 00 01 11  pre     ix,&H1101
9347:  24 1F        std     $31,(ix+$sx)
9349:  20 3F        st      $31,(ix+$sy)
934B:  60 1F 04     st      $31,(ix+&H04)
934E:  37 82 94     jp      &H9482
9351:  D6 00 01 11  pre     ix,&H1101
9355:  28 A0        ld      $0,(ix-$sy)
9357:  44 00 06     anc     $0,&H06
935A:  F0           rtn     z
935B:  02 02        ld      $2,$sx
935D:  68 03 09     ld      $3,(ix+&H09)
9360:  A8 00        ldw     $0,(ix+$sx)
9362:  09 60 01     sb      $0,$1
9365:  B5 0C        jr      c,&H9372
9367:  01 60 03     sbc     $0,$3
936A:  B5 0D        jr      c,&H9378
936C:  77 DF 02     cal     &H02DF
936F:  02 A2 91     ld      $2,$sy,jr &H9302
9372:  77 DD 02     cal     &H02DD
9375:  02 A2 97     ld      $2,$sy,jr &H930E
9378:  01 02        sbc     $2,$sx
937A:  F7           rtn   
937B:  D6 00 01 11  pre     ix,&H1101
937F:  2C 00        ldd     $0,(ix+$sx)
9381:  2C AA        ldd     $10,(ix-$sy)
9383:  D6 00 3B 11  pre     ix,&H113B
9387:  24 50        std     $16,(ix+$sz)
9389:  77 F2 01     cal     &H01F2
938C:  77 36 03     cal     &H0336
938F:  44 0A 20     anc     $10,&H20
9392:  F0           rtn     z
9393:  DB 44 A0     invm    $4,6
9396:  E0 04 A0     stm     $4,(ix+$sx),6
9399:  F7           rtn   
939A:  D1 02 28 05  ldw     $2,&H0528
939E:  77 38 92     cal     &H9238
93A1:  B4 05        jr      nz,&H93A7
93A3:  D1 02 68 0A  ldw     $2,&H0A68
93A7:  D1 00 3C 15  ldw     $0,&H153C
93AB:  D1 04 18 00  ldw     $4,&H0018
93AF:  37 BB 0E     jp      &H0EBB
93B2:  02 A7 95     ld      $7,$sy,jr &H9349
93B5:  05 73 95     nac     $19,$21
93B8:  06 AE 95     orc     $14,$sy,jr &H934F
93BB:  07 BA 33     xrc     $26,$sy,jr &H93F0
93BE:  08 FC 95 09  ad      $28,$21,jr &H93CA
93C2:  04 95 0B     anc     $21,$sx,jr &H93CF
93C5:  E3 95 0C     stim    $21,(iz-$sx),1
93C8:  F1           rtn     nc
93C9:  95 0D        psrw    sx,$13
93CB:  BF 95        sbw     (iz-$sx),$21
93CD:  11 1A        ld      $26,($sx)
93CF:  96 12        pre     ix,$18
93D1:  32 96 1C     jp      lz,&H1C96
93D4:  59 95        bdns    &H95
93D6:  1D 63        gsr     ??,$3
93D8:  95 1E        psrw    sx,$30
93DA:  5E           ****  
93DB:  95 1F        psrw    sx,$31
93DD:  54 95 00     ppo     &H00
93E0:  76 96 77     cal     nlz,&H7796
93E3:  82 94 D6     ldw     $20,$sx,jr &H93BB
93E6:  00 B2 93     adc     $18,$sy,jr &H937B
93E9:  41 10 20     sbc     $16,&H20
93EC:  35 66 01     jp      c,&H0166
93EF:  41 10 7F     sbc     $16,&H7F
93F2:  F0           rtn     z
93F3:  D6 00 39 17  pre     ix,&H1739
93F7:  3A 1E        sbc     (ix+$sx),$30
93F9:  B4 14        jr      nz,&H940E
93FB:  D6 00 01 11  pre     ix,&H1101
93FF:  2C 00        ldd     $0,(ix+$sx)
9401:  D6 00 3B 11  pre     ix,&H113B
9405:  24 50        std     $16,(ix+$sz)
9407:  D6 00 01 11  pre     ix,&H1101
940B:  3C 1E        ad      (ix+$sx),$30
940D:  F7           rtn   
940E:  77 7B 93     cal     &H937B
9411:  77 2D 93     cal     &H932D
9414:  E8 A0 E0     ldm     $0,(ix-$sy),8
9417:  01 61 04     sbc     $1,$4
941A:  B5 30        jr      c,&H944B
941C:  A6 01        phsw    $1
941E:  77 37 29     cal     &H2937
9421:  AE 00        ppsw    $0
9423:  B4 09        jr      nz,&H942D
9425:  77 4F 29     cal     &H294F
9428:  41 01 40     sbc     $1,&H40
942B:  B4 07        jr      nz,&H9433
942D:  77 ED 01     cal     &H01ED
9430:  34 51 94     jp      nz,&H9451
9433:  01 64 07     sbc     $4,$7
9436:  B4 14        jr      nz,&H944B
9438:  01 63 06     sbc     $3,$6
943B:  B4 06        jr      nz,&H9442
943D:  44 00 09     anc     $0,&H09
9440:  B4 0A        jr      nz,&H944B
9442:  77 A4 96     cal     &H96A4
9445:  77 F7 94     cal     &H94F7
9448:  37 11 96     jp      &H9611
944B:  77 F7 94     cal     &H94F7
944E:  37 6A 95     jp      &H956A
9451:  00 27        adc     $7,$sy
9453:  B5 0D        jr      c,&H9461
9455:  D6 00 01 11  pre     ix,&H1101
9459:  3C 1E        ad      (ix+$sx),$30
945B:  7C 1E 06     ad      (ix+&H06),$30
945E:  37 6A 95     jp      &H956A
9461:  4C 06 E0     an      $6,&HE0
9464:  B0 87        jr      z,&H93EC
9466:  77 F8 96     cal     &H96F8
9469:  D6 00 01 11  pre     ix,&H1101
946D:  E8 00 C0     ldm     $0,(ix+$sx),7
9470:  49 00 1F     sb      $0,&H1F
9473:  49 01 20     sb      $1,&H20
9476:  49 05 20     sb      $5,&H20
9479:  49 06 1F     sb      $6,&H1F
947C:  E0 00 C0     stm     $0,(ix+$sx),7
947F:  37 11 96     jp      &H9611
9482:  77 37 29     cal     &H2937
9485:  B4 0A        jr      nz,&H9490
9487:  77 4F 29     cal     &H294F
948A:  41 01 40     sbc     $1,&H40
948D:  34 9C 02     jp      nz,&H029C
9490:  77 ED 01     cal     &H01ED
9493:  30 9C 02     jp      z,&H029C
9496:  D6 00 06 11  pre     ix,&H1106
949A:  2C 00        ldd     $0,(ix+$sx)
949C:  20 A0        st      $0,(ix-$sy)
949E:  60 80 03     st      $0,(ix-&H03)
94A1:  68 80 05     ld      $0,(ix-&H05)
94A4:  D6 00 3B 11  pre     ix,&H113B
94A8:  3A 5F        sbc     (ix+$sz),$31
94AA:  B0 07        jr      z,&H94B2
94AC:  08 20        ad      $0,$sy
94AE:  B1 87        jr      nc,&H9436
94B0:  09 20        sb      $0,$sy
94B2:  D6 00 04 11  pre     ix,&H1104
94B6:  24 00        std     $0,(ix+$sx)
94B8:  60 00 03     st      $0,(ix+&H03)
94BB:  F7           rtn   
94BC:  D6 00 01 11  pre     ix,&H1101
94C0:  EA 00 C0     ldim    $0,(ix+$sx),7
94C3:  01 46        sbc     $6,$sz
94C5:  30 76 96     jp      z,&H9676
94C8:  00 26        adc     $6,$sy
94CA:  B1 14        jr      nc,&H94DF
94CC:  4C 05 E0     an      $5,&HE0
94CF:  30 5C 96     jp      z,&H965C
94D2:  42 00 20     ld      $0,&H20
94D5:  7E 80 02     sb      (ix-&H02),$0
94D8:  3E A0        sb      (ix-$sy),$0
94DA:  77 A4 96     cal     &H96A4
94DD:  B7 16        jr      &H94F4
94DF:  4C 06 1F     an      $6,&H1F
94E2:  41 06 1F     sbc     $6,&H1F
94E5:  B4 09        jr      nz,&H94EF
94E7:  77 06 97     cal     &H9706
94EA:  77 82 94     cal     &H9482
94ED:  B7 06        jr      &H94F4
94EF:  7C 9E 04     ad      (ix-&H04),$30
94F2:  3C BE        ad      (ix-$sy),$30
94F4:  37 67 96     jp      &H9667
94F7:  D6 00 01 11  pre     ix,&H1101
94FB:  68 00 06     ld      $0,(ix+&H06)
94FE:  3A 00        sbc     (ix+$sx),$0
9500:  F1           rtn     nc
9501:  3C 1E        ad      (ix+$sx),$30
9503:  F7           rtn   
9504:  D1 02 0A 07  ldw     $2,&H070A
9508:  09 22        sb      $2,$sy
950A:  F5           rtn     c
950B:  A6 03        phsw    $3
950D:  42 10 20     ld      $16,&H20
9510:  77 E2 93     cal     &H93E2
9513:  AE 02        ppsw    $2
9515:  D1 00 01 11  ldw     $0,&H1101
9519:  11 40        ld      $0,($sz)
951B:  0C 60 03     an      $0,$3
951E:  B4 97        jr      nz,&H94B6
9520:  F7           rtn   
9521:  42 80 20 03  ld      $0,&H20,jr &H9527
9525:  02 20        ld      $0,$sy
9527:  D6 00 01 11  pre     ix,&H1101
952B:  2C 01        ldd     $1,(ix+$sx)
952D:  08 41        ad      $1,$sz
952F:  F5           rtn     c
9530:  7A 01 06     sbc     (ix+&H06),$1
9533:  F5           rtn     c
9534:  B7 16        jr      &H954B
9536:  42 80 20 03  ld      $0,&H20,jr &H953C
953A:  02 20        ld      $0,$sy
953C:  D6 00 01 11  pre     ix,&H1101
9540:  2C 01        ldd     $1,(ix+$sx)
9542:  09 41        sb      $1,$sz
9544:  F5           rtn     c
9545:  68 00 05     ld      $0,(ix+&H05)
9548:  01 41        sbc     $1,$sz
954A:  F5           rtn     c
954B:  D6 00 01 11  pre     ix,&H1101
954F:  24 01        std     $1,(ix+$sx)
9551:  01 1E        sbc     $30,$sx
9553:  F7           rtn   
9554:  77 21 95     cal     &H9521
9557:  B7 0E        jr      &H9566
9559:  77 25 95     cal     &H9525
955C:  B7 09        jr      &H9566
955E:  77 36 95     cal     &H9536
9561:  B7 04        jr      &H9566
9563:  77 3A 95     cal     &H953A
9566:  F5           rtn     c
9567:  77 93 03     cal     &H0393
956A:  77 51 93     cal     &H9351
956D:  30 82 94     jp      z,&H9482
9570:  37 14 96     jp      &H9614
9573:  D6 00 03 11  pre     ix,&H1103
9577:  68 00 02     ld      $0,(ix+&H02)
957A:  28 21        ld      $1,(ix+$sy)
957C:  08 21        ad      $1,$sy
957E:  09 41        sb      $1,$sz
9580:  30 F7 95     jp      z,&H95F7
9583:  77 1D 97     cal     &H971D
9586:  D6 00 01 11  pre     ix,&H1101
958A:  68 00 04     ld      $0,(ix+&H04)
958D:  24 00        std     $0,(ix+$sx)
958F:  37 11 96     jp      &H9611
9592:  D6 00 03 11  pre     ix,&H1103
9596:  68 80 02     ld      $0,(ix-&H02)
9599:  28 21        ld      $1,(ix+$sy)
959B:  08 21        ad      $1,$sy
959D:  09 41        sb      $1,$sz
959F:  B0 57        jr      z,&H95F7
95A1:  77 1D 97     cal     &H971D
95A4:  37 11 96     jp      &H9611
95A7:  D1 00 05 11  ldw     $0,&H1105
95AB:  11 C0 04     ld      $0,($sz),jr &H95B1
95AE:  77 E3 02     cal     &H02E3
95B1:  D6 00 01 11  pre     ix,&H1101
95B5:  B7 A9        jr      &H955F
95B7:  D6 00 01 11  pre     ix,&H1101
95BB:  24 00        std     $0,(ix+$sx)
95BD:  B7 D4        jr      &H9592
95BF:  77 ED 01     cal     &H01ED
95C2:  34 76 96     jp      nz,&H9676
95C5:  D6 00 01 11  pre     ix,&H1101
95C9:  2C 00        ldd     $0,(ix+$sx)
95CB:  4C 00 E0     an      $0,&HE0
95CE:  48 00 20     ad      $0,&H20
95D1:  B1 9B        jr      nc,&H956D
95D3:  77 E3 02     cal     &H02E3
95D6:  4C 00 E0     an      $0,&HE0
95D9:  48 00 20     ad      $0,&H20
95DC:  B1 A6        jr      nc,&H9583
95DE:  77 A4 96     cal     &H96A4
95E1:  B7 8F        jr      &H9571
95E3:  77 ED 01     cal     &H01ED
95E6:  B4 C0        jr      nz,&H95A7
95E8:  D6 00 01 11  pre     ix,&H1101
95EC:  24 1F        std     $31,(ix+$sx)
95EE:  37 6A 95     jp      &H956A
95F1:  77 ED 01     cal     &H01ED
95F4:  34 73 95     jp      nz,&H9573
95F7:  77 38 93     cal     &H9338
95FA:  B7 16        jr      &H9611
95FC:  D6 00 02 11  pre     ix,&H1102
9600:  28 20        ld      $0,(ix+$sy)
9602:  3A A0        sbc     (ix-$sy),$0
9604:  B0 71        jr      z,&H9676
9606:  3E BE        sb      (ix-$sy),$30
9608:  77 FE 02     cal     &H02FE
960B:  77 D0 96     cal     &H96D0
960E:  77 93 03     cal     &H0393
9611:  77 51 93     cal     &H9351
9614:  77 F5 92     cal     &H92F5
9617:  37 82 94     jp      &H9482
961A:  77 E3 02     cal     &H02E3
961D:  7A 80 03     sbc     (ix-&H03),$0
9620:  B5 99        jr      c,&H95BA
9622:  77 FF 01     cal     &H01FF
9625:  B0 50        jr      z,&H9676
9627:  02 21        ld      $1,$sy
9629:  D6 00 03 11  pre     ix,&H1103
962D:  77 1D 97     cal     &H971D
9630:  B7 A3        jr      &H95D4
9632:  77 37 29     cal     &H2937
9635:  B4 09        jr      nz,&H963F
9637:  77 4F 29     cal     &H294F
963A:  41 01 40     sbc     $1,&H40
963D:  B4 07        jr      nz,&H9645
963F:  77 ED 01     cal     &H01ED
9642:  34 BC 94     jp      nz,&H94BC
9645:  77 FE 02     cal     &H02FE
9648:  77 E3 02     cal     &H02E3
964B:  7A 80 03     sbc     (ix-&H03),$0
964E:  B1 27        jr      nc,&H9676
9650:  2C 01        ldd     $1,(ix+$sx)
9652:  01 60 01     sbc     $0,$1
9655:  B5 11        jr      c,&H9667
9657:  77 79 96     cal     &H9679
965A:  B1 0C        jr      nc,&H9667
965C:  D6 00 07 11  pre     ix,&H1107
9660:  2C 00        ldd     $0,(ix+$sx)
9662:  77 FF 01     cal     &H01FF
9665:  B4 10        jr      nz,&H9676
9667:  77 C5 96     cal     &H96C5
966A:  26 10        phs     $16
966C:  42 10 20     ld      $16,&H20
966F:  77 7B 93     cal     &H937B
9672:  2E 10        pps     $16
9674:  B7 E7        jr      &H965C
9676:  01 3F        sbc     $31,$sy
9678:  F7           rtn   
9679:  D6 00 00 11  pre     ix,&H1100
967D:  E8 00 E0     ldm     $0,(ix+$sx),8
9680:  01 64 07     sbc     $4,$7
9683:  B0 14        jr      z,&H9698
9685:  48 04 20     ad      $4,&H20
9688:  02 60 04     ld      $0,$4
968B:  77 F2 02     cal     &H02F2
968E:  49 04 20     sb      $4,&H20
9691:  01 44        sbc     $4,$sz
9693:  75 06 97     cal     c,&H9706
9696:  B7 2B        jr      &H96C2
9698:  44 00 08     anc     $0,&H08
969B:  34 76 96     jp      nz,&H9676
969E:  01 63 06     sbc     $3,$6
96A1:  30 76 96     jp      z,&H9676
96A4:  77 F8 96     cal     &H96F8
96A7:  42 01 20     ld      $1,&H20
96AA:  D6 00 01 11  pre     ix,&H1101
96AE:  3E 01        sb      (ix+$sx),$1
96B0:  B1 03        jr      nc,&H96B4
96B2:  3C 01        ad      (ix+$sx),$1
96B4:  3E 21        sb      (ix+$sy),$1
96B6:  B1 03        jr      nc,&H96BA
96B8:  3C 21        ad      (ix+$sy),$1
96BA:  7E 01 04     sb      (ix+&H04),$1
96BD:  B1 04        jr      nc,&H96C2
96BF:  7C 01 04     ad      (ix+&H04),$1
96C2:  37 82 94     jp      &H9482
96C5:  D6 00 01 11  pre     ix,&H1101
96C9:  2A 00        ldi     $0,(ix+$sx)
96CB:  02 22        ld      $2,$sy
96CD:  08 C2 0C     ad      $2,$sz,jr &H96DB
96D0:  D6 00 01 11  pre     ix,&H1101
96D4:  2A 02        ldi     $2,(ix+$sx)
96D6:  02 20        ld      $0,$sy
96D8:  08 60 02     ad      $0,$2
96DB:  24 20        std     $0,(ix+$sy)
96DD:  28 21        ld      $1,(ix+$sy)
96DF:  20 22        st      $2,(ix+$sy)
96E1:  68 80 02     ld      $0,(ix-&H02)
96E4:  09 41        sb      $1,$sz
96E6:  60 01 05     st      $1,(ix+&H05)
96E9:  77 2B 97     cal     &H972B
96EC:  96 22        pre     iy,$2
96EE:  28 A0        ld      $0,(ix-$sy)
96F0:  77 FF 01     cal     &H01FF
96F3:  9E 20        gre     iy,$0
96F5:  37 55 01     jp      &H0155
96F8:  D6 00 03 11  pre     ix,&H1103
96FC:  D1 00 20 00  ldw     $0,&H0020
9700:  A0 00        stw     $0,(ix+$sx)
9702:  42 81 E0 9F  ld      $1,&HE0,jr &H96A4
9706:  D6 00 03 11  pre     ix,&H1103
970A:  28 20        ld      $0,(ix+$sy)
970C:  08 20        ad      $0,$sy
970E:  02 41        ld      $1,$sz
9710:  48 01 20     ad      $1,&H20
9713:  B5 06        jr      c,&H971A
9715:  A0 00        stw     $0,(ix+$sx)
9717:  1B 81 B3     cmp     $1,jr &H96CC
971A:  42 01 20     ld      $1,&H20
971D:  60 01 05     st      $1,(ix+&H05)
9720:  20 20        st      $0,(ix+$sy)
9722:  77 2B 97     cal     &H972B
9725:  C2 60 62     ldm     $0,$2,4
9728:  37 57 01     jp      &H0157
972B:  28 20        ld      $0,(ix+$sy)
972D:  77 FF 01     cal     &H01FF
9730:  D6 00 04 11  pre     ix,&H1104
9734:  68 04 04     ld      $4,(ix+&H04)
9737:  02 05        ld      $5,$sx
9739:  F7           rtn   
973A:  3A 41        sbc     (ix+$sz),$1
973C:  B0 04        jr      z,&H9741
973E:  B5 02        jr      c,&H9741
9740:  F7           rtn   
9741:  20 5F        st      $31,(ix+$sz)
9743:  01 43        sbc     $3,$sz
9745:  F0           rtn     z
9746:  09 20        sb      $0,$sy
9748:  3A 41        sbc     (ix+$sz),$1
974A:  B0 8A        jr      z,&H96D5
974C:  F7           rtn   
974D:  77 FE 02     cal     &H02FE
9750:  77 3A 97     cal     &H973A
9753:  D1 00 00 10  ldw     $0,&H1000
9757:  D1 02 00 01  ldw     $2,&H0100
975B:  37 57 01     jp      &H0157
975E:  77 4D 97     cal     &H974D
9761:  D6 40 05 11  pre     iz,&H1105
9765:  2D 00        ldd     $0,(iz+$sx)
9767:  D6 40 3B 11  pre     iz,&H113B
976B:  2D 41        ldd     $1,(iz+$sz)
976D:  F7           rtn   
976E:  D1 00 01 60  ldw     $0,&H6001
9772:  B7 05        jr      &H9778
9774:  D1 00 00 80  ldw     $0,&H8000
9778:  D6 00 09 11  pre     ix,&H1109
977C:  A0 00        stw     $0,(ix+$sx)
977E:  F7           rtn   
977F:  D1 02 3C 12  ldw     $2,&H123C
9783:  E6 0E 60     phsm    $14,4
9786:  09 6B 0A     sb      $11,$10
9789:  1E 6C        gst     ua,$12
978B:  9E 4D        gre     iz,$13
978D:  56 60 54     pst     ua,&H54
9790:  D6 40 3B 11  pre     iz,&H113B
9794:  2D 70 0A     ldd     $16,(iz+$10)
9797:  2B 10        ldi     $16,(iz+$sx)
9799:  77 3A 03     cal     &H033A
979C:  E8 04 A0     ldm     $4,(ix+$sx),6
979F:  16 60        pst     ua,$0
97A1:  96 02        pre     ix,$2
97A3:  E2 04 A0     stim    $4,(ix+$sx),6
97A6:  9E 02        gre     ix,$2
97A8:  09 2B        sb      $11,$sy
97AA:  B1 94        jr      nc,&H973F
97AC:  96 4D        pre     iz,$13
97AE:  16 6C        pst     ua,$12
97B0:  EE 0B 60     ppsm    $11,4
97B3:  F7           rtn   
97B4:  1E 6E        gst     ua,$14
97B6:  56 60 44     pst     ua,&H44
97B9:  11 71 0F     ld      $17,($15)
97BC:  88 2F        adw     $15,$sy
97BE:  02 64 11     ld      $4,$17
97C1:  02 05        ld      $5,$sx
97C3:  82 62 0F     ldw     $2,$15
97C6:  D1 00 5E 16  ldw     $0,&H165E
97CA:  77 F9 00     cal     &H00F9
97CD:  16 6E        pst     ua,$14
97CF:  D6 00 5E 16  pre     ix,&H165E
97D3:  B7 03        jr      &H97D7
97D5:  96 0F        pre     ix,$15
97D7:  09 31        sb      $17,$sy
97D9:  F5           rtn     c
97DA:  2A 10        ldi     $16,(ix+$sx)
97DC:  9E 0E        gre     ix,$14
97DE:  77 F1 2A     cal     &H2AF1
97E1:  96 8E 8C     pre     ix,$14,jr &H976F
97E4:  D6 60 C1 1C  pre     us,&H1CC1
97E8:  EF 0F C0     ppum    $15,7
97EB:  EF 16 E0     ppum    $22,8
97EE:  96 4F        pre     iz,$15
97F0:  D1 02 5C 9F  ldw     $2,&H9F5C
97F4:  77 7A 29     cal     &H297A
97F7:  77 1B 03     cal     &H031B
97FA:  4C 97 F9 11  an      $23,&HF9,jr &H980E
97FE:  D7 00 D7 1B  pre     ss,&H1BD7
9802:  77 8C 98     cal     &H988C
9805:  D6 00 8E 16  pre     ix,&H168E
9809:  A8 04        ldw     $4,(ix+$sx)
980B:  37 E4 9D     jp      &H9DE4
980E:  77 6C 99     cal     &H996C
9811:  77 DB 99     cal     &H99DB
9814:  D7 00 D7 1B  pre     ss,&H1BD7
9818:  4C 18 7F     an      $24,&H7F
981B:  D6 60 D0 1C  pre     us,&H1CD0
981F:  9E 4F        gre     iz,$15
9821:  E7 1D E0     phum    $29,8
9824:  E7 15 C0     phum    $21,7
9827:  77 C8 23     cal     &H23C8
982A:  41 00 FD     sbc     $0,&HFD
982D:  B4 04        jr      nz,&H9832
982F:  42 00 0D     ld      $0,&H0D
9832:  02 50        ld      $16,$sz
9834:  41 00 80     sbc     $0,&H80
9837:  B5 21        jr      c,&H9859
9839:  41 00 A6     sbc     $0,&HA6
983C:  B5 34        jr      c,&H9871
983E:  41 00 E0     sbc     $0,&HE0
9841:  B5 0C        jr      c,&H984E
9843:  41 00 F0     sbc     $0,&HF0
9846:  B5 35        jr      c,&H987C
9848:  4C 10 0F     an      $16,&H0F
984B:  4E 10 30     or      $16,&H30
984E:  44 17 06     anc     $23,&H06
9851:  30 ED 9A     jp      z,&H9AED
9854:  77 E3 2A     cal     &H2AE3
9857:  B7 C4        jr      &H981C
9859:  41 00 20     sbc     $0,&H20
985C:  B1 8F        jr      nc,&H97EC
985E:  44 17 06     anc     $23,&H06
9861:  B4 07        jr      nz,&H9869
9863:  D6 00 CF 47  pre     ix,&H47CF
9867:  B7 21        jr      &H9889
9869:  41 00 0D     sbc     $0,&H0D
986C:  B4 99        jr      nz,&H9806
986E:  37 C8 9D     jp      &H9DC8
9871:  44 17 06     anc     $23,&H06
9874:  30 84 9A     jp      z,&H9A84
9877:  77 43 21     cal     &H2143
987A:  B7 E7        jr      &H9862
987C:  D6 00 20 48  pre     ix,&H4820
9880:  44 17 06     anc     $23,&H06
9883:  B4 05        jr      nz,&H9889
9885:  D6 00 02 48  pre     ix,&H4802
9889:  37 62 9F     jp      &H9F62
988C:  02 00        ld      $0,$sx
988E:  D6 00 D1 16  pre     ix,&H16D1
9892:  A0 1F        stw     $31,(ix+$sx)
9894:  77 E8 33     cal     &H33E8
9897:  77 FD 98     cal     &H98FD
989A:  96 59        pre     iz,$25
989C:  9E 53        gre     iz,$19
989E:  82 31        ldw     $17,$sy
98A0:  D1 17 00 01  ldw     $23,&H0100
98A4:  02 3D        ld      $29,$sy
98A6:  D6 00 EF 1B  pre     ix,&H1BEF
98AA:  24 1F        std     $31,(ix+$sx)
98AC:  D1 00 C4 16  ldw     $0,&H16C4
98B0:  50 40 86     st      &H86,($sz)
98B3:  D1 02 5C 9F  ldw     $2,&H9F5C
98B7:  77 7A 29     cal     &H297A
98BA:  77 1B 03     cal     &H031B
98BD:  77 43 93     cal     &H9343
98C0:  37 6E 97     jp      &H976E
98C3:  D6 00 D1 16  pre     ix,&H16D1
98C7:  BA 00        sbcw    (ix+$sx),$0
98C9:  B1 12        jr      nc,&H98DC
98CB:  E6 03 60     phsm    $3,4
98CE:  77 FD 98     cal     &H98FD
98D1:  EE 00 60     ppsm    $0,4
98D4:  D6 00 D1 16  pre     ix,&H16D1
98D8:  BA 00        sbcw    (ix+$sx),$0
98DA:  B5 19        jr      c,&H98F4
98DC:  A8 06        ldw     $6,(ix+$sx)
98DE:  BE 00        sbw     (ix+$sx),$0
98E0:  A6 01        phsw    $1
98E2:  88 60 02     adw     $0,$2
98E5:  82 64 1B     ldw     $4,$27
98E8:  89 64 02     sbw     $4,$2
98EB:  89 64 06     sbw     $4,$6
98EE:  77 4C 01     cal     &H014C
98F1:  AE 00        ppsw    $0
98F3:  F7           rtn   
98F4:  D6 60 CF 1C  pre     us,&H1CCF
98F8:  A7 1C        phuw    $28
98FA:  37 6D 2B     jp      &H2B6D
98FD:  D6 00 CF 18  pre     ix,&H18CF
9901:  E8 00 60     ldm     $0,(ix+$sx),4
9904:  89 42        sbw     $2,$sz
9906:  F0           rtn     z
9907:  D1 00 00 01  ldw     $0,&H0100
990B:  81 42        sbcw    $2,$sz
990D:  B1 04        jr      nc,&H9912
990F:  82 60 02     ldw     $0,$2
9912:  82 62 1B     ldw     $2,$27
9915:  89 22        sbw     $2,$sy
9917:  77 B1 34     cal     &H34B1
991A:  D6 00 D1 16  pre     ix,&H16D1
991E:  BC 00        adw     (ix+$sx),$0
9920:  F7           rtn   
9921:  D6 00 D1 16  pre     ix,&H16D1
9925:  A8 06        ldw     $6,(ix+$sx)
9927:  BC 02        adw     (ix+$sx),$2
9929:  88 42        adw     $2,$sz
992B:  82 64 1B     ldw     $4,$27
992E:  89 64 02     sbw     $4,$2
9931:  89 64 06     sbw     $4,$6
9934:  37 4C 01     jp      &H014C
9937:  D6 00 C4 16  pre     ix,&H16C4
993B:  28 20        ld      $0,(ix+$sy)
993D:  44 00 0E     anc     $0,&H0E
9940:  F0           rtn     z
9941:  2C 00        ldd     $0,(ix+$sx)
9943:  44 00 80     anc     $0,&H80
9946:  F0           rtn     z
9947:  44 00 04     anc     $0,&H04
994A:  F0           rtn     z
994B:  44 00 02     anc     $0,&H02
994E:  F7           rtn   
994F:  77 37 99     cal     &H9937
9952:  F0           rtn     z
9953:  4C 00 7F     an      $0,&H7F
9956:  24 00        std     $0,(ix+$sx)
9958:  77 E8 33     cal     &H33E8
995B:  D6 00 D1 16  pre     ix,&H16D1
995F:  A8 02        ldw     $2,(ix+$sx)
9961:  82 60 1B     ldw     $0,$27
9964:  89 20        sbw     $0,$sy
9966:  89 60 02     sbw     $0,$2
9969:  37 EA 34     jp      &H34EA
996C:  9E 55        gre     iz,$21
996E:  96 53        pre     iz,$19
9970:  D1 02 60 60  ldw     $2,&H6060
9974:  82 64 11     ldw     $4,$17
9977:  D1 06 00 0A  ldw     $6,&H0A00
997B:  D1 08 0D 1A  ldw     $8,&H1A0D
997F:  D6 00 3B 11  pre     ix,&H113B
9983:  9E 40        gre     iz,$0
9985:  81 55        sbcw    $21,$sz
9987:  B4 0C        jr      nz,&H9994
9989:  09 62 03     sb      $2,$3
998C:  D1 00 01 11  ldw     $0,&H1101
9990:  10 42        st      $2,($sz)
9992:  02 26        ld      $6,$sy
9994:  2B 00        ldi     $0,(iz+$sx)
9996:  01 48        sbc     $8,$sz
9998:  B0 21        jr      z,&H99BA
999A:  01 49        sbc     $9,$sz
999C:  B0 36        jr      z,&H99D3
999E:  22 00        sti     $0,(ix+$sx)
99A0:  09 23        sb      $3,$sy
99A2:  B4 A0        jr      nz,&H9943
99A4:  96 55        pre     iz,$21
99A6:  D6 00 D3 16  pre     ix,&H16D3
99AA:  A0 04        stw     $4,(ix+$sx)
99AC:  44 18 80     anc     $24,&H80
99AF:  F4           rtn     nz
99B0:  D1 0A 00 5F  ldw     $10,&H5F00
99B4:  77 7F 97     cal     &H977F
99B7:  37 0F 93     jp      &H930F
99BA:  3B 07        sbc     (iz+$sx),$7
99BC:  B4 03        jr      nz,&H99C0
99BE:  2D 20        ldd     $0,(iz+$sy)
99C0:  01 06        sbc     $6,$sx
99C2:  B4 03        jr      nz,&H99C6
99C4:  88 24        adw     $4,$sy
99C6:  22 1F        sti     $31,(ix+$sx)
99C8:  09 23        sb      $3,$sy
99CA:  B0 A7        jr      z,&H9972
99CC:  44 03 1F     anc     $3,&H1F
99CF:  B4 8A        jr      nz,&H995A
99D1:  B7 CF        jr      &H99A1
99D3:  22 1F        sti     $31,(ix+$sx)
99D5:  09 23        sb      $3,$sy
99D7:  B4 85        jr      nz,&H995D
99D9:  B7 B6        jr      &H9990
99DB:  9E 55        gre     iz,$21
99DD:  77 57 5D     cal     &H5D57
99E0:  A6 12        phsw    $18
99E2:  D6 00 D3 16  pre     ix,&H16D3
99E6:  A8 11        ldw     $17,(ix+$sx)
99E8:  77 E3 5C     cal     &H5CE3
99EB:  AE 11        ppsw    $17
99ED:  96 55        pre     iz,$21
99EF:  37 1E 5D     jp      &H5D1E
99F2:  77 DD 7B     cal     &H7BDD
99F5:  B7 16        jr      &H9A0C
99F7:  77 A7 21     cal     &H21A7
99FA:  B7 11        jr      &H9A0C
99FC:  77 AA 21     cal     &H21AA
99FF:  B7 0C        jr      &H9A0C
9A01:  77 54 23     cal     &H2354
9A04:  B7 07        jr      &H9A0C
9A06:  77 F2 22     cal     &H22F2
9A09:  77 DB 2A     cal     &H2ADB
9A0C:  37 14 98     jp      &H9814
9A0F:  9E 55        gre     iz,$21
9A11:  77 4A 0B     cal     &H0B4A
9A14:  D6 00 D3 18  pre     ix,&H18D3
9A18:  42 00 FF     ld      $0,&HFF
9A1B:  2B 01        ldi     $1,(iz+$sx)
9A1D:  41 01 0D     sbc     $1,&H0D
9A20:  B0 10        jr      z,&H9A31
9A22:  41 01 1A     sbc     $1,&H1A
9A25:  B0 0B        jr      z,&H9A31
9A27:  22 01        sti     $1,(ix+$sx)
9A29:  09 20        sb      $0,$sy
9A2B:  B4 91        jr      nz,&H99BD
9A2D:  24 1F        std     $31,(ix+$sx)
9A2F:  B7 05        jr      &H9A35
9A31:  2D A1        ldd     $1,(iz-$sy)
9A33:  24 1F        std     $31,(ix+$sx)
9A35:  9E 40        gre     iz,$0
9A37:  81 55        sbcw    $21,$sz
9A39:  31 11 9C     jp      nc,&H9C11
9A3C:  37 6E 9B     jp      &H9B6E
9A3F:  F7           rtn   
9A40:  D1 00 D3 18  ldw     $0,&H18D3
9A44:  96 00        pre     ix,$0
9A46:  D6 20 D4 19  pre     iy,&H19D4
9A4A:  DC 1F        sup     $31
9A4C:  9E 0D        gre     ix,$13
9A4E:  89 4D        sbw     $13,$sz
9A50:  B0 C5        jr      z,&H9A16
9A52:  B7 62        jr      &H9AB5
9A54:  77 61 9A     cal     &H9A61
9A57:  B7 5D        jr      &H9AB5
9A59:  77 5E 9A     cal     &H9A5E
9A5C:  B7 58        jr      &H9AB5
9A5E:  02 80 03     ld      $0,$sx,jr &H9A63
9A61:  02 20        ld      $0,$sy
9A63:  26 1B        phs     $27
9A65:  E6 16 A0     phsm    $22,6
9A68:  77 CC 21     cal     &H21CC
9A6B:  77 A7 13     cal     &H13A7
9A6E:  82 60 0F     ldw     $0,$15
9A71:  02 6D 11     ld      $13,$17
9A74:  02 0E        ld      $14,$sx
9A76:  EE 11 A0     ppsm    $17,6
9A79:  2E 1B        pps     $27
9A7B:  F7           rtn   
9A7C:  18 6E        biu     $14
9A7E:  F1           rtn     nc
9A7F:  22 00        sti     $0,(ix+$sx)
9A81:  08 2D        ad      $13,$sy
9A83:  F7           rtn   
9A84:  77 7F 21     cal     &H217F
9A87:  D6 00 5E 16  pre     ix,&H165E
9A8B:  02 0D        ld      $13,$sx
9A8D:  2B 00        ldi     $0,(iz+$sx)
9A8F:  44 00 80     anc     $0,&H80
9A92:  B4 06        jr      nz,&H9A99
9A94:  22 00        sti     $0,(ix+$sx)
9A96:  08 AD 8B     ad      $13,$sy,jr &H9A23
9A99:  4C 00 7F     an      $0,&H7F
9A9C:  77 7F 9A     cal     &H9A7F
9A9F:  42 00 28     ld      $0,&H28
9AA2:  77 7C 9A     cal     &H9A7C
9AA5:  42 00 20     ld      $0,&H20
9AA8:  77 7C 9A     cal     &H9A7C
9AAB:  96 4B        pre     iz,$11
9AAD:  16 6A        pst     ua,$10
9AAF:  D1 00 5E 16  ldw     $0,&H165E
9AB3:  02 0E        ld      $14,$sx
9AB5:  04 38        anc     $24,$sy
9AB7:  B4 19        jr      nz,&H9AD1
9AB9:  D1 02 1A 0D  ldw     $2,&H0D1A
9ABD:  3B 02        sbc     (iz+$sx),$2
9ABF:  B0 11        jr      z,&H9AD1
9AC1:  3B 03        sbc     (iz+$sx),$3
9AC3:  B0 0D        jr      z,&H9AD1
9AC5:  11 44        ld      $4,($sz)
9AC7:  88 20        adw     $0,$sy
9AC9:  23 04        sti     $4,(iz+$sx)
9ACB:  89 2D        sbw     $13,$sy
9ACD:  B4 91        jr      nz,&H9A5F
9ACF:  B7 1A        jr      &H9AEA
9AD1:  A6 01        phsw    $1
9AD3:  82 60 0D     ldw     $0,$13
9AD6:  9E 42        gre     iz,$2
9AD8:  77 C3 98     cal     &H98C3
9ADB:  AE 02        ppsw    $2
9ADD:  82 44        ldw     $4,$sz
9ADF:  82 46        ldw     $6,$sz
9AE1:  9E 40        gre     iz,$0
9AE3:  88 46        adw     $6,$sz
9AE5:  96 46        pre     iz,$6
9AE7:  77 F9 00     cal     &H00F9
9AEA:  37 6E 9B     jp      &H9B6E
9AED:  04 38        anc     $24,$sy
9AEF:  B0 1D        jr      z,&H9B0D
9AF1:  82 20        ldw     $0,$sy
9AF3:  41 10 0D     sbc     $16,&H0D
9AF6:  B4 03        jr      nz,&H9AFA
9AF8:  08 20        ad      $0,$sy
9AFA:  9E 42        gre     iz,$2
9AFC:  77 C3 98     cal     &H98C3
9AFF:  23 10        sti     $16,(iz+$sx)
9B01:  41 10 0D     sbc     $16,&H0D
9B04:  B4 69        jr      nz,&H9B6E
9B06:  42 10 0A     ld      $16,&H0A
9B09:  23 10        sti     $16,(iz+$sx)
9B0B:  B7 62        jr      &H9B6E
9B0D:  41 10 0D     sbc     $16,&H0D
9B10:  B0 A0        jr      z,&H9AB1
9B12:  D1 00 0D 1A  ldw     $0,&H1A0D
9B16:  3B 00        sbc     (iz+$sx),$0
9B18:  B0 A8        jr      z,&H9AC1
9B1A:  3B 01        sbc     (iz+$sx),$1
9B1C:  B0 AC        jr      z,&H9AC9
9B1E:  B7 A0        jr      &H9ABF
9B20:  4E 18 80     or      $24,&H80
9B23:  42 00 1A     ld      $0,&H1A
9B26:  3B 00        sbc     (iz+$sx),$0
9B28:  30 14 98     jp      z,&H9814
9B2B:  2D 20        ldd     $0,(iz+$sy)
9B2D:  D1 01 0D 0A  ldw     $1,&H0A0D
9B31:  BB A1        sbcw    (iz-$sy),$1
9B33:  B4 37        jr      nz,&H9B6B
9B35:  2D 20        ldd     $0,(iz+$sy)
9B37:  B7 33        jr      &H9B6B
9B39:  77 56 0B     cal     &H0B56
9B3C:  01 02        sbc     $2,$sx
9B3E:  B0 86        jr      z,&H9AC5
9B40:  B7 2D        jr      &H9B6E
9B42:  42 00 20     ld      $0,&H20
9B45:  09 60 02     sb      $0,$2
9B48:  D6 00 01 11  pre     ix,&H1101
9B4C:  2C 02        ldd     $2,(ix+$sx)
9B4E:  4C 02 1F     an      $2,&H1F
9B51:  F7           rtn   
9B52:  9E 55        gre     iz,$21
9B54:  4E 18 80     or      $24,&H80
9B57:  77 56 0B     cal     &H0B56
9B5A:  B5 5E        jr      c,&H9BB9
9B5C:  01 02        sbc     $2,$sx
9B5E:  B0 0C        jr      z,&H9B6B
9B60:  77 42 9B     cal     &H9B42
9B63:  08 60 02     ad      $0,$2
9B66:  41 00 20     sbc     $0,&H20
9B69:  B5 75        jr      c,&H9BDF
9B6B:  77 97 03     cal     &H0397
9B6E:  9E 55        gre     iz,$21
9B70:  96 53        pre     iz,$19
9B72:  42 01 5F     ld      $1,&H5F
9B75:  2B 00        ldi     $0,(iz+$sx)
9B77:  41 00 1A     sbc     $0,&H1A
9B7A:  B0 39        jr      z,&H9BB4
9B7C:  41 00 0D     sbc     $0,&H0D
9B7F:  B4 0D        jr      nz,&H9B8D
9B81:  4C 01 E0     an      $1,&HE0
9B84:  42 00 0A     ld      $0,&H0A
9B87:  3B 00        sbc     (iz+$sx),$0
9B89:  B4 03        jr      nz,&H9B8D
9B8B:  2D 20        ldd     $0,(iz+$sy)
9B8D:  09 21        sb      $1,$sy
9B8F:  B1 9B        jr      nc,&H9B2B
9B91:  9E 40        gre     iz,$0
9B93:  81 55        sbcw    $21,$sz
9B95:  B5 1E        jr      c,&H9BB4
9B97:  4C 18 7F     an      $24,&H7F
9B9A:  96 53        pre     iz,$19
9B9C:  77 56 0B     cal     &H0B56
9B9F:  9E 53        gre     iz,$19
9BA1:  96 55        pre     iz,$21
9BA3:  B1 B6        jr      nc,&H9B5A
9BA5:  88 31        adw     $17,$sy
9BA7:  88 33        adw     $19,$sy
9BA9:  11 61 13     ld      $1,($19)
9BAC:  41 01 0A     sbc     $1,&H0A
9BAF:  B4 C2        jr      nz,&H9B72
9BB1:  88 B3 C5     adw     $19,$sy,jr &H9B78
9BB4:  96 55        pre     iz,$21
9BB6:  37 0E 98     jp      &H980E
9BB9:  2D 20        ldd     $0,(iz+$sy)
9BBB:  41 00 0A     sbc     $0,&H0A
9BBE:  B4 03        jr      nz,&H9BC2
9BC0:  2D 20        ldd     $0,(iz+$sy)
9BC2:  77 42 9B     cal     &H9B42
9BC5:  B0 DB        jr      z,&H9BA1
9BC7:  08 60 02     ad      $0,$2
9BCA:  41 00 20     sbc     $0,&H20
9BCD:  B1 06        jr      nc,&H9BD4
9BCF:  77 58 0B     cal     &H0B58
9BD2:  B7 E8        jr      &H9BBB
9BD4:  2D A0        ldd     $0,(iz-$sy)
9BD6:  41 00 0A     sbc     $0,&H0A
9BD9:  B4 EF        jr      nz,&H9BC9
9BDB:  2D A0        ldd     $0,(iz-$sy)
9BDD:  B7 8C        jr      &H9B6A
9BDF:  96 55        pre     iz,$21
9BE1:  37 14 98     jp      &H9814
9BE4:  4E 18 80     or      $24,&H80
9BE7:  9E 40        gre     iz,$0
9BE9:  81 59        sbcw    $25,$sz
9BEB:  B0 8B        jr      z,&H9B77
9BED:  2D A0        ldd     $0,(iz-$sy)
9BEF:  D1 00 0D 0A  ldw     $0,&H0A0D
9BF3:  BB A0        sbcw    (iz-$sy),$0
9BF5:  B4 18        jr      nz,&H9C0E
9BF7:  2D A0        ldd     $0,(iz-$sy)
9BF9:  B7 14        jr      &H9C0E
9BFB:  77 4A 0B     cal     &H0B4A
9BFE:  B7 12        jr      &H9C11
9C00:  4E 18 80     or      $24,&H80
9C03:  9E 55        gre     iz,$21
9C05:  77 64 0B     cal     &H0B64
9C08:  B5 33        jr      c,&H9C3C
9C0A:  01 02        sbc     $2,$sx
9C0C:  B4 AE        jr      nz,&H9BBB
9C0E:  77 97 03     cal     &H0397
9C11:  9E 55        gre     iz,$21
9C13:  81 75 13     sbcw    $21,$19
9C16:  B1 E1        jr      nc,&H9BF8
9C18:  4C 18 7F     an      $24,&H7F
9C1B:  96 53        pre     iz,$19
9C1D:  77 64 0B     cal     &H0B64
9C20:  B1 16        jr      nc,&H9C37
9C22:  89 31        sbw     $17,$sy
9C24:  9E 4A        gre     iz,$10
9C26:  77 64 0B     cal     &H0B64
9C29:  01 02        sbc     $2,$sx
9C2B:  B0 86        jr      z,&H9BB2
9C2D:  42 00 20     ld      $0,&H20
9C30:  09 60 02     sb      $0,$2
9C33:  96 4A        pre     iz,$10
9C35:  2D C0        ldd     $0,(iz-$sz)
9C37:  9E 53        gre     iz,$19
9C39:  96 D5 AA     pre     iz,$21,jr &H9BE5
9C3C:  9E 4A        gre     iz,$10
9C3E:  77 64 0B     cal     &H0B64
9C41:  01 02        sbc     $2,$sx
9C43:  B0 86        jr      z,&H9BCA
9C45:  42 00 20     ld      $0,&H20
9C48:  09 60 02     sb      $0,$2
9C4B:  D6 00 01 11  pre     ix,&H1101
9C4F:  2C 02        ldd     $2,(ix+$sx)
9C51:  4C 02 1F     an      $2,&H1F
9C54:  09 60 02     sb      $0,$2
9C57:  96 4A        pre     iz,$10
9C59:  B5 CC        jr      c,&H9C26
9C5B:  2D C0        ldd     $0,(iz-$sz)
9C5D:  B7 D0        jr      &H9C2E
9C5F:  42 00 1A     ld      $0,&H1A
9C62:  3B 00        sbc     (iz+$sx),$0
9C64:  B0 16        jr      z,&H9C7B
9C66:  D1 00 0D 0A  ldw     $0,&H0A0D
9C6A:  BB 00        sbcw    (iz+$sx),$0
9C6C:  B0 07        jr      z,&H9C74
9C6E:  77 C3 9C     cal     &H9CC3
9C71:  37 0E 98     jp      &H980E
9C74:  77 C6 9C     cal     &H9CC6
9C77:  B7 87        jr      &H9BFF
9C79:  0F 38        xr      $24,$sy
9C7B:  37 14 98     jp      &H9814
9C7E:  9E 40        gre     iz,$0
9C80:  81 59        sbcw    $25,$sz
9C82:  B0 88        jr      z,&H9C0B
9C84:  2D A0        ldd     $0,(iz-$sy)
9C86:  D1 01 0D 0A  ldw     $1,&H0A0D
9C8A:  BB A1        sbcw    (iz-$sy),$1
9C8C:  B4 2F        jr      nz,&H9CBC
9C8E:  2D A0        ldd     $0,(iz-$sy)
9C90:  26 00        phs     $0
9C92:  77 C6 9C     cal     &H9CC6
9C95:  2E 00        pps     $0
9C97:  9E 55        gre     iz,$21
9C99:  81 75 13     sbcw    $21,$19
9C9C:  31 11 9C     jp      nc,&H9C11
9C9F:  41 00 0D     sbc     $0,&H0D
9CA2:  B4 03        jr      nz,&H9CA6
9CA4:  89 31        sbw     $17,$sy
9CA6:  77 64 0B     cal     &H0B64
9CA9:  01 02        sbc     $2,$sx
9CAB:  B0 86        jr      z,&H9C32
9CAD:  42 00 20     ld      $0,&H20
9CB0:  09 60 02     sb      $0,$2
9CB3:  96 55        pre     iz,$21
9CB5:  2D C0        ldd     $0,(iz-$sz)
9CB7:  9E 53        gre     iz,$19
9CB9:  96 D5 CA     pre     iz,$21,jr &H9C85
9CBC:  26 00        phs     $0
9CBE:  77 C3 9C     cal     &H9CC3
9CC1:  B7 AD        jr      &H9C6F
9CC3:  82 A2 05     ldw     $2,$sy,jr &H9CCA
9CC6:  D1 02 02 00  ldw     $2,&H0002
9CCA:  9E 40        gre     iz,$0
9CCC:  77 21 99     cal     &H9921
9CCF:  37 97 03     jp      &H0397
9CD2:  82 31        ldw     $17,$sy
9CD4:  82 73 19     ldw     $19,$25
9CD7:  96 59        pre     iz,$25
9CD9:  37 0E 98     jp      &H980E
9CDC:  77 3B 29     cal     &H293B
9CDF:  D1 00 01 11  ldw     $0,&H1101
9CE3:  11 41        ld      $1,($sz)
9CE5:  42 00 07     ld      $0,&H07
9CE8:  B0 04        jr      z,&H9CED
9CEA:  42 00 03     ld      $0,&H03
9CED:  0C 41        an      $1,$sz
9CEF:  09 60 01     sb      $0,$1
9CF2:  08 20        ad      $0,$sy
9CF4:  01 00        sbc     $0,$sx
9CF6:  B0 FC        jr      z,&H9CF3
9CF8:  D6 00 5E 16  pre     ix,&H165E
9CFC:  D1 0D 00 20  ldw     $13,&H2000
9D00:  22 0E        sti     $14,(ix+$sx)
9D02:  08 2D        ad      $13,$sy
9D04:  09 20        sb      $0,$sy
9D06:  B4 87        jr      nz,&H9C8E
9D08:  37 AF 9A     jp      &H9AAF
9D0B:  77 4A 0B     cal     &H0B4A
9D0E:  9E 40        gre     iz,$0
9D10:  82 55        ldw     $21,$sz
9D12:  81 53        sbcw    $19,$sz
9D14:  B5 03        jr      c,&H9D18
9D16:  82 53        ldw     $19,$sz
9D18:  77 44 0B     cal     &H0B44
9D1B:  82 60 15     ldw     $0,$21
9D1E:  9E 42        gre     iz,$2
9D20:  89 42        sbw     $2,$sz
9D22:  77 21 99     cal     &H9921
9D25:  96 55        pre     iz,$21
9D27:  37 0E 98     jp      &H980E
9D2A:  77 6E 97     cal     &H976E
9D2D:  4C 17 F9     an      $23,&HF9
9D30:  96 53        pre     iz,$19
9D32:  77 56 0B     cal     &H0B56
9D35:  B1 0F        jr      nc,&H9D45
9D37:  2D 20        ldd     $0,(iz+$sy)
9D39:  41 00 0A     sbc     $0,&H0A
9D3C:  B4 03        jr      nz,&H9D40
9D3E:  2D 20        ldd     $0,(iz+$sy)
9D40:  88 31        adw     $17,$sy
9D42:  9E D3 92     gre     iz,$19,jr &H9CD6
9D45:  01 02        sbc     $2,$sx
9D47:  B0 86        jr      z,&H9CCE
9D49:  37 0E 98     jp      &H980E
9D4C:  4C 17 F9     an      $23,&HF9
9D4F:  4E 97 04 07  or      $23,&H04,jr &H9D59
9D53:  4C 17 F9     an      $23,&HF9
9D56:  4E 17 02     or      $23,&H02
9D59:  77 5F 9D     cal     &H9D5F
9D5C:  37 14 98     jp      &H9814
9D5F:  77 57 5D     cal     &H5D57
9D62:  A6 12        phsw    $18
9D64:  D6 00 D3 16  pre     ix,&H16D3
9D68:  A8 11        ldw     $17,(ix+$sx)
9D6A:  77 E3 5C     cal     &H5CE3
9D6D:  D6 00 52 38  pre     ix,&H3852
9D71:  D1 04 08 00  ldw     $4,&H0008
9D75:  D1 06 67 77  ldw     $6,&H7767
9D79:  44 17 02     anc     $23,&H02
9D7C:  B4 0B        jr      nz,&H9D88
9D7E:  6C 08 08     ldd     $8,(ix+&H08)
9D81:  D1 04 05 00  ldw     $4,&H0005
9D85:  42 06 65     ld      $6,&H65
9D88:  9E 02        gre     ix,$2
9D8A:  D1 00 1C 15  ldw     $0,&H151C
9D8E:  A6 07        phsw    $7
9D90:  77 BB 0E     cal     &H0EBB
9D93:  AE 06        ppsw    $6
9D95:  AE 11        ppsw    $17
9D97:  D6 00 00 11  pre     ix,&H1100
9D9B:  E8 00 A0     ldm     $0,(ix+$sx),6
9D9E:  4E 00 0A     or      $0,&H0A
9DA1:  02 61 06     ld      $1,$6
9DA4:  02 02        ld      $2,$sx
9DA6:  E2 00 E0     stim    $0,(ix+$sx),8
9DA9:  77 9C 02     cal     &H029C
9DAC:  77 74 97     cal     &H9774
9DAF:  D1 00 9B 11  ldw     $0,&H119B
9DB3:  D1 02 1C 15  ldw     $2,&H151C
9DB7:  D1 04 20 00  ldw     $4,&H0020
9DBB:  77 4C 01     cal     &H014C
9DBE:  D1 0A 00 7F  ldw     $10,&H7F00
9DC2:  77 7F 97     cal     &H977F
9DC5:  37 0F 93     jp      &H930F
9DC8:  77 23 03     cal     &H0323
9DCB:  77 6E 97     cal     &H976E
9DCE:  9E 55        gre     iz,$21
9DD0:  77 5E 97     cal     &H975E
9DD3:  77 3C 00     cal     &H003C
9DD6:  B5 24        jr      c,&H9DFB
9DD8:  44 17 02     anc     $23,&H02
9DDB:  34 60 9E     jp      nz,&H9E60
9DDE:  4C 17 FB     an      $23,&HFB
9DE1:  77 1D 9E     cal     &H9E1D
9DE4:  96 59        pre     iz,$25
9DE6:  82 28        ldw     $8,$sy
9DE8:  77 0C 9E     cal     &H9E0C
9DEB:  42 00 1A     ld      $0,&H1A
9DEE:  3B 00        sbc     (iz+$sx),$0
9DF0:  30 6E 9B     jp      z,&H9B6E
9DF3:  82 71 08     ldw     $17,$8
9DF6:  9E 53        gre     iz,$19
9DF8:  37 0E 98     jp      &H980E
9DFB:  44 17 02     anc     $23,&H02
9DFE:  B0 07        jr      z,&H9E06
9E00:  D6 00 EF 1B  pre     ix,&H1BEF
9E04:  24 1F        std     $31,(ix+$sx)
9E06:  4C 17 F9     an      $23,&HF9
9E09:  96 D5 93     pre     iz,$21,jr &H9D9E
9E0C:  81 24        sbcw    $4,$sy
9E0E:  B1 03        jr      nc,&H9E12
9E10:  82 24        ldw     $4,$sy
9E12:  81 64 08     sbcw    $4,$8
9E15:  F0           rtn     z
9E16:  77 44 0B     cal     &H0B44
9E19:  F1           rtn     nc
9E1A:  88 A8 8A     adw     $8,$sy,jr &H9DA6
9E1D:  89 64 04     sbw     $4,$4
9E20:  A6 12        phsw    $18
9E22:  77 29 00     cal     &H0029
9E25:  B1 07        jr      nc,&H9E2D
9E27:  77 11 1F     cal     &H1F11
9E2A:  82 64 11     ldw     $4,$17
9E2D:  AE 11        ppsw    $17
9E2F:  37 93 00     jp      &H0093
9E32:  D6 00 DF 1B  pre     ix,&H1BDF
9E36:  EB 00 E0     ldim    $0,(iz+$sx),8
9E39:  E2 00 E0     stim    $0,(ix+$sx),8
9E3C:  E6 07 E0     phsm    $7,8
9E3F:  E9 00 E0     ldm     $0,(iz+$sx),8
9E42:  E2 00 E0     stim    $0,(ix+$sx),8
9E45:  EE 00 E0     ppsm    $0,8
9E48:  6D 88 08     ldd     $8,(iz-&H08)
9E4B:  D1 08 00 10  ldw     $8,&H1000
9E4F:  2B 0A        ldi     $10,(iz+$sx)
9E51:  01 0A        sbc     $10,$sx
9E53:  B0 07        jr      z,&H9E5B
9E55:  08 28        ad      $8,$sy
9E57:  09 29        sb      $9,$sy
9E59:  B4 8B        jr      nz,&H9DE5
9E5B:  24 08        std     $8,(ix+$sx)
9E5D:  F7           rtn   
9E5E:  9E 55        gre     iz,$21
9E60:  D6 00 D3 16  pre     ix,&H16D3
9E64:  A8 00        ldw     $0,(ix+$sx)
9E66:  D6 00 F0 1B  pre     ix,&H1BF0
9E6A:  28 A8        ld      $8,(ix-$sy)
9E6C:  A2 00        stiw    $0,(ix+$sx)
9E6E:  A0 15        stw     $21,(ix+$sx)
9E70:  D6 00 DF 1B  pre     ix,&H1BDF
9E74:  E8 00 E0     ldm     $0,(ix+$sx),8
9E77:  44 17 02     anc     $23,&H02
9E7A:  74 32 9E     cal     nz,&H9E32
9E7D:  96 55        pre     iz,$21
9E7F:  4C 17 FD     an      $23,&HFD
9E82:  01 08        sbc     $8,$sx
9E84:  B0 38        jr      z,&H9EBD
9E86:  42 09 1A     ld      $9,&H1A
9E89:  3B 09        sbc     (iz+$sx),$9
9E8B:  B0 31        jr      z,&H9EBD
9E8D:  2D 29        ldd     $9,(iz+$sy)
9E8F:  42 09 0D     ld      $9,&H0D
9E92:  3B A9        sbc     (iz-$sy),$9
9E94:  B4 10        jr      nz,&H9EA5
9E96:  42 09 0A     ld      $9,&H0A
9E99:  3B 09        sbc     (iz+$sx),$9
9E9B:  B4 03        jr      nz,&H9E9F
9E9D:  2D 29        ldd     $9,(iz+$sy)
9E9F:  D6 00 F0 1B  pre     ix,&H1BF0
9EA3:  BC 1E        adw     (ix+$sx),$30
9EA5:  2B 09        ldi     $9,(iz+$sx)
9EA7:  01 49        sbc     $9,$sz
9EA9:  B0 21        jr      z,&H9ECB
9EAB:  41 09 0D     sbc     $9,&H0D
9EAE:  B0 11        jr      z,&H9EC0
9EB0:  41 09 1A     sbc     $9,&H1A
9EB3:  B4 8F        jr      nz,&H9E43
9EB5:  D6 00 F2 1B  pre     ix,&H1BF2
9EB9:  A8 15        ldw     $21,(ix+$sx)
9EBB:  96 55        pre     iz,$21
9EBD:  37 0E 98     jp      &H980E
9EC0:  E6 03 60     phsm    $3,4
9EC3:  77 C5 29     cal     &H29C5
9EC6:  EE 00 60     ppsm    $0,4
9EC9:  B7 B4        jr      &H9E7E
9ECB:  26 08        phs     $8
9ECD:  E9 0A C0     ldm     $10,(iz+$sx),7
9ED0:  77 25 9F     cal     &H9F25
9ED3:  2E 08        pps     $8
9ED5:  B4 B1        jr      nz,&H9E87
9ED7:  41 08 09     sbc     $8,&H09
9EDA:  B5 28        jr      c,&H9F03
9EDC:  9E 55        gre     iz,$21
9EDE:  A6 16        phsw    $22
9EE0:  6B 09 07     ldi     $9,(iz+&H07)
9EE3:  26 08        phs     $8
9EE5:  49 08 08     sb      $8,&H08
9EE8:  E6 07 E0     phsm    $7,8
9EEB:  D6 00 E7 1B  pre     ix,&H1BE7
9EEF:  E8 00 E0     ldm     $0,(ix+$sx),8
9EF2:  E9 0A C0     ldm     $10,(iz+$sx),7
9EF5:  77 25 9F     cal     &H9F25
9EF8:  EE 00 E0     ppsm    $0,8
9EFB:  2E 08        pps     $8
9EFD:  AE 15        ppsw    $21
9EFF:  96 55        pre     iz,$21
9F01:  B4 DD        jr      nz,&H9EDF
9F03:  2D A9        ldd     $9,(iz-$sy)
9F05:  D6 00 F0 1B  pre     ix,&H1BF0
9F09:  A8 15        ldw     $21,(ix+$sx)
9F0B:  D6 00 D3 16  pre     ix,&H16D3
9F0F:  A0 15        stw     $21,(ix+$sx)
9F11:  81 75 11     sbcw    $21,$17
9F14:  B0 0D        jr      z,&H9F22
9F16:  82 71 15     ldw     $17,$21
9F19:  9E 55        gre     iz,$21
9F1B:  77 4A 0B     cal     &H0B4A
9F1E:  9E 53        gre     iz,$19
9F20:  96 55        pre     iz,$21
9F22:  37 6E 9B     jp      &H9B6E
9F25:  49 08 02     sb      $8,&H02
9F28:  B5 19        jr      c,&H9F42
9F2A:  B0 1A        jr      z,&H9F45
9F2C:  49 08 02     sb      $8,&H02
9F2F:  B5 18        jr      c,&H9F48
9F31:  B0 1A        jr      z,&H9F4C
9F33:  49 08 02     sb      $8,&H02
9F36:  B5 19        jr      c,&H9F50
9F38:  B0 1B        jr      z,&H9F54
9F3A:  09 28        sb      $8,$sy
9F3C:  B0 1B        jr      z,&H9F58
9F3E:  C7 49 E0     xrcm    $9,$sz,8
9F41:  F7           rtn   
9F42:  01 C9 83     sbc     $9,$sz,jr &H9EC7
9F45:  81 C9 86     sbcw    $9,$sz,jr &H9ECD
9F48:  C7 C9 40 8A  xrcm    $9,$sz,3,jr &H9ED5
9F4C:  C7 C9 60 8E  xrcm    $9,$sz,4,jr &H9EDD
9F50:  C7 C9 80 92  xrcm    $9,$sz,5,jr &H9EE5
9F54:  C7 C9 A0 96  xrcm    $9,$sz,6,jr &H9EED
9F58:  C7 C9 C0 9A  xrcm    $9,$sz,7,jr &H9EF5
9F5C:  77 91 29     cal     &H2991
9F5F:  37 46 24     jp      &H2446
9F62:  1E 63        gst     ua,$3
9F64:  56 60 24     pst     ua,&H24
9F67:  37 69 01     jp      &H0169
9F6A:  77 88 85     cal     &H8588
9F6D:  56 60 14     pst     ua,&H14
9F70:  F7           rtn   
9F71:  77 88 85     cal     &H8588
9F74:  56 60 94     pst     ua,&H94
9F77:  F7           rtn   
9F78:  1E 6E        gst     ua,$14
9F7A:  56 60 64     pst     ua,&H64
9F7D:  37 B9 97     jp      &H97B9
9F80:  D6 00 00 11  pre     ix,&H1100
9F84:  26 10        phs     $16
9F86:  68 10 04     ld      $16,(ix+&H04)
9F89:  20 30        st      $16,(ix+$sy)
9F8B:  42 10 0D     ld      $16,&H0D
9F8E:  77 E2 93     cal     &H93E2
9F91:  2E 10        pps     $16
9F93:  F7           rtn   
9F94:  D6 00 C4 16  pre     ix,&H16C4
9F98:  42 00 40     ld      $0,&H40
9F9B:  20 00        st      $0,(ix+$sx)
9F9D:  D1 02 F4 A6  ldw     $2,&HA6F4
9FA1:  77 7A 29     cal     &H297A
9FA4:  D6 00 3E 20  pre     ix,&H203E
9FA8:  20 1F        st      $31,(ix+$sx)
9FAA:  F7           rtn   
9FAB:  D6 00 F3 1C  pre     ix,&H1CF3
9FAF:  20 1F        st      $31,(ix+$sx)
9FB1:  D6 00 F0 1C  pre     ix,&H1CF0
9FB5:  20 1F        st      $31,(ix+$sx)
9FB7:  D6 00 F1 1C  pre     ix,&H1CF1
9FBB:  20 1F        st      $31,(ix+$sx)
9FBD:  D6 00 F2 1C  pre     ix,&H1CF2
9FC1:  20 1F        st      $31,(ix+$sx)
9FC3:  F7           rtn   
9FC4:  D6 00 E8 1C  pre     ix,&H1CE8
9FC8:  20 1F        st      $31,(ix+$sx)
9FCA:  D6 00 CF 18  pre     ix,&H18CF
9FCE:  A8 00        ldw     $0,(ix+$sx)
9FD0:  D6 00 D0 1C  pre     ix,&H1CD0
9FD4:  A2 00        stiw    $0,(ix+$sx)
9FD6:  A2 00        stiw    $0,(ix+$sx)
9FD8:  D6 00 D1 18  pre     ix,&H18D1
9FDC:  A8 02        ldw     $2,(ix+$sx)
9FDE:  D6 00 E4 1C  pre     ix,&H1CE4
9FE2:  A2 02        stiw    $2,(ix+$sx)
9FE4:  A0 02        stw     $2,(ix+$sx)
9FE6:  89 42        sbw     $2,$sz
9FE8:  98 43        bidw    $3
9FEA:  D1 04 00 04  ldw     $4,&H0400
9FEE:  81 62 04     sbcw    $2,$4
9FF1:  B5 2A        jr      c,&HA01C
9FF3:  A6 01        phsw    $1
9FF5:  88 60 02     adw     $0,$2
9FF8:  D6 00 DC 1C  pre     ix,&H1CDC
9FFC:  77 13 A0     cal     &HA013
9FFF:  AE 00        ppsw    $0
A001:  98 43        bidw    $3
A003:  D1 04 00 02  ldw     $4,&H0200
A007:  81 62 04     sbcw    $2,$4
A00A:  B5 11        jr      c,&HA01C
A00C:  88 60 02     adw     $0,$2
A00F:  D6 00 D4 1C  pre     ix,&H1CD4
A013:  A2 00        stiw    $0,(ix+$sx)
A015:  A2 00        stiw    $0,(ix+$sx)
A017:  A2 00        stiw    $0,(ix+$sx)
A019:  A0 00        stw     $0,(ix+$sx)
A01B:  F7           rtn   
A01C:  D6 00 E8 1C  pre     ix,&H1CE8
A020:  20 1E        st      $30,(ix+$sx)
A022:  D6 00 12 1D  pre     ix,&H1D12
A026:  02 00        ld      $0,$sx
A028:  A0 1F        stw     $31,(ix+$sx)
A02A:  37 E5 FC     jp      &HFCE5
A02D:  77 AB 9F     cal     &H9FAB
A030:  D6 00 8C 16  pre     ix,&H168C
A034:  28 01        ld      $1,(ix+$sx)
A036:  4C 01 0F     an      $1,&H0F
A039:  4E 01 30     or      $1,&H30
A03C:  42 00 46     ld      $0,&H46
A03F:  02 02        ld      $2,$sx
A041:  D6 00 F9 1C  pre     ix,&H1CF9
A045:  E0 00 40     stm     $0,(ix+$sx),3
A048:  D1 0F 91 38  ldw     $15,&H3891
A04C:  77 78 9F     cal     &H9F78
A04F:  D1 0F F9 1C  ldw     $15,&H1CF9
A053:  42 11 02     ld      $17,&H02
A056:  77 D5 97     cal     &H97D5
A059:  77 E8 2A     cal     &H2AE8
A05C:  77 A9 A0     cal     &HA0A9
A05F:  77 C4 9F     cal     &H9FC4
A062:  77 0C A9     cal     &HA90C
A065:  77 21 A9     cal     &HA921
A068:  77 36 A9     cal     &HA936
A06B:  77 7B A8     cal     &HA87B
A06E:  F7           rtn   
A06F:  77 AB 9F     cal     &H9FAB
A072:  D6 00 F7 1C  pre     ix,&H1CF7
A076:  02 00        ld      $0,$sx
A078:  A0 1F        stw     $31,(ix+$sx)
A07A:  D6 00 F5 1C  pre     ix,&H1CF5
A07E:  A0 1F        stw     $31,(ix+$sx)
A080:  F7           rtn   
A081:  D1 00 00 01  ldw     $0,&H0100
A085:  D1 02 80 00  ldw     $2,&H0080
A089:  D6 00 42 20  pre     ix,&H2042
A08D:  E2 00 60     stim    $0,(ix+$sx),4
A090:  42 01 02     ld      $1,&H02
A093:  01 12        sbc     $18,$sx
A095:  B0 04        jr      z,&HA09A
A097:  42 03 02     ld      $3,&H02
A09A:  E2 00 60     stim    $0,(ix+$sx),4
A09D:  02 03        ld      $3,$sx
A09F:  E2 00 60     stim    $0,(ix+$sx),4
A0A2:  42 03 02     ld      $3,&H02
A0A5:  E2 00 60     stim    $0,(ix+$sx),4
A0A8:  F7           rtn   
A0A9:  D6 00 8C 16  pre     ix,&H168C
A0AD:  28 00        ld      $0,(ix+$sx)
A0AF:  18 60        biu     $0
A0B1:  D6 00 BB 18  pre     ix,&H18BB
A0B5:  A8 42        ldw     $2,(ix+$sz)
A0B7:  D6 00 BD 18  pre     ix,&H18BD
A0BB:  A8 44        ldw     $4,(ix+$sz)
A0BD:  82 66 02     ldw     $6,$2
A0C0:  D6 00 E9 1C  pre     ix,&H1CE9
A0C4:  E0 02 A0     stm     $2,(ix+$sx),6
A0C7:  F7           rtn   
A0C8:  77 29 52     cal     &H5229
A0CB:  D1 00 00 05  ldw     $0,&H0500
A0CF:  81 4F        sbcw    $15,$sz
A0D1:  F1           rtn     nc
A0D2:  77 6E 24     cal     &H246E
A0D5:  77 65 24     cal     &H2465
A0D8:  37 6D 2B     jp      &H2B6D
A0DB:  77 C8 A0     cal     &HA0C8
A0DE:  77 16 54     cal     &H5416
A0E1:  D1 00 D7 1B  ldw     $0,&H1BD7
A0E5:  97 00        pre     ss,$0
A0E7:  D6 00 2A 20  pre     ix,&H202A
A0EB:  A0 00        stw     $0,(ix+$sx)
A0ED:  9E 60        gre     us,$0
A0EF:  D6 00 2C 20  pre     ix,&H202C
A0F3:  A0 00        stw     $0,(ix+$sx)
A0F5:  77 71 27     cal     &H2771
A0F8:  77 94 9F     cal     &H9F94
A0FB:  77 52 A1     cal     &HA152
A0FE:  B7 2A        jr      &HA129
A100:  77 C8 A0     cal     &HA0C8
A103:  77 16 54     cal     &H5416
A106:  D1 00 D7 1B  ldw     $0,&H1BD7
A10A:  97 00        pre     ss,$0
A10C:  D6 00 2A 20  pre     ix,&H202A
A110:  A0 00        stw     $0,(ix+$sx)
A112:  9E 60        gre     us,$0
A114:  D6 00 2C 20  pre     ix,&H202C
A118:  A0 00        stw     $0,(ix+$sx)
A11A:  77 71 27     cal     &H2771
A11D:  77 94 9F     cal     &H9F94
A120:  77 52 A1     cal     &HA152
A123:  77 6F A0     cal     &HA06F
A126:  77 81 A1     cal     &HA181
A129:  77 2E A1     cal     &HA12E
A12C:  B7 84        jr      &HA0B1
A12E:  D6 00 34 11  pre     ix,&H1134
A132:  20 1F        st      $31,(ix+$sx)
A134:  77 95 A2     cal     &HA295
A137:  77 CD A2     cal     &HA2CD
A13A:  D6 00 F5 1C  pre     ix,&H1CF5
A13E:  02 00        ld      $0,$sx
A140:  A0 1F        stw     $31,(ix+$sx)
A142:  77 EC A2     cal     &HA2EC
A145:  F5           rtn     c
A146:  01 10        sbc     $16,$sx
A148:  30 64 FD     jp      z,&HFD64
A14B:  D6 00 3B 48  pre     ix,&H483B
A14F:  37 62 9F     jp      &H9F62
A152:  77 2D A0     cal     &HA02D
A155:  77 62 A9     cal     &HA962
A158:  77 9E A2     cal     &HA29E
A15B:  D6 00 12 1D  pre     ix,&H1D12
A15F:  A0 1E        stw     $30,(ix+$sx)
A161:  D6 00 F3 1C  pre     ix,&H1CF3
A165:  20 1E        st      $30,(ix+$sx)
A167:  02 00        ld      $0,$sx
A169:  D6 00 68 1F  pre     ix,&H1F68
A16D:  A0 1F        stw     $31,(ix+$sx)
A16F:  77 D0 B4     cal     &HB4D0
A172:  D6 00 12 1D  pre     ix,&H1D12
A176:  02 00        ld      $0,$sx
A178:  A0 1F        stw     $31,(ix+$sx)
A17A:  D6 00 F3 1C  pre     ix,&H1CF3
A17E:  20 1F        st      $31,(ix+$sx)
A180:  F7           rtn   
A181:  D6 00 E8 1C  pre     ix,&H1CE8
A185:  28 00        ld      $0,(ix+$sx)
A187:  18 40        bid     $0
A189:  35 0C FE     jp      c,&HFE0C
A18C:  D6 40 16 1D  pre     iz,&H1D16
A190:  02 12        ld      $18,$sx
A192:  77 49 A8     cal     &HA849
A195:  B5 56        jr      c,&HA1EC
A197:  41 10 21     sbc     $16,&H21
A19A:  B5 89        jr      c,&HA124
A19C:  41 10 3E     sbc     $16,&H3E
A19F:  B4 2A        jr      nz,&HA1CA
A1A1:  77 49 A8     cal     &HA849
A1A4:  B5 28        jr      c,&HA1CD
A1A6:  41 10 21     sbc     $16,&H21
A1A9:  B5 12        jr      c,&HA1BC
A1AB:  08 32        ad      $18,$sy
A1AD:  41 12 07     sbc     $18,&H07
A1B0:  B1 19        jr      nc,&HA1CA
A1B2:  02 60 10     ld      $0,$16
A1B5:  77 B6 00     cal     &H00B6
A1B8:  23 00        sti     $0,(iz+$sx)
A1BA:  B7 9A        jr      &HA155
A1BC:  01 32        sbc     $18,$sy
A1BE:  B5 9E        jr      c,&HA15D
A1C0:  77 49 A8     cal     &HA849
A1C3:  B5 09        jr      c,&HA1CD
A1C5:  41 10 21     sbc     $16,&H21
A1C8:  B5 89        jr      c,&HA152
A1CA:  37 64 FD     jp      &HFD64
A1CD:  41 12 06     sbc     $18,&H06
A1D0:  B4 87        jr      nz,&HA158
A1D2:  D6 00 16 1D  pre     ix,&H1D16
A1D6:  E8 02 A0     ldm     $2,(ix+$sx),6
A1D9:  42 09 22     ld      $9,&H22
A1DC:  D1 0A 50 52  ldw     $10,&H5250
A1E0:  D1 0C 4E 3A  ldw     $12,&H3A4E
A1E4:  42 0E 22     ld      $14,&H22
A1E7:  C7 62 A9     xrcm    $2,$9,6
A1EA:  B4 A1        jr      nz,&HA18C
A1EC:  9E 60        gre     us,$0
A1EE:  D6 00 2E 20  pre     ix,&H202E
A1F2:  A0 00        stw     $0,(ix+$sx)
A1F4:  D6 00 E6 1C  pre     ix,&H1CE6
A1F8:  A8 00        ldw     $0,(ix+$sx)
A1FA:  96 60        pre     us,$0
A1FC:  77 1B EF     cal     &HEF1B
A1FF:  77 36 A9     cal     &HA936
A202:  D6 00 DA 1C  pre     ix,&H1CDA
A206:  A8 00        ldw     $0,(ix+$sx)
A208:  D6 00 3F 20  pre     ix,&H203F
A20C:  A0 00        stw     $0,(ix+$sx)
A20E:  77 81 A0     cal     &HA081
A211:  02 00        ld      $0,$sx
A213:  D6 00 12 1D  pre     ix,&H1D12
A217:  A0 1F        stw     $31,(ix+$sx)
A219:  D6 00 F3 1C  pre     ix,&H1CF3
A21D:  42 00 02     ld      $0,&H02
A220:  20 00        st      $0,(ix+$sx)
A222:  77 86 C9     cal     &HC986
A225:  02 00        ld      $0,$sx
A227:  D6 00 12 1D  pre     ix,&H1D12
A22B:  A0 1F        stw     $31,(ix+$sx)
A22D:  D6 00 F3 1C  pre     ix,&H1CF3
A231:  20 1F        st      $31,(ix+$sx)
A233:  D6 00 2E 20  pre     ix,&H202E
A237:  A8 00        ldw     $0,(ix+$sx)
A239:  96 60        pre     us,$0
A23B:  F7           rtn   
A23C:  77 49 A8     cal     &HA849
A23F:  B5 09        jr      c,&HA249
A241:  41 10 21     sbc     $16,&H21
A244:  B5 89        jr      c,&HA1CE
A246:  37 64 FD     jp      &HFD64
A249:  D6 00 F0 1C  pre     ix,&H1CF0
A24D:  28 00        ld      $0,(ix+$sx)
A24F:  4E 00 80     or      $0,&H80
A252:  20 00        st      $0,(ix+$sx)
A254:  F7           rtn   
A255:  77 49 A8     cal     &HA849
A258:  B5 08        jr      c,&HA261
A25A:  41 10 21     sbc     $16,&H21
A25D:  B5 89        jr      c,&HA1E7
A25F:  B7 9A        jr      &HA1FA
A261:  D6 00 F0 1C  pre     ix,&H1CF0
A265:  28 00        ld      $0,(ix+$sx)
A267:  4C 00 7F     an      $0,&H7F
A26A:  20 00        st      $0,(ix+$sx)
A26C:  F7           rtn   
A26D:  D7 00 D7 1B  pre     ss,&H1BD7
A271:  D6 60 D0 1C  pre     us,&H1CD0
A275:  D6 00 C4 16  pre     ix,&H16C4
A279:  20 1F        st      $31,(ix+$sx)
A27B:  42 0E 08     ld      $14,&H08
A27E:  20 2E        st      $14,(ix+$sy)
A280:  D6 00 8C 16  pre     ix,&H168C
A284:  28 0E        ld      $14,(ix+$sx)
A286:  D6 00 12 1D  pre     ix,&H1D12
A28A:  A8 13        ldw     $19,(ix+$sx)
A28C:  81 33        sbcw    $19,$sy
A28E:  B1 03        jr      nc,&HA292
A290:  88 33        adw     $19,$sy
A292:  37 A6 6C     jp      &H6CA6
A295:  77 80 9F     cal     &H9F80
A298:  42 10 3E     ld      $16,&H3E
A29B:  37 E2 93     jp      &H93E2
A29E:  D6 00 D4 1C  pre     ix,&H1CD4
A2A2:  A8 00        ldw     $0,(ix+$sx)
A2A4:  D1 02 10 00  ldw     $2,&H0010
A2A8:  89 60 02     sbw     $0,$2
A2AB:  A0 00        stw     $0,(ix+$sx)
A2AD:  96 00        pre     ix,$0
A2AF:  22 1E        sti     $30,(ix+$sx)
A2B1:  D6 40 F9 1C  pre     iz,&H1CF9
A2B5:  42 00 0F     ld      $0,&H0F
A2B8:  2B 01        ldi     $1,(iz+$sx)
A2BA:  22 01        sti     $1,(ix+$sx)
A2BC:  09 20        sb      $0,$sy
A2BE:  B0 07        jr      z,&HA2C6
A2C0:  01 01        sbc     $1,$sx
A2C2:  B0 89        jr      z,&HA24C
A2C4:  B7 8D        jr      &HA252
A2C6:  D6 00 F4 1C  pre     ix,&H1CF4
A2CA:  20 1F        st      $31,(ix+$sx)
A2CC:  F7           rtn   
A2CD:  77 9D A3     cal     &HA39D
A2D0:  89 62 02     sbw     $2,$2
A2D3:  D6 00 00 10  pre     ix,&H1000
A2D7:  2B 00        ldi     $0,(iz+$sx)
A2D9:  01 00        sbc     $0,$sx
A2DB:  B0 07        jr      z,&HA2E3
A2DD:  22 00        sti     $0,(ix+$sx)
A2DF:  88 22        adw     $2,$sy
A2E1:  B7 8B        jr      &HA26D
A2E3:  D6 00 F7 1C  pre     ix,&H1CF7
A2E7:  A0 02        stw     $2,(ix+$sx)
A2E9:  37 80 9F     jp      &H9F80
A2EC:  D6 40 16 1D  pre     iz,&H1D16
A2F0:  89 72 12     sbw     $18,$18
A2F3:  77 49 A8     cal     &HA849
A2F6:  B5 32        jr      c,&HA329
A2F8:  41 10 21     sbc     $16,&H21
A2FB:  B5 17        jr      c,&HA313
A2FD:  88 32        adw     $18,$sy
A2FF:  02 60 10     ld      $0,$16
A302:  77 B6 00     cal     &H00B6
A305:  41 00 41     sbc     $0,&H41
A308:  B5 10        jr      c,&HA319
A30A:  41 00 5B     sbc     $0,&H5B
A30D:  B1 0B        jr      nc,&HA319
A30F:  23 00        sti     $0,(iz+$sx)
A311:  B7 9F        jr      &HA2B1
A313:  81 32        sbcw    $18,$sy
A315:  B1 16        jr      nc,&HA32C
A317:  B7 A5        jr      &HA2BD
A319:  41 10 3E     sbc     $16,&H3E
A31C:  34 64 FD     jp      nz,&HFD64
A31F:  77 70 A8     cal     &HA870
A322:  89 32        sbw     $18,$sy
A324:  30 64 FD     jp      z,&HFD64
A327:  B7 04        jr      &HA32C
A329:  81 32        sbcw    $18,$sy
A32B:  F5           rtn     c
A32C:  D6 00 16 1D  pre     ix,&H1D16
A330:  D1 02 03 00  ldw     $2,&H0003
A334:  81 72 02     sbcw    $18,$2
A337:  B0 2E        jr      z,&HA366
A339:  D1 09 54 52  ldw     $9,&H5254
A33D:  42 0B 4F     ld      $11,&H4F
A340:  D1 02 04 00  ldw     $2,&H0004
A344:  81 72 02     sbcw    $18,$2
A347:  B0 32        jr      z,&HA37A
A349:  D1 02 05 00  ldw     $2,&H0005
A34D:  81 72 02     sbcw    $18,$2
A350:  34 64 FD     jp      nz,&HFD64
A353:  D1 0C 46 46  ldw     $12,&H4646
A357:  E8 02 80     ldm     $2,(ix+$sx),5
A35A:  C7 62 89     xrcm    $2,$9,5
A35D:  34 64 FD     jp      nz,&HFD64
A360:  42 10 03     ld      $16,&H03
A363:  01 1E        sbc     $30,$sx
A365:  F7           rtn   
A366:  E8 02 40     ldm     $2,(ix+$sx),3
A369:  D1 09 52 55  ldw     $9,&H5552
A36D:  42 0B 4E     ld      $11,&H4E
A370:  C7 62 49     xrcm    $2,$9,3
A373:  34 64 FD     jp      nz,&HFD64
A376:  02 30        ld      $16,$sy
A378:  B7 96        jr      &HA30F
A37A:  E8 02 60     ldm     $2,(ix+$sx),4
A37D:  42 0C 4E     ld      $12,&H4E
A380:  C7 62 69     xrcm    $2,$9,4
A383:  B4 06        jr      nz,&HA38A
A385:  42 10 02     ld      $16,&H02
A388:  B7 A6        jr      &HA32F
A38A:  D1 09 45 44  ldw     $9,&H4445
A38E:  D1 0B 49 54  ldw     $11,&H5449
A392:  C7 62 69     xrcm    $2,$9,4
A395:  34 64 FD     jp      nz,&HFD64
A398:  42 10 04     ld      $16,&H04
A39B:  B7 B9        jr      &HA355
A39D:  77 91 29     cal     &H2991
A3A0:  77 17 03     cal     &H0317
A3A3:  28 20        ld      $0,(ix+$sy)
A3A5:  62 00 05     sti     $0,(ix+&H05)
A3A8:  22 00        sti     $0,(ix+$sx)
A3AA:  20 00        st      $0,(ix+$sx)
A3AC:  77 B4 29     cal     &H29B4
A3AF:  77 BB 29     cal     &H29BB
A3B2:  77 D6 A3     cal     &HA3D6
A3B5:  26 00        phs     $0
A3B7:  77 FE 02     cal     &H02FE
A3BA:  D6 40 05 11  pre     iz,&H1105
A3BE:  2D 00        ldd     $0,(iz+$sx)
A3C0:  D6 40 3B 11  pre     iz,&H113B
A3C4:  2D 41        ldd     $1,(iz+$sz)
A3C6:  77 23 03     cal     &H0323
A3C9:  2E 00        pps     $0
A3CB:  41 00 1A     sbc     $0,&H1A
A3CE:  B0 04        jr      z,&HA3D3
A3D0:  01 1E        sbc     $30,$sx
A3D2:  F7           rtn   
A3D3:  01 3F        sbc     $31,$sy
A3D5:  F7           rtn   
A3D6:  77 C8 23     cal     &H23C8
A3D9:  41 00 FD     sbc     $0,&HFD
A3DC:  B0 21        jr      z,&HA3FE
A3DE:  41 00 80     sbc     $0,&H80
A3E1:  B5 06        jr      c,&HA3E8
A3E3:  41 00 A6     sbc     $0,&HA6
A3E6:  B5 1D        jr      c,&HA404
A3E8:  41 00 0D     sbc     $0,&H0D
A3EB:  F0           rtn     z
A3EC:  41 00 E0     sbc     $0,&HE0
A3EF:  B1 19        jr      nc,&HA409
A3F1:  41 00 0B     sbc     $0,&H0B
A3F4:  B4 04        jr      nz,&HA3F9
A3F6:  42 00 02     ld      $0,&H02
A3F9:  77 38 20     cal     &H2038
A3FC:  B7 A7        jr      &HA3A4
A3FE:  42 00 1A     ld      $0,&H1A
A401:  01 3F        sbc     $31,$sy
A403:  F7           rtn   
A404:  77 43 21     cal     &H2143
A407:  B7 B2        jr      &HA3BA
A409:  41 00 E2     sbc     $0,&HE2
A40C:  B0 22        jr      z,&HA42F
A40E:  41 00 E6     sbc     $0,&HE6
A411:  B0 25        jr      z,&HA437
A413:  41 00 E7     sbc     $0,&HE7
A416:  B0 28        jr      z,&HA43F
A418:  41 00 E9     sbc     $0,&HE9
A41B:  B0 28        jr      z,&HA444
A41D:  41 00 F0     sbc     $0,&HF0
A420:  B5 CB        jr      c,&HA3EC
A422:  41 00 FA     sbc     $0,&HFA
A425:  B1 D0        jr      nc,&HA3F6
A427:  4C 00 0F     an      $0,&H0F
A42A:  4E 00 30     or      $0,&H30
A42D:  B7 B5        jr      &HA3E3
A42F:  77 AA 29     cal     &H29AA
A432:  77 A7 21     cal     &H21A7
A435:  B7 E0        jr      &HA416
A437:  77 F2 22     cal     &H22F2
A43A:  77 DB 2A     cal     &H2ADB
A43D:  B7 E8        jr      &HA426
A43F:  77 54 23     cal     &H2354
A442:  B7 ED        jr      &HA430
A444:  77 AA 29     cal     &H29AA
A447:  77 AA 21     cal     &H21AA
A44A:  B7 F5        jr      &HA440
A44C:  D6 00 0F 1D  pre     ix,&H1D0F
A450:  28 B0        ld      $16,(ix-$sy)
A452:  01 10        sbc     $16,$sx
A454:  B4 31        jr      nz,&HA486
A456:  D6 00 ED 1C  pre     ix,&H1CED
A45A:  D1 02 EB 1C  ldw     $2,&H1CEB
A45E:  91 62 02     ldw     $2,($2)
A461:  BA 02        sbcw    (ix+$sx),$2
A463:  B1 33        jr      nc,&HA497
A465:  A8 00        ldw     $0,(ix+$sx)
A467:  11 50        ld      $16,($sz)
A469:  88 20        adw     $0,$sy
A46B:  A0 00        stw     $0,(ix+$sx)
A46D:  41 10 0D     sbc     $16,&H0D
A470:  B4 1E        jr      nz,&HA48F
A472:  42 10 0A     ld      $16,&H0A
A475:  11 42        ld      $2,($sz)
A477:  41 02 0A     sbc     $2,&H0A
A47A:  B4 08        jr      nz,&HA483
A47C:  02 70 02     ld      $16,$2
A47F:  88 20        adw     $0,$sy
A481:  A0 00        stw     $0,(ix+$sx)
A483:  01 1E        sbc     $30,$sx
A485:  F7           rtn   
A486:  28 0D        ld      $13,(ix+$sx)
A488:  28 2E        ld      $14,(ix+$sy)
A48A:  02 0F        ld      $15,$sx
A48C:  E0 AD 40     stm     $13,(ix-$sy),3
A48F:  41 10 1A     sbc     $16,&H1A
A492:  B4 90        jr      nz,&HA423
A494:  01 3F        sbc     $31,$sy
A496:  F7           rtn   
A497:  42 10 1A     ld      $16,&H1A
A49A:  B7 87        jr      &HA422
A49C:  77 3D 02     cal     &H023D
A49F:  77 A4 03     cal     &H03A4
A4A2:  26 00        phs     $0
A4A4:  77 41 02     cal     &H0241
A4A7:  2E 00        pps     $0
A4A9:  77 8F 19     cal     &H198F
A4AC:  B5 91        jr      c,&HA43E
A4AE:  41 00 FD     sbc     $0,&HFD
A4B1:  B4 04        jr      nz,&HA4B6
A4B3:  42 00 1A     ld      $0,&H1A
A4B6:  D6 00 81 1F  pre     ix,&H1F81
A4BA:  02 01        ld      $1,$sx
A4BC:  A0 00        stw     $0,(ix+$sx)
A4BE:  F7           rtn   
A4BF:  E6 03 60     phsm    $3,4
A4C2:  96 51        pre     iz,$17
A4C4:  29 20        ld      $0,(iz+$sy)
A4C6:  04 20        anc     $0,$sy
A4C8:  30 6E FE     jp      z,&HFE6E
A4CB:  44 00 10     anc     $0,&H10
A4CE:  B4 25        jr      nz,&HA4F4
A4D0:  29 13        ld      $19,(iz+$sx)
A4D2:  77 AD A5     cal     &HA5AD
A4D5:  B5 1E        jr      c,&HA4F4
A4D7:  96 51        pre     iz,$17
A4D9:  69 00 02     ld      $0,(iz+&H02)
A4DC:  44 00 80     anc     $0,&H80
A4DF:  B0 0E        jr      z,&HA4EE
A4E1:  41 10 1A     sbc     $16,&H1A
A4E4:  B0 0F        jr      z,&HA4F4
A4E6:  41 10 0D     sbc     $16,&H0D
A4E9:  B4 04        jr      nz,&HA4EE
A4EB:  42 10 0A     ld      $16,&H0A
A4EE:  01 1E        sbc     $30,$sx
A4F0:  EE 00 60     ppsm    $0,4
A4F3:  F7           rtn   
A4F4:  96 51        pre     iz,$17
A4F6:  29 20        ld      $0,(iz+$sy)
A4F8:  4E 00 10     or      $0,&H10
A4FB:  21 20        st      $0,(iz+$sy)
A4FD:  01 3F        sbc     $31,$sy
A4FF:  B7 90        jr      &HA490
A501:  E6 03 60     phsm    $3,4
A504:  96 51        pre     iz,$17
A506:  29 13        ld      $19,(iz+$sx)
A508:  01 13        sbc     $19,$sx
A50A:  34 62 FE     jp      nz,&HFE62
A50D:  69 1D 03     ld      $29,(iz+&H03)
A510:  D1 00 39 17  ldw     $0,&H1739
A514:  10 5D        st      $29,($sz)
A516:  69 00 02     ld      $0,(iz+&H02)
A519:  44 00 80     anc     $0,&H80
A51C:  26 10        phs     $16
A51E:  B4 23        jr      nz,&HA542
A520:  01 1D        sbc     $29,$sx
A522:  B4 09        jr      nz,&HA52C
A524:  41 10 0A     sbc     $16,&H0A
A527:  B4 04        jr      nz,&HA52C
A529:  42 10 0D     ld      $16,&H0D
A52C:  26 10        phs     $16
A52E:  77 C5 29     cal     &H29C5
A531:  2E 10        pps     $16
A533:  77 F1 2A     cal     &H2AF1
A536:  D1 00 39 17  ldw     $0,&H1739
A53A:  10 5F        st      $31,($sz)
A53C:  2E 10        pps     $16
A53E:  EE 00 60     ppsm    $0,4
A541:  F7           rtn   
A542:  01 1D        sbc     $29,$sx
A544:  B0 A1        jr      z,&HA4E6
A546:  41 10 0A     sbc     $16,&H0A
A549:  B4 9E        jr      nz,&HA4E8
A54B:  77 C5 29     cal     &H29C5
A54E:  42 10 0D     ld      $16,&H0D
A551:  77 F1 2A     cal     &H2AF1
A554:  42 10 0A     ld      $16,&H0A
A557:  B7 AC        jr      &HA504
A559:  96 51        pre     iz,$17
A55B:  29 20        ld      $0,(iz+$sy)
A55D:  04 20        anc     $0,$sy
A55F:  30 6E FE     jp      z,&HFE6E
A562:  02 6F 10     ld      $15,$16
A565:  69 00 02     ld      $0,(iz+&H02)
A568:  44 00 80     anc     $0,&H80
A56B:  B0 09        jr      z,&HA575
A56D:  41 0F 0A     sbc     $15,&H0A
A570:  B4 04        jr      nz,&HA575
A572:  42 0F 0D     ld      $15,&H0D
A575:  D6 40 54 20  pre     iz,&H2054
A579:  BF 1E        sbw     (iz+$sx),$30
A57B:  A9 02        ldw     $2,(iz+$sx)
A57D:  D1 00 56 20  ldw     $0,&H2056
A581:  88 60 02     adw     $0,$2
A584:  10 4F        st      $15,($sz)
A586:  96 51        pre     iz,$17
A588:  29 20        ld      $0,(iz+$sy)
A58A:  4C 00 EF     an      $0,&HEF
A58D:  21 20        st      $0,(iz+$sy)
A58F:  01 1E        sbc     $30,$sx
A591:  F7           rtn   
A592:  96 51        pre     iz,$17
A594:  29 13        ld      $19,(iz+$sx)
A596:  01 13        sbc     $19,$sx
A598:  34 62 FE     jp      nz,&HFE62
A59B:  69 04 03     ld      $4,(iz+&H03)
A59E:  01 04        sbc     $4,$sx
A5A0:  F4           rtn     nz
A5A1:  29 20        ld      $0,(iz+$sy)
A5A3:  04 20        anc     $0,$sy
A5A5:  F0           rtn     z
A5A6:  44 00 10     anc     $0,&H10
A5A9:  F4           rtn     nz
A5AA:  37 1B EF     jp      &HEF1B
A5AD:  01 13        sbc     $19,$sx
A5AF:  34 62 FE     jp      nz,&HFE62
A5B2:  77 B6 A5     cal     &HA5B6
A5B5:  F7           rtn   
A5B6:  A6 12        phsw    $18
A5B8:  D6 40 54 20  pre     iz,&H2054
A5BC:  A9 02        ldw     $2,(iz+$sx)
A5BE:  D1 00 56 20  ldw     $0,&H2056
A5C2:  88 60 02     adw     $0,$2
A5C5:  11 50        ld      $16,($sz)
A5C7:  01 10        sbc     $16,$sx
A5C9:  B4 26        jr      nz,&HA5F0
A5CB:  77 1B EF     cal     &HEF1B
A5CE:  77 9D A3     cal     &HA39D
A5D1:  42 01 0D     ld      $1,&H0D
A5D4:  B1 04        jr      nc,&HA5D9
A5D6:  42 01 1A     ld      $1,&H1A
A5D9:  D6 00 56 20  pre     ix,&H2056
A5DD:  2B 00        ldi     $0,(iz+$sx)
A5DF:  01 00        sbc     $0,$sx
A5E1:  B0 05        jr      z,&HA5E7
A5E3:  22 00        sti     $0,(ix+$sx)
A5E5:  B7 89        jr      &HA56F
A5E7:  22 01        sti     $1,(ix+$sx)
A5E9:  20 1F        st      $31,(ix+$sx)
A5EB:  77 80 9F     cal     &H9F80
A5EE:  B7 B7        jr      &HA5A6
A5F0:  BD 1E        adw     (iz+$sx),$30
A5F2:  41 10 1A     sbc     $16,&H1A
A5F5:  B0 06        jr      z,&HA5FC
A5F7:  01 1E        sbc     $30,$sx
A5F9:  AE 11        ppsw    $17
A5FB:  F7           rtn   
A5FC:  01 3F        sbc     $31,$sy
A5FE:  AE 11        ppsw    $17
A600:  F7           rtn   
A601:  D6 00 F0 1C  pre     ix,&H1CF0
A605:  28 00        ld      $0,(ix+$sx)
A607:  44 00 80     anc     $0,&H80
A60A:  F0           rtn     z
A60B:  D6 00 12 1D  pre     ix,&H1D12
A60F:  A8 00        ldw     $0,(ix+$sx)
A611:  84 40        ancw    $0,$sz
A613:  F0           rtn     z
A614:  77 80 9F     cal     &H9F80
A617:  42 10 28     ld      $16,&H28
A61A:  77 E2 93     cal     &H93E2
A61D:  77 20 FF     cal     &HFF20
A620:  42 10 29     ld      $16,&H29
A623:  77 E2 93     cal     &H93E2
A626:  42 10 20     ld      $16,&H20
A629:  77 E2 93     cal     &H93E2
A62C:  77 83 A6     cal     &HA683
A62F:  42 10 20     ld      $16,&H20
A632:  77 E2 93     cal     &H93E2
A635:  42 10 3F     ld      $16,&H3F
A638:  77 E2 93     cal     &H93E2
A63B:  9F 00        gre     ss,$0
A63D:  D6 00 36 20  pre     ix,&H2036
A641:  A0 00        stw     $0,(ix+$sx)
A643:  9E 60        gre     us,$0
A645:  D6 00 38 20  pre     ix,&H2038
A649:  A0 00        stw     $0,(ix+$sx)
A64B:  D6 00 3E 20  pre     ix,&H203E
A64F:  42 00 02     ld      $0,&H02
A652:  20 00        st      $0,(ix+$sx)
A654:  77 C8 23     cal     &H23C8
A657:  02 50        ld      $16,$sz
A659:  41 00 0D     sbc     $0,&H0D
A65C:  B0 0C        jr      z,&HA669
A65E:  77 B6 00     cal     &H00B6
A661:  41 00 43     sbc     $0,&H43
A664:  B4 91        jr      nz,&HA5F6
A666:  77 E2 93     cal     &H93E2
A669:  77 80 9F     cal     &H9F80
A66C:  D6 00 36 20  pre     ix,&H2036
A670:  A8 00        ldw     $0,(ix+$sx)
A672:  97 00        pre     ss,$0
A674:  D6 00 38 20  pre     ix,&H2038
A678:  A8 00        ldw     $0,(ix+$sx)
A67A:  96 60        pre     us,$0
A67C:  D6 00 3E 20  pre     ix,&H203E
A680:  20 1F        st      $31,(ix+$sx)
A682:  F7           rtn   
A683:  77 A9 A0     cal     &HA0A9
A686:  82 20        ldw     $0,$sy
A688:  D6 00 12 1D  pre     ix,&H1D12
A68C:  BA 00        sbcw    (ix+$sx),$0
A68E:  B0 19        jr      z,&HA6A8
A690:  A6 01        phsw    $1
A692:  77 C5 29     cal     &H29C5
A695:  77 56 A4     cal     &HA456
A698:  B5 0C        jr      c,&HA6A5
A69A:  41 10 0A     sbc     $16,&H0A
A69D:  B4 8C        jr      nz,&HA62A
A69F:  AE 00        ppsw    $0
A6A1:  88 20        adw     $0,$sy
A6A3:  B7 9C        jr      &HA640
A6A5:  AE 00        ppsw    $0
A6A7:  F7           rtn   
A6A8:  77 56 A4     cal     &HA456
A6AB:  F5           rtn     c
A6AC:  41 10 0A     sbc     $16,&H0A
A6AF:  F0           rtn     z
A6B0:  77 E2 93     cal     &H93E2
A6B3:  B7 8C        jr      &HA640
A6B5:  49 00 05     sb      $0,&H05
A6B8:  37 41 A7     jp      &HA741
A6BB:  77 E2 93     cal     &H93E2
A6BE:  B7 52        jr      &HA711
A6C0:  77 E2 93     cal     &H93E2
A6C3:  B7 0F        jr      &HA6D3
A6C5:  77 E2 93     cal     &H93E2
A6C8:  D6 00 F0 1C  pre     ix,&H1CF0
A6CC:  28 00        ld      $0,(ix+$sx)
A6CE:  4E 00 80     or      $0,&H80
A6D1:  20 00        st      $0,(ix+$sx)
A6D3:  77 80 9F     cal     &H9F80
A6D6:  D6 00 3E 20  pre     ix,&H203E
A6DA:  28 00        ld      $0,(ix+$sx)
A6DC:  41 00 06     sbc     $0,&H06
A6DF:  30 67 EF     jp      z,&HEF67
A6E2:  B7 F7        jr      &HA6DA
A6E4:  77 E2 93     cal     &H93E2
A6E7:  D6 00 F0 1C  pre     ix,&H1CF0
A6EB:  28 00        ld      $0,(ix+$sx)
A6ED:  4C 00 7F     an      $0,&H7F
A6F0:  20 00        st      $0,(ix+$sx)
A6F2:  B7 A0        jr      &HA693
A6F4:  D6 00 39 17  pre     ix,&H1739
A6F8:  20 1F        st      $31,(ix+$sx)
A6FA:  77 23 03     cal     &H0323
A6FD:  77 80 9F     cal     &H9F80
A700:  D6 00 3E 20  pre     ix,&H203E
A704:  28 00        ld      $0,(ix+$sx)
A706:  01 00        sbc     $0,$sx
A708:  B4 11        jr      nz,&HA71A
A70A:  D1 0F 4C 42  ldw     $15,&H424C
A70E:  77 78 9F     cal     &H9F78
A711:  D6 00 3E 20  pre     ix,&H203E
A715:  20 1F        st      $31,(ix+$sx)
A717:  37 C5 FE     jp      &HFEC5
A71A:  41 00 06     sbc     $0,&H06
A71D:  B0 E9        jr      z,&HA707
A71F:  41 00 07     sbc     $0,&H07
A722:  B0 EE        jr      z,&HA711
A724:  41 00 0B     sbc     $0,&H0B
A727:  B0 06        jr      z,&HA72E
A729:  41 00 0C     sbc     $0,&H0C
A72C:  B4 14        jr      nz,&HA741
A72E:  D6 00 3A 20  pre     ix,&H203A
A732:  A8 02        ldw     $2,(ix+$sx)
A734:  97 02        pre     ss,$2
A736:  D6 00 3C 20  pre     ix,&H203C
A73A:  A8 02        ldw     $2,(ix+$sx)
A73C:  96 62        pre     us,$2
A73E:  49 00 0A     sb      $0,&H0A
A741:  48 00 05     ad      $0,&H05
A744:  D6 00 3E 20  pre     ix,&H203E
A748:  20 00        st      $0,(ix+$sx)
A74A:  D1 0F 52 42  ldw     $15,&H4252
A74E:  77 78 9F     cal     &H9F78
A751:  77 C8 23     cal     &H23C8
A754:  02 50        ld      $16,$sz
A756:  77 B6 00     cal     &H00B6
A759:  41 00 41     sbc     $0,&H41
A75C:  30 BB A6     jp      z,&HA6BB
A75F:  41 00 43     sbc     $0,&H43
A762:  30 C0 A6     jp      z,&HA6C0
A765:  41 00 0D     sbc     $0,&H0D
A768:  30 D3 A6     jp      z,&HA6D3
A76B:  41 00 54     sbc     $0,&H54
A76E:  30 C5 A6     jp      z,&HA6C5
A771:  41 00 4E     sbc     $0,&H4E
A774:  30 E4 A6     jp      z,&HA6E4
A777:  41 00 44     sbc     $0,&H44
A77A:  B4 AA        jr      nz,&HA725
A77C:  77 E2 93     cal     &H93E2
A77F:  9F 00        gre     ss,$0
A781:  D6 00 3A 20  pre     ix,&H203A
A785:  A0 00        stw     $0,(ix+$sx)
A787:  9E 60        gre     us,$0
A789:  D6 00 3C 20  pre     ix,&H203C
A78D:  A0 00        stw     $0,(ix+$sx)
A78F:  D6 00 3E 20  pre     ix,&H203E
A793:  42 00 05     ld      $0,&H05
A796:  3C 00        ad      (ix+$sx),$0
A798:  77 80 9F     cal     &H9F80
A79B:  D1 0F CA 47  ldw     $15,&H47CA
A79F:  77 78 9F     cal     &H9F78
A7A2:  D6 00 16 1D  pre     ix,&H1D16
A7A6:  20 1F        st      $31,(ix+$sx)
A7A8:  D6 00 18 1E  pre     ix,&H1E18
A7AC:  A0 1E        stw     $30,(ix+$sx)
A7AE:  77 9D A3     cal     &HA39D
A7B1:  2B 00        ldi     $0,(iz+$sx)
A7B3:  01 00        sbc     $0,$sx
A7B5:  30 0E A8     jp      z,&HA80E
A7B8:  41 00 21     sbc     $0,&H21
A7BB:  B5 8B        jr      c,&HA747
A7BD:  77 AB 00     cal     &H00AB
A7C0:  B5 07        jr      c,&HA7C8
A7C2:  41 00 5F     sbc     $0,&H5F
A7C5:  34 0E A8     jp      nz,&HA80E
A7C8:  02 50        ld      $16,$sz
A7CA:  77 24 B1     cal     &HB124
A7CD:  2B 00        ldi     $0,(iz+$sx)
A7CF:  77 AB 00     cal     &H00AB
A7D2:  B5 8B        jr      c,&HA75E
A7D4:  77 2B 00     cal     &H002B
A7D7:  B5 90        jr      c,&HA768
A7D9:  41 00 5F     sbc     $0,&H5F
A7DC:  B0 95        jr      z,&HA772
A7DE:  01 00        sbc     $0,$sx
A7E0:  B0 0A        jr      z,&HA7EB
A7E2:  41 00 21     sbc     $0,&H21
A7E5:  B1 28        jr      nc,&HA80E
A7E7:  2B 00        ldi     $0,(iz+$sx)
A7E9:  B7 8C        jr      &HA776
A7EB:  77 DC B2     cal     &HB2DC
A7EE:  84 72 12     ancw    $18,$18
A7F1:  B0 1C        jr      z,&HA80E
A7F3:  D6 00 70 1F  pre     ix,&H1F70
A7F7:  A0 12        stw     $18,(ix+$sx)
A7F9:  42 10 02     ld      $16,&H02
A7FC:  42 11 11     ld      $17,&H11
A7FF:  77 A6 C8     cal     &HC8A6
A802:  B1 0B        jr      nc,&HA80E
A804:  7A 1E 03     sbc     (ix+&H03),$30
A807:  B4 0C        jr      nz,&HA814
A809:  77 53 C9     cal     &HC953
A80C:  B5 89        jr      c,&HA796
A80E:  77 DB 2A     cal     &H2ADB
A811:  37 A2 A7     jp      &HA7A2
A814:  77 38 DC     cal     &HDC38
A817:  44 13 F0     anc     $19,&HF0
A81A:  B4 0A        jr      nz,&HA825
A81C:  01 13        sbc     $19,$sx
A81E:  B0 91        jr      z,&HA7B0
A820:  41 13 09     sbc     $19,&H09
A823:  B1 96        jr      nc,&HA7BA
A825:  A6 10        phsw    $16
A827:  26 13        phs     $19
A829:  77 80 9F     cal     &H9F80
A82C:  2E 13        pps     $19
A82E:  26 13        phs     $19
A830:  77 88 FB     cal     &HFB88
A833:  42 10 3A     ld      $16,&H3A
A836:  77 E2 93     cal     &H93E2
A839:  42 10 20     ld      $16,&H20
A83C:  77 E2 93     cal     &H93E2
A83F:  2E 13        pps     $19
A841:  AE 0F        ppsw    $15
A843:  77 E0 FB     cal     &HFBE0
A846:  37 98 A7     jp      &HA798
A849:  D6 00 F7 1C  pre     ix,&H1CF7
A84D:  A8 00        ldw     $0,(ix+$sx)
A84F:  D6 00 F5 1C  pre     ix,&H1CF5
A853:  A8 02        ldw     $2,(ix+$sx)
A855:  81 42        sbcw    $2,$sz
A857:  B0 12        jr      z,&HA86A
A859:  D1 00 00 10  ldw     $0,&H1000
A85D:  88 60 02     adw     $0,$2
A860:  11 50        ld      $16,($sz)
A862:  88 22        adw     $2,$sy
A864:  A0 02        stw     $2,(ix+$sx)
A866:  09 40        sb      $0,$sz
A868:  B7 04        jr      &HA86D
A86A:  42 00 40     ld      $0,&H40
A86D:  14 40        pfl     $0
A86F:  F7           rtn   
A870:  D6 00 F5 1C  pre     ix,&H1CF5
A874:  A8 00        ldw     $0,(ix+$sx)
A876:  89 20        sbw     $0,$sy
A878:  A0 00        stw     $0,(ix+$sx)
A87A:  F7           rtn   
A87B:  89 40        sbw     $0,$sz
A87D:  D6 00 1C 1E  pre     ix,&H1E1C
A881:  20 1F        st      $31,(ix+$sx)
A883:  D6 00 6A 1F  pre     ix,&H1F6A
A887:  A0 00        stw     $0,(ix+$sx)
A889:  D6 00 14 1D  pre     ix,&H1D14
A88D:  A0 00        stw     $0,(ix+$sx)
A88F:  D6 00 1A 1E  pre     ix,&H1E1A
A893:  20 1F        st      $31,(ix+$sx)
A895:  77 7A C7     cal     &HC77A
A898:  77 BC C7     cal     &HC7BC
A89B:  D6 00 57 1F  pre     ix,&H1F57
A89F:  20 1F        st      $31,(ix+$sx)
A8A1:  D1 10 57 1F  ldw     $16,&H1F57
A8A5:  77 02 C8     cal     &HC802
A8A8:  D1 02 97 38  ldw     $2,&H3897
A8AC:  D1 04 09 00  ldw     $4,&H0009
A8B0:  42 06 11     ld      $6,&H11
A8B3:  77 E1 A8     cal     &HA8E1
A8B6:  D1 02 A0 38  ldw     $2,&H38A0
A8BA:  D1 04 0A 00  ldw     $4,&H000A
A8BE:  42 06 11     ld      $6,&H11
A8C1:  77 E1 A8     cal     &HA8E1
A8C4:  D1 02 AA 38  ldw     $2,&H38AA
A8C8:  D1 04 0A 00  ldw     $4,&H000A
A8CC:  42 06 11     ld      $6,&H11
A8CF:  77 E1 A8     cal     &HA8E1
A8D2:  D1 02 B4 38  ldw     $2,&H38B4
A8D6:  D1 04 0A 00  ldw     $4,&H000A
A8DA:  42 06 11     ld      $6,&H11
A8DD:  77 E1 A8     cal     &HA8E1
A8E0:  F7           rtn   
A8E1:  D1 00 57 1F  ldw     $0,&H1F57
A8E5:  50 40 11     st      &H11,($sz)
A8E8:  D1 00 5B 1F  ldw     $0,&H1F5B
A8EC:  10 46        st      $6,($sz)
A8EE:  D6 00 18 1E  pre     ix,&H1E18
A8F2:  A0 04        stw     $4,(ix+$sx)
A8F4:  D1 00 16 1D  ldw     $0,&H1D16
A8F8:  77 BB 0E     cal     &H0EBB
A8FB:  77 6C B2     cal     &HB26C
A8FE:  D6 00 58 1F  pre     ix,&H1F58
A902:  A0 12        stw     $18,(ix+$sx)
A904:  D1 10 57 1F  ldw     $16,&H1F57
A908:  77 02 C8     cal     &HC802
A90B:  F7           rtn   
A90C:  D6 00 D0 1C  pre     ix,&H1CD0
A910:  AA 00        ldiw    $0,(ix+$sx)
A912:  A0 00        stw     $0,(ix+$sx)
A914:  D6 00 D6 1C  pre     ix,&H1CD6
A918:  A8 00        ldw     $0,(ix+$sx)
A91A:  D6 00 D4 1C  pre     ix,&H1CD4
A91E:  A0 00        stw     $0,(ix+$sx)
A920:  F7           rtn   
A921:  D6 00 D8 1C  pre     ix,&H1CD8
A925:  AA 00        ldiw    $0,(ix+$sx)
A927:  A0 00        stw     $0,(ix+$sx)
A929:  D6 00 DE 1C  pre     ix,&H1CDE
A92D:  A8 00        ldw     $0,(ix+$sx)
A92F:  D6 00 DC 1C  pre     ix,&H1CDC
A933:  A0 00        stw     $0,(ix+$sx)
A935:  F7           rtn   
A936:  D6 00 E0 1C  pre     ix,&H1CE0
A93A:  AA 00        ldiw    $0,(ix+$sx)
A93C:  A0 00        stw     $0,(ix+$sx)
A93E:  D6 00 E6 1C  pre     ix,&H1CE6
A942:  A8 00        ldw     $0,(ix+$sx)
A944:  D6 00 E4 1C  pre     ix,&H1CE4
A948:  A0 00        stw     $0,(ix+$sx)
A94A:  F7           rtn   
A94B:  77 8F A9     cal     &HA98F
A94E:  B5 08        jr      c,&HA957
A950:  B0 0A        jr      z,&HA95B
A952:  77 4A B0     cal     &HB04A
A955:  B4 8B        jr      nz,&HA8E1
A957:  D1 12 00 0F  ldw     $18,&H0F00
A95B:  D1 00 08 1D  ldw     $0,&H1D08
A95F:  90 52        stw     $18,($sz)
A961:  F7           rtn   
A962:  D1 00 11 1D  ldw     $0,&H1D11
A966:  50 40 FF     st      &HFF,($sz)
A969:  D6 00 0E 1D  pre     ix,&H1D0E
A96D:  22 1F        sti     $31,(ix+$sx)
A96F:  22 1F        sti     $31,(ix+$sx)
A971:  20 1F        st      $31,(ix+$sx)
A973:  D1 00 18 1E  ldw     $0,&H1E18
A977:  90 5E        stw     $30,($sz)
A979:  D1 00 16 1D  ldw     $0,&H1D16
A97D:  10 5E        st      $30,($sz)
A97F:  D1 00 1A 1E  ldw     $0,&H1E1A
A983:  10 5F        st      $31,($sz)
A985:  D1 00 1B 1E  ldw     $0,&H1E1B
A989:  10 5F        st      $31,($sz)
A98B:  77 EB AE     cal     &HAEEB
A98E:  F7           rtn   
A98F:  D1 00 1A 1E  ldw     $0,&H1E1A
A993:  11 42        ld      $2,($sz)
A995:  44 02 40     anc     $2,&H40
A998:  B0 07        jr      z,&HA9A0
A99A:  77 C4 B0     cal     &HB0C4
A99D:  14 5F        pfl     $31
A99F:  F7           rtn   
A9A0:  77 4C A4     cal     &HA44C
A9A3:  F5           rtn     c
A9A4:  41 10 0A     sbc     $16,&H0A
A9A7:  B4 16        jr      nz,&HA9BE
A9A9:  D6 00 12 1D  pre     ix,&H1D12
A9AD:  BC 1E        adw     (ix+$sx),$30
A9AF:  D1 00 1A 1E  ldw     $0,&H1E1A
A9B3:  11 42        ld      $2,($sz)
A9B5:  44 02 80     anc     $2,&H80
A9B8:  B0 99        jr      z,&HA952
A9BA:  54 40 80     pfl     &H80
A9BD:  F7           rtn   
A9BE:  41 10 00     sbc     $16,&H00
A9C1:  B0 A2        jr      z,&HA964
A9C3:  41 10 09     sbc     $16,&H09
A9C6:  35 76 FD     jp      c,&HFD76
A9C9:  41 10 0E     sbc     $16,&H0E
A9CC:  B5 AD        jr      c,&HA97A
A9CE:  41 10 20     sbc     $16,&H20
A9D1:  35 76 FD     jp      c,&HFD76
A9D4:  B0 B5        jr      z,&HA98A
A9D6:  41 10 7F     sbc     $16,&H7F
A9D9:  31 76 FD     jp      nc,&HFD76
A9DC:  41 10 2F     sbc     $16,&H2F
A9DF:  B4 1A        jr      nz,&HA9FA
A9E1:  77 4C A4     cal     &HA44C
A9E4:  B5 06        jr      c,&HA9EB
A9E6:  41 10 2A     sbc     $16,&H2A
A9E9:  B0 0B        jr      z,&HA9F5
A9EB:  D1 00 0E 1D  ldw     $0,&H1D0E
A9EF:  10 50        st      $16,($sz)
A9F1:  42 90 2F 58  ld      $16,&H2F,jr &HAA4C
A9F5:  77 52 AA     cal     &HAA52
A9F8:  B7 D9        jr      &HA9D2
A9FA:  77 5C B4     cal     &HB45C
A9FD:  B4 07        jr      nz,&HAA05
A9FF:  77 76 AA     cal     &HAA76
AA02:  14 5F        pfl     $31
AA04:  F7           rtn   
AA05:  41 10 22     sbc     $16,&H22
AA08:  B4 07        jr      nz,&HAA10
AA0A:  77 DC AA     cal     &HAADC
AA0D:  14 5F        pfl     $31
AA0F:  F7           rtn   
AA10:  41 10 27     sbc     $16,&H27
AA13:  B4 07        jr      nz,&HAA1B
AA15:  77 2C AB     cal     &HAB2C
AA18:  14 5F        pfl     $31
AA1A:  F7           rtn   
AA1B:  77 4B B4     cal     &HB44B
AA1E:  B0 1E        jr      z,&HAA3D
AA20:  41 10 2E     sbc     $16,&H2E
AA23:  B4 1F        jr      nz,&HAA43
AA25:  77 4C A4     cal     &HA44C
AA28:  D1 00 0E 1D  ldw     $0,&H1D0E
AA2C:  10 50        st      $16,($sz)
AA2E:  B5 0A        jr      c,&HAA39
AA30:  77 4B B4     cal     &HB44B
AA33:  B4 05        jr      nz,&HAA39
AA35:  42 90 2E 05  ld      $16,&H2E,jr &HAA3D
AA39:  42 90 2E 10  ld      $16,&H2E,jr &HAA4C
AA3D:  77 40 AC     cal     &HAC40
AA40:  14 5F        pfl     $31
AA42:  F7           rtn   
AA43:  41 10 23     sbc     $16,&H23
AA46:  B4 05        jr      nz,&HAA4C
AA48:  77 95 AE     cal     &HAE95
AA4B:  F7           rtn   
AA4C:  77 E8 B0     cal     &HB0E8
AA4F:  14 5F        pfl     $31
AA51:  F7           rtn   
AA52:  77 4C A4     cal     &HA44C
AA55:  35 70 FD     jp      c,&HFD70
AA58:  41 10 0A     sbc     $16,&H0A
AA5B:  B4 09        jr      nz,&HAA65
AA5D:  D6 00 12 1D  pre     ix,&H1D12
AA61:  BC 1E        adw     (ix+$sx),$30
AA63:  B7 92        jr      &HA9F6
AA65:  41 10 2A     sbc     $16,&H2A
AA68:  B4 97        jr      nz,&HAA00
AA6A:  77 4C A4     cal     &HA44C
AA6D:  35 70 FD     jp      c,&HFD70
AA70:  41 10 2F     sbc     $16,&H2F
AA73:  B4 9C        jr      nz,&HAA10
AA75:  F7           rtn   
AA76:  D1 00 16 1D  ldw     $0,&H1D16
AA7A:  10 5F        st      $31,($sz)
AA7C:  77 24 B1     cal     &HB124
AA7F:  77 4C A4     cal     &HA44C
AA82:  B5 0B        jr      c,&HAA8E
AA84:  77 4B B4     cal     &HB44B
AA87:  B0 8C        jr      z,&HAA14
AA89:  77 5C B4     cal     &HB45C
AA8C:  B0 91        jr      z,&HAA1E
AA8E:  D1 00 0E 1D  ldw     $0,&H1D0E
AA92:  10 50        st      $16,($sz)
AA94:  D1 00 1A 1E  ldw     $0,&H1E1A
AA98:  11 42        ld      $2,($sz)
AA9A:  44 02 80     anc     $2,&H80
AA9D:  B0 08        jr      z,&HAAA6
AA9F:  44 02 20     anc     $2,&H20
AAA2:  B4 35        jr      nz,&HAAD8
AAA4:  B7 21        jr      &HAAC6
AAA6:  77 66 B3     cal     &HB366
AAA9:  84 72 12     ancw    $18,$18
AAAC:  B0 19        jr      z,&HAAC6
AAAE:  D1 00 1A 1E  ldw     $0,&H1E1A
AAB2:  50 40 40     st      &H40,($sz)
AAB5:  96 12        pre     ix,$18
AAB7:  E8 10 60     ldm     $16,(ix+$sx),4
AABA:  D6 00 17 1D  pre     ix,&H1D17
AABE:  E0 10 60     stm     $16,(ix+$sx),4
AAC1:  77 C4 B0     cal     &HB0C4
AAC4:  B7 16        jr      &HAADB
AAC6:  77 71 B1     cal     &HB171
AAC9:  B4 0E        jr      nz,&HAAD8
AACB:  D1 00 18 1E  ldw     $0,&H1E18
AACF:  90 5E        stw     $30,($sz)
AAD1:  D1 00 16 1D  ldw     $0,&H1D16
AAD5:  10 DE 04     st      $30,($sz),jr &HAADB
AAD8:  77 6C B2     cal     &HB26C
AADB:  F7           rtn   
AADC:  D1 00 16 1D  ldw     $0,&H1D16
AAE0:  42 02 11     ld      $2,&H11
AAE3:  10 42        st      $2,($sz)
AAE5:  D6 00 18 1E  pre     ix,&H1E18
AAE9:  BC 1E        adw     (ix+$sx),$30
AAEB:  77 4C A4     cal     &HA44C
AAEE:  35 82 FD     jp      c,&HFD82
AAF1:  41 10 0A     sbc     $16,&H0A
AAF4:  30 82 FD     jp      z,&HFD82
AAF7:  41 10 22     sbc     $16,&H22
AAFA:  B0 18        jr      z,&HAB13
AAFC:  41 10 5C     sbc     $16,&H5C
AAFF:  B4 0E        jr      nz,&HAB0E
AB01:  77 64 AB     cal     &HAB64
AB04:  B1 09        jr      nc,&HAB0E
AB06:  D6 00 12 1D  pre     ix,&H1D12
AB0A:  BC 1E        adw     (ix+$sx),$30
AB0C:  B7 A2        jr      &HAAAF
AB0E:  77 24 B1     cal     &HB124
AB11:  B7 A7        jr      &HAAB9
AB13:  D6 00 18 1E  pre     ix,&H1E18
AB17:  A8 00        ldw     $0,(ix+$sx)
AB19:  89 20        sbw     $0,$sy
AB1B:  89 20        sbw     $0,$sy
AB1D:  D6 00 17 1D  pre     ix,&H1D17
AB21:  20 00        st      $0,(ix+$sx)
AB23:  02 10        ld      $16,$sx
AB25:  77 24 B1     cal     &HB124
AB28:  77 6C B2     cal     &HB26C
AB2B:  F7           rtn   
AB2C:  77 4C A4     cal     &HA44C
AB2F:  35 7C FD     jp      c,&HFD7C
AB32:  41 10 0A     sbc     $16,&H0A
AB35:  30 7C FD     jp      z,&HFD7C
AB38:  41 10 5C     sbc     $16,&H5C
AB3B:  B4 07        jr      nz,&HAB43
AB3D:  77 64 AB     cal     &HAB64
AB40:  35 7C FD     jp      c,&HFD7C
AB43:  D1 00 16 1D  ldw     $0,&H1D16
AB47:  42 02 03     ld      $2,&H03
AB4A:  10 42        st      $2,($sz)
AB4C:  77 24 B1     cal     &HB124
AB4F:  02 10        ld      $16,$sx
AB51:  77 24 B1     cal     &HB124
AB54:  77 4C A4     cal     &HA44C
AB57:  35 7C FD     jp      c,&HFD7C
AB5A:  41 10 27     sbc     $16,&H27
AB5D:  34 7C FD     jp      nz,&HFD7C
AB60:  77 6C B2     cal     &HB26C
AB63:  F7           rtn   
AB64:  77 4C A4     cal     &HA44C
AB67:  35 88 FD     jp      c,&HFD88
AB6A:  41 10 0A     sbc     $16,&H0A
AB6D:  B4 05        jr      nz,&HAB73
AB6F:  54 40 40     pfl     &H40
AB72:  F7           rtn   
AB73:  41 10 22     sbc     $16,&H22
AB76:  B0 40        jr      z,&HABB7
AB78:  41 10 27     sbc     $16,&H27
AB7B:  B0 3B        jr      z,&HABB7
AB7D:  41 10 5C     sbc     $16,&H5C
AB80:  B0 36        jr      z,&HABB7
AB82:  41 10 61     sbc     $16,&H61
AB85:  B4 05        jr      nz,&HAB8B
AB87:  42 90 07 2D  ld      $16,&H07,jr &HABB7
AB8B:  41 10 62     sbc     $16,&H62
AB8E:  B4 05        jr      nz,&HAB94
AB90:  42 90 08 24  ld      $16,&H08,jr &HABB7
AB94:  41 10 74     sbc     $16,&H74
AB97:  B4 05        jr      nz,&HAB9D
AB99:  42 90 09 1B  ld      $16,&H09,jr &HABB7
AB9D:  41 10 66     sbc     $16,&H66
ABA0:  B4 05        jr      nz,&HABA6
ABA2:  42 90 0C 12  ld      $16,&H0C,jr &HABB7
ABA6:  41 10 72     sbc     $16,&H72
ABA9:  B4 05        jr      nz,&HABAF
ABAB:  42 90 0D 09  ld      $16,&H0D,jr &HABB7
ABAF:  41 10 6E     sbc     $16,&H6E
ABB2:  B4 07        jr      nz,&HABBA
ABB4:  42 10 0A     ld      $16,&H0A
ABB7:  14 5F        pfl     $31
ABB9:  F7           rtn   
ABBA:  41 10 58     sbc     $16,&H58
ABBD:  B0 3E        jr      z,&HABFC
ABBF:  41 10 78     sbc     $16,&H78
ABC2:  B0 39        jr      z,&HABFC
ABC4:  77 97 B4     cal     &HB497
ABC7:  B4 75        jr      nz,&HAC3D
ABC9:  42 00 02     ld      $0,&H02
ABCC:  4C 10 07     an      $16,&H07
ABCF:  26 10        phs     $16
ABD1:  26 00        phs     $0
ABD3:  77 4C A4     cal     &HA44C
ABD6:  B1 05        jr      nc,&HABDC
ABD8:  2E 00        pps     $0
ABDA:  B7 5A        jr      &HAC35
ABDC:  77 97 B4     cal     &HB497
ABDF:  B0 05        jr      z,&HABE5
ABE1:  2E 00        pps     $0
ABE3:  B7 51        jr      &HAC35
ABE5:  4C 10 07     an      $16,&H07
ABE8:  AE 00        ppsw    $0
ABEA:  18 61        biu     $1
ABEC:  18 61        biu     $1
ABEE:  18 61        biu     $1
ABF0:  35 88 FD     jp      c,&HFD88
ABF3:  0E 70 01     or      $16,$1
ABF6:  09 20        sb      $0,$sy
ABF8:  B4 AA        jr      nz,&HABA3
ABFA:  B7 42        jr      &HAC3D
ABFC:  02 10        ld      $16,$sx
ABFE:  26 10        phs     $16
AC00:  77 4C A4     cal     &HA44C
AC03:  B5 31        jr      c,&HAC35
AC05:  77 A8 B4     cal     &HB4A8
AC08:  B4 2C        jr      nz,&HAC35
AC0A:  2E 00        pps     $0
AC0C:  44 10 40     anc     $16,&H40
AC0F:  B0 04        jr      z,&HAC14
AC11:  48 10 09     ad      $16,&H09
AC14:  4C 10 0F     an      $16,&H0F
AC17:  26 10        phs     $16
AC19:  77 4C A4     cal     &HA44C
AC1C:  B5 18        jr      c,&HAC35
AC1E:  77 A8 B4     cal     &HB4A8
AC21:  B4 13        jr      nz,&HAC35
AC23:  44 10 40     anc     $16,&H40
AC26:  B0 04        jr      z,&HAC2B
AC28:  48 10 09     ad      $16,&H09
AC2B:  4C 10 0F     an      $16,&H0F
AC2E:  2E 00        pps     $0
AC30:  1A 20        diu     $0
AC32:  0E D0 09     or      $16,$sz,jr &HAC3D
AC35:  D1 00 0E 1D  ldw     $0,&H1D0E
AC39:  10 50        st      $16,($sz)
AC3B:  2E 10        pps     $16
AC3D:  14 5F        pfl     $31
AC3F:  F7           rtn   
AC40:  41 10 30     sbc     $16,&H30
AC43:  B0 58        jr      z,&HAC9C
AC45:  41 10 2E     sbc     $16,&H2E
AC48:  30 23 AD     jp      z,&HAD23
AC4B:  77 24 B1     cal     &HB124
AC4E:  77 4C A4     cal     &HA44C
AC51:  B1 09        jr      nc,&HAC5B
AC53:  D6 00 0E 1D  pre     ix,&H1D0E
AC57:  20 10        st      $16,(ix+$sx)
AC59:  B7 12        jr      &HAC6C
AC5B:  77 4B B4     cal     &HB44B
AC5E:  B0 94        jr      z,&HABF3
AC60:  41 10 2E     sbc     $16,&H2E
AC63:  30 23 AD     jp      z,&HAD23
AC66:  77 61 AD     cal     &HAD61
AC69:  30 3B AD     jp      z,&HAD3B
AC6C:  D6 40 17 1D  pre     iz,&H1D17
AC70:  77 AC 07     cal     &H07AC
AC73:  77 68 F5     cal     &HF568
AC76:  77 3D AE     cal     &HAE3D
AC79:  41 0E 04     sbc     $14,&H04
AC7C:  B4 0C        jr      nz,&HAC89
AC7E:  D1 00 18 1E  ldw     $0,&H1E18
AC82:  D1 02 05 00  ldw     $2,&H0005
AC86:  90 C2 07     stw     $2,($sz),jr &HAC8F
AC89:  41 0E 06     sbc     $14,&H06
AC8C:  34 5D AD     jp      nz,&HAD5D
AC8F:  D6 00 16 1D  pre     ix,&H1D16
AC93:  42 0E 05     ld      $14,&H05
AC96:  E0 0E 80     stm     $14,(ix+$sx),5
AC99:  37 5D AD     jp      &HAD5D
AC9C:  77 4C A4     cal     &HA44C
AC9F:  B1 0B        jr      nc,&HACAB
ACA1:  42 10 30     ld      $16,&H30
ACA4:  77 24 B1     cal     &HB124
ACA7:  42 90 1A 30  ld      $16,&H1A,jr &HACDA
ACAB:  41 10 58     sbc     $16,&H58
ACAE:  B0 36        jr      z,&HACE5
ACB0:  41 10 78     sbc     $16,&H78
ACB3:  B0 31        jr      z,&HACE5
ACB5:  26 10        phs     $16
ACB7:  42 10 30     ld      $16,&H30
ACBA:  77 24 B1     cal     &HB124
ACBD:  2E 10        pps     $16
ACBF:  B7 09        jr      &HACC9
ACC1:  77 24 B1     cal     &HB124
ACC4:  77 4C A4     cal     &HA44C
ACC7:  B5 12        jr      c,&HACDA
ACC9:  77 97 B4     cal     &HB497
ACCC:  B0 8C        jr      z,&HAC59
ACCE:  41 10 2E     sbc     $16,&H2E
ACD1:  B0 51        jr      z,&HAD23
ACD3:  77 61 AD     cal     &HAD61
ACD6:  B0 64        jr      z,&HAD3B
ACD8:  B7 07        jr      &HACE0
ACDA:  D6 00 0E 1D  pre     ix,&H1D0E
ACDE:  20 10        st      $16,(ix+$sx)
ACE0:  77 E1 AD     cal     &HADE1
ACE3:  B7 79        jr      &HAD5D
ACE5:  D6 00 0F 1D  pre     ix,&H1D0F
ACE9:  20 10        st      $16,(ix+$sx)
ACEB:  77 4C A4     cal     &HA44C
ACEE:  B5 06        jr      c,&HACF5
ACF0:  77 A8 B4     cal     &HB4A8
ACF3:  B0 11        jr      z,&HAD05
ACF5:  D6 00 0E 1D  pre     ix,&H1D0E
ACF9:  28 2F        ld      $15,(ix+$sy)
ACFB:  A0 0F        stw     $15,(ix+$sx)
ACFD:  42 10 30     ld      $16,&H30
AD00:  77 24 B1     cal     &HB124
AD03:  B7 1A        jr      &HAD1E
AD05:  D6 00 0F 1D  pre     ix,&H1D0F
AD09:  20 1F        st      $31,(ix+$sx)
AD0B:  77 24 B1     cal     &HB124
AD0E:  77 4C A4     cal     &HA44C
AD11:  B5 06        jr      c,&HAD18
AD13:  77 A8 B4     cal     &HB4A8
AD16:  B0 8C        jr      z,&HACA3
AD18:  D6 00 0E 1D  pre     ix,&H1D0E
AD1C:  20 10        st      $16,(ix+$sx)
AD1E:  77 0B AE     cal     &HAE0B
AD21:  B7 3B        jr      &HAD5D
AD23:  77 24 B1     cal     &HB124
AD26:  77 4C A4     cal     &HA44C
AD29:  B5 0B        jr      c,&HAD35
AD2B:  77 4B B4     cal     &HB44B
AD2E:  B0 8C        jr      z,&HACBB
AD30:  77 61 AD     cal     &HAD61
AD33:  B7 07        jr      &HAD3B
AD35:  D6 00 0E 1D  pre     ix,&H1D0E
AD39:  20 10        st      $16,(ix+$sx)
AD3B:  D6 40 17 1D  pre     iz,&H1D17
AD3F:  77 AC 07     cal     &H07AC
AD42:  77 7E F3     cal     &HF37E
AD45:  D6 00 16 1D  pre     ix,&H1D16
AD49:  42 09 08     ld      $9,&H08
AD4C:  22 09        sti     $9,(ix+$sx)
AD4E:  E2 0A E0     stim    $10,(ix+$sx),8
AD51:  20 1F        st      $31,(ix+$sx)
AD53:  D1 00 18 1E  ldw     $0,&H1E18
AD57:  D1 02 09 00  ldw     $2,&H0009
AD5B:  90 42        stw     $2,($sz)
AD5D:  77 6C B2     cal     &HB26C
AD60:  F7           rtn   
AD61:  41 10 45     sbc     $16,&H45
AD64:  B0 0E        jr      z,&HAD73
AD66:  41 10 65     sbc     $16,&H65
AD69:  B0 09        jr      z,&HAD73
AD6B:  D6 00 0E 1D  pre     ix,&H1D0E
AD6F:  20 10        st      $16,(ix+$sx)
AD71:  B7 6B        jr      &HADDD
AD73:  D6 00 10 1D  pre     ix,&H1D10
AD77:  20 10        st      $16,(ix+$sx)
AD79:  77 4C A4     cal     &HA44C
AD7C:  B5 0B        jr      c,&HAD88
AD7E:  41 10 2B     sbc     $16,&H2B
AD81:  B0 1A        jr      z,&HAD9C
AD83:  41 10 2D     sbc     $16,&H2D
AD86:  B0 15        jr      z,&HAD9C
AD88:  D6 00 0F 1D  pre     ix,&H1D0F
AD8C:  28 2F        ld      $15,(ix+$sy)
AD8E:  02 11        ld      $17,$sx
AD90:  E0 AF 40     stm     $15,(ix-$sy),3
AD93:  B5 49        jr      c,&HADDD
AD95:  77 4B B4     cal     &HB44B
AD98:  B4 44        jr      nz,&HADDD
AD9A:  B7 1E        jr      &HADB9
AD9C:  D6 00 0F 1D  pre     ix,&H1D0F
ADA0:  28 2F        ld      $15,(ix+$sy)
ADA2:  A0 0F        stw     $15,(ix+$sx)
ADA4:  77 4C A4     cal     &HA44C
ADA7:  D6 00 0F 1D  pre     ix,&H1D0F
ADAB:  28 0E        ld      $14,(ix+$sx)
ADAD:  28 2F        ld      $15,(ix+$sy)
ADAF:  E0 AE 40     stm     $14,(ix-$sy),3
ADB2:  B5 2A        jr      c,&HADDD
ADB4:  77 4B B4     cal     &HB44B
ADB7:  B4 25        jr      nz,&HADDD
ADB9:  77 4C A4     cal     &HA44C
ADBC:  77 24 B1     cal     &HB124
ADBF:  77 4C A4     cal     &HA44C
ADC2:  77 24 B1     cal     &HB124
ADC5:  77 4C A4     cal     &HA44C
ADC8:  B5 0B        jr      c,&HADD4
ADCA:  77 4B B4     cal     &HB44B
ADCD:  B4 06        jr      nz,&HADD4
ADCF:  77 24 B1     cal     &HB124
ADD2:  B7 8E        jr      &HAD61
ADD4:  D6 00 0E 1D  pre     ix,&H1D0E
ADD8:  20 10        st      $16,(ix+$sx)
ADDA:  14 DF 04     pfl     $31,jr &HADE0
ADDD:  54 40 80     pfl     &H80
ADE0:  F7           rtn   
ADE1:  D1 0F 00 00  ldw     $15,&H0000
ADE5:  D1 11 00 00  ldw     $17,&H0000
ADE9:  D6 00 17 1D  pre     ix,&H1D17
ADED:  2A 00        ldi     $0,(ix+$sx)
ADEF:  01 00        sbc     $0,$sx
ADF1:  B0 15        jr      z,&HAE07
ADF3:  02 01        ld      $1,$sx
ADF5:  41 01 03     sbc     $1,&H03
ADF8:  B0 08        jr      z,&HAE01
ADFA:  98 6F        biuw    $15
ADFC:  98 31        rouw    $17
ADFE:  08 A1 8B     ad      $1,$sy,jr &HAD8B
AE01:  4C 00 07     an      $0,&H07
AE04:  0E CF 99     or      $15,$sz,jr &HAD9F
AE07:  77 3D AE     cal     &HAE3D
AE0A:  F7           rtn   
AE0B:  D1 0F 00 00  ldw     $15,&H0000
AE0F:  D1 11 00 00  ldw     $17,&H0000
AE13:  D6 00 17 1D  pre     ix,&H1D17
AE17:  2A 00        ldi     $0,(ix+$sx)
AE19:  01 00        sbc     $0,$sx
AE1B:  B0 1D        jr      z,&HAE39
AE1D:  02 01        ld      $1,$sx
AE1F:  41 01 04     sbc     $1,&H04
AE22:  B0 08        jr      z,&HAE2B
AE24:  98 6F        biuw    $15
AE26:  98 31        rouw    $17
AE28:  08 A1 8B     ad      $1,$sy,jr &HADB5
AE2B:  44 00 40     anc     $0,&H40
AE2E:  B0 04        jr      z,&HAE33
AE30:  48 00 09     ad      $0,&H09
AE33:  4C 00 0F     an      $0,&H0F
AE36:  0E CF A1     or      $15,$sz,jr &HADD9
AE39:  77 3D AE     cal     &HAE3D
AE3C:  F7           rtn   
AE3D:  D6 00 0E 1D  pre     ix,&H1D0E
AE41:  28 02        ld      $2,(ix+$sx)
AE43:  41 02 4C     sbc     $2,&H4C
AE46:  B0 06        jr      z,&HAE4D
AE48:  41 02 6C     sbc     $2,&H6C
AE4B:  B4 14        jr      nz,&HAE60
AE4D:  D6 00 17 1D  pre     ix,&H1D17
AE51:  E0 0F 60     stm     $15,(ix+$sx),4
AE54:  77 4C A4     cal     &HA44C
AE57:  D6 00 17 1D  pre     ix,&H1D17
AE5B:  E8 0F 60     ldm     $15,(ix+$sx),4
AE5E:  B7 1B        jr      &HAE7A
AE60:  84 71 11     ancw    $17,$17
AE63:  B4 13        jr      nz,&HAE77
AE65:  44 10 80     anc     $16,&H80
AE68:  B4 05        jr      nz,&HAE6E
AE6A:  42 8E 03 04  ld      $14,&H03,jr &HAE71
AE6E:  42 0E 04     ld      $14,&H04
AE71:  D1 02 03 00  ldw     $2,&H0003
AE75:  B7 0F        jr      &HAE85
AE77:  44 12 80     anc     $18,&H80
AE7A:  42 8E 05 04  ld      $14,&H05,jr &HAE81
AE7E:  42 0E 06     ld      $14,&H06
AE81:  D1 02 05 00  ldw     $2,&H0005
AE85:  D6 00 16 1D  pre     ix,&H1D16
AE89:  E2 0E 80     stim    $14,(ix+$sx),5
AE8C:  20 1F        st      $31,(ix+$sx)
AE8E:  D1 00 18 1E  ldw     $0,&H1E18
AE92:  90 42        stw     $2,($sz)
AE94:  F7           rtn   
AE95:  D1 00 16 1D  ldw     $0,&H1D16
AE99:  10 5F        st      $31,($sz)
AE9B:  02 07        ld      $7,$sx
AE9D:  77 4C A4     cal     &HA44C
AEA0:  35 8E FD     jp      c,&HFD8E
AEA3:  77 5C B4     cal     &HB45C
AEA6:  B4 07        jr      nz,&HAEAE
AEA8:  77 24 B1     cal     &HB124
AEAB:  08 A7 90     ad      $7,$sy,jr &HAE3D
AEAE:  D1 00 0E 1D  ldw     $0,&H1D0E
AEB2:  10 50        st      $16,($sz)
AEB4:  02 68 07     ld      $8,$7
AEB7:  41 08 06     sbc     $8,&H06
AEBA:  34 8E FD     jp      nz,&HFD8E
AEBD:  D1 0F BE 38  ldw     $15,&H38BE
AEC1:  02 71 08     ld      $17,$8
AEC4:  D1 05 1A 1D  ldw     $5,&H1D1A
AEC8:  77 71 9F     cal     &H9F71
AECB:  77 82 0A     cal     &H0A82
AECE:  77 79 85     cal     &H8579
AED1:  34 8E FD     jp      nz,&HFD8E
AED4:  D1 00 1A 1E  ldw     $0,&H1E1A
AED8:  50 40 80     st      &H80,($sz)
AEDB:  54 40 80     pfl     &H80
AEDE:  D1 00 18 1E  ldw     $0,&H1E18
AEE2:  90 5E        stw     $30,($sz)
AEE4:  D1 00 16 1D  ldw     $0,&H1D16
AEE8:  10 5E        st      $30,($sz)
AEEA:  F7           rtn   
AEEB:  D6 00 16 1D  pre     ix,&H1D16
AEEF:  02 00        ld      $0,$sx
AEF1:  42 01 04     ld      $1,&H04
AEF4:  D1 02 00 00  ldw     $2,&H0000
AEF8:  42 04 4E     ld      $4,&H4E
AEFB:  42 05 55     ld      $5,&H55
AEFE:  42 06 4C     ld      $6,&H4C
AF01:  42 07 4C     ld      $7,&H4C
AF04:  E2 00 E0     stim    $0,(ix+$sx),8
AF07:  20 1F        st      $31,(ix+$sx)
AF09:  D1 02 E4 1C  ldw     $2,&H1CE4
AF0D:  91 60 02     ldw     $0,($2)
AF10:  D1 04 0C 00  ldw     $4,&H000C
AF14:  89 60 04     sbw     $0,$4
AF17:  82 52        ldw     $18,$sz
AF19:  90 60 02     stw     $0,($2)
AF1C:  D1 02 16 1D  ldw     $2,&H1D16
AF20:  77 4C 01     cal     &H014C
AF23:  96 12        pre     ix,$18
AF25:  D1 00 E2 1C  ldw     $0,&H1CE2
AF29:  91 50        ldw     $16,($sz)
AF2B:  42 00 08     ld      $0,&H08
AF2E:  A2 50        stiw    $16,(ix+$sz)
AF30:  9E 12        gre     ix,$18
AF32:  D6 00 16 1D  pre     ix,&H1D16
AF36:  42 00 03     ld      $0,&H03
AF39:  D1 01 00 00  ldw     $1,&H0000
AF3D:  E2 00 40     stim    $0,(ix+$sx),3
AF40:  20 1F        st      $31,(ix+$sx)
AF42:  D1 00 18 1E  ldw     $0,&H1E18
AF46:  D1 02 03 00  ldw     $2,&H0003
AF4A:  90 42        stw     $2,($sz)
AF4C:  A6 13        phsw    $19
AF4E:  D1 12 00 00  ldw     $18,&H0000
AF52:  77 A3 B3     cal     &HB3A3
AF55:  AE 00        ppsw    $0
AF57:  90 50        stw     $16,($sz)
AF59:  D6 00 16 1D  pre     ix,&H1D16
AF5D:  02 00        ld      $0,$sx
AF5F:  42 01 03     ld      $1,&H03
AF62:  42 04 45     ld      $4,&H45
AF65:  42 05 4F     ld      $5,&H4F
AF68:  42 06 46     ld      $6,&H46
AF6B:  E2 00 C0     stim    $0,(ix+$sx),7
AF6E:  20 1F        st      $31,(ix+$sx)
AF70:  D1 00 18 1E  ldw     $0,&H1E18
AF74:  D1 02 0B 00  ldw     $2,&H000B
AF78:  90 42        stw     $2,($sz)
AF7A:  77 0F B3     cal     &HB30F
AF7D:  96 12        pre     ix,$18
AF7F:  D1 00 E2 1C  ldw     $0,&H1CE2
AF83:  91 50        ldw     $16,($sz)
AF85:  A2 10        stiw    $16,(ix+$sx)
AF87:  9E 12        gre     ix,$18
AF89:  A6 13        phsw    $19
AF8B:  D6 00 16 1D  pre     ix,&H1D16
AF8F:  02 00        ld      $0,$sx
AF91:  02 21        ld      $1,$sy
AF93:  42 04 28     ld      $4,&H28
AF96:  E2 00 80     stim    $0,(ix+$sx),5
AF99:  20 1F        st      $31,(ix+$sx)
AF9B:  77 71 B1     cal     &HB171
AF9E:  77 A3 B3     cal     &HB3A3
AFA1:  D6 00 16 1D  pre     ix,&H1D16
AFA5:  02 00        ld      $0,$sx
AFA7:  02 21        ld      $1,$sy
AFA9:  42 04 2D     ld      $4,&H2D
AFAC:  E2 00 80     stim    $0,(ix+$sx),5
AFAF:  20 1F        st      $31,(ix+$sx)
AFB1:  77 71 B1     cal     &HB171
AFB4:  77 A3 B3     cal     &HB3A3
AFB7:  D6 00 16 1D  pre     ix,&H1D16
AFBB:  42 00 03     ld      $0,&H03
AFBE:  82 21        ldw     $1,$sy
AFC0:  E2 00 40     stim    $0,(ix+$sx),3
AFC3:  20 1F        st      $31,(ix+$sx)
AFC5:  D1 00 18 1E  ldw     $0,&H1E18
AFC9:  D1 02 03 00  ldw     $2,&H0003
AFCD:  90 42        stw     $2,($sz)
AFCF:  D1 12 00 00  ldw     $18,&H0000
AFD3:  77 A3 B3     cal     &HB3A3
AFD6:  D6 00 16 1D  pre     ix,&H1D16
AFDA:  02 00        ld      $0,$sx
AFDC:  02 21        ld      $1,$sy
AFDE:  42 04 29     ld      $4,&H29
AFE1:  E2 00 80     stim    $0,(ix+$sx),5
AFE4:  20 1F        st      $31,(ix+$sx)
AFE6:  77 71 B1     cal     &HB171
AFE9:  77 A3 B3     cal     &HB3A3
AFEC:  AE 00        ppsw    $0
AFEE:  90 50        stw     $16,($sz)
AFF0:  D6 00 16 1D  pre     ix,&H1D16
AFF4:  02 00        ld      $0,$sx
AFF6:  42 01 04     ld      $1,&H04
AFF9:  42 04 46     ld      $4,&H46
AFFC:  42 05 49     ld      $5,&H49
AFFF:  42 06 4C     ld      $6,&H4C
B002:  42 07 45     ld      $7,&H45
B005:  E2 00 E0     stim    $0,(ix+$sx),8
B008:  20 1F        st      $31,(ix+$sx)
B00A:  D1 00 18 1E  ldw     $0,&H1E18
B00E:  D1 02 0C 00  ldw     $2,&H000C
B012:  90 42        stw     $2,($sz)
B014:  77 0F B3     cal     &HB30F
B017:  96 12        pre     ix,$18
B019:  D1 00 E2 1C  ldw     $0,&H1CE2
B01D:  91 50        ldw     $16,($sz)
B01F:  A2 10        stiw    $16,(ix+$sx)
B021:  9E 12        gre     ix,$18
B023:  A6 13        phsw    $19
B025:  D6 00 16 1D  pre     ix,&H1D16
B029:  02 00        ld      $0,$sx
B02B:  42 01 04     ld      $1,&H04
B02E:  42 04 63     ld      $4,&H63
B031:  42 05 68     ld      $5,&H68
B034:  42 06 61     ld      $6,&H61
B037:  42 07 72     ld      $7,&H72
B03A:  E2 00 E0     stim    $0,(ix+$sx),8
B03D:  20 1F        st      $31,(ix+$sx)
B03F:  77 71 B1     cal     &HB171
B042:  77 A3 B3     cal     &HB3A3
B045:  AE 00        ppsw    $0
B047:  90 50        stw     $16,($sz)
B049:  F7           rtn   
B04A:  D6 00 1A 1E  pre     ix,&H1E1A
B04E:  42 00 20     ld      $0,&H20
B051:  3C 00        ad      (ix+$sx),$0
B053:  77 8F A9     cal     &HA98F
B056:  35 8E FD     jp      c,&HFD8E
B059:  34 8E FD     jp      nz,&HFD8E
B05C:  D1 00 16 1D  ldw     $0,&H1D16
B060:  91 42        ldw     $2,($sz)
B062:  01 02        sbc     $2,$sx
B064:  34 8E FD     jp      nz,&HFD8E
B067:  D6 00 18 1E  pre     ix,&H1E18
B06B:  42 00 04     ld      $0,&H04
B06E:  3C 00        ad      (ix+$sx),$0
B070:  77 0F B3     cal     &HB30F
B073:  A6 13        phsw    $19
B075:  D6 00 1A 1E  pre     ix,&H1E1A
B079:  42 00 20     ld      $0,&H20
B07C:  3E 00        sb      (ix+$sx),$0
B07E:  77 4C A4     cal     &HA44C
B081:  35 8E FD     jp      c,&HFD8E
B084:  77 35 B4     cal     &HB435
B087:  31 8E FD     jp      nc,&HFD8E
B08A:  41 10 0A     sbc     $16,&H0A
B08D:  30 8E FD     jp      z,&HFD8E
B090:  77 8F A9     cal     &HA98F
B093:  35 8E FD     jp      c,&HFD8E
B096:  34 8E FD     jp      nz,&HFD8E
B099:  AE 00        ppsw    $0
B09B:  96 00        pre     ix,$0
B09D:  D1 00 E2 1C  ldw     $0,&H1CE2
B0A1:  91 50        ldw     $16,($sz)
B0A3:  A2 10        stiw    $16,(ix+$sx)
B0A5:  9E 00        gre     ix,$0
B0A7:  A6 01        phsw    $1
B0A9:  77 A3 B3     cal     &HB3A3
B0AC:  AE 00        ppsw    $0
B0AE:  90 50        stw     $16,($sz)
B0B0:  A6 01        phsw    $1
B0B2:  77 8F A9     cal     &HA98F
B0B5:  B5 05        jr      c,&HB0BB
B0B7:  B4 03        jr      nz,&HB0BB
B0B9:  B7 91        jr      &HB04B
B0BB:  AE 00        ppsw    $0
B0BD:  D1 00 1A 1E  ldw     $0,&H1E1A
B0C1:  10 5F        st      $31,($sz)
B0C3:  F7           rtn   
B0C4:  D6 00 17 1D  pre     ix,&H1D17
B0C8:  E8 10 60     ldm     $16,(ix+$sx),4
B0CB:  A6 13        phsw    $19
B0CD:  77 FF B3     cal     &HB3FF
B0D0:  AE 00        ppsw    $0
B0D2:  81 60 10     sbcw    $0,$16
B0D5:  B0 0B        jr      z,&HB0E1
B0D7:  D6 00 17 1D  pre     ix,&H1D17
B0DB:  A2 10        stiw    $16,(ix+$sx)
B0DD:  A0 00        stw     $0,(ix+$sx)
B0DF:  B7 07        jr      &HB0E7
B0E1:  D1 00 1A 1E  ldw     $0,&H1E1A
B0E5:  10 5F        st      $31,($sz)
B0E7:  F7           rtn   
B0E8:  D1 00 16 1D  ldw     $0,&H1D16
B0EC:  10 5F        st      $31,($sz)
B0EE:  77 24 B1     cal     &HB124
B0F1:  77 71 B1     cal     &HB171
B0F4:  34 70 FD     jp      nz,&HFD70
B0F7:  A6 13        phsw    $19
B0F9:  77 4C A4     cal     &HA44C
B0FC:  D1 00 0E 1D  ldw     $0,&H1D0E
B100:  10 50        st      $16,($sz)
B102:  B5 12        jr      c,&HB115
B104:  77 24 B1     cal     &HB124
B107:  77 71 B1     cal     &HB171
B10A:  B4 0A        jr      nz,&HB115
B10C:  AE 00        ppsw    $0
B10E:  D1 00 0E 1D  ldw     $0,&H1D0E
B112:  10 DF 9D     st      $31,($sz),jr &HB0B1
B115:  AE 12        ppsw    $18
B117:  D1 00 18 1E  ldw     $0,&H1E18
B11B:  90 5E        stw     $30,($sz)
B11D:  D1 00 16 1D  ldw     $0,&H1D16
B121:  10 5E        st      $30,($sz)
B123:  F7           rtn   
B124:  A6 01        phsw    $1
B126:  D1 00 18 1E  ldw     $0,&H1E18
B12A:  91 42        ldw     $2,($sz)
B12C:  D1 00 01 01  ldw     $0,&H0101
B130:  81 42        sbcw    $2,$sz
B132:  D1 00 16 1D  ldw     $0,&H1D16
B136:  11 44        ld      $4,($sz)
B138:  B0 20        jr      z,&HB159
B13A:  31 82 FD     jp      nc,&HFD82
B13D:  01 04        sbc     $4,$sx
B13F:  B4 0E        jr      nz,&HB14E
B141:  41 02 0C     sbc     $2,&H0C
B144:  B1 29        jr      nc,&HB16E
B146:  41 02 04     sbc     $2,&H04
B149:  B1 04        jr      nc,&HB14E
B14B:  42 02 04     ld      $2,&H04
B14E:  88 60 02     adw     $0,$2
B151:  26 11        phs     $17
B153:  02 11        ld      $17,$sx
B155:  90 50        stw     $16,($sz)
B157:  2E 11        pps     $17
B159:  D1 00 18 1E  ldw     $0,&H1E18
B15D:  88 22        adw     $2,$sy
B15F:  90 42        stw     $2,($sz)
B161:  01 04        sbc     $4,$sx
B163:  B4 0A        jr      nz,&HB16E
B165:  49 02 04     sb      $2,&H04
B168:  D1 00 17 1D  ldw     $0,&H1D17
B16C:  10 42        st      $2,($sz)
B16E:  AE 00        ppsw    $0
B170:  F7           rtn   
B171:  77 71 9F     cal     &H9F71
B174:  D6 00 16 1D  pre     ix,&H1D16
B178:  28 22        ld      $2,(ix+$sy)
B17A:  41 02 09     sbc     $2,&H09
B17D:  31 65 B2     jp      nc,&HB265
B180:  6C 14 04     ldd     $20,(ix+&H04)
B183:  01 22        sbc     $2,$sy
B185:  B4 16        jr      nz,&HB19C
B187:  D6 40 C5 38  pre     iz,&H38C5
B18B:  AB 00        ldiw    $0,(iz+$sx)
B18D:  01 00        sbc     $0,$sx
B18F:  30 65 B2     jp      z,&HB265
B192:  2B 06        ldi     $6,(iz+$sx)
B194:  01 66 14     sbc     $6,$20
B197:  30 5D B2     jp      z,&HB25D
B19A:  B7 90        jr      &HB12B
B19C:  41 02 02     sbc     $2,&H02
B19F:  B4 18        jr      nz,&HB1B8
B1A1:  A8 14        ldw     $20,(ix+$sx)
B1A3:  D6 40 0E 39  pre     iz,&H390E
B1A7:  AB 00        ldiw    $0,(iz+$sx)
B1A9:  01 00        sbc     $0,$sx
B1AB:  30 65 B2     jp      z,&HB265
B1AE:  AB 06        ldiw    $6,(iz+$sx)
B1B0:  81 66 14     sbcw    $6,$20
B1B3:  30 5D B2     jp      z,&HB25D
B1B6:  B7 90        jr      &HB147
B1B8:  41 02 03     sbc     $2,&H03
B1BB:  B4 1A        jr      nz,&HB1D6
B1BD:  E8 14 40     ldm     $20,(ix+$sx),3
B1C0:  D6 40 63 39  pre     iz,&H3963
B1C4:  AB 00        ldiw    $0,(iz+$sx)
B1C6:  01 00        sbc     $0,$sx
B1C8:  30 65 B2     jp      z,&HB265
B1CB:  EB 06 40     ldim    $6,(iz+$sx),3
B1CE:  C7 66 54     xrcm    $6,$20,3
B1D1:  30 5D B2     jp      z,&HB25D
B1D4:  B7 91        jr      &HB166
B1D6:  41 02 04     sbc     $2,&H04
B1D9:  B4 18        jr      nz,&HB1F2
B1DB:  E8 14 60     ldm     $20,(ix+$sx),4
B1DE:  D6 40 9B 39  pre     iz,&H399B
B1E2:  AB 00        ldiw    $0,(iz+$sx)
B1E4:  01 00        sbc     $0,$sx
B1E6:  B0 7E        jr      z,&HB265
B1E8:  EB 06 60     ldim    $6,(iz+$sx),4
B1EB:  C7 66 74     xrcm    $6,$20,4
B1EE:  B0 6E        jr      z,&HB25D
B1F0:  B7 8F        jr      &HB180
B1F2:  41 02 05     sbc     $2,&H05
B1F5:  B4 18        jr      nz,&HB20E
B1F7:  E8 14 80     ldm     $20,(ix+$sx),5
B1FA:  D6 40 20 3A  pre     iz,&H3A20
B1FE:  AB 00        ldiw    $0,(iz+$sx)
B200:  01 00        sbc     $0,$sx
B202:  B0 62        jr      z,&HB265
B204:  EB 06 80     ldim    $6,(iz+$sx),5
B207:  C7 66 94     xrcm    $6,$20,5
B20A:  B0 52        jr      z,&HB25D
B20C:  B7 8F        jr      &HB19C
B20E:  41 02 06     sbc     $2,&H06
B211:  B4 18        jr      nz,&HB22A
B213:  E8 14 A0     ldm     $20,(ix+$sx),6
B216:  D6 40 9F 3A  pre     iz,&H3A9F
B21A:  AB 00        ldiw    $0,(iz+$sx)
B21C:  01 00        sbc     $0,$sx
B21E:  B0 46        jr      z,&HB265
B220:  EB 06 A0     ldim    $6,(iz+$sx),6
B223:  C7 66 B4     xrcm    $6,$20,6
B226:  B0 36        jr      z,&HB25D
B228:  B7 8F        jr      &HB1B8
B22A:  41 02 07     sbc     $2,&H07
B22D:  B4 18        jr      nz,&HB246
B22F:  E8 14 C0     ldm     $20,(ix+$sx),7
B232:  D6 40 50 3B  pre     iz,&H3B50
B236:  AB 00        ldiw    $0,(iz+$sx)
B238:  01 00        sbc     $0,$sx
B23A:  B0 2A        jr      z,&HB265
B23C:  EB 06 C0     ldim    $6,(iz+$sx),7
B23F:  C7 66 D4     xrcm    $6,$20,7
B242:  B0 1A        jr      z,&HB25D
B244:  B7 8F        jr      &HB1D4
B246:  E8 14 E0     ldm     $20,(ix+$sx),8
B249:  D6 40 99 3B  pre     iz,&H3B99
B24D:  AB 00        ldiw    $0,(iz+$sx)
B24F:  01 00        sbc     $0,$sx
B251:  B0 13        jr      z,&HB265
B253:  EB 06 E0     ldim    $6,(iz+$sx),8
B256:  C7 66 F4     xrcm    $6,$20,8
B259:  B0 03        jr      z,&HB25D
B25B:  B7 8F        jr      &HB1EB
B25D:  82 52        ldw     $18,$sz
B25F:  77 79 85     cal     &H8579
B262:  14 DF 07     pfl     $31,jr &HB26B
B265:  77 79 85     cal     &H8579
B268:  54 40 80     pfl     &H80
B26B:  F7           rtn   
B26C:  D1 12 00 00  ldw     $18,&H0000
B270:  D1 00 1A 1E  ldw     $0,&H1E1A
B274:  11 42        ld      $2,($sz)
B276:  44 02 80     anc     $2,&H80
B279:  F4           rtn     nz
B27A:  D1 00 16 1D  ldw     $0,&H1D16
B27E:  11 42        ld      $2,($sz)
B280:  01 02        sbc     $2,$sx
B282:  B4 15        jr      nz,&HB298
B284:  77 DC B2     cal     &HB2DC
B287:  84 72 12     ancw    $18,$18
B28A:  B4 44        jr      nz,&HB2CF
B28C:  D1 00 14 1D  ldw     $0,&H1D14
B290:  91 42        ldw     $2,($sz)
B292:  D1 00 18 1D  ldw     $0,&H1D18
B296:  90 42        stw     $2,($sz)
B298:  D1 00 DA 1C  ldw     $0,&H1CDA
B29C:  91 42        ldw     $2,($sz)
B29E:  D1 00 18 1E  ldw     $0,&H1E18
B2A2:  91 44        ldw     $4,($sz)
B2A4:  D1 00 DC 1C  ldw     $0,&H1CDC
B2A8:  91 52        ldw     $18,($sz)
B2AA:  89 72 04     sbw     $18,$4
B2AD:  81 72 02     sbcw    $18,$2
B2B0:  35 06 FE     jp      c,&HFE06
B2B3:  90 52        stw     $18,($sz)
B2B5:  82 60 12     ldw     $0,$18
B2B8:  D1 02 16 1D  ldw     $2,&H1D16
B2BC:  77 4C 01     cal     &H014C
B2BF:  D1 00 16 1D  ldw     $0,&H1D16
B2C3:  11 42        ld      $2,($sz)
B2C5:  01 02        sbc     $2,$sx
B2C7:  B4 07        jr      nz,&HB2CF
B2C9:  D1 00 14 1D  ldw     $0,&H1D14
B2CD:  90 52        stw     $18,($sz)
B2CF:  D1 00 18 1E  ldw     $0,&H1E18
B2D3:  90 5E        stw     $30,($sz)
B2D5:  D1 00 16 1D  ldw     $0,&H1D16
B2D9:  10 5E        st      $30,($sz)
B2DB:  F7           rtn   
B2DC:  D6 00 16 1D  pre     ix,&H1D16
B2E0:  2A 27        ldi     $7,(ix+$sy)
B2E2:  02 68 07     ld      $8,$7
B2E5:  9E 05        gre     ix,$5
B2E7:  88 25        adw     $5,$sy
B2E9:  88 25        adw     $5,$sy
B2EB:  D6 40 14 1D  pre     iz,&H1D14
B2EF:  A9 12        ldw     $18,(iz+$sx)
B2F1:  84 72 12     ancw    $18,$18
B2F4:  B0 19        jr      z,&HB30E
B2F6:  96 52        pre     iz,$18
B2F8:  2B 31        ldi     $17,(iz+$sy)
B2FA:  01 71 07     sbc     $17,$7
B2FD:  B4 8F        jr      nz,&HB28D
B2FF:  9E 4F        gre     iz,$15
B301:  88 2F        adw     $15,$sy
B303:  88 2F        adw     $15,$sy
B305:  77 82 0A     cal     &H0A82
B308:  B0 05        jr      z,&HB30E
B30A:  02 E7 08 9E  ld      $7,$8,jr &HB2AB
B30E:  F7           rtn   
B30F:  77 66 B3     cal     &HB366
B312:  84 72 12     ancw    $18,$18
B315:  B4 43        jr      nz,&HB359
B317:  D1 00 E4 1C  ldw     $0,&H1CE4
B31B:  91 42        ldw     $2,($sz)
B31D:  D1 00 18 1D  ldw     $0,&H1D18
B321:  90 42        stw     $2,($sz)
B323:  D1 00 E2 1C  ldw     $0,&H1CE2
B327:  91 42        ldw     $2,($sz)
B329:  D1 00 18 1E  ldw     $0,&H1E18
B32D:  91 44        ldw     $4,($sz)
B32F:  D1 00 E4 1C  ldw     $0,&H1CE4
B333:  91 52        ldw     $18,($sz)
B335:  89 72 04     sbw     $18,$4
B338:  81 72 02     sbcw    $18,$2
B33B:  35 56 FE     jp      c,&HFE56
B33E:  90 52        stw     $18,($sz)
B340:  82 60 12     ldw     $0,$18
B343:  D1 02 16 1D  ldw     $2,&H1D16
B347:  77 4C 01     cal     &H014C
B34A:  D1 00 18 1E  ldw     $0,&H1E18
B34E:  91 44        ldw     $4,($sz)
B350:  D1 00 04 00  ldw     $0,&H0004
B354:  89 44        sbw     $4,$sz
B356:  88 72 04     adw     $18,$4
B359:  D1 00 18 1E  ldw     $0,&H1E18
B35D:  90 5E        stw     $30,($sz)
B35F:  D1 00 16 1D  ldw     $0,&H1D16
B363:  10 5E        st      $30,($sz)
B365:  F7           rtn   
B366:  D6 00 16 1D  pre     ix,&H1D16
B36A:  2A 27        ldi     $7,(ix+$sy)
B36C:  02 68 07     ld      $8,$7
B36F:  9E 05        gre     ix,$5
B371:  88 25        adw     $5,$sy
B373:  88 25        adw     $5,$sy
B375:  D6 40 E4 1C  pre     iz,&H1CE4
B379:  A9 12        ldw     $18,(iz+$sx)
B37B:  96 52        pre     iz,$18
B37D:  2B 31        ldi     $17,(iz+$sy)
B37F:  01 71 07     sbc     $17,$7
B382:  B4 0C        jr      nz,&HB38F
B384:  9E 4F        gre     iz,$15
B386:  88 2F        adw     $15,$sy
B388:  88 2F        adw     $15,$sy
B38A:  77 82 0A     cal     &H0A82
B38D:  B0 0C        jr      z,&HB39A
B38F:  A9 12        ldw     $18,(iz+$sx)
B391:  84 72 12     ancw    $18,$18
B394:  B0 0D        jr      z,&HB3A2
B396:  02 E7 08 9E  ld      $7,$8,jr &HB337
B39A:  02 09        ld      $9,$sx
B39C:  88 6F 08     adw     $15,$8
B39F:  82 72 0F     ldw     $18,$15
B3A2:  F7           rtn   
B3A3:  84 72 12     ancw    $18,$18
B3A6:  B4 0F        jr      nz,&HB3B6
B3A8:  D1 00 18 1E  ldw     $0,&H1E18
B3AC:  91 44        ldw     $4,($sz)
B3AE:  D1 02 02 00  ldw     $2,&H0002
B3B2:  88 E2 04 14  adw     $2,$4,jr &HB3C9
B3B6:  D6 00 16 1D  pre     ix,&H1D16
B3BA:  D1 00 00 00  ldw     $0,&H0000
B3BE:  A2 00        stiw    $0,(ix+$sx)
B3C0:  A0 12        stw     $18,(ix+$sx)
B3C2:  D1 04 04 00  ldw     $4,&H0004
B3C6:  82 62 04     ldw     $2,$4
B3C9:  D1 00 E4 1C  ldw     $0,&H1CE4
B3CD:  91 46        ldw     $6,($sz)
B3CF:  D1 00 E2 1C  ldw     $0,&H1CE2
B3D3:  91 50        ldw     $16,($sz)
B3D5:  96 10        pre     ix,$16
B3D7:  88 70 02     adw     $16,$2
B3DA:  81 66 10     sbcw    $6,$16
B3DD:  35 56 FE     jp      c,&HFE56
B3E0:  90 50        stw     $16,($sz)
B3E2:  84 72 12     ancw    $18,$18
B3E5:  B4 03        jr      nz,&HB3E9
B3E7:  A2 04        stiw    $4,(ix+$sx)
B3E9:  9E 00        gre     ix,$0
B3EB:  D1 02 16 1D  ldw     $2,&H1D16
B3EF:  77 4C 01     cal     &H014C
B3F2:  D1 00 18 1E  ldw     $0,&H1E18
B3F6:  90 5E        stw     $30,($sz)
B3F8:  D1 00 16 1D  ldw     $0,&H1D16
B3FC:  10 5E        st      $30,($sz)
B3FE:  F7           rtn   
B3FF:  96 10        pre     ix,$16
B401:  AA 04        ldiw    $4,(ix+$sx)
B403:  84 64 04     ancw    $4,$4
B406:  B4 12        jr      nz,&HB419
B408:  AA 12        ldiw    $18,(ix+$sx)
B40A:  9E 10        gre     ix,$16
B40C:  D1 00 18 1E  ldw     $0,&H1E18
B410:  90 5E        stw     $30,($sz)
B412:  D1 00 16 1D  ldw     $0,&H1D16
B416:  10 DE 1C     st      $30,($sz),jr &HB434
B419:  D1 00 18 1E  ldw     $0,&H1E18
B41D:  90 44        stw     $4,($sz)
B41F:  9E 10        gre     ix,$16
B421:  88 70 04     adw     $16,$4
B424:  A6 11        phsw    $17
B426:  D1 00 16 1D  ldw     $0,&H1D16
B42A:  9E 02        gre     ix,$2
B42C:  77 4C 01     cal     &H014C
B42F:  77 6C B2     cal     &HB26C
B432:  AE 10        ppsw    $16
B434:  F7           rtn   
B435:  41 10 09     sbc     $16,&H09
B438:  B5 0B        jr      c,&HB444
B43A:  41 10 0E     sbc     $16,&H0E
B43D:  B5 09        jr      c,&HB447
B43F:  41 10 20     sbc     $16,&H20
B442:  B0 04        jr      z,&HB447
B444:  14 DF 04     pfl     $31,jr &HB44A
B447:  54 40 40     pfl     &H40
B44A:  F7           rtn   
B44B:  41 10 30     sbc     $16,&H30
B44E:  B5 09        jr      c,&HB458
B450:  41 10 3A     sbc     $16,&H3A
B453:  B1 04        jr      nc,&HB458
B455:  14 DF 04     pfl     $31,jr &HB45B
B458:  54 40 80     pfl     &H80
B45B:  F7           rtn   
B45C:  41 10 41     sbc     $16,&H41
B45F:  B5 18        jr      c,&HB478
B461:  41 10 5B     sbc     $16,&H5B
B464:  B5 10        jr      c,&HB475
B466:  41 10 5F     sbc     $16,&H5F
B469:  B0 0B        jr      z,&HB475
B46B:  41 10 61     sbc     $16,&H61
B46E:  B5 09        jr      c,&HB478
B470:  41 10 7B     sbc     $16,&H7B
B473:  B1 04        jr      nc,&HB478
B475:  14 DF 04     pfl     $31,jr &HB47B
B478:  54 40 80     pfl     &H80
B47B:  F7           rtn   
B47C:  41 10 20     sbc     $16,&H20
B47F:  B5 13        jr      c,&HB493
B481:  41 10 7F     sbc     $16,&H7F
B484:  B5 0B        jr      c,&HB490
B486:  41 10 A1     sbc     $16,&HA1
B489:  B5 09        jr      c,&HB493
B48B:  41 10 F0     sbc     $16,&HF0
B48E:  B1 04        jr      nc,&HB493
B490:  14 DF 04     pfl     $31,jr &HB496
B493:  54 40 80     pfl     &H80
B496:  F7           rtn   
B497:  41 10 30     sbc     $16,&H30
B49A:  B5 09        jr      c,&HB4A4
B49C:  41 10 38     sbc     $16,&H38
B49F:  B1 04        jr      nc,&HB4A4
B4A1:  14 DF 04     pfl     $31,jr &HB4A7
B4A4:  54 40 80     pfl     &H80
B4A7:  F7           rtn   
B4A8:  41 10 30     sbc     $16,&H30
B4AB:  B5 20        jr      c,&HB4CC
B4AD:  41 10 3A     sbc     $16,&H3A
B4B0:  B5 18        jr      c,&HB4C9
B4B2:  41 10 41     sbc     $16,&H41
B4B5:  B5 16        jr      c,&HB4CC
B4B7:  41 10 47     sbc     $16,&H47
B4BA:  B5 0E        jr      c,&HB4C9
B4BC:  41 10 61     sbc     $16,&H61
B4BF:  B5 0C        jr      c,&HB4CC
B4C1:  41 10 67     sbc     $16,&H67
B4C4:  B1 07        jr      nc,&HB4CC
B4C6:  4C 10 DF     an      $16,&HDF
B4C9:  14 DF 04     pfl     $31,jr &HB4CF
B4CC:  54 40 80     pfl     &H80
B4CF:  F7           rtn   
B4D0:  D6 00 EF 1C  pre     ix,&H1CEF
B4D4:  20 1F        st      $31,(ix+$sx)
B4D6:  D6 00 1D 1E  pre     ix,&H1E1D
B4DA:  20 1F        st      $31,(ix+$sx)
B4DC:  D6 00 1C 1E  pre     ix,&H1E1C
B4E0:  20 1F        st      $31,(ix+$sx)
B4E2:  77 7A C7     cal     &HC77A
B4E5:  77 4B A9     cal     &HA94B
B4E8:  B5 38        jr      c,&HB521
B4EA:  77 22 B5     cal     &HB522
B4ED:  77 83 B5     cal     &HB583
B4F0:  77 BC C7     cal     &HC7BC
B4F3:  77 95 B6     cal     &HB695
B4F6:  B1 A1        jr      nc,&HB498
B4F8:  B0 1A        jr      z,&HB513
B4FA:  77 A2 B8     cal     &HB8A2
B4FD:  D6 00 08 1D  pre     ix,&H1D08
B501:  A8 12        ldw     $18,(ix+$sx)
B503:  41 12 60     sbc     $18,&H60
B506:  B0 B1        jr      z,&HB4B8
B508:  D6 00 1D 1E  pre     ix,&H1E1D
B50C:  3C 1E        ad      (ix+$sx),$30
B50E:  77 4B A9     cal     &HA94B
B511:  B7 A2        jr      &HB4B4
B513:  D6 00 1D 1E  pre     ix,&H1E1D
B517:  3A 1F        sbc     (ix+$sx),$31
B519:  34 70 FD     jp      nz,&HFD70
B51C:  77 B0 B9     cal     &HB9B0
B51F:  B7 CA        jr      &HB4EA
B521:  F7           rtn   
B522:  D6 00 08 1D  pre     ix,&H1D08
B526:  A8 12        ldw     $18,(ix+$sx)
B528:  D6 00 1C 1E  pre     ix,&H1E1C
B52C:  28 02        ld      $2,(ix+$sx)
B52E:  01 13        sbc     $19,$sx
B530:  B0 06        jr      z,&HB537
B532:  09 40        sb      $0,$sz
B534:  14 40        pfl     $0
B536:  F7           rtn   
B537:  41 12 03     sbc     $18,&H03
B53A:  B4 0E        jr      nz,&HB549
B53C:  01 02        sbc     $2,$sx
B53E:  B0 07        jr      z,&HB546
B540:  41 02 02     sbc     $2,&H02
B543:  34 94 FD     jp      nz,&HFD94
B546:  02 A3 26     ld      $3,$sy,jr &HB56E
B549:  41 12 02     sbc     $18,&H02
B54C:  B4 0B        jr      nz,&HB558
B54E:  41 02 02     sbc     $2,&H02
B551:  34 94 FD     jp      nz,&HFD94
B554:  42 83 02 17  ld      $3,&H02,jr &HB56E
B558:  01 32        sbc     $18,$sy
B55A:  B0 07        jr      z,&HB562
B55C:  41 12 04     sbc     $18,&H04
B55F:  34 94 FD     jp      nz,&HFD94
B562:  01 22        sbc     $2,$sy
B564:  B0 15        jr      z,&HB57A
B566:  41 02 02     sbc     $2,&H02
B569:  B0 10        jr      z,&HB57A
B56B:  37 94 FD     jp      &HFD94
B56E:  D6 00 5A 1F  pre     ix,&H1F5A
B572:  20 03        st      $3,(ix+$sx)
B574:  D6 00 76 1F  pre     ix,&H1F76
B578:  20 03        st      $3,(ix+$sx)
B57A:  77 4B A9     cal     &HA94B
B57D:  42 00 40     ld      $0,&H40
B580:  14 40        pfl     $0
B582:  F7           rtn   
B583:  D6 00 08 1D  pre     ix,&H1D08
B587:  A8 12        ldw     $18,(ix+$sx)
B589:  01 33        sbc     $19,$sy
B58B:  B0 06        jr      z,&HB592
B58D:  09 40        sb      $0,$sz
B58F:  14 40        pfl     $0
B591:  F7           rtn   
B592:  41 12 08     sbc     $18,&H08
B595:  B4 09        jr      nz,&HB59F
B597:  02 04        ld      $4,$sx
B599:  89 65 05     sbw     $5,$5
B59C:  37 6E B6     jp      &HB66E
B59F:  41 12 0E     sbc     $18,&H0E
B5A2:  B4 0B        jr      nz,&HB5AE
B5A4:  42 04 07     ld      $4,&H07
B5A7:  D1 05 04 00  ldw     $5,&H0004
B5AB:  37 6E B6     jp      &HB66E
B5AE:  41 12 0F     sbc     $18,&H0F
B5B1:  B4 0B        jr      nz,&HB5BD
B5B3:  42 04 08     ld      $4,&H08
B5B6:  D1 05 08 00  ldw     $5,&H0008
B5BA:  37 6E B6     jp      &HB66E
B5BD:  41 12 10     sbc     $18,&H10
B5C0:  30 9A FD     jp      z,&HFD9A
B5C3:  41 12 11     sbc     $18,&H11
B5C6:  30 9A FD     jp      z,&HFD9A
B5C9:  09 63 03     sb      $3,$3
B5CC:  41 12 0D     sbc     $18,&H0D
B5CF:  B4 12        jr      nz,&HB5E2
B5D1:  77 4B A9     cal     &HA94B
B5D4:  02 23        ld      $3,$sy
B5D6:  42 04 04     ld      $4,&H04
B5D9:  D1 05 02 00  ldw     $5,&H0002
B5DD:  01 33        sbc     $19,$sy
B5DF:  34 77 B6     jp      nz,&HB677
B5E2:  41 12 09     sbc     $18,&H09
B5E5:  B4 10        jr      nz,&HB5F6
B5E7:  01 03        sbc     $3,$sx
B5E9:  34 9A FD     jp      nz,&HFD9A
B5EC:  02 24        ld      $4,$sy
B5EE:  08 64 03     ad      $4,$3
B5F1:  82 25        ldw     $5,$sy
B5F3:  37 6E B6     jp      &HB66E
B5F6:  41 12 0B     sbc     $18,&H0B
B5F9:  B4 0D        jr      nz,&HB607
B5FB:  42 04 03     ld      $4,&H03
B5FE:  08 64 03     ad      $4,$3
B601:  D1 05 02 00  ldw     $5,&H0002
B605:  B7 68        jr      &HB66E
B607:  41 12 0A     sbc     $18,&H0A
B60A:  B4 1D        jr      nz,&HB628
B60C:  26 03        phs     $3
B60E:  77 4B A9     cal     &HA94B
B611:  2E 03        pps     $3
B613:  01 33        sbc     $19,$sy
B615:  B4 06        jr      nz,&HB61C
B617:  41 12 0B     sbc     $18,&H0B
B61A:  B0 A0        jr      z,&HB5BB
B61C:  42 04 03     ld      $4,&H03
B61F:  08 64 03     ad      $4,$3
B622:  D1 05 02 00  ldw     $5,&H0002
B626:  B7 50        jr      &HB677
B628:  41 12 0C     sbc     $18,&H0C
B62B:  B4 3B        jr      nz,&HB667
B62D:  01 03        sbc     $3,$sx
B62F:  34 9A FD     jp      nz,&HFD9A
B632:  26 03        phs     $3
B634:  77 4B A9     cal     &HA94B
B637:  2E 03        pps     $3
B639:  01 33        sbc     $19,$sy
B63B:  B4 1F        jr      nz,&HB65B
B63D:  41 12 0E     sbc     $18,&H0E
B640:  B4 09        jr      nz,&HB64A
B642:  01 03        sbc     $3,$sx
B644:  34 70 FD     jp      nz,&HFD70
B647:  37 B3 B5     jp      &HB5B3
B64A:  41 12 0B     sbc     $18,&H0B
B64D:  B4 0D        jr      nz,&HB65B
B64F:  42 04 05     ld      $4,&H05
B652:  08 64 03     ad      $4,$3
B655:  D1 05 04 00  ldw     $5,&H0004
B659:  B7 14        jr      &HB66E
B65B:  42 04 05     ld      $4,&H05
B65E:  08 64 03     ad      $4,$3
B661:  D1 05 04 00  ldw     $5,&H0004
B665:  B7 11        jr      &HB677
B667:  01 23        sbc     $3,$sy
B669:  B0 CE        jr      z,&HB638
B66B:  37 9A FD     jp      &HFD9A
B66E:  E6 06 40     phsm    $6,3
B671:  77 4B A9     cal     &HA94B
B674:  EE 04 40     ppsm    $4,3
B677:  D6 00 5B 1F  pre     ix,&H1F5B
B67B:  20 04        st      $4,(ix+$sx)
B67D:  D6 00 77 1F  pre     ix,&H1F77
B681:  20 04        st      $4,(ix+$sx)
B683:  D6 00 5E 1F  pre     ix,&H1F5E
B687:  A0 05        stw     $5,(ix+$sx)
B689:  D6 00 78 1F  pre     ix,&H1F78
B68D:  A0 05        stw     $5,(ix+$sx)
B68F:  42 00 40     ld      $0,&H40
B692:  14 40        pfl     $0
B694:  F7           rtn   
B695:  D6 00 08 1D  pre     ix,&H1D08
B699:  D1 00 2D 03  ldw     $0,&H032D
B69D:  BA 00        sbcw    (ix+$sx),$0
B69F:  B4 27        jr      nz,&HB6C7
B6A1:  D6 00 5B 1F  pre     ix,&H1F5B
B6A5:  28 00        ld      $0,(ix+$sx)
B6A7:  01 00        sbc     $0,$sx
B6A9:  30 A0 FD     jp      z,&HFDA0
B6AC:  4E 00 10     or      $0,&H10
B6AF:  20 00        st      $0,(ix+$sx)
B6B1:  D6 00 5E 1F  pre     ix,&H1F5E
B6B5:  D1 00 02 00  ldw     $0,&H0002
B6B9:  A0 00        stw     $0,(ix+$sx)
B6BB:  77 4B A9     cal     &HA94B
B6BE:  D1 00 2D 03  ldw     $0,&H032D
B6C2:  81 52        sbcw    $18,$sz
B6C4:  30 A0 FD     jp      z,&HFDA0
B6C7:  77 66 C7     cal     &HC766
B6CA:  01 02        sbc     $2,$sx
B6CC:  B0 1F        jr      z,&HB6EC
B6CE:  41 01 05     sbc     $1,&H05
B6D1:  30 A6 FD     jp      z,&HFDA6
B6D4:  D1 02 60 03  ldw     $2,&H0360
B6D8:  81 42        sbcw    $2,$sz
B6DA:  34 70 FD     jp      nz,&HFD70
B6DD:  D6 00 5B 1F  pre     ix,&H1F5B
B6E1:  28 02        ld      $2,(ix+$sx)
B6E3:  44 02 10     anc     $2,&H10
B6E6:  34 70 FD     jp      nz,&HFD70
B6E9:  37 B6 B7     jp      &HB7B6
B6EC:  D6 00 58 1F  pre     ix,&H1F58
B6F0:  A0 00        stw     $0,(ix+$sx)
B6F2:  77 4B A9     cal     &HA94B
B6F5:  D1 00 29 03  ldw     $0,&H0329
B6F9:  81 52        sbcw    $18,$sz
B6FB:  B4 4C        jr      nz,&HB748
B6FD:  D1 00 57 1F  ldw     $0,&H1F57
B701:  50 40 12     st      &H12,($sz)
B704:  D6 00 1C 1E  pre     ix,&H1E1C
B708:  28 00        ld      $0,(ix+$sx)
B70A:  01 20        sbc     $0,$sy
B70C:  30 B8 FD     jp      z,&HFDB8
B70F:  77 4B A9     cal     &HA94B
B712:  D1 00 5B 03  ldw     $0,&H035B
B716:  81 52        sbcw    $18,$sz
B718:  B4 27        jr      nz,&HB740
B71A:  89 40        sbw     $0,$sz
B71C:  D6 00 1E 1E  pre     ix,&H1E1E
B720:  A0 00        stw     $0,(ix+$sx)
B722:  77 4B A9     cal     &HA94B
B725:  D1 00 56 03  ldw     $0,&H0356
B729:  81 52        sbcw    $18,$sz
B72B:  B0 38        jr      z,&HB764
B72D:  D1 00 60 03  ldw     $0,&H0360
B731:  81 52        sbcw    $18,$sz
B733:  B0 30        jr      z,&HB764
B735:  D1 00 4B 03  ldw     $0,&H034B
B739:  81 52        sbcw    $18,$sz
B73B:  30 B2 FD     jp      z,&HFDB2
B73E:  B7 68        jr      &HB7A7
B740:  D6 00 1E 1E  pre     ix,&H1E1E
B744:  A0 1E        stw     $30,(ix+$sx)
B746:  B7 60        jr      &HB7A7
B748:  D6 00 5B 1F  pre     ix,&H1F5B
B74C:  3A 1F        sbc     (ix+$sx),$31
B74E:  30 9A FD     jp      z,&HFD9A
B751:  D6 00 08 1D  pre     ix,&H1D08
B755:  D1 00 2A 03  ldw     $0,&H032A
B759:  BA 00        sbcw    (ix+$sx),$0
B75B:  B4 08        jr      nz,&HB764
B75D:  77 BB B7     cal     &HB7BB
B760:  D6 00 08 1D  pre     ix,&H1D08
B764:  D6 00 08 1D  pre     ix,&H1D08
B768:  D1 00 56 03  ldw     $0,&H0356
B76C:  BA 00        sbcw    (ix+$sx),$0
B76E:  B0 0A        jr      z,&HB779
B770:  D1 00 60 03  ldw     $0,&H0360
B774:  BA 00        sbcw    (ix+$sx),$0
B776:  34 70 FD     jp      nz,&HFD70
B779:  D6 00 5B 1F  pre     ix,&H1F5B
B77D:  28 00        ld      $0,(ix+$sx)
B77F:  41 00 0B     sbc     $0,&H0B
B782:  B4 20        jr      nz,&HB7A3
B784:  D6 00 62 1F  pre     ix,&H1F62
B788:  A8 00        ldw     $0,(ix+$sx)
B78A:  84 40        ancw    $0,$sz
B78C:  B4 16        jr      nz,&HB7A3
B78E:  D6 00 1C 1E  pre     ix,&H1E1C
B792:  3A 1F        sbc     (ix+$sx),$31
B794:  B0 0E        jr      z,&HB7A3
B796:  3A 1E        sbc     (ix+$sx),$30
B798:  B0 0A        jr      z,&HB7A3
B79A:  D6 00 5A 1F  pre     ix,&H1F5A
B79E:  3A 1E        sbc     (ix+$sx),$30
B7A0:  34 AC FD     jp      nz,&HFDAC
B7A3:  42 80 C0 12  ld      $0,&HC0,jr &HB7B8
B7A7:  D6 00 1C 1E  pre     ix,&H1E1C
B7AB:  28 00        ld      $0,(ix+$sx)
B7AD:  01 00        sbc     $0,$sx
B7AF:  34 70 FD     jp      nz,&HFD70
B7B2:  42 80 40 03  ld      $0,&H40,jr &HB7B8
B7B6:  02 00        ld      $0,$sx
B7B8:  14 40        pfl     $0
B7BA:  F7           rtn   
B7BB:  D6 00 23 1E  pre     ix,&H1E23
B7BF:  D1 00 25 1E  ldw     $0,&H1E25
B7C3:  A0 00        stw     $0,(ix+$sx)
B7C5:  77 4B A9     cal     &HA94B
B7C8:  D1 00 5C 03  ldw     $0,&H035C
B7CC:  81 52        sbcw    $18,$sz
B7CE:  B4 08        jr      nz,&HB7D7
B7D0:  89 40        sbw     $0,$sz
B7D2:  77 4C B8     cal     &HB84C
B7D5:  B7 4A        jr      &HB820
B7D7:  77 66 C7     cal     &HC766
B7DA:  01 02        sbc     $2,$sx
B7DC:  30 70 FD     jp      z,&HFD70
B7DF:  D1 03 5C 03  ldw     $3,&H035C
B7E3:  81 43        sbcw    $3,$sz
B7E5:  30 AC FD     jp      z,&HFDAC
B7E8:  41 02 FF     sbc     $2,&HFF
B7EB:  30 70 FD     jp      z,&HFD70
B7EE:  41 02 03     sbc     $2,&H03
B7F1:  B0 0C        jr      z,&HB7FE
B7F3:  41 02 04     sbc     $2,&H04
B7F6:  B0 07        jr      z,&HB7FE
B7F8:  41 02 05     sbc     $2,&H05
B7FB:  34 AC FD     jp      nz,&HFDAC
B7FE:  96 00        pre     ix,$0
B800:  41 02 05     sbc     $2,&H05
B803:  B4 0B        jr      nz,&HB80F
B805:  42 00 03     ld      $0,&H03
B808:  A8 40        ldw     $0,(ix+$sz)
B80A:  84 40        ancw    $0,$sz
B80C:  34 AC FD     jp      nz,&HFDAC
B80F:  A8 20        ldw     $0,(ix+$sy)
B811:  77 4C B8     cal     &HB84C
B814:  77 4B A9     cal     &HA94B
B817:  D1 00 5C 03  ldw     $0,&H035C
B81B:  81 52        sbcw    $18,$sz
B81D:  34 70 FD     jp      nz,&HFD70
B820:  77 4B A9     cal     &HA94B
B823:  D1 00 2A 03  ldw     $0,&H032A
B827:  81 52        sbcw    $18,$sz
B829:  B4 06        jr      nz,&HB830
B82B:  77 4B A9     cal     &HA94B
B82E:  B7 D8        jr      &HB807
B830:  D1 10 57 1F  ldw     $16,&H1F57
B834:  77 6D C8     cal     &HC86D
B837:  D1 00 5B 1F  ldw     $0,&H1F5B
B83B:  50 40 0B     st      &H0B,($sz)
B83E:  77 68 B8     cal     &HB868
B841:  B5 06        jr      c,&HB848
B843:  77 8B B8     cal     &HB88B
B846:  B7 97        jr      &HB7DE
B848:  77 8B B8     cal     &HB88B
B84B:  F7           rtn   
B84C:  D6 00 23 1E  pre     ix,&H1E23
B850:  A8 02        ldw     $2,(ix+$sx)
B852:  D1 04 89 1E  ldw     $4,&H1E89
B856:  81 62 04     sbcw    $2,$4
B859:  31 AC FD     jp      nc,&HFDAC
B85C:  90 60 02     stw     $0,($2)
B85F:  D1 00 02 00  ldw     $0,&H0002
B863:  88 42        adw     $2,$sz
B865:  A0 02        stw     $2,(ix+$sx)
B867:  F7           rtn   
B868:  D6 00 23 1E  pre     ix,&H1E23
B86C:  A8 02        ldw     $2,(ix+$sx)
B86E:  D1 00 02 00  ldw     $0,&H0002
B872:  89 42        sbw     $2,$sz
B874:  A0 02        stw     $2,(ix+$sx)
B876:  91 60 02     ldw     $0,($2)
B879:  D1 04 25 1E  ldw     $4,&H1E25
B87D:  81 62 04     sbcw    $2,$4
B880:  B0 04        jr      z,&HB885
B882:  02 82 04     ld      $2,$sx,jr &HB888
B885:  42 02 40     ld      $2,&H40
B888:  14 42        pfl     $2
B88A:  F7           rtn   
B88B:  D6 00 62 1F  pre     ix,&H1F62
B88F:  A0 00        stw     $0,(ix+$sx)
B891:  82 45        ldw     $5,$sz
B893:  D6 00 5E 1F  pre     ix,&H1F5E
B897:  A8 0F        ldw     $15,(ix+$sx)
B899:  77 35 0A     cal     &H0A35
B89C:  35 AC FD     jp      c,&HFDAC
B89F:  A0 00        stw     $0,(ix+$sx)
B8A1:  F7           rtn   
B8A2:  42 11 10     ld      $17,&H10
B8A5:  D6 00 58 1F  pre     ix,&H1F58
B8A9:  A8 00        ldw     $0,(ix+$sx)
B8AB:  D6 00 70 1F  pre     ix,&H1F70
B8AF:  A0 00        stw     $0,(ix+$sx)
B8B1:  D6 00 57 1F  pre     ix,&H1F57
B8B5:  28 00        ld      $0,(ix+$sx)
B8B7:  41 00 11     sbc     $0,&H11
B8BA:  34 32 B9     jp      nz,&HB932
B8BD:  42 10 06     ld      $16,&H06
B8C0:  D6 00 5A 1F  pre     ix,&H1F5A
B8C4:  3A 1F        sbc     (ix+$sx),$31
B8C6:  B4 61        jr      nz,&HB928
B8C8:  D6 40 5B 1F  pre     iz,&H1F5B
B8CC:  29 00        ld      $0,(iz+$sx)
B8CE:  41 00 0B     sbc     $0,&H0B
B8D1:  B4 0B        jr      nz,&HB8DD
B8D3:  D6 40 62 1F  pre     iz,&H1F62
B8D7:  A9 00        ldw     $0,(iz+$sx)
B8D9:  84 40        ancw    $0,$sz
B8DB:  B0 4A        jr      z,&HB926
B8DD:  77 A6 C8     cal     &HC8A6
B8E0:  B1 62        jr      nc,&HB943
B8E2:  77 4B B9     cal     &HB94B
B8E5:  68 00 03     ld      $0,(ix+&H03)
B8E8:  01 00        sbc     $0,$sx
B8EA:  B4 34        jr      nz,&HB91F
B8EC:  D6 40 64 1F  pre     iz,&H1F64
B8F0:  A9 00        ldw     $0,(iz+$sx)
B8F2:  84 40        ancw    $0,$sz
B8F4:  B4 09        jr      nz,&HB8FE
B8F6:  D6 40 5A 1F  pre     iz,&H1F5A
B8FA:  21 1E        st      $30,(iz+$sx)
B8FC:  B7 22        jr      &HB91F
B8FE:  42 00 0D     ld      $0,&H0D
B901:  A8 40        ldw     $0,(ix+$sz)
B903:  84 40        ancw    $0,$sz
B905:  34 C4 FD     jp      nz,&HFDC4
B908:  D6 40 D8 1C  pre     iz,&H1CD8
B90C:  A9 00        ldw     $0,(iz+$sx)
B90E:  D1 02 44 00  ldw     $2,&H0044
B912:  88 60 02     adw     $0,$2
B915:  9E 02        gre     ix,$2
B917:  81 42        sbcw    $2,$sz
B919:  35 C4 FD     jp      c,&HFDC4
B91C:  60 1E 03     st      $30,(ix+&H03)
B91F:  77 53 C9     cal     &HC953
B922:  B5 BE        jr      c,&HB8E1
B924:  B7 1E        jr      &HB943
B926:  20 1E        st      $30,(ix+$sx)
B928:  77 A6 C8     cal     &HC8A6
B92B:  B1 17        jr      nc,&HB943
B92D:  77 4B B9     cal     &HB94B
B930:  B7 12        jr      &HB943
B932:  42 10 04     ld      $16,&H04
B935:  D6 00 5A 1F  pre     ix,&H1F5A
B939:  20 1E        st      $30,(ix+$sx)
B93B:  77 A6 C8     cal     &HC8A6
B93E:  B1 04        jr      nc,&HB943
B940:  77 A6 B9     cal     &HB9A6
B943:  D1 10 57 1F  ldw     $16,&H1F57
B947:  77 02 C8     cal     &HC802
B94A:  F7           rtn   
B94B:  28 00        ld      $0,(ix+$sx)
B94D:  41 00 11     sbc     $0,&H11
B950:  34 C4 FD     jp      nz,&HFDC4
B953:  9E 00        gre     ix,$0
B955:  A6 01        phsw    $1
B957:  D6 40 57 1F  pre     iz,&H1F57
B95B:  68 01 04     ld      $1,(ix+&H04)
B95E:  7B 01 04     sbc     (iz+&H04),$1
B961:  34 C4 FD     jp      nz,&HFDC4
B964:  4C 01 0F     an      $1,&H0F
B967:  41 01 09     sbc     $1,&H09
B96A:  B5 04        jr      c,&HB96F
B96C:  77 74 B9     cal     &HB974
B96F:  AE 00        ppsw    $0
B971:  96 00        pre     ix,$0
B973:  F7           rtn   
B974:  42 00 0B     ld      $0,&H0B
B977:  A8 41        ldw     $1,(ix+$sz)
B979:  84 61 01     ancw    $1,$1
B97C:  B0 0E        jr      z,&HB98B
B97E:  A9 43        ldw     $3,(iz+$sz)
B980:  84 63 03     ancw    $3,$3
B983:  B0 07        jr      z,&HB98B
B985:  81 61 03     sbcw    $1,$3
B988:  34 C4 FD     jp      nz,&HFDC4
B98B:  42 00 09     ld      $0,&H09
B98E:  A8 41        ldw     $1,(ix+$sz)
B990:  96 01        pre     ix,$1
B992:  A9 41        ldw     $1,(iz+$sz)
B994:  96 41        pre     iz,$1
B996:  68 01 04     ld      $1,(ix+&H04)
B999:  7B 01 04     sbc     (iz+&H04),$1
B99C:  34 C4 FD     jp      nz,&HFDC4
B99F:  41 01 0B     sbc     $1,&H0B
B9A2:  30 74 B9     jp      z,&HB974
B9A5:  F7           rtn   
B9A6:  28 00        ld      $0,(ix+$sx)
B9A8:  41 00 12     sbc     $0,&H12
B9AB:  34 C4 FD     jp      nz,&HFDC4
B9AE:  B7 DC        jr      &HB98B
B9B0:  77 E2 B9     cal     &HB9E2
B9B3:  D6 00 1C 1E  pre     ix,&H1E1C
B9B7:  20 1E        st      $30,(ix+$sx)
B9B9:  D6 00 1E 1E  pre     ix,&H1E1E
B9BD:  A8 02        ldw     $2,(ix+$sx)
B9BF:  84 62 02     ancw    $2,$2
B9C2:  B0 04        jr      z,&HB9C7
B9C4:  77 2F BA     cal     &HBA2F
B9C7:  D6 00 08 1D  pre     ix,&H1D08
B9CB:  D1 00 5D 03  ldw     $0,&H035D
B9CF:  BA 00        sbcw    (ix+$sx),$0
B9D1:  B0 06        jr      z,&HB9D8
B9D3:  77 9B BA     cal     &HBA9B
B9D6:  B7 90        jr      &HB967
B9D8:  77 18 BB     cal     &HBB18
B9DB:  77 4B A9     cal     &HA94B
B9DE:  77 3F BB     cal     &HBB3F
B9E1:  F7           rtn   
B9E2:  D6 00 58 1F  pre     ix,&H1F58
B9E6:  A8 00        ldw     $0,(ix+$sx)
B9E8:  D6 00 70 1F  pre     ix,&H1F70
B9EC:  A0 00        stw     $0,(ix+$sx)
B9EE:  42 11 10     ld      $17,&H10
B9F1:  42 10 04     ld      $16,&H04
B9F4:  77 A6 C8     cal     &HC8A6
B9F7:  B1 11        jr      nc,&HBA09
B9F9:  77 A6 B9     cal     &HB9A6
B9FC:  68 00 03     ld      $0,(ix+&H03)
B9FF:  01 00        sbc     $0,$sx
BA01:  30 C4 FD     jp      z,&HFDC4
BA04:  77 53 C9     cal     &HC953
BA07:  B5 8C        jr      c,&HB994
BA09:  D6 00 5A 1F  pre     ix,&H1F5A
BA0D:  20 1F        st      $31,(ix+$sx)
BA0F:  D6 00 D8 1C  pre     ix,&H1CD8
BA13:  A8 00        ldw     $0,(ix+$sx)
BA15:  D6 00 64 1F  pre     ix,&H1F64
BA19:  A0 00        stw     $0,(ix+$sx)
BA1B:  D6 00 DA 1C  pre     ix,&H1CDA
BA1F:  A8 00        ldw     $0,(ix+$sx)
BA21:  D6 00 7A 1F  pre     ix,&H1F7A
BA25:  A0 00        stw     $0,(ix+$sx)
BA27:  D1 10 57 1F  ldw     $16,&H1F57
BA2B:  77 02 C8     cal     &HC802
BA2E:  F7           rtn   
BA2F:  77 7A C7     cal     &HC77A
BA32:  77 BC C7     cal     &HC7BC
BA35:  77 66 C7     cal     &HC766
BA38:  01 02        sbc     $2,$sx
BA3A:  34 70 FD     jp      nz,&HFD70
BA3D:  D6 00 58 1F  pre     ix,&H1F58
BA41:  A0 00        stw     $0,(ix+$sx)
BA43:  77 7C BA     cal     &HBA7C
BA46:  77 4B A9     cal     &HA94B
BA49:  D1 00 5B 03  ldw     $0,&H035B
BA4D:  81 52        sbcw    $18,$sz
BA4F:  B0 15        jr      z,&HBA65
BA51:  D1 00 56 03  ldw     $0,&H0356
BA55:  81 52        sbcw    $18,$sz
BA57:  34 70 FD     jp      nz,&HFD70
BA5A:  D6 00 1E 1E  pre     ix,&H1E1E
BA5E:  BC 1E        adw     (ix+$sx),$30
BA60:  77 4B A9     cal     &HA94B
BA63:  B7 AF        jr      &HBA13
BA65:  D6 00 7A 1F  pre     ix,&H1F7A
BA69:  A8 00        ldw     $0,(ix+$sx)
BA6B:  96 00        pre     ix,$0
BA6D:  42 00 0B     ld      $0,&H0B
BA70:  D6 40 1E 1E  pre     iz,&H1E1E
BA74:  A9 02        ldw     $2,(iz+$sx)
BA76:  A0 42        stw     $2,(ix+$sz)
BA78:  77 4B A9     cal     &HA94B
BA7B:  F7           rtn   
BA7C:  D6 00 58 1F  pre     ix,&H1F58
BA80:  A8 00        ldw     $0,(ix+$sx)
BA82:  D6 00 70 1F  pre     ix,&H1F70
BA86:  A0 00        stw     $0,(ix+$sx)
BA88:  02 10        ld      $16,$sx
BA8A:  42 11 11     ld      $17,&H11
BA8D:  77 A6 C8     cal     &HC8A6
BA90:  35 C4 FD     jp      c,&HFDC4
BA93:  D1 10 57 1F  ldw     $16,&H1F57
BA97:  77 2D C8     cal     &HC82D
BA9A:  F7           rtn   
BA9B:  77 7A C7     cal     &HC77A
BA9E:  77 22 B5     cal     &HB522
BAA1:  77 83 B5     cal     &HB583
BAA4:  77 BC C7     cal     &HC7BC
BAA7:  77 95 B6     cal     &HB695
BAAA:  B1 18        jr      nc,&HBAC3
BAAC:  D6 00 08 1D  pre     ix,&H1D08
BAB0:  D1 00 60 03  ldw     $0,&H0360
BAB4:  BA 00        sbcw    (ix+$sx),$0
BAB6:  B0 09        jr      z,&HBAC0
BAB8:  77 C7 BA     cal     &HBAC7
BABB:  77 4B A9     cal     &HA94B
BABE:  B7 9B        jr      &HBA5A
BAC0:  77 C7 BA     cal     &HBAC7
BAC3:  77 4B A9     cal     &HA94B
BAC6:  F7           rtn   
BAC7:  D6 00 58 1F  pre     ix,&H1F58
BACB:  A8 00        ldw     $0,(ix+$sx)
BACD:  D6 00 70 1F  pre     ix,&H1F70
BAD1:  A0 00        stw     $0,(ix+$sx)
BAD3:  02 10        ld      $16,$sx
BAD5:  42 11 11     ld      $17,&H11
BAD8:  77 A6 C8     cal     &HC8A6
BADB:  31 B8 FD     jp      nc,&HFDB8
BADE:  68 00 03     ld      $0,(ix+&H03)
BAE1:  44 00 80     anc     $0,&H80
BAE4:  34 C4 FD     jp      nz,&HFDC4
BAE7:  D6 40 5A 1F  pre     iz,&H1F5A
BAEB:  29 00        ld      $0,(iz+$sx)
BAED:  4E 00 80     or      $0,&H80
BAF0:  21 00        st      $0,(iz+$sx)
BAF2:  D6 40 5B 1F  pre     iz,&H1F5B
BAF6:  29 00        ld      $0,(iz+$sx)
BAF8:  41 00 07     sbc     $0,&H07
BAFB:  B4 0E        jr      nz,&HBB0A
BAFD:  42 00 08     ld      $0,&H08
BB00:  21 00        st      $0,(iz+$sx)
BB02:  D1 00 5E 1F  ldw     $0,&H1F5E
BB06:  D0 40 08 00  stw     &H0008,($sz)
BB0A:  9E 00        gre     ix,$0
BB0C:  D1 02 57 1F  ldw     $2,&H1F57
BB10:  D1 04 0F 00  ldw     $4,&H000F
BB14:  77 4C 01     cal     &H014C
BB17:  F7           rtn   
BB18:  D6 00 D8 1C  pre     ix,&H1CD8
BB1C:  A8 02        ldw     $2,(ix+$sx)
BB1E:  D6 00 7A 1F  pre     ix,&H1F7A
BB22:  A8 00        ldw     $0,(ix+$sx)
BB24:  96 00        pre     ix,$0
BB26:  42 00 0D     ld      $0,&H0D
BB29:  A8 40        ldw     $0,(ix+$sz)
BB2B:  81 42        sbcw    $2,$sz
BB2D:  B0 10        jr      z,&HBB3E
BB2F:  96 00        pre     ix,$0
BB31:  68 00 03     ld      $0,(ix+&H03)
BB34:  4C 00 7F     an      $0,&H7F
BB37:  60 00 03     st      $0,(ix+&H03)
BB3A:  42 80 0F 94  ld      $0,&H0F,jr &HBAD1
BB3E:  F7           rtn   
BB3F:  D1 00 1C 1E  ldw     $0,&H1E1C
BB43:  50 40 02     st      &H02,($sz)
BB46:  77 7A C7     cal     &HC77A
BB49:  77 22 B5     cal     &HB522
BB4C:  B5 08        jr      c,&HBB55
BB4E:  77 83 B5     cal     &HB583
BB51:  B5 06        jr      c,&HBB58
BB53:  B7 2F        jr      &HBB83
BB55:  77 83 B5     cal     &HB583
BB58:  77 BC C7     cal     &HC7BC
BB5B:  77 95 B6     cal     &HB695
BB5E:  B1 14        jr      nc,&HBB73
BB60:  77 A4 BB     cal     &HBBA4
BB63:  D6 00 08 1D  pre     ix,&H1D08
BB67:  A8 02        ldw     $2,(ix+$sx)
BB69:  41 02 56     sbc     $2,&H56
BB6C:  B4 06        jr      nz,&HBB73
BB6E:  77 4B A9     cal     &HA94B
BB71:  B7 9A        jr      &HBB0C
BB73:  77 4B A9     cal     &HA94B
BB76:  D1 00 5E 03  ldw     $0,&H035E
BB7A:  81 52        sbcw    $18,$sz
BB7C:  B4 B7        jr      nz,&HBB34
BB7E:  77 30 BC     cal     &HBC30
BB81:  B7 1E        jr      &HBBA0
BB83:  D6 00 1C 1E  pre     ix,&H1E1C
BB87:  42 00 03     ld      $0,&H03
BB8A:  20 00        st      $0,(ix+$sx)
BB8C:  77 30 BC     cal     &HBC30
BB8F:  D6 00 08 1D  pre     ix,&H1D08
BB93:  D1 00 5E 03  ldw     $0,&H035E
BB97:  BA 00        sbcw    (ix+$sx),$0
BB99:  B0 06        jr      z,&HBBA0
BB9B:  77 68 BC     cal     &HBC68
BB9E:  B7 90        jr      &HBB2F
BBA0:  77 1E BC     cal     &HBC1E
BBA3:  F7           rtn   
BBA4:  D6 00 58 1F  pre     ix,&H1F58
BBA8:  A8 00        ldw     $0,(ix+$sx)
BBAA:  D6 00 70 1F  pre     ix,&H1F70
BBAE:  A0 00        stw     $0,(ix+$sx)
BBB0:  D6 00 57 1F  pre     ix,&H1F57
BBB4:  28 00        ld      $0,(ix+$sx)
BBB6:  41 00 11     sbc     $0,&H11
BBB9:  B4 48        jr      nz,&HBC02
BBBB:  D6 00 5A 1F  pre     ix,&H1F5A
BBBF:  28 00        ld      $0,(ix+$sx)
BBC1:  01 20        sbc     $0,$sy
BBC3:  B0 0E        jr      z,&HBBD2
BBC5:  02 10        ld      $16,$sx
BBC7:  42 11 11     ld      $17,&H11
BBCA:  77 A6 C8     cal     &HC8A6
BBCD:  35 C4 FD     jp      c,&HFDC4
BBD0:  B7 29        jr      &HBBFA
BBD2:  42 10 06     ld      $16,&H06
BBD5:  42 11 10     ld      $17,&H10
BBD8:  77 A6 C8     cal     &HC8A6
BBDB:  B1 04        jr      nc,&HBBE0
BBDD:  77 4B B9     cal     &HB94B
BBE0:  02 10        ld      $16,$sx
BBE2:  42 11 11     ld      $17,&H11
BBE5:  77 A6 C8     cal     &HC8A6
BBE8:  B1 11        jr      nc,&HBBFA
BBEA:  77 4B B9     cal     &HB94B
BBED:  68 00 03     ld      $0,(ix+&H03)
BBF0:  01 20        sbc     $0,$sy
BBF2:  34 C4 FD     jp      nz,&HFDC4
BBF5:  77 53 C9     cal     &HC953
BBF8:  B5 8C        jr      c,&HBB85
BBFA:  D1 10 57 1F  ldw     $16,&H1F57
BBFE:  77 2D C8     cal     &HC82D
BC01:  F7           rtn   
BC02:  42 11 10     ld      $17,&H10
BC05:  42 10 04     ld      $16,&H04
BC08:  77 A6 C8     cal     &HC8A6
BC0B:  B1 04        jr      nc,&HBC10
BC0D:  77 A6 B9     cal     &HB9A6
BC10:  D6 00 5A 1F  pre     ix,&H1F5A
BC14:  20 1E        st      $30,(ix+$sx)
BC16:  D1 10 57 1F  ldw     $16,&H1F57
BC1A:  77 02 C8     cal     &HC802
BC1D:  F7           rtn   
BC1E:  77 82 C1     cal     &HC182
BC21:  D1 10 00 06  ldw     $16,&H0600
BC25:  77 49 C7     cal     &HC749
BC28:  D1 10 00 07  ldw     $16,&H0700
BC2C:  77 49 C7     cal     &HC749
BC2F:  F7           rtn   
BC30:  D6 00 D2 1C  pre     ix,&H1CD2
BC34:  A8 02        ldw     $2,(ix+$sx)
BC36:  D6 00 7A 1F  pre     ix,&H1F7A
BC3A:  A8 00        ldw     $0,(ix+$sx)
BC3C:  96 00        pre     ix,$0
BC3E:  42 00 05     ld      $0,&H05
BC41:  A0 42        stw     $2,(ix+$sz)
BC43:  D6 00 20 1E  pre     ix,&H1E20
BC47:  20 1F        st      $31,(ix+$sx)
BC49:  D6 00 89 1E  pre     ix,&H1E89
BC4D:  D1 00 8B 1E  ldw     $0,&H1E8B
BC51:  A0 00        stw     $0,(ix+$sx)
BC53:  D6 00 EF 1E  pre     ix,&H1EEF
BC57:  D1 00 F3 1E  ldw     $0,&H1EF3
BC5B:  A0 00        stw     $0,(ix+$sx)
BC5D:  D6 00 F1 1E  pre     ix,&H1EF1
BC61:  D1 00 57 1F  ldw     $0,&H1F57
BC65:  A0 00        stw     $0,(ix+$sx)
BC67:  F7           rtn   
BC68:  D1 00 11 1A  ldw     $0,&H1A11
BC6C:  9F 02        gre     ss,$2
BC6E:  81 42        sbcw    $2,$sz
BC70:  35 F4 FD     jp      c,&HFDF4
BC73:  D6 00 08 1D  pre     ix,&H1D08
BC77:  D1 00 5D 03  ldw     $0,&H035D
BC7B:  BA 00        sbcw    (ix+$sx),$0
BC7D:  B4 15        jr      nz,&HBC93
BC7F:  77 4B A9     cal     &HA94B
BC82:  D6 00 08 1D  pre     ix,&H1D08
BC86:  D1 00 5E 03  ldw     $0,&H035E
BC8A:  BA 00        sbcw    (ix+$sx),$0
BC8C:  B0 6B        jr      z,&HBCF8
BC8E:  77 68 BC     cal     &HBC68
BC91:  B7 90        jr      &HBC22
BC93:  77 FC BC     cal     &HBCFC
BC96:  D6 00 08 1D  pre     ix,&H1D08
BC9A:  A8 02        ldw     $2,(ix+$sx)
BC9C:  41 03 02     sbc     $3,&H02
BC9F:  B4 0D        jr      nz,&HBCAD
BCA1:  02 70 02     ld      $16,$2
BCA4:  D6 00 4A 48  pre     ix,&H484A
BCA8:  77 62 9F     cal     &H9F62
BCAB:  B7 4F        jr      &HBCFB
BCAD:  44 03 F0     anc     $3,&HF0
BCB0:  B0 3E        jr      z,&HBCEF
BCB2:  11 60 02     ld      $0,($2)
BCB5:  01 00        sbc     $0,$sx
BCB7:  B4 37        jr      nz,&HBCEF
BCB9:  D6 00 0C 1D  pre     ix,&H1D0C
BCBD:  A0 02        stw     $2,(ix+$sx)
BCBF:  77 4B A9     cal     &HA94B
BCC2:  D1 00 5F 03  ldw     $0,&H035F
BCC6:  81 52        sbcw    $18,$sz
BCC8:  B4 0C        jr      nz,&HBCD5
BCCA:  77 C6 C1     cal     &HC1C6
BCCD:  77 4B A9     cal     &HA94B
BCD0:  77 68 BC     cal     &HBC68
BCD3:  B7 27        jr      &HBCFB
BCD5:  D6 00 EF 1C  pre     ix,&H1CEF
BCD9:  20 1F        st      $31,(ix+$sx)
BCDB:  77 84 C3     cal     &HC384
BCDE:  D6 00 0C 1D  pre     ix,&H1D0C
BCE2:  A8 10        ldw     $16,(ix+$sx)
BCE4:  D6 00 0A 1D  pre     ix,&H1D0A
BCE8:  A0 10        stw     $16,(ix+$sx)
BCEA:  77 CD C2     cal     &HC2CD
BCED:  B7 0A        jr      &HBCF8
BCEF:  D6 00 EF 1C  pre     ix,&H1CEF
BCF3:  20 1F        st      $31,(ix+$sx)
BCF5:  77 A7 C2     cal     &HC2A7
BCF8:  77 4B A9     cal     &HA94B
BCFB:  F7           rtn   
BCFC:  D6 00 11 1D  pre     ix,&H1D11
BD00:  28 10        ld      $16,(ix+$sx)
BD02:  42 11 00     ld      $17,&H00
BD05:  77 49 C7     cal     &HC749
BD08:  D6 00 12 1D  pre     ix,&H1D12
BD0C:  A8 10        ldw     $16,(ix+$sx)
BD0E:  77 49 C7     cal     &HC749
BD11:  F7           rtn   
BD12:  D6 00 08 1D  pre     ix,&H1D08
BD16:  28 00        ld      $0,(ix+$sx)
BD18:  D6 00 20 1E  pre     ix,&H1E20
BD1C:  28 01        ld      $1,(ix+$sx)
BD1E:  D6 00 D2 1C  pre     ix,&H1CD2
BD22:  A8 02        ldw     $2,(ix+$sx)
BD24:  77 25 C2     cal     &HC225
BD27:  D6 00 08 1D  pre     ix,&H1D08
BD2B:  A8 10        ldw     $16,(ix+$sx)
BD2D:  77 49 C7     cal     &HC749
BD30:  D6 00 D2 1C  pre     ix,&H1CD2
BD34:  A8 10        ldw     $16,(ix+$sx)
BD36:  D1 00 06 00  ldw     $0,&H0006
BD3A:  88 50        adw     $16,$sz
BD3C:  77 49 C7     cal     &HC749
BD3F:  89 70 10     sbw     $16,$16
BD42:  77 49 C7     cal     &HC749
BD45:  77 49 C7     cal     &HC749
BD48:  77 4B A9     cal     &HA94B
BD4B:  D1 00 29 03  ldw     $0,&H0329
BD4F:  81 52        sbcw    $18,$sz
BD51:  34 70 FD     jp      nz,&HFD70
BD54:  D1 00 EF 1C  ldw     $0,&H1CEF
BD58:  50 40 80     st      &H80,($sz)
BD5B:  77 4B A9     cal     &HA94B
BD5E:  77 A7 C2     cal     &HC2A7
BD61:  77 15 C2     cal     &HC215
BD64:  D6 40 D2 1C  pre     iz,&H1CD2
BD68:  A9 02        ldw     $2,(iz+$sx)
BD6A:  42 00 04     ld      $0,&H04
BD6D:  A0 42        stw     $2,(ix+$sz)
BD6F:  77 4B A9     cal     &HA94B
BD72:  D6 00 20 1E  pre     ix,&H1E20
BD76:  3C 1E        ad      (ix+$sx),$30
BD78:  77 68 BC     cal     &HBC68
BD7B:  D6 00 20 1E  pre     ix,&H1E20
BD7F:  3E 1E        sb      (ix+$sx),$30
BD81:  D6 00 08 1D  pre     ix,&H1D08
BD85:  D1 00 19 02  ldw     $0,&H0219
BD89:  BA 00        sbcw    (ix+$sx),$0
BD8B:  B0 13        jr      z,&HBD9F
BD8D:  77 15 C2     cal     &HC215
BD90:  D6 40 D2 1C  pre     iz,&H1CD2
BD94:  A9 02        ldw     $2,(iz+$sx)
BD96:  42 00 06     ld      $0,&H06
BD99:  A0 42        stw     $2,(ix+$sz)
BD9B:  77 44 C2     cal     &HC244
BD9E:  F7           rtn   
BD9F:  77 15 C2     cal     &HC215
BDA2:  D6 40 D2 1C  pre     iz,&H1CD2
BDA6:  A9 02        ldw     $2,(iz+$sx)
BDA8:  D1 00 04 00  ldw     $0,&H0004
BDAC:  88 42        adw     $2,$sz
BDAE:  42 00 06     ld      $0,&H06
BDB1:  A0 42        stw     $2,(ix+$sz)
BDB3:  77 44 C2     cal     &HC244
BDB6:  D6 00 08 1D  pre     ix,&H1D08
BDBA:  28 00        ld      $0,(ix+$sx)
BDBC:  D6 00 20 1E  pre     ix,&H1E20
BDC0:  28 01        ld      $1,(ix+$sx)
BDC2:  D6 00 D2 1C  pre     ix,&H1CD2
BDC6:  A8 02        ldw     $2,(ix+$sx)
BDC8:  77 25 C2     cal     &HC225
BDCB:  D1 10 25 02  ldw     $16,&H0225
BDCF:  77 49 C7     cal     &HC749
BDD2:  89 70 10     sbw     $16,$16
BDD5:  77 49 C7     cal     &HC749
BDD8:  77 FC BC     cal     &HBCFC
BDDB:  D6 00 08 1D  pre     ix,&H1D08
BDDF:  A8 10        ldw     $16,(ix+$sx)
BDE1:  77 49 C7     cal     &HC749
BDE4:  77 4B A9     cal     &HA94B
BDE7:  D6 00 20 1E  pre     ix,&H1E20
BDEB:  3C 1E        ad      (ix+$sx),$30
BDED:  77 68 BC     cal     &HBC68
BDF0:  D6 00 20 1E  pre     ix,&H1E20
BDF4:  3E 1E        sb      (ix+$sx),$30
BDF6:  77 15 C2     cal     &HC215
BDF9:  D6 40 D2 1C  pre     iz,&H1CD2
BDFD:  A9 02        ldw     $2,(iz+$sx)
BDFF:  42 00 02     ld      $0,&H02
BE02:  A0 42        stw     $2,(ix+$sz)
BE04:  77 44 C2     cal     &HC244
BE07:  F7           rtn   
BE08:  D6 00 08 1D  pre     ix,&H1D08
BE0C:  28 00        ld      $0,(ix+$sx)
BE0E:  D6 00 20 1E  pre     ix,&H1E20
BE12:  28 01        ld      $1,(ix+$sx)
BE14:  D6 00 D2 1C  pre     ix,&H1CD2
BE18:  A8 02        ldw     $2,(ix+$sx)
BE1A:  77 25 C2     cal     &HC225
BE1D:  D6 00 08 1D  pre     ix,&H1D08
BE21:  A8 10        ldw     $16,(ix+$sx)
BE23:  77 49 C7     cal     &HC749
BE26:  D6 00 D2 1C  pre     ix,&H1CD2
BE2A:  A8 10        ldw     $16,(ix+$sx)
BE2C:  D1 00 06 00  ldw     $0,&H0006
BE30:  88 50        adw     $16,$sz
BE32:  77 49 C7     cal     &HC749
BE35:  89 70 10     sbw     $16,$16
BE38:  77 49 C7     cal     &HC749
BE3B:  77 49 C7     cal     &HC749
BE3E:  77 4B A9     cal     &HA94B
BE41:  D1 00 29 03  ldw     $0,&H0329
BE45:  81 52        sbcw    $18,$sz
BE47:  34 70 FD     jp      nz,&HFD70
BE4A:  D1 00 EF 1C  ldw     $0,&H1CEF
BE4E:  50 40 80     st      &H80,($sz)
BE51:  77 4B A9     cal     &HA94B
BE54:  77 A7 C2     cal     &HC2A7
BE57:  77 15 C2     cal     &HC215
BE5A:  D6 40 D2 1C  pre     iz,&H1CD2
BE5E:  A9 02        ldw     $2,(iz+$sx)
BE60:  42 00 04     ld      $0,&H04
BE63:  A0 42        stw     $2,(ix+$sz)
BE65:  77 4B A9     cal     &HA94B
BE68:  D6 00 20 1E  pre     ix,&H1E20
BE6C:  3C 1E        ad      (ix+$sx),$30
BE6E:  77 68 BC     cal     &HBC68
BE71:  D6 00 20 1E  pre     ix,&H1E20
BE75:  3E 1E        sb      (ix+$sx),$30
BE77:  77 32 C1     cal     &HC132
BE7A:  D1 10 25 02  ldw     $16,&H0225
BE7E:  77 49 C7     cal     &HC749
BE81:  77 15 C2     cal     &HC215
BE84:  9E 10        gre     ix,$16
BE86:  D1 00 04 00  ldw     $0,&H0004
BE8A:  89 50        sbw     $16,$sz
BE8C:  77 49 C7     cal     &HC749
BE8F:  77 15 C2     cal     &HC215
BE92:  D6 40 D2 1C  pre     iz,&H1CD2
BE96:  A9 02        ldw     $2,(iz+$sx)
BE98:  42 00 06     ld      $0,&H06
BE9B:  A0 42        stw     $2,(ix+$sz)
BE9D:  77 44 C2     cal     &HC244
BEA0:  77 94 C0     cal     &HC094
BEA3:  F7           rtn   
BEA4:  D6 00 08 1D  pre     ix,&H1D08
BEA8:  28 00        ld      $0,(ix+$sx)
BEAA:  D6 00 20 1E  pre     ix,&H1E20
BEAE:  28 01        ld      $1,(ix+$sx)
BEB0:  D6 00 D2 1C  pre     ix,&H1CD2
BEB4:  A8 02        ldw     $2,(ix+$sx)
BEB6:  77 25 C2     cal     &HC225
BEB9:  D6 00 08 1D  pre     ix,&H1D08
BEBD:  A8 10        ldw     $16,(ix+$sx)
BEBF:  77 49 C7     cal     &HC749
BEC2:  77 4B A9     cal     &HA94B
BEC5:  D6 00 20 1E  pre     ix,&H1E20
BEC9:  3C 1E        ad      (ix+$sx),$30
BECB:  77 68 BC     cal     &HBC68
BECE:  D6 00 20 1E  pre     ix,&H1E20
BED2:  3E 1E        sb      (ix+$sx),$30
BED4:  D6 00 08 1D  pre     ix,&H1D08
BED8:  D1 00 1A 02  ldw     $0,&H021A
BEDC:  BA 00        sbcw    (ix+$sx),$0
BEDE:  34 70 FD     jp      nz,&HFD70
BEE1:  77 32 C1     cal     &HC132
BEE4:  77 FC BC     cal     &HBCFC
BEE7:  D6 00 08 1D  pre     ix,&H1D08
BEEB:  A8 10        ldw     $16,(ix+$sx)
BEED:  77 49 C7     cal     &HC749
BEF0:  D6 00 D2 1C  pre     ix,&H1CD2
BEF4:  A8 10        ldw     $16,(ix+$sx)
BEF6:  D1 00 06 00  ldw     $0,&H0006
BEFA:  88 50        adw     $16,$sz
BEFC:  77 49 C7     cal     &HC749
BEFF:  77 15 C2     cal     &HC215
BF02:  9E 10        gre     ix,$16
BF04:  D1 00 04 00  ldw     $0,&H0004
BF08:  89 50        sbw     $16,$sz
BF0A:  77 49 C7     cal     &HC749
BF0D:  D6 00 D2 1C  pre     ix,&H1CD2
BF11:  A8 00        ldw     $0,(ix+$sx)
BF13:  A6 01        phsw    $1
BF15:  89 70 10     sbw     $16,$16
BF18:  77 49 C7     cal     &HC749
BF1B:  77 4B A9     cal     &HA94B
BF1E:  D1 00 29 03  ldw     $0,&H0329
BF22:  81 52        sbcw    $18,$sz
BF24:  34 70 FD     jp      nz,&HFD70
BF27:  D1 00 EF 1C  ldw     $0,&H1CEF
BF2B:  50 40 80     st      &H80,($sz)
BF2E:  77 4B A9     cal     &HA94B
BF31:  77 A7 C2     cal     &HC2A7
BF34:  AE 00        ppsw    $0
BF36:  D6 00 D2 1C  pre     ix,&H1CD2
BF3A:  A8 02        ldw     $2,(ix+$sx)
BF3C:  90 42        stw     $2,($sz)
BF3E:  77 4B A9     cal     &HA94B
BF41:  D1 00 60 03  ldw     $0,&H0360
BF45:  81 52        sbcw    $18,$sz
BF47:  34 70 FD     jp      nz,&HFD70
BF4A:  77 44 C2     cal     &HC244
BF4D:  77 94 C0     cal     &HC094
BF50:  77 4B A9     cal     &HA94B
BF53:  F7           rtn   
BF54:  D1 10 24 02  ldw     $16,&H0224
BF58:  77 49 C7     cal     &HC749
BF5B:  77 FC BC     cal     &HBCFC
BF5E:  D6 00 08 1D  pre     ix,&H1D08
BF62:  28 00        ld      $0,(ix+$sx)
BF64:  D6 00 20 1E  pre     ix,&H1E20
BF68:  28 01        ld      $1,(ix+$sx)
BF6A:  D6 00 D2 1C  pre     ix,&H1CD2
BF6E:  A8 02        ldw     $2,(ix+$sx)
BF70:  77 25 C2     cal     &HC225
BF73:  D6 00 08 1D  pre     ix,&H1D08
BF77:  A8 10        ldw     $16,(ix+$sx)
BF79:  77 49 C7     cal     &HC749
BF7C:  D6 00 D2 1C  pre     ix,&H1CD2
BF80:  A8 10        ldw     $16,(ix+$sx)
BF82:  D1 00 0A 00  ldw     $0,&H000A
BF86:  88 50        adw     $16,$sz
BF88:  77 49 C7     cal     &HC749
BF8B:  89 70 10     sbw     $16,$16
BF8E:  77 49 C7     cal     &HC749
BF91:  77 49 C7     cal     &HC749
BF94:  77 49 C7     cal     &HC749
BF97:  77 49 C7     cal     &HC749
BF9A:  77 4B A9     cal     &HA94B
BF9D:  D1 00 29 03  ldw     $0,&H0329
BFA1:  81 52        sbcw    $18,$sz
BFA3:  34 70 FD     jp      nz,&HFD70
BFA6:  D1 00 EF 1C  ldw     $0,&H1CEF
BFAA:  50 40 00     st      &H00,($sz)
BFAD:  77 4B A9     cal     &HA94B
BFB0:  77 A7 C2     cal     &HC2A7
BFB3:  77 15 C2     cal     &HC215
BFB6:  D6 40 D2 1C  pre     iz,&H1CD2
BFBA:  A9 02        ldw     $2,(iz+$sx)
BFBC:  42 00 04     ld      $0,&H04
BFBF:  A0 42        stw     $2,(ix+$sz)
BFC1:  D1 00 EF 1C  ldw     $0,&H1CEF
BFC5:  50 40 00     st      &H00,($sz)
BFC8:  77 4B A9     cal     &HA94B
BFCB:  77 A7 C2     cal     &HC2A7
BFCE:  77 15 C2     cal     &HC215
BFD1:  D6 40 D2 1C  pre     iz,&H1CD2
BFD5:  A9 02        ldw     $2,(iz+$sx)
BFD7:  42 00 06     ld      $0,&H06
BFDA:  A0 42        stw     $2,(ix+$sz)
BFDC:  D1 00 EF 1C  ldw     $0,&H1CEF
BFE0:  50 40 80     st      &H80,($sz)
BFE3:  77 4B A9     cal     &HA94B
BFE6:  77 A7 C2     cal     &HC2A7
BFE9:  77 15 C2     cal     &HC215
BFEC:  D6 40 D2 1C  pre     iz,&H1CD2
BFF0:  A9 02        ldw     $2,(iz+$sx)
BFF2:  42 00 08     ld      $0,&H08
BFF5:  A0 42        stw     $2,(ix+$sz)
BFF7:  77 4B A9     cal     &HA94B
BFFA:  D6 00 20 1E  pre     ix,&H1E20
BFFE:  3C 1E        ad      (ix+$sx),$30
C000:  77 68 BC     cal     &HBC68
C003:  D6 00 20 1E  pre     ix,&H1E20
C007:  3E 1E        sb      (ix+$sx),$30
C009:  77 32 C1     cal     &HC132
C00C:  D1 10 25 02  ldw     $16,&H0225
C010:  77 49 C7     cal     &HC749
C013:  77 15 C2     cal     &HC215
C016:  9E 10        gre     ix,$16
C018:  D1 00 04 00  ldw     $0,&H0004
C01C:  89 50        sbw     $16,$sz
C01E:  77 49 C7     cal     &HC749
C021:  77 15 C2     cal     &HC215
C024:  D6 40 D2 1C  pre     iz,&H1CD2
C028:  A9 02        ldw     $2,(iz+$sx)
C02A:  42 00 0A     ld      $0,&H0A
C02D:  A0 42        stw     $2,(ix+$sz)
C02F:  77 44 C2     cal     &HC244
C032:  77 94 C0     cal     &HC094
C035:  F7           rtn   
C036:  77 6B C0     cal     &HC06B
C039:  D6 00 08 1D  pre     ix,&H1D08
C03D:  28 00        ld      $0,(ix+$sx)
C03F:  D6 00 20 1E  pre     ix,&H1E20
C043:  28 01        ld      $1,(ix+$sx)
C045:  D6 00 D2 1C  pre     ix,&H1CD2
C049:  A8 02        ldw     $2,(ix+$sx)
C04B:  77 63 C2     cal     &HC263
C04E:  D1 10 25 02  ldw     $16,&H0225
C052:  77 49 C7     cal     &HC749
C055:  89 70 10     sbw     $16,$16
C058:  77 49 C7     cal     &HC749
C05B:  77 4B A9     cal     &HA94B
C05E:  D1 00 60 03  ldw     $0,&H0360
C062:  81 52        sbcw    $18,$sz
C064:  34 70 FD     jp      nz,&HFD70
C067:  77 4B A9     cal     &HA94B
C06A:  F7           rtn   
C06B:  D6 00 89 1E  pre     ix,&H1E89
C06F:  A8 02        ldw     $2,(ix+$sx)
C071:  D1 00 8B 1E  ldw     $0,&H1E8B
C075:  81 60 02     sbcw    $0,$2
C078:  31 E2 FD     jp      nc,&HFDE2
C07B:  D1 00 04 00  ldw     $0,&H0004
C07F:  89 42        sbw     $2,$sz
C081:  11 60 02     ld      $0,($2)
C084:  41 00 1A     sbc     $0,&H1A
C087:  B0 0B        jr      z,&HC093
C089:  41 00 1B     sbc     $0,&H1B
C08C:  B0 06        jr      z,&HC093
C08E:  41 00 1C     sbc     $0,&H1C
C091:  B4 A1        jr      nz,&HC033
C093:  F7           rtn   
C094:  D6 00 EF 1E  pre     ix,&H1EEF
C098:  A8 02        ldw     $2,(ix+$sx)
C09A:  D1 00 F3 1E  ldw     $0,&H1EF3
C09E:  81 60 02     sbcw    $0,$2
C0A1:  B1 2B        jr      nc,&HC0CD
C0A3:  96 02        pre     ix,$2
C0A5:  42 00 03     ld      $0,&H03
C0A8:  28 C0        ld      $0,(ix-$sz)
C0AA:  D6 40 20 1E  pre     iz,&H1E20
C0AE:  29 01        ld      $1,(iz+$sx)
C0B0:  01 41        sbc     $1,$sz
C0B2:  B1 1A        jr      nc,&HC0CD
C0B4:  42 00 02     ld      $0,&H02
C0B7:  A8 C0        ldw     $0,(ix-$sz)
C0B9:  96 00        pre     ix,$0
C0BB:  42 00 02     ld      $0,&H02
C0BE:  D6 40 D2 1C  pre     iz,&H1CD2
C0C2:  A9 04        ldw     $4,(iz+$sx)
C0C4:  A0 44        stw     $4,(ix+$sz)
C0C6:  D1 00 04 00  ldw     $0,&H0004
C0CA:  89 C2 B2     sbw     $2,$sz,jr &HC07E
C0CD:  D6 00 EF 1E  pre     ix,&H1EEF
C0D1:  A0 02        stw     $2,(ix+$sx)
C0D3:  F7           rtn   
C0D4:  77 09 C1     cal     &HC109
C0D7:  D6 00 08 1D  pre     ix,&H1D08
C0DB:  28 00        ld      $0,(ix+$sx)
C0DD:  D6 00 20 1E  pre     ix,&H1E20
C0E1:  28 01        ld      $1,(ix+$sx)
C0E3:  D6 00 D2 1C  pre     ix,&H1CD2
C0E7:  A8 02        ldw     $2,(ix+$sx)
C0E9:  77 85 C2     cal     &HC285
C0EC:  D1 10 25 02  ldw     $16,&H0225
C0F0:  77 49 C7     cal     &HC749
C0F3:  89 70 10     sbw     $16,$16
C0F6:  77 49 C7     cal     &HC749
C0F9:  77 4B A9     cal     &HA94B
C0FC:  D1 00 60 03  ldw     $0,&H0360
C100:  81 52        sbcw    $18,$sz
C102:  34 70 FD     jp      nz,&HFD70
C105:  77 4B A9     cal     &HA94B
C108:  F7           rtn   
C109:  D6 00 89 1E  pre     ix,&H1E89
C10D:  A8 02        ldw     $2,(ix+$sx)
C10F:  D1 00 8B 1E  ldw     $0,&H1E8B
C113:  81 60 02     sbcw    $0,$2
C116:  31 E8 FD     jp      nc,&HFDE8
C119:  D1 00 04 00  ldw     $0,&H0004
C11D:  89 42        sbw     $2,$sz
C11F:  11 60 02     ld      $0,($2)
C122:  41 00 1A     sbc     $0,&H1A
C125:  B0 0B        jr      z,&HC131
C127:  41 00 1B     sbc     $0,&H1B
C12A:  B0 06        jr      z,&HC131
C12C:  41 00 1C     sbc     $0,&H1C
C12F:  B4 A1        jr      nz,&HC0D1
C131:  F7           rtn   
C132:  D6 00 F1 1E  pre     ix,&H1EF1
C136:  A8 02        ldw     $2,(ix+$sx)
C138:  D1 00 57 1F  ldw     $0,&H1F57
C13C:  81 42        sbcw    $2,$sz
C13E:  B1 28        jr      nc,&HC167
C140:  96 02        pre     ix,$2
C142:  28 20        ld      $0,(ix+$sy)
C144:  D6 40 20 1E  pre     iz,&H1E20
C148:  29 01        ld      $1,(iz+$sx)
C14A:  01 41        sbc     $1,$sz
C14C:  B1 1A        jr      nc,&HC167
C14E:  42 00 02     ld      $0,&H02
C151:  A8 40        ldw     $0,(ix+$sz)
C153:  96 00        pre     ix,$0
C155:  42 00 02     ld      $0,&H02
C158:  D6 40 D2 1C  pre     iz,&H1CD2
C15C:  A9 04        ldw     $4,(iz+$sx)
C15E:  A0 44        stw     $4,(ix+$sz)
C160:  D1 00 04 00  ldw     $0,&H0004
C164:  88 C2 AE     adw     $2,$sz,jr &HC114
C167:  D6 00 F1 1E  pre     ix,&H1EF1
C16B:  A0 02        stw     $2,(ix+$sx)
C16D:  F7           rtn   
C16E:  77 82 C1     cal     &HC182
C171:  D1 00 EF 1C  ldw     $0,&H1CEF
C175:  50 40 00     st      &H00,($sz)
C178:  77 4B A9     cal     &HA94B
C17B:  77 A7 C2     cal     &HC2A7
C17E:  77 4B A9     cal     &HA94B
C181:  F7           rtn   
C182:  D1 10 22 02  ldw     $16,&H0222
C186:  77 49 C7     cal     &HC749
C189:  D6 00 D2 1C  pre     ix,&H1CD2
C18D:  A8 10        ldw     $16,(ix+$sx)
C18F:  D1 00 02 00  ldw     $0,&H0002
C193:  88 50        adw     $16,$sz
C195:  77 49 C7     cal     &HC749
C198:  F7           rtn   
C199:  D6 00 08 1D  pre     ix,&H1D08
C19D:  A8 10        ldw     $16,(ix+$sx)
C19F:  77 49 C7     cal     &HC749
C1A2:  77 4B A9     cal     &HA94B
C1A5:  77 66 C7     cal     &HC766
C1A8:  01 02        sbc     $2,$sx
C1AA:  34 70 FD     jp      nz,&HFD70
C1AD:  D6 00 08 1D  pre     ix,&H1D08
C1B1:  A8 10        ldw     $16,(ix+$sx)
C1B3:  77 49 C7     cal     &HC749
C1B6:  77 4B A9     cal     &HA94B
C1B9:  D1 00 60 03  ldw     $0,&H0360
C1BD:  81 52        sbcw    $18,$sz
C1BF:  34 70 FD     jp      nz,&HFD70
C1C2:  77 4B A9     cal     &HA94B
C1C5:  F7           rtn   
C1C6:  D6 00 0C 1D  pre     ix,&H1D0C
C1CA:  A8 00        ldw     $0,(ix+$sx)
C1CC:  D6 00 70 1F  pre     ix,&H1F70
C1D0:  A0 00        stw     $0,(ix+$sx)
C1D2:  02 10        ld      $16,$sx
C1D4:  42 11 31     ld      $17,&H31
C1D7:  77 A6 C8     cal     &HC8A6
C1DA:  35 C4 FD     jp      c,&HFDC4
C1DD:  D1 00 57 1F  ldw     $0,&H1F57
C1E1:  D1 02 11 00  ldw     $2,&H0011
C1E5:  77 57 01     cal     &H0157
C1E8:  D1 00 57 1F  ldw     $0,&H1F57
C1EC:  50 40 31     st      &H31,($sz)
C1EF:  D6 00 0C 1D  pre     ix,&H1D0C
C1F3:  A8 00        ldw     $0,(ix+$sx)
C1F5:  D6 00 58 1F  pre     ix,&H1F58
C1F9:  A0 00        stw     $0,(ix+$sx)
C1FB:  D6 00 D2 1C  pre     ix,&H1CD2
C1FF:  A8 02        ldw     $2,(ix+$sx)
C201:  D1 00 04 00  ldw     $0,&H0004
C205:  89 42        sbw     $2,$sz
C207:  D6 00 5C 1F  pre     ix,&H1F5C
C20B:  A0 02        stw     $2,(ix+$sx)
C20D:  D1 10 57 1F  ldw     $16,&H1F57
C211:  77 2D C8     cal     &HC82D
C214:  F7           rtn   
C215:  D6 00 89 1E  pre     ix,&H1E89
C219:  A8 00        ldw     $0,(ix+$sx)
C21B:  96 00        pre     ix,$0
C21D:  42 00 02     ld      $0,&H02
C220:  A8 C0        ldw     $0,(ix-$sz)
C222:  96 00        pre     ix,$0
C224:  F7           rtn   
C225:  D6 00 89 1E  pre     ix,&H1E89
C229:  A8 04        ldw     $4,(ix+$sx)
C22B:  96 44        pre     iz,$4
C22D:  D1 06 04 00  ldw     $6,&H0004
C231:  88 64 06     adw     $4,$6
C234:  D1 06 EF 1E  ldw     $6,&H1EEF
C238:  81 66 04     sbcw    $6,$4
C23B:  35 F4 FD     jp      c,&HFDF4
C23E:  A0 04        stw     $4,(ix+$sx)
C240:  E1 00 60     stm     $0,(iz+$sx),4
C243:  F7           rtn   
C244:  D6 00 89 1E  pre     ix,&H1E89
C248:  A8 04        ldw     $4,(ix+$sx)
C24A:  D1 06 04 00  ldw     $6,&H0004
C24E:  89 64 06     sbw     $4,$6
C251:  D1 06 8B 1E  ldw     $6,&H1E8B
C255:  81 64 06     sbcw    $4,$6
C258:  35 5D FD     jp      c,&HFD5D
C25B:  A0 04        stw     $4,(ix+$sx)
C25D:  96 04        pre     ix,$4
C25F:  E8 00 60     ldm     $0,(ix+$sx),4
C262:  F7           rtn   
C263:  D6 00 EF 1E  pre     ix,&H1EEF
C267:  A8 04        ldw     $4,(ix+$sx)
C269:  96 44        pre     iz,$4
C26B:  D1 06 04 00  ldw     $6,&H0004
C26F:  88 64 06     adw     $4,$6
C272:  D1 06 F1 1E  ldw     $6,&H1EF1
C276:  91 66 06     ldw     $6,($6)
C279:  81 66 04     sbcw    $6,$4
C27C:  35 FA FD     jp      c,&HFDFA
C27F:  A0 04        stw     $4,(ix+$sx)
C281:  E1 00 60     stm     $0,(iz+$sx),4
C284:  F7           rtn   
C285:  D6 00 F1 1E  pre     ix,&H1EF1
C289:  A8 04        ldw     $4,(ix+$sx)
C28B:  D1 06 04 00  ldw     $6,&H0004
C28F:  89 64 06     sbw     $4,$6
C292:  D1 06 EF 1E  ldw     $6,&H1EEF
C296:  91 66 06     ldw     $6,($6)
C299:  81 64 06     sbcw    $4,$6
C29C:  35 FA FD     jp      c,&HFDFA
C29F:  A0 04        stw     $4,(ix+$sx)
C2A1:  96 04        pre     ix,$4
C2A3:  E0 00 60     stm     $0,(ix+$sx),4
C2A6:  F7           rtn   
C2A7:  77 84 C3     cal     &HC384
C2AA:  B7 22        jr      &HC2CD
C2AC:  D6 00 EF 1C  pre     ix,&H1CEF
C2B0:  28 00        ld      $0,(ix+$sx)
C2B2:  44 00 40     anc     $0,&H40
C2B5:  B4 06        jr      nz,&HC2BC
C2B7:  77 4B A9     cal     &HA94B
C2BA:  B7 12        jr      &HC2CD
C2BC:  4C 00 BF     an      $0,&HBF
C2BF:  20 00        st      $0,(ix+$sx)
C2C1:  D6 00 0C 1D  pre     ix,&H1D0C
C2C5:  A8 00        ldw     $0,(ix+$sx)
C2C7:  D6 00 08 1D  pre     ix,&H1D08
C2CB:  A0 00        stw     $0,(ix+$sx)
C2CD:  D6 00 08 1D  pre     ix,&H1D08
C2D1:  A8 00        ldw     $0,(ix+$sx)
C2D3:  77 B6 C3     cal     &HC3B6
C2D6:  26 00        phs     $0
C2D8:  D6 00 0A 1D  pre     ix,&H1D0A
C2DC:  A8 00        ldw     $0,(ix+$sx)
C2DE:  77 B6 C3     cal     &HC3B6
C2E1:  2E 03        pps     $3
C2E3:  26 00        phs     $0
C2E5:  02 44        ld      $4,$sz
C2E7:  77 27 C4     cal     &HC427
C2EA:  02 50        ld      $16,$sz
C2EC:  1A 10        did     $16
C2EE:  D6 00 65 48  pre     ix,&H4865
C2F2:  77 62 9F     cal     &H9F62
C2F5:  D6 00 08 1D  pre     ix,&H1D08
C2F9:  A8 00        ldw     $0,(ix+$sx)
C2FB:  41 01 03     sbc     $1,&H03
C2FE:  B4 6E        jr      nz,&HC36D
C300:  D6 00 08 1D  pre     ix,&H1D08
C304:  A8 00        ldw     $0,(ix+$sx)
C306:  77 B6 C3     cal     &HC3B6
C309:  2E 01        pps     $1
C30B:  26 00        phs     $0
C30D:  41 01 1E     sbc     $1,&H1E
C310:  B0 06        jr      z,&HC317
C312:  41 01 1F     sbc     $1,&H1F
C315:  B4 1E        jr      nz,&HC334
C317:  D6 00 EF 1C  pre     ix,&H1CEF
C31B:  28 02        ld      $2,(ix+$sx)
C31D:  44 02 10     anc     $2,&H10
C320:  34 D6 FD     jp      nz,&HFDD6
C323:  41 01 1E     sbc     $1,&H1E
C326:  B0 20        jr      z,&HC347
C328:  01 20        sbc     $0,$sy
C32A:  B4 06        jr      nz,&HC331
C32C:  77 F8 C4     cal     &HC4F8
C32F:  B7 17        jr      &HC347
C331:  77 5B C5     cal     &HC55B
C334:  D6 00 0A 1D  pre     ix,&H1D0A
C338:  A8 10        ldw     $16,(ix+$sx)
C33A:  41 11 03     sbc     $17,&H03
C33D:  B0 09        jr      z,&HC347
C33F:  41 11 0F     sbc     $17,&H0F
C342:  B0 04        jr      z,&HC347
C344:  77 49 C7     cal     &HC749
C347:  D6 00 23 1E  pre     ix,&H1E23
C34B:  A8 00        ldw     $0,(ix+$sx)
C34D:  96 00        pre     ix,$0
C34F:  A8 00        ldw     $0,(ix+$sx)
C351:  77 B6 C3     cal     &HC3B6
C354:  2E 04        pps     $4
C356:  26 04        phs     $4
C358:  02 43        ld      $3,$sz
C35A:  77 27 C4     cal     &HC427
C35D:  02 50        ld      $16,$sz
C35F:  4C 10 0F     an      $16,&H0F
C362:  D6 00 77 48  pre     ix,&H4877
C366:  77 62 9F     cal     &H9F62
C369:  B5 A3        jr      c,&HC30D
C36B:  B0 12        jr      z,&HC37E
C36D:  2E 00        pps     $0
C36F:  D6 40 0A 1D  pre     iz,&H1D0A
C373:  D6 00 08 1D  pre     ix,&H1D08
C377:  A8 00        ldw     $0,(ix+$sx)
C379:  A1 00        stw     $0,(iz+$sx)
C37B:  37 AC C2     jp      &HC2AC
C37E:  2E 00        pps     $0
C380:  77 AE C3     cal     &HC3AE
C383:  F7           rtn   
C384:  D1 00 25 1E  ldw     $0,&H1E25
C388:  D6 00 23 1E  pre     ix,&H1E23
C38C:  A0 00        stw     $0,(ix+$sx)
C38E:  D1 02 00 0F  ldw     $2,&H0F00
C392:  90 42        stw     $2,($sz)
C394:  D6 00 0A 1D  pre     ix,&H1D0A
C398:  A0 02        stw     $2,(ix+$sx)
C39A:  D6 00 21 1E  pre     ix,&H1E21
C39E:  20 1F        st      $31,(ix+$sx)
C3A0:  D6 00 22 1E  pre     ix,&H1E22
C3A4:  20 1F        st      $31,(ix+$sx)
C3A6:  D1 10 00 06  ldw     $16,&H0600
C3AA:  77 49 C7     cal     &HC749
C3AD:  F7           rtn   
C3AE:  D1 10 00 07  ldw     $16,&H0700
C3B2:  77 49 C7     cal     &HC749
C3B5:  F7           rtn   
C3B6:  44 01 F0     anc     $1,&HF0
C3B9:  B4 5F        jr      nz,&HC419
C3BB:  41 01 03     sbc     $1,&H03
C3BE:  B4 47        jr      nz,&HC406
C3C0:  41 00 57     sbc     $0,&H57
C3C3:  B1 14        jr      nc,&HC3D8
C3C5:  77 71 9F     cal     &H9F71
C3C8:  D6 40 CC 3B  pre     iz,&H3BCC
C3CC:  49 00 29     sb      $0,&H29
C3CF:  29 43        ld      $3,(iz+$sz)
C3D1:  77 79 85     cal     &H8579
C3D4:  02 60 03     ld      $0,$3
C3D7:  F7           rtn   
C3D8:  41 00 5A     sbc     $0,&H5A
C3DB:  B4 05        jr      nz,&HC3E1
C3DD:  42 00 19     ld      $0,&H19
C3E0:  F7           rtn   
C3E1:  41 00 5B     sbc     $0,&H5B
C3E4:  B4 05        jr      nz,&HC3EA
C3E6:  42 00 1A     ld      $0,&H1A
C3E9:  F7           rtn   
C3EA:  41 00 5C     sbc     $0,&H5C
C3ED:  B4 05        jr      nz,&HC3F3
C3EF:  42 00 1B     ld      $0,&H1B
C3F2:  F7           rtn   
C3F3:  41 00 5F     sbc     $0,&H5F
C3F6:  B4 05        jr      nz,&HC3FC
C3F8:  42 00 1C     ld      $0,&H1C
C3FB:  F7           rtn   
C3FC:  41 00 60     sbc     $0,&H60
C3FF:  34 70 FD     jp      nz,&HFD70
C402:  42 00 1D     ld      $0,&H1D
C405:  F7           rtn   
C406:  41 01 05     sbc     $1,&H05
C409:  B4 05        jr      nz,&HC40F
C40B:  42 00 1E     ld      $0,&H1E
C40E:  F7           rtn   
C40F:  41 01 0F     sbc     $1,&H0F
C412:  34 70 FD     jp      nz,&HFD70
C415:  42 00 21     ld      $0,&H21
C418:  F7           rtn   
C419:  11 40        ld      $0,($sz)
C41B:  01 00        sbc     $0,$sx
C41D:  B4 05        jr      nz,&HC423
C41F:  42 00 1F     ld      $0,&H1F
C422:  F7           rtn   
C423:  42 00 20     ld      $0,&H20
C426:  F7           rtn   
C427:  02 65 04     ld      $5,$4
C42A:  09 25        sb      $5,$sy
C42C:  09 66 06     sb      $6,$6
C42F:  42 0F 21     ld      $15,&H21
C432:  09 70 10     sb      $16,$16
C435:  77 35 0A     cal     &H0A35
C438:  02 62 03     ld      $2,$3
C43B:  09 22        sb      $2,$sy
C43D:  09 63 03     sb      $3,$3
C440:  88 60 02     adw     $0,$2
C443:  D1 02 FA 3B  ldw     $2,&H3BFA
C447:  88 60 02     adw     $0,$2
C44A:  96 40        pre     iz,$0
C44C:  77 71 9F     cal     &H9F71
C44F:  29 04        ld      $4,(iz+$sx)
C451:  77 79 85     cal     &H8579
C454:  02 60 04     ld      $0,$4
C457:  F7           rtn   
C458:  F7           rtn   
C459:  77 4B A9     cal     &HA94B
C45C:  77 83 B5     cal     &HB583
C45F:  B1 3E        jr      nc,&HC49E
C461:  D6 00 08 1D  pre     ix,&H1D08
C465:  D1 00 2D 03  ldw     $0,&H032D
C469:  BA 00        sbcw    (ix+$sx),$0
C46B:  B4 13        jr      nz,&HC47F
C46D:  D6 00 5B 1F  pre     ix,&H1F5B
C471:  28 00        ld      $0,(ix+$sx)
C473:  4E 00 10     or      $0,&H10
C476:  20 00        st      $0,(ix+$sx)
C478:  77 4B A9     cal     &HA94B
C47B:  D6 00 08 1D  pre     ix,&H1D08
C47F:  D1 00 5B 03  ldw     $0,&H035B
C483:  BA 00        sbcw    (ix+$sx),$0
C485:  34 70 FD     jp      nz,&HFD70
C488:  D6 00 5B 1F  pre     ix,&H1F5B
C48C:  28 00        ld      $0,(ix+$sx)
C48E:  01 00        sbc     $0,$sx
C490:  30 DC FD     jp      z,&HFDDC
C493:  D6 00 08 1D  pre     ix,&H1D08
C497:  D1 00 37 03  ldw     $0,&H0337
C49B:  A0 00        stw     $0,(ix+$sx)
C49D:  F7           rtn   
C49E:  D6 00 EF 1C  pre     ix,&H1CEF
C4A2:  28 00        ld      $0,(ix+$sx)
C4A4:  4E 00 40     or      $0,&H40
C4A7:  20 00        st      $0,(ix+$sx)
C4A9:  D6 00 08 1D  pre     ix,&H1D08
C4AD:  A8 00        ldw     $0,(ix+$sx)
C4AF:  D6 40 0C 1D  pre     iz,&H1D0C
C4B3:  A1 00        stw     $0,(iz+$sx)
C4B5:  D1 00 5A 03  ldw     $0,&H035A
C4B9:  A0 00        stw     $0,(ix+$sx)
C4BB:  F7           rtn   
C4BC:  D6 00 08 1D  pre     ix,&H1D08
C4C0:  28 00        ld      $0,(ix+$sx)
C4C2:  41 00 2D     sbc     $0,&H2D
C4C5:  B4 05        jr      nz,&HC4CB
C4C7:  42 80 38 0D  ld      $0,&H38,jr &HC4D7
C4CB:  41 00 2E     sbc     $0,&H2E
C4CE:  B4 05        jr      nz,&HC4D4
C4D0:  42 80 45 04  ld      $0,&H45,jr &HC4D7
C4D4:  42 00 3C     ld      $0,&H3C
C4D7:  20 00        st      $0,(ix+$sx)
C4D9:  F7           rtn   
C4DA:  D6 00 08 1D  pre     ix,&H1D08
C4DE:  28 00        ld      $0,(ix+$sx)
C4E0:  08 20        ad      $0,$sy
C4E2:  20 00        st      $0,(ix+$sx)
C4E4:  F7           rtn   
C4E5:  D6 00 23 1E  pre     ix,&H1E23
C4E9:  A8 02        ldw     $2,(ix+$sx)
C4EB:  D1 00 04 00  ldw     $0,&H0004
C4EF:  89 42        sbw     $2,$sz
C4F1:  96 02        pre     ix,$2
C4F3:  89 40        sbw     $0,$sz
C4F5:  A0 00        stw     $0,(ix+$sx)
C4F7:  F7           rtn   
C4F8:  D6 00 0A 1D  pre     ix,&H1D0A
C4FC:  A8 00        ldw     $0,(ix+$sx)
C4FE:  D6 00 70 1F  pre     ix,&H1F70
C502:  A0 00        stw     $0,(ix+$sx)
C504:  42 10 03     ld      $16,&H03
C507:  42 11 10     ld      $17,&H10
C50A:  77 A6 C8     cal     &HC8A6
C50D:  B1 0A        jr      nc,&HC518
C50F:  28 00        ld      $0,(ix+$sx)
C511:  41 00 12     sbc     $0,&H12
C514:  34 CA FD     jp      nz,&HFDCA
C517:  F7           rtn   
C518:  42 10 04     ld      $16,&H04
C51B:  77 A6 C8     cal     &HC8A6
C51E:  B1 14        jr      nc,&HC533
C520:  28 00        ld      $0,(ix+$sx)
C522:  41 00 12     sbc     $0,&H12
C525:  34 CA FD     jp      nz,&HFDCA
C528:  42 00 04     ld      $0,&H04
C52B:  28 40        ld      $0,(ix+$sz)
C52D:  41 00 03     sbc     $0,&H03
C530:  34 C4 FD     jp      nz,&HFDC4
C533:  77 7A C7     cal     &HC77A
C536:  77 BC C7     cal     &HC7BC
C539:  D1 00 57 1F  ldw     $0,&H1F57
C53D:  50 40 12     st      &H12,($sz)
C540:  D6 00 0A 1D  pre     ix,&H1D0A
C544:  A8 00        ldw     $0,(ix+$sx)
C546:  D6 00 58 1F  pre     ix,&H1F58
C54A:  A0 00        stw     $0,(ix+$sx)
C54C:  D1 00 5A 1F  ldw     $0,&H1F5A
C550:  50 40 01     st      &H01,($sz)
C553:  D1 10 57 1F  ldw     $16,&H1F57
C557:  77 02 C8     cal     &HC802
C55A:  F7           rtn   
C55B:  D6 00 0A 1D  pre     ix,&H1D0A
C55F:  A8 00        ldw     $0,(ix+$sx)
C561:  D6 00 70 1F  pre     ix,&H1F70
C565:  A0 00        stw     $0,(ix+$sx)
C567:  02 10        ld      $16,$sx
C569:  42 11 11     ld      $17,&H11
C56C:  77 A6 C8     cal     &HC8A6
C56F:  F5           rtn     c
C570:  42 10 03     ld      $16,&H03
C573:  42 11 10     ld      $17,&H10
C576:  77 A6 C8     cal     &HC8A6
C579:  31 BE FD     jp      nc,&HFDBE
C57C:  28 00        ld      $0,(ix+$sx)
C57E:  41 00 11     sbc     $0,&H11
C581:  34 D0 FD     jp      nz,&HFDD0
C584:  F7           rtn   
C585:  D6 00 08 1D  pre     ix,&H1D08
C589:  A8 02        ldw     $2,(ix+$sx)
C58B:  D6 00 22 1E  pre     ix,&H1E22
C58F:  3A 1F        sbc     (ix+$sx),$31
C591:  B0 21        jr      z,&HC5B3
C593:  41 02 2F     sbc     $2,&H2F
C596:  B5 1C        jr      c,&HC5B3
C598:  41 02 36     sbc     $2,&H36
C59B:  B0 17        jr      z,&HC5B3
C59D:  41 02 5A     sbc     $2,&H5A
C5A0:  B0 12        jr      z,&HC5B3
C5A2:  41 02 2F     sbc     $2,&H2F
C5A5:  34 D6 FD     jp      nz,&HFDD6
C5A8:  D6 00 EF 1C  pre     ix,&H1CEF
C5AC:  28 00        ld      $0,(ix+$sx)
C5AE:  4E 00 10     or      $0,&H10
C5B1:  20 00        st      $0,(ix+$sx)
C5B3:  41 02 29     sbc     $2,&H29
C5B6:  B4 14        jr      nz,&HC5CB
C5B8:  82 20        ldw     $0,$sy
C5BA:  77 17 C7     cal     &HC717
C5BD:  D6 00 0A 1D  pre     ix,&H1D0A
C5C1:  A8 00        ldw     $0,(ix+$sx)
C5C3:  77 17 C7     cal     &HC717
C5C6:  77 31 C6     cal     &HC631
C5C9:  B7 58        jr      &HC622
C5CB:  41 02 2A     sbc     $2,&H2A
C5CE:  B4 06        jr      nz,&HC5D5
C5D0:  77 31 C6     cal     &HC631
C5D3:  B7 4E        jr      &HC622
C5D5:  41 02 36     sbc     $2,&H36
C5D8:  B4 09        jr      nz,&HC5E2
C5DA:  D6 00 22 1E  pre     ix,&H1E22
C5DE:  3C 1E        ad      (ix+$sx),$30
C5E0:  B7 41        jr      &HC622
C5E2:  41 02 37     sbc     $2,&H37
C5E5:  B4 0E        jr      nz,&HC5F4
C5E7:  D6 00 5B 1F  pre     ix,&H1F5B
C5EB:  28 00        ld      $0,(ix+$sx)
C5ED:  02 21        ld      $1,$sy
C5EF:  77 17 C7     cal     &HC717
C5F2:  B7 2F        jr      &HC622
C5F4:  41 02 48     sbc     $2,&H48
C5F7:  B4 0F        jr      nz,&HC607
C5F9:  D6 00 21 1E  pre     ix,&H1E21
C5FD:  28 10        ld      $16,(ix+$sx)
C5FF:  42 11 08     ld      $17,&H08
C602:  77 49 C7     cal     &HC749
C605:  B7 1C        jr      &HC622
C607:  41 02 49     sbc     $2,&H49
C60A:  B4 0F        jr      nz,&HC61A
C60C:  D6 00 21 1E  pre     ix,&H1E21
C610:  28 10        ld      $16,(ix+$sx)
C612:  42 11 0A     ld      $17,&H0A
C615:  77 49 C7     cal     &HC749
C618:  B7 09        jr      &HC622
C61A:  41 02 5A     sbc     $2,&H5A
C61D:  B4 04        jr      nz,&HC622
C61F:  77 31 C6     cal     &HC631
C622:  D6 00 08 1D  pre     ix,&H1D08
C626:  A8 00        ldw     $0,(ix+$sx)
C628:  77 17 C7     cal     &HC717
C62B:  42 00 80     ld      $0,&H80
C62E:  14 40        pfl     $0
C630:  F7           rtn   
C631:  D6 00 21 1E  pre     ix,&H1E21
C635:  3C 1E        ad      (ix+$sx),$30
C637:  F7           rtn   
C638:  77 30 C7     cal     &HC730
C63B:  41 00 36     sbc     $0,&H36
C63E:  B4 16        jr      nz,&HC655
C640:  D6 00 22 1E  pre     ix,&H1E22
C644:  3E 1E        sb      (ix+$sx),$30
C646:  B4 48        jr      nz,&HC68F
C648:  D6 00 EF 1C  pre     ix,&H1CEF
C64C:  28 02        ld      $2,(ix+$sx)
C64E:  4C 02 EF     an      $2,&HEF
C651:  20 02        st      $2,(ix+$sx)
C653:  B7 3B        jr      &HC68F
C655:  41 00 37     sbc     $0,&H37
C658:  B4 10        jr      nz,&HC669
C65A:  82 50        ldw     $16,$sz
C65C:  77 49 C7     cal     &HC749
C65F:  77 30 C7     cal     &HC730
C662:  82 50        ldw     $16,$sz
C664:  77 49 C7     cal     &HC749
C667:  B7 2C        jr      &HC694
C669:  41 00 48     sbc     $0,&H48
C66C:  B4 0F        jr      nz,&HC67C
C66E:  D6 00 21 1E  pre     ix,&H1E21
C672:  28 10        ld      $16,(ix+$sx)
C674:  42 11 09     ld      $17,&H09
C677:  77 49 C7     cal     &HC749
C67A:  B7 19        jr      &HC694
C67C:  41 00 49     sbc     $0,&H49
C67F:  B4 0F        jr      nz,&HC68F
C681:  D6 00 21 1E  pre     ix,&H1E21
C685:  28 10        ld      $16,(ix+$sx)
C687:  42 11 0B     ld      $17,&H0B
C68A:  77 49 C7     cal     &HC749
C68D:  B7 06        jr      &HC694
C68F:  82 50        ldw     $16,$sz
C691:  77 49 C7     cal     &HC749
C694:  42 00 40     ld      $0,&H40
C697:  14 40        pfl     $0
C699:  F7           rtn   
C69A:  77 30 C7     cal     &HC730
C69D:  41 00 29     sbc     $0,&H29
C6A0:  B4 23        jr      nz,&HC6C4
C6A2:  82 50        ldw     $16,$sz
C6A4:  D6 00 22 1E  pre     ix,&H1E22
C6A8:  3A 1F        sbc     (ix+$sx),$31
C6AA:  B0 04        jr      z,&HC6AF
C6AC:  42 10 28     ld      $16,&H28
C6AF:  77 49 C7     cal     &HC749
C6B2:  77 30 C7     cal     &HC730
C6B5:  82 50        ldw     $16,$sz
C6B7:  77 49 C7     cal     &HC749
C6BA:  77 30 C7     cal     &HC730
C6BD:  82 50        ldw     $16,$sz
C6BF:  77 49 C7     cal     &HC749
C6C2:  B7 0D        jr      &HC6D0
C6C4:  41 00 5A     sbc     $0,&H5A
C6C7:  B4 03        jr      nz,&HC6CB
C6C9:  B7 06        jr      &HC6D0
C6CB:  82 50        ldw     $16,$sz
C6CD:  77 49 C7     cal     &HC749
C6D0:  D6 00 21 1E  pre     ix,&H1E21
C6D4:  3E 1E        sb      (ix+$sx),$30
C6D6:  42 00 80     ld      $0,&H80
C6D9:  14 40        pfl     $0
C6DB:  F7           rtn   
C6DC:  D6 00 EF 1C  pre     ix,&H1CEF
C6E0:  28 00        ld      $0,(ix+$sx)
C6E2:  D6 00 08 1D  pre     ix,&H1D08
C6E6:  A8 02        ldw     $2,(ix+$sx)
C6E8:  44 00 80     anc     $0,&H80
C6EB:  B4 09        jr      nz,&HC6F5
C6ED:  41 02 60     sbc     $2,&H60
C6F0:  34 70 FD     jp      nz,&HFD70
C6F3:  B7 07        jr      &HC6FB
C6F5:  41 02 5B     sbc     $2,&H5B
C6F8:  34 70 FD     jp      nz,&HFD70
C6FB:  02 00        ld      $0,$sx
C6FD:  14 40        pfl     $0
C6FF:  F7           rtn   
C700:  F7           rtn   
C701:  D6 00 23 1E  pre     ix,&H1E23
C705:  A8 02        ldw     $2,(ix+$sx)
C707:  D1 00 04 00  ldw     $0,&H0004
C70B:  89 42        sbw     $2,$sz
C70D:  96 02        pre     ix,$2
C70F:  BC 1E        adw     (ix+$sx),$30
C711:  42 00 80     ld      $0,&H80
C714:  14 40        pfl     $0
C716:  F7           rtn   
C717:  D6 00 23 1E  pre     ix,&H1E23
C71B:  D1 02 02 00  ldw     $2,&H0002
C71F:  BC 02        adw     (ix+$sx),$2
C721:  D1 02 89 1E  ldw     $2,&H1E89
C725:  BA 02        sbcw    (ix+$sx),$2
C727:  30 EE FD     jp      z,&HFDEE
C72A:  A8 02        ldw     $2,(ix+$sx)
C72C:  90 60 02     stw     $0,($2)
C72F:  F7           rtn   
C730:  D6 00 23 1E  pre     ix,&H1E23
C734:  A8 02        ldw     $2,(ix+$sx)
C736:  91 60 02     ldw     $0,($2)
C739:  D1 02 25 1E  ldw     $2,&H1E25
C73D:  BA 02        sbcw    (ix+$sx),$2
C73F:  30 5D FD     jp      z,&HFD5D
C742:  D1 02 02 00  ldw     $2,&H0002
C746:  BE 02        sbw     (ix+$sx),$2
C748:  F7           rtn   
C749:  D6 00 D2 1C  pre     ix,&H1CD2
C74D:  A8 00        ldw     $0,(ix+$sx)
C74F:  82 42        ldw     $2,$sz
C751:  D1 04 02 00  ldw     $4,&H0002
C755:  88 62 04     adw     $2,$4
C758:  D6 40 D4 1C  pre     iz,&H1CD4
C75C:  BB 02        sbcw    (iz+$sx),$2
C75E:  35 00 FE     jp      c,&HFE00
C761:  A0 02        stw     $2,(ix+$sx)
C763:  90 50        stw     $16,($sz)
C765:  F7           rtn   
C766:  D6 00 08 1D  pre     ix,&H1D08
C76A:  A8 00        ldw     $0,(ix+$sx)
C76C:  44 01 F0     anc     $1,&HF0
C76F:  B4 05        jr      nz,&HC775
C771:  42 02 FF     ld      $2,&HFF
C774:  F7           rtn   
C775:  96 00        pre     ix,$0
C777:  28 02        ld      $2,(ix+$sx)
C779:  F7           rtn   
C77A:  D6 00 1C 1E  pre     ix,&H1E1C
C77E:  3A 1F        sbc     (ix+$sx),$31
C780:  B4 04        jr      nz,&HC785
C782:  02 80 0C     ld      $0,$sx,jr &HC790
C785:  3A 1E        sbc     (ix+$sx),$30
C787:  B4 05        jr      nz,&HC78D
C789:  42 80 04 04  ld      $0,&H04,jr &HC790
C78D:  42 00 05     ld      $0,&H05
C790:  D6 00 5A 1F  pre     ix,&H1F5A
C794:  20 00        st      $0,(ix+$sx)
C796:  D6 00 76 1F  pre     ix,&H1F76
C79A:  20 00        st      $0,(ix+$sx)
C79C:  42 00 03     ld      $0,&H03
C79F:  D6 00 5B 1F  pre     ix,&H1F5B
C7A3:  20 00        st      $0,(ix+$sx)
C7A5:  D6 00 77 1F  pre     ix,&H1F77
C7A9:  20 00        st      $0,(ix+$sx)
C7AB:  D1 00 02 00  ldw     $0,&H0002
C7AF:  D6 00 5E 1F  pre     ix,&H1F5E
C7B3:  A0 00        stw     $0,(ix+$sx)
C7B5:  D6 00 78 1F  pre     ix,&H1F78
C7B9:  A0 00        stw     $0,(ix+$sx)
C7BB:  F7           rtn   
C7BC:  D1 00 57 1F  ldw     $0,&H1F57
C7C0:  50 40 11     st      &H11,($sz)
C7C3:  D6 00 76 1F  pre     ix,&H1F76
C7C7:  28 00        ld      $0,(ix+$sx)
C7C9:  D6 00 5A 1F  pre     ix,&H1F5A
C7CD:  20 00        st      $0,(ix+$sx)
C7CF:  D6 00 77 1F  pre     ix,&H1F77
C7D3:  28 00        ld      $0,(ix+$sx)
C7D5:  D6 00 5B 1F  pre     ix,&H1F5B
C7D9:  20 00        st      $0,(ix+$sx)
C7DB:  D6 00 78 1F  pre     ix,&H1F78
C7DF:  A8 00        ldw     $0,(ix+$sx)
C7E1:  D6 00 5E 1F  pre     ix,&H1F5E
C7E5:  A0 00        stw     $0,(ix+$sx)
C7E7:  89 40        sbw     $0,$sz
C7E9:  D6 00 58 1F  pre     ix,&H1F58
C7ED:  A0 00        stw     $0,(ix+$sx)
C7EF:  D6 00 5C 1F  pre     ix,&H1F5C
C7F3:  A0 00        stw     $0,(ix+$sx)
C7F5:  D6 00 60 1F  pre     ix,&H1F60
C7F9:  A2 00        stiw    $0,(ix+$sx)
C7FB:  A2 00        stiw    $0,(ix+$sx)
C7FD:  A2 00        stiw    $0,(ix+$sx)
C7FF:  A0 00        stw     $0,(ix+$sx)
C801:  F7           rtn   
C802:  D6 00 68 1F  pre     ix,&H1F68
C806:  A8 02        ldw     $2,(ix+$sx)
C808:  D6 40 DA 1C  pre     iz,&H1CDA
C80C:  A9 04        ldw     $4,(iz+$sx)
C80E:  84 62 02     ancw    $2,$2
C811:  B4 03        jr      nz,&HC815
C813:  A0 04        stw     $4,(ix+$sx)
C815:  D6 00 6A 1F  pre     ix,&H1F6A
C819:  A8 02        ldw     $2,(ix+$sx)
C81B:  84 62 02     ancw    $2,$2
C81E:  B0 08        jr      z,&HC827
C820:  96 42        pre     iz,$2
C822:  42 00 0F     ld      $0,&H0F
C825:  A1 44        stw     $4,(iz+$sz)
C827:  A0 04        stw     $4,(ix+$sx)
C829:  77 81 C8     cal     &HC881
C82C:  F7           rtn   
C82D:  D6 00 DA 1C  pre     ix,&H1CDA
C831:  A8 02        ldw     $2,(ix+$sx)
C833:  D6 00 7A 1F  pre     ix,&H1F7A
C837:  A8 04        ldw     $4,(ix+$sx)
C839:  96 04        pre     ix,$4
C83B:  42 00 0D     ld      $0,&H0D
C83E:  A8 44        ldw     $4,(ix+$sz)
C840:  D6 40 D8 1C  pre     iz,&H1CD8
C844:  A9 06        ldw     $6,(iz+$sx)
C846:  81 64 06     sbcw    $4,$6
C849:  B4 05        jr      nz,&HC84F
C84B:  A0 42        stw     $2,(ix+$sz)
C84D:  B7 0E        jr      &HC85C
C84F:  D6 00 6E 1F  pre     ix,&H1F6E
C853:  A8 04        ldw     $4,(ix+$sx)
C855:  96 04        pre     ix,$4
C857:  42 00 0F     ld      $0,&H0F
C85A:  A0 42        stw     $2,(ix+$sz)
C85C:  D6 00 6E 1F  pre     ix,&H1F6E
C860:  A0 02        stw     $2,(ix+$sx)
C862:  96 10        pre     ix,$16
C864:  42 00 0F     ld      $0,&H0F
C867:  A0 46        stw     $6,(ix+$sz)
C869:  77 81 C8     cal     &HC881
C86C:  F7           rtn   
C86D:  D6 00 DA 1C  pre     ix,&H1CDA
C871:  A8 00        ldw     $0,(ix+$sx)
C873:  A6 01        phsw    $1
C875:  77 81 C8     cal     &HC881
C878:  AE 00        ppsw    $0
C87A:  D6 00 60 1F  pre     ix,&H1F60
C87E:  A0 00        stw     $0,(ix+$sx)
C880:  F7           rtn   
C881:  D6 00 DA 1C  pre     ix,&H1CDA
C885:  A8 00        ldw     $0,(ix+$sx)
C887:  82 42        ldw     $2,$sz
C889:  D1 04 11 00  ldw     $4,&H0011
C88D:  88 62 04     adw     $2,$4
C890:  D6 40 DC 1C  pre     iz,&H1CDC
C894:  BB 02        sbcw    (iz+$sx),$2
C896:  35 06 FE     jp      c,&HFE06
C899:  A0 02        stw     $2,(ix+$sx)
C89B:  82 62 10     ldw     $2,$16
C89E:  D1 04 11 00  ldw     $4,&H0011
C8A2:  77 4C 01     cal     &H014C
C8A5:  F7           rtn   
C8A6:  41 10 03     sbc     $16,&H03
C8A9:  B1 10        jr      nc,&HC8BA
C8AB:  D6 00 7A 1F  pre     ix,&H1F7A
C8AF:  A8 00        ldw     $0,(ix+$sx)
C8B1:  96 00        pre     ix,$0
C8B3:  42 00 0D     ld      $0,&H0D
C8B6:  A8 44        ldw     $4,(ix+$sz)
C8B8:  B7 1E        jr      &HC8D7
C8BA:  41 10 04     sbc     $16,&H04
C8BD:  B0 06        jr      z,&HC8C4
C8BF:  41 10 06     sbc     $16,&H06
C8C2:  B4 09        jr      nz,&HC8CC
C8C4:  D6 00 D8 1C  pre     ix,&H1CD8
C8C8:  A8 04        ldw     $4,(ix+$sx)
C8CA:  B7 0C        jr      &HC8D7
C8CC:  D6 00 68 1F  pre     ix,&H1F68
C8D0:  A8 04        ldw     $4,(ix+$sx)
C8D2:  84 64 04     ancw    $4,$4
C8D5:  B0 74        jr      z,&HC94A
C8D7:  D6 00 D8 1C  pre     ix,&H1CD8
C8DB:  A8 06        ldw     $6,(ix+$sx)
C8DD:  42 08 F0     ld      $8,&HF0
C8E0:  44 11 0F     anc     $17,&H0F
C8E3:  B0 04        jr      z,&HC8E8
C8E5:  42 08 FF     ld      $8,&HFF
C8E8:  41 10 02     sbc     $16,&H02
C8EB:  B1 13        jr      nc,&HC8FF
C8ED:  81 64 06     sbcw    $4,$6
C8F0:  B4 38        jr      nz,&HC929
C8F2:  01 10        sbc     $16,$sx
C8F4:  B0 55        jr      z,&HC94A
C8F6:  D6 00 68 1F  pre     ix,&H1F68
C8FA:  A8 04        ldw     $4,(ix+$sx)
C8FC:  48 10 0A     ad      $16,&H0A
C8FF:  41 10 0F     sbc     $16,&H0F
C902:  B1 08        jr      nc,&HC90B
C904:  84 64 04     ancw    $4,$4
C907:  B0 42        jr      z,&HC94A
C909:  B7 1F        jr      &HC929
C90B:  81 64 06     sbcw    $4,$6
C90E:  B4 13        jr      nz,&HC922
C910:  D6 00 72 1F  pre     ix,&H1F72
C914:  A8 00        ldw     $0,(ix+$sx)
C916:  96 00        pre     ix,$0
C918:  42 00 0F     ld      $0,&H0F
C91B:  A8 44        ldw     $4,(ix+$sz)
C91D:  49 10 0A     sb      $16,&H0A
C920:  B7 B9        jr      &HC8DA
C922:  96 04        pre     ix,$4
C924:  7A 1E 03     sbc     (ix+&H03),$30
C927:  B4 1A        jr      nz,&HC942
C929:  96 04        pre     ix,$4
C92B:  28 00        ld      $0,(ix+$sx)
C92D:  0C 60 08     an      $0,$8
C930:  01 51        sbc     $17,$sz
C932:  B4 0F        jr      nz,&HC942
C934:  D1 00 70 1F  ldw     $0,&H1F70
C938:  91 40        ldw     $0,($sz)
C93A:  84 40        ancw    $0,$sz
C93C:  B0 10        jr      z,&HC94D
C93E:  BA 20        sbcw    (ix+$sy),$0
C940:  B0 0C        jr      z,&HC94D
C942:  77 59 C9     cal     &HC959
C945:  77 C5 29     cal     &H29C5
C948:  B7 E1        jr      &HC92A
C94A:  02 80 04     ld      $0,$sx,jr &HC950
C94D:  42 00 40     ld      $0,&H40
C950:  14 40        pfl     $0
C952:  F7           rtn   
C953:  77 59 C9     cal     &HC959
C956:  37 D7 C8     jp      &HC8D7
C959:  41 10 05     sbc     $16,&H05
C95C:  B0 06        jr      z,&HC963
C95E:  41 10 06     sbc     $16,&H06
C961:  B4 1E        jr      nz,&HC980
C963:  28 00        ld      $0,(ix+$sx)
C965:  41 00 12     sbc     $0,&H12
C968:  B4 17        jr      nz,&HC980
C96A:  7A 1F 03     sbc     (ix+&H03),$31
C96D:  B4 12        jr      nz,&HC980
C96F:  42 00 0D     ld      $0,&H0D
C972:  A8 44        ldw     $4,(ix+$sz)
C974:  9E 00        gre     ix,$0
C976:  D6 00 72 1F  pre     ix,&H1F72
C97A:  A0 00        stw     $0,(ix+$sx)
C97C:  48 10 0A     ad      $16,&H0A
C97F:  F7           rtn   
C980:  42 00 0F     ld      $0,&H0F
C983:  A8 44        ldw     $4,(ix+$sz)
C985:  F7           rtn   
C986:  77 98 C9     cal     &HC998
C989:  77 CF CA     cal     &HCACF
C98C:  D6 00 7E 1F  pre     ix,&H1F7E
C990:  02 00        ld      $0,$sx
C992:  20 00        st      $0,(ix+$sx)
C994:  77 68 CB     cal     &HCB68
C997:  F7           rtn   
C998:  D6 00 E0 1C  pre     ix,&H1CE0
C99C:  A8 00        ldw     $0,(ix+$sx)
C99E:  D6 00 E2 1C  pre     ix,&H1CE2
C9A2:  A0 00        stw     $0,(ix+$sx)
C9A4:  D6 00 D8 1C  pre     ix,&H1CD8
C9A8:  A8 00        ldw     $0,(ix+$sx)
C9AA:  96 00        pre     ix,$0
C9AC:  77 C5 29     cal     &H29C5
C9AF:  E8 00 60     ldm     $0,(ix+$sx),4
C9B2:  41 00 11     sbc     $0,&H11
C9B5:  B0 0B        jr      z,&HC9C1
C9B7:  41 00 12     sbc     $0,&H12
C9BA:  B4 12        jr      nz,&HC9CD
C9BC:  77 52 CA     cal     &HCA52
C9BF:  B7 0D        jr      &HC9CD
C9C1:  01 03        sbc     $3,$sx
C9C3:  B0 06        jr      z,&HC9CA
C9C5:  41 03 02     sbc     $3,&H02
C9C8:  B4 04        jr      nz,&HC9CD
C9CA:  77 11 CA     cal     &HCA11
C9CD:  42 02 0F     ld      $2,&H0F
C9D0:  A8 60 02     ldw     $0,(ix+$2)
C9D3:  84 40        ancw    $0,$sz
C9D5:  B0 05        jr      z,&HC9DB
C9D7:  96 00        pre     ix,$0
C9D9:  B7 AE        jr      &HC988
C9DB:  D6 00 E0 1C  pre     ix,&H1CE0
C9DF:  A8 00        ldw     $0,(ix+$sx)
C9E1:  96 00        pre     ix,$0
C9E3:  D1 00 42 20  ldw     $0,&H2042
C9E7:  D1 02 46 20  ldw     $2,&H2046
C9EB:  D1 04 4A 20  ldw     $4,&H204A
C9EF:  D1 06 4E 20  ldw     $6,&H204E
C9F3:  E0 00 E0     stm     $0,(ix+$sx),8
C9F6:  D6 00 E2 1C  pre     ix,&H1CE2
C9FA:  A8 00        ldw     $0,(ix+$sx)
C9FC:  D6 00 27 20  pre     ix,&H2027
CA00:  A0 00        stw     $0,(ix+$sx)
CA02:  D6 00 11 1D  pre     ix,&H1D11
CA06:  89 40        sbw     $0,$sz
CA08:  20 00        st      $0,(ix+$sx)
CA0A:  D6 00 12 1D  pre     ix,&H1D12
CA0E:  A0 00        stw     $0,(ix+$sx)
CA10:  F7           rtn   
CA11:  D1 00 E2 1C  ldw     $0,&H1CE2
CA15:  91 44        ldw     $4,($sz)
CA17:  42 02 05     ld      $2,&H05
CA1A:  A0 64 02     stw     $4,(ix+$2)
CA1D:  42 02 07     ld      $2,&H07
CA20:  A8 66 02     ldw     $6,(ix+$2)
CA23:  9E 00        gre     ix,$0
CA25:  D6 00 E2 1C  pre     ix,&H1CE2
CA29:  A8 08        ldw     $8,(ix+$sx)
CA2B:  88 68 06     adw     $8,$6
CA2E:  35 48 FE     jp      c,&HFE48
CA31:  D6 00 E6 1C  pre     ix,&H1CE6
CA35:  A8 0A        ldw     $10,(ix+$sx)
CA37:  81 6A 08     sbcw    $10,$8
CA3A:  35 48 FE     jp      c,&HFE48
CA3D:  D6 00 E2 1C  pre     ix,&H1CE2
CA41:  A0 08        stw     $8,(ix+$sx)
CA43:  89 26        sbw     $6,$sy
CA45:  96 04        pre     ix,$4
CA47:  02 08        ld      $8,$sx
CA49:  22 08        sti     $8,(ix+$sx)
CA4B:  89 26        sbw     $6,$sy
CA4D:  B1 85        jr      nc,&HC9D3
CA4F:  96 00        pre     ix,$0
CA51:  F7           rtn   
CA52:  9E 00        gre     ix,$0
CA54:  A6 01        phsw    $1
CA56:  68 00 03     ld      $0,(ix+&H03)
CA59:  01 00        sbc     $0,$sx
CA5B:  B0 06        jr      z,&HCA62
CA5D:  41 00 02     sbc     $0,&H02
CA60:  B4 2A        jr      nz,&HCA8B
CA62:  42 02 0D     ld      $2,&H0D
CA65:  A8 60 02     ldw     $0,(ix+$2)
CA68:  96 00        pre     ix,$0
CA6A:  77 C5 29     cal     &H29C5
CA6D:  E8 00 60     ldm     $0,(ix+$sx),4
CA70:  01 00        sbc     $0,$sx
CA72:  B0 18        jr      z,&HCA8B
CA74:  41 00 11     sbc     $0,&H11
CA77:  B4 09        jr      nz,&HCA81
CA79:  41 03 02     sbc     $3,&H02
CA7C:  B4 04        jr      nz,&HCA81
CA7E:  77 11 CA     cal     &HCA11
CA81:  42 02 0F     ld      $2,&H0F
CA84:  A8 60 02     ldw     $0,(ix+$2)
CA87:  96 00        pre     ix,$0
CA89:  B7 A0        jr      &HCA2A
CA8B:  AE 00        ppsw    $0
CA8D:  96 00        pre     ix,$0
CA8F:  F7           rtn   
CA90:  89 66 06     sbw     $6,$6
CA93:  E8 00 60     ldm     $0,(ix+$sx),4
CA96:  01 00        sbc     $0,$sx
CA98:  B0 35        jr      z,&HCACE
CA9A:  41 00 11     sbc     $0,&H11
CA9D:  B4 27        jr      nz,&HCAC5
CA9F:  41 03 05     sbc     $3,&H05
CAA2:  B4 22        jr      nz,&HCAC5
CAA4:  42 00 05     ld      $0,&H05
CAA7:  A0 46        stw     $6,(ix+$sz)
CAA9:  42 00 07     ld      $0,&H07
CAAC:  A8 41        ldw     $1,(ix+$sz)
CAAE:  88 66 01     adw     $6,$1
CAB1:  A6 07        phsw    $7
CAB3:  82 6A 01     ldw     $10,$1
CAB6:  77 0D DA     cal     &HDA0D
CAB9:  9E 60        gre     us,$0
CABB:  89 60 0A     sbw     $0,$10
CABE:  96 60        pre     us,$0
CAC0:  77 3B DA     cal     &HDA3B
CAC3:  AE 06        ppsw    $6
CAC5:  42 00 0F     ld      $0,&H0F
CAC8:  A8 41        ldw     $1,(ix+$sz)
CACA:  96 01        pre     ix,$1
CACC:  B7 BA        jr      &HCA87
CACE:  F7           rtn   
CACF:  D6 00 D8 1C  pre     ix,&H1CD8
CAD3:  A8 00        ldw     $0,(ix+$sx)
CAD5:  96 00        pre     ix,$0
CAD7:  E8 02 60     ldm     $2,(ix+$sx),4
CADA:  41 02 12     sbc     $2,&H12
CADD:  B4 37        jr      nz,&HCB15
CADF:  01 05        sbc     $5,$sx
CAE1:  B0 06        jr      z,&HCAE8
CAE3:  41 05 02     sbc     $5,&H02
CAE6:  B4 2E        jr      nz,&HCB15
CAE8:  91 60 03     ldw     $0,($3)
CAEB:  01 00        sbc     $0,$sx
CAED:  B4 27        jr      nz,&HCB15
CAEF:  41 01 04     sbc     $1,&H04
CAF2:  B4 22        jr      nz,&HCB15
CAF4:  D1 00 04 00  ldw     $0,&H0004
CAF8:  88 60 03     adw     $0,$3
CAFB:  D1 02 6D 61  ldw     $2,&H616D
CAFF:  D1 04 69 6E  ldw     $4,&H6E69
CB03:  91 46        ldw     $6,($sz)
CB05:  81 66 02     sbcw    $6,$2
CB08:  B4 0C        jr      nz,&HCB15
CB0A:  88 20        adw     $0,$sy
CB0C:  88 20        adw     $0,$sy
CB0E:  91 46        ldw     $6,($sz)
CB10:  81 66 04     sbcw    $6,$4
CB13:  B0 10        jr      z,&HCB24
CB15:  42 02 0F     ld      $2,&H0F
CB18:  A8 60 02     ldw     $0,(ix+$2)
CB1B:  96 00        pre     ix,$0
CB1D:  84 40        ancw    $0,$sz
CB1F:  30 0C FE     jp      z,&HFE0C
CB22:  B7 CC        jr      &HCAEF
CB24:  42 02 0B     ld      $2,&H0B
CB27:  A8 60 02     ldw     $0,(ix+$2)
CB2A:  84 40        ancw    $0,$sz
CB2C:  34 12 FE     jp      nz,&HFE12
CB2F:  9E 04        gre     ix,$4
CB31:  D6 00 7A 1F  pre     ix,&H1F7A
CB35:  A0 04        stw     $4,(ix+$sx)
CB37:  96 04        pre     ix,$4
CB39:  42 02 05     ld      $2,&H05
CB3C:  A8 60 02     ldw     $0,(ix+$2)
CB3F:  D6 00 7C 1F  pre     ix,&H1F7C
CB43:  A0 00        stw     $0,(ix+$sx)
CB45:  96 04        pre     ix,$4
CB47:  42 02 0D     ld      $2,&H0D
CB4A:  A8 60 02     ldw     $0,(ix+$2)
CB4D:  A6 01        phsw    $1
CB4F:  D1 0A 04 00  ldw     $10,&H0004
CB53:  77 0D DA     cal     &HDA0D
CB56:  77 3B DA     cal     &HDA3B
CB59:  89 40        sbw     $0,$sz
CB5B:  A6 01        phsw    $1
CB5D:  77 51 FB     cal     &HFB51
CB60:  AE 00        ppsw    $0
CB62:  96 00        pre     ix,$0
CB64:  77 90 CA     cal     &HCA90
CB67:  F7           rtn   
CB68:  77 C5 29     cal     &H29C5
CB6B:  9F 00        gre     ss,$0
CB6D:  D6 00 30 20  pre     ix,&H2030
CB71:  A0 00        stw     $0,(ix+$sx)
CB73:  D6 00 7E 1F  pre     ix,&H1F7E
CB77:  28 00        ld      $0,(ix+$sx)
CB79:  01 20        sbc     $0,$sy
CB7B:  F0           rtn     z
CB7C:  D6 00 7C 1F  pre     ix,&H1F7C
CB80:  A8 00        ldw     $0,(ix+$sx)
CB82:  96 00        pre     ix,$0
CB84:  A8 00        ldw     $0,(ix+$sx)
CB86:  44 01 F0     anc     $1,&HF0
CB89:  B4 4C        jr      nz,&HCBD6
CB8B:  01 01        sbc     $1,$sx
CB8D:  B4 09        jr      nz,&HCB97
CB8F:  77 BA CC     cal     &HCCBA
CB92:  77 01 A6     cal     &HA601
CB95:  B7 46        jr      &HCBDC
CB97:  41 01 02     sbc     $1,&H02
CB9A:  B4 06        jr      nz,&HCBA1
CB9C:  77 D7 CC     cal     &HCCD7
CB9F:  B7 B8        jr      &HCB58
CBA1:  41 01 06     sbc     $1,&H06
CBA4:  B4 06        jr      nz,&HCBAB
CBA6:  77 AD CD     cal     &HCDAD
CBA9:  B7 C2        jr      &HCB6C
CBAB:  41 01 07     sbc     $1,&H07
CBAE:  B4 06        jr      nz,&HCBB5
CBB0:  77 C8 CD     cal     &HCDC8
CBB3:  B7 CC        jr      &HCB80
CBB5:  41 01 03     sbc     $1,&H03
CBB8:  B4 06        jr      nz,&HCBBF
CBBA:  77 3F CF     cal     &HCF3F
CBBD:  B7 1E        jr      &HCBDC
CBBF:  41 01 01     sbc     $1,&H01
CBC2:  B4 26        jr      nz,&HCBE9
CBC4:  82 42        ldw     $2,$sz
CBC6:  D1 00 03 03  ldw     $0,&H0303
CBCA:  D6 00 89 1F  pre     ix,&H1F89
CBCE:  E0 00 60     stm     $0,(ix+$sx),4
CBD1:  77 4F D9     cal     &HD94F
CBD4:  B7 07        jr      &HCBDC
CBD6:  77 56 CC     cal     &HCC56
CBD9:  77 4F D9     cal     &HD94F
CBDC:  D6 00 7C 1F  pre     ix,&H1F7C
CBE0:  D1 02 02 00  ldw     $2,&H0002
CBE4:  BC 02        adw     (ix+$sx),$2
CBE6:  37 68 CB     jp      &HCB68
CBE9:  41 01 08     sbc     $1,&H08
CBEC:  B4 09        jr      nz,&HCBF6
CBEE:  89 62 02     sbw     $2,$2
CBF1:  77 C6 D6     cal     &HD6C6
CBF4:  B7 99        jr      &HCB8E
CBF6:  41 01 0A     sbc     $1,&H0A
CBF9:  B4 08        jr      nz,&HCC02
CBFB:  82 22        ldw     $2,$sy
CBFD:  77 C6 D6     cal     &HD6C6
CC00:  B7 A5        jr      &HCBA6
CC02:  41 01 09     sbc     $1,&H09
CC05:  B0 06        jr      z,&HCC0C
CC07:  41 01 0B     sbc     $1,&H0B
CC0A:  B4 0C        jr      nz,&HCC17
CC0C:  77 EA D6     cal     &HD6EA
CC0F:  82 62 0F     ldw     $2,$15
CC12:  77 1A D7     cal     &HD71A
CC15:  B7 BA        jr      &HCBD0
CC17:  34 5D FD     jp      nz,&HFD5D
CC1A:  D6 00 30 20  pre     ix,&H2030
CC1E:  A8 00        ldw     $0,(ix+$sx)
CC20:  97 00        pre     ss,$0
CC22:  D6 00 7E 1F  pre     ix,&H1F7E
CC26:  28 02        ld      $2,(ix+$sx)
CC28:  41 02 02     sbc     $2,&H02
CC2B:  B4 15        jr      nz,&HCC41
CC2D:  77 66 FB     cal     &HFB66
CC30:  AE 02        ppsw    $2
CC32:  77 A4 D2     cal     &HD2A4
CC35:  D6 00 7C 1F  pre     ix,&H1F7C
CC39:  D1 02 04 00  ldw     $2,&H0004
CC3D:  BC 02        adw     (ix+$sx),$2
CC3F:  B7 0D        jr      &HCC4D
CC41:  D6 00 A7 1F  pre     ix,&H1FA7
CC45:  28 13        ld      $19,(ix+$sx)
CC47:  CF 6A EA     xrm     $10,$10,8
CC4A:  09 72 12     sb      $18,$18
CC4D:  77 D4 DC     cal     &HDCD4
CC50:  77 4F D9     cal     &HD94F
CC53:  37 DC CB     jp      &HCBDC
CC56:  96 00        pre     ix,$0
CC58:  2A 02        ldi     $2,(ix+$sx)
CC5A:  01 02        sbc     $2,$sx
CC5C:  B0 06        jr      z,&HCC63
CC5E:  41 02 10     sbc     $2,&H10
CC61:  B4 11        jr      nz,&HCC73
CC63:  02 62 01     ld      $2,$1
CC66:  02 41        ld      $1,$sz
CC68:  02 20        ld      $0,$sy
CC6A:  D6 00 89 1F  pre     ix,&H1F89
CC6E:  E0 00 40     stm     $0,(ix+$sx),3
CC71:  B7 3D        jr      &HCCAF
CC73:  42 00 03     ld      $0,&H03
CC76:  02 61 02     ld      $1,$2
CC79:  41 01 03     sbc     $1,&H03
CC7C:  B0 06        jr      z,&HCC83
CC7E:  41 01 04     sbc     $1,&H04
CC81:  B4 05        jr      nz,&HCC87
CC83:  A8 02        ldw     $2,(ix+$sx)
CC85:  B7 29        jr      &HCCAF
CC87:  41 01 05     sbc     $1,&H05
CC8A:  B0 06        jr      z,&HCC91
CC8C:  41 01 06     sbc     $1,&H06
CC8F:  B4 06        jr      nz,&HCC96
CC91:  E8 02 60     ldm     $2,(ix+$sx),4
CC94:  B7 1A        jr      &HCCAF
CC96:  41 01 08     sbc     $1,&H08
CC99:  B4 06        jr      nz,&HCCA0
CC9B:  E8 02 E0     ldm     $2,(ix+$sx),8
CC9E:  B7 10        jr      &HCCAF
CCA0:  41 01 11     sbc     $1,&H11
CCA3:  34 5D FD     jp      nz,&HFD5D
CCA6:  42 00 06     ld      $0,&H06
CCA9:  2A 04        ldi     $4,(ix+$sx)
CCAB:  02 05        ld      $5,$sx
CCAD:  9E 02        gre     ix,$2
CCAF:  D6 00 89 1F  pre     ix,&H1F89
CCB3:  E2 00 E0     stim    $0,(ix+$sx),8
CCB6:  E0 08 20     stm     $8,(ix+$sx),2
CCB9:  F7           rtn   
CCBA:  D6 00 11 1D  pre     ix,&H1D11
CCBE:  20 00        st      $0,(ix+$sx)
CCC0:  D6 00 7C 1F  pre     ix,&H1F7C
CCC4:  D1 02 02 00  ldw     $2,&H0002
CCC8:  BC 02        adw     (ix+$sx),$2
CCCA:  A8 00        ldw     $0,(ix+$sx)
CCCC:  96 00        pre     ix,$0
CCCE:  A8 00        ldw     $0,(ix+$sx)
CCD0:  D6 00 12 1D  pre     ix,&H1D12
CCD4:  A0 00        stw     $0,(ix+$sx)
CCD6:  F7           rtn   
CCD7:  D6 00 7C 1F  pre     ix,&H1F7C
CCDB:  41 00 18     sbc     $0,&H18
CCDE:  B0 4A        jr      z,&HCD29
CCE0:  41 00 1A     sbc     $0,&H1A
CCE3:  B0 45        jr      z,&HCD29
CCE5:  41 00 1C     sbc     $0,&H1C
CCE8:  B0 61        jr      z,&HCD4A
CCEA:  41 00 22     sbc     $0,&H22
CCED:  B0 19        jr      z,&HCD07
CCEF:  41 00 23     sbc     $0,&H23
CCF2:  30 7E CD     jp      z,&HCD7E
CCF5:  41 00 24     sbc     $0,&H24
CCF8:  B0 4B        jr      z,&HCD44
CCFA:  41 00 25     sbc     $0,&H25
CCFD:  30 7E CD     jp      z,&HCD7E
CD00:  D1 02 02 00  ldw     $2,&H0002
CD04:  BC 02        adw     (ix+$sx),$2
CD06:  F7           rtn   
CD07:  D6 00 7A 1F  pre     ix,&H1F7A
CD0B:  A8 00        ldw     $0,(ix+$sx)
CD0D:  96 00        pre     ix,$0
CD0F:  68 00 04     ld      $0,(ix+&H04)
CD12:  D6 00 7C 1F  pre     ix,&H1F7C
CD16:  01 00        sbc     $0,$sx
CD18:  B4 10        jr      nz,&HCD29
CD1A:  77 2E CD     cal     &HCD2E
CD1D:  91 42        ldw     $2,($sz)
CD1F:  A0 02        stw     $2,(ix+$sx)
CD21:  77 D9 CD     cal     &HCDD9
CD24:  B0 46        jr      z,&HCD6B
CD26:  37 1E FE     jp      &HFE1E
CD29:  77 2E CD     cal     &HCD2E
CD2C:  B7 36        jr      &HCD63
CD2E:  D1 0A 02 00  ldw     $10,&H0002
CD32:  77 0D DA     cal     &HDA0D
CD35:  77 3B DA     cal     &HDA3B
CD38:  A8 00        ldw     $0,(ix+$sx)
CD3A:  A7 01        phuw    $1
CD3C:  D1 02 02 00  ldw     $2,&H0002
CD40:  88 60 02     adw     $0,$2
CD43:  F7           rtn   
CD44:  D1 0F 08 00  ldw     $15,&H0008
CD48:  B7 05        jr      &HCD4E
CD4A:  D1 0F 06 00  ldw     $15,&H0006
CD4E:  D1 0A 03 00  ldw     $10,&H0003
CD52:  77 0D DA     cal     &HDA0D
CD55:  77 3B DA     cal     &HDA3B
CD58:  02 00        ld      $0,$sx
CD5A:  27 00        phu     $0
CD5C:  A8 00        ldw     $0,(ix+$sx)
CD5E:  A7 01        phuw    $1
CD60:  88 60 0F     adw     $0,$15
CD63:  91 42        ldw     $2,($sz)
CD65:  A0 02        stw     $2,(ix+$sx)
CD67:  77 D9 CD     cal     &HCDD9
CD6A:  F4           rtn     nz
CD6B:  D6 00 89 1F  pre     ix,&H1F89
CD6F:  D1 00 03 03  ldw     $0,&H0303
CD73:  D1 02 00 00  ldw     $2,&H0000
CD77:  E0 00 60     stm     $0,(ix+$sx),4
CD7A:  77 FC CD     cal     &HCDFC
CD7D:  F7           rtn   
CD7E:  A8 02        ldw     $2,(ix+$sx)
CD80:  96 02        pre     ix,$2
CD82:  D1 04 02 00  ldw     $4,&H0002
CD86:  A8 62 04     ldw     $2,(ix+$4)
CD89:  41 00 23     sbc     $0,&H23
CD8C:  B0 08        jr      z,&HCD95
CD8E:  D6 00 7C 1F  pre     ix,&H1F7C
CD92:  A0 02        stw     $2,(ix+$sx)
CD94:  F7           rtn   
CD95:  82 78 02     ldw     $24,$2
CD98:  42 00 00     ld      $0,&H00
CD9B:  42 13 31     ld      $19,&H31
CD9E:  77 3C DD     cal     &HDD3C
CDA1:  42 00 05     ld      $0,&H05
CDA4:  A8 42        ldw     $2,(ix+$sz)
CDA6:  D6 00 7C 1F  pre     ix,&H1F7C
CDAA:  A0 02        stw     $2,(ix+$sx)
CDAC:  F7           rtn   
CDAD:  77 D9 CD     cal     &HCDD9
CDB0:  B0 10        jr      z,&HCDC1
CDB2:  D1 0A 02 00  ldw     $10,&H0002
CDB6:  77 0D DA     cal     &HDA0D
CDB9:  77 3B DA     cal     &HDA3B
CDBC:  89 40        sbw     $0,$sz
CDBE:  A7 01        phuw    $1
CDC0:  F7           rtn   
CDC1:  D1 00 02 00  ldw     $0,&H0002
CDC5:  BC 00        adw     (ix+$sx),$0
CDC7:  F7           rtn   
CDC8:  D6 00 89 1F  pre     ix,&H1F89
CDCC:  77 64 DA     cal     &HDA64
CDCF:  77 F6 DA     cal     &HDAF6
CDD2:  77 D4 DC     cal     &HDCD4
CDD5:  77 FC CD     cal     &HCDFC
CDD8:  F7           rtn   
CDD9:  D6 00 7C 1F  pre     ix,&H1F7C
CDDD:  D1 00 02 00  ldw     $0,&H0002
CDE1:  BC 00        adw     (ix+$sx),$0
CDE3:  A8 00        ldw     $0,(ix+$sx)
CDE5:  91 42        ldw     $2,($sz)
CDE7:  01 03        sbc     $3,$sx
CDE9:  B4 09        jr      nz,&HCDF3
CDEB:  77 BA CC     cal     &HCCBA
CDEE:  77 01 A6     cal     &HA601
CDF1:  B7 99        jr      &HCD8B
CDF3:  41 03 06     sbc     $3,&H06
CDF6:  B0 9E        jr      z,&HCD95
CDF8:  41 03 07     sbc     $3,&H07
CDFB:  F7           rtn   
CDFC:  AF 00        ppuw    $0
CDFE:  77 51 DA     cal     &HDA51
CE01:  D6 00 7C 1F  pre     ix,&H1F7C
CE05:  84 40        ancw    $0,$sz
CE07:  B4 08        jr      nz,&HCE10
CE09:  D1 00 02 00  ldw     $0,&H0002
CE0D:  BC 00        adw     (ix+$sx),$0
CE0F:  F7           rtn   
CE10:  A0 00        stw     $0,(ix+$sx)
CE12:  91 44        ldw     $4,($sz)
CE14:  41 04 18     sbc     $4,&H18
CE17:  B0 18        jr      z,&HCE30
CE19:  41 04 1A     sbc     $4,&H1A
CE1C:  B0 13        jr      z,&HCE30
CE1E:  41 04 1C     sbc     $4,&H1C
CE21:  B0 18        jr      z,&HCE3A
CE23:  41 04 22     sbc     $4,&H22
CE26:  B0 17        jr      z,&HCE3E
CE28:  41 04 24     sbc     $4,&H24
CE2B:  B0 0E        jr      z,&HCE3A
CE2D:  37 5D FD     jp      &HFD5D
CE30:  D1 02 04 00  ldw     $2,&H0004
CE34:  BC 02        adw     (ix+$sx),$2
CE36:  77 42 CE     cal     &HCE42
CE39:  F7           rtn   
CE3A:  77 5C CE     cal     &HCE5C
CE3D:  F7           rtn   
CE3E:  77 CB CE     cal     &HCECB
CE41:  F7           rtn   
CE42:  77 5C D6     cal     &HD65C
CE45:  D6 00 7C 1F  pre     ix,&H1F7C
CE49:  A8 00        ldw     $0,(ix+$sx)
CE4B:  84 6F 0F     ancw    $15,$15
CE4E:  B0 08        jr      z,&HCE57
CE50:  D1 02 02 00  ldw     $2,&H0002
CE54:  88 60 02     adw     $0,$2
CE57:  91 42        ldw     $2,($sz)
CE59:  A0 02        stw     $2,(ix+$sx)
CE5B:  F7           rtn   
CE5C:  2F 02        ppu     $2
CE5E:  77 51 DA     cal     &HDA51
CE61:  01 22        sbc     $2,$sy
CE63:  B0 4E        jr      z,&HCEB2
CE65:  41 04 1C     sbc     $4,&H1C
CE68:  B0 07        jr      z,&HCE70
CE6A:  D1 0F 0A 00  ldw     $15,&H000A
CE6E:  B7 05        jr      &HCE74
CE70:  D1 0F 04 00  ldw     $15,&H0004
CE74:  26 04        phs     $4
CE76:  D1 0A 03 00  ldw     $10,&H0003
CE7A:  77 0D DA     cal     &HDA0D
CE7D:  77 3B DA     cal     &HDA3B
CE80:  02 20        ld      $0,$sy
CE82:  27 00        phu     $0
CE84:  D6 00 7C 1F  pre     ix,&H1F7C
CE88:  A8 00        ldw     $0,(ix+$sx)
CE8A:  A7 01        phuw    $1
CE8C:  88 60 0F     adw     $0,$15
CE8F:  91 4F        ldw     $15,($sz)
CE91:  A0 0F        stw     $15,(ix+$sx)
CE93:  77 D9 CD     cal     &HCDD9
CE96:  2E 04        pps     $4
CE98:  F4           rtn     nz
CE99:  EF 00 40     ppum    $0,3
CE9C:  77 51 DA     cal     &HDA51
CE9F:  D6 00 7C 1F  pre     ix,&H1F7C
CEA3:  A0 00        stw     $0,(ix+$sx)
CEA5:  D6 00 89 1F  pre     ix,&H1F89
CEA9:  D1 00 03 03  ldw     $0,&H0303
CEAD:  82 22        ldw     $2,$sy
CEAF:  E0 00 60     stm     $0,(ix+$sx),4
CEB2:  41 04 1C     sbc     $4,&H1C
CEB5:  B0 07        jr      z,&HCEBD
CEB7:  D1 0F 0E 00  ldw     $15,&H000E
CEBB:  B7 05        jr      &HCEC1
CEBD:  D1 0F 08 00  ldw     $15,&H0008
CEC1:  D6 00 7C 1F  pre     ix,&H1F7C
CEC5:  BC 0F        adw     (ix+$sx),$15
CEC7:  77 42 CE     cal     &HCE42
CECA:  F7           rtn   
CECB:  77 66 FB     cal     &HFB66
CECE:  AE 00        ppsw    $0
CED0:  77 51 DA     cal     &HDA51
CED3:  84 40        ancw    $0,$sz
CED5:  B4 0A        jr      nz,&HCEE0
CED7:  D6 00 7E 1F  pre     ix,&H1F7E
CEDB:  02 20        ld      $0,$sy
CEDD:  20 00        st      $0,(ix+$sx)
CEDF:  F7           rtn   
CEE0:  D6 00 7A 1F  pre     ix,&H1F7A
CEE4:  A8 02        ldw     $2,(ix+$sx)
CEE6:  A6 01        phsw    $1
CEE8:  96 02        pre     ix,$2
CEEA:  42 00 04     ld      $0,&H04
CEED:  28 5C        ld      $28,(ix+$sz)
CEEF:  D6 00 89 1F  pre     ix,&H1F89
CEF3:  77 F6 DA     cal     &HDAF6
CEF6:  02 7D 13     ld      $29,$19
CEF9:  01 1C        sbc     $28,$sx
CEFB:  B4 04        jr      nz,&HCF00
CEFD:  02 93 08     ld      $19,$sx,jr &HCF07
CF00:  26 1C        phs     $28
CF02:  77 A8 D7     cal     &HD7A8
CF05:  2E 13        pps     $19
CF07:  77 D4 DC     cal     &HDCD4
CF0A:  AE 00        ppsw    $0
CF0C:  EF 02 C0     ppum    $2,7
CF0F:  D6 00 7C 1F  pre     ix,&H1F7C
CF13:  A0 00        stw     $0,(ix+$sx)
CF15:  D6 00 7A 1F  pre     ix,&H1F7A
CF19:  A0 02        stw     $2,(ix+$sx)
CF1B:  D6 00 11 1D  pre     ix,&H1D11
CF1F:  20 04        st      $4,(ix+$sx)
CF21:  D6 00 12 1D  pre     ix,&H1D12
CF25:  A0 05        stw     $5,(ix+$sx)
CF27:  9E 60        gre     us,$0
CF29:  88 60 07     adw     $0,$7
CF2C:  96 60        pre     us,$0
CF2E:  77 51 DA     cal     &HDA51
CF31:  77 4F D9     cal     &HD94F
CF34:  D6 00 7C 1F  pre     ix,&H1F7C
CF38:  D1 02 06 00  ldw     $2,&H0006
CF3C:  BC 02        adw     (ix+$sx),$2
CF3E:  F7           rtn   
CF3F:  26 00        phs     $0
CF41:  41 00 2A     sbc     $0,&H2A
CF44:  B0 0B        jr      z,&HCF50
CF46:  B1 19        jr      nc,&HCF60
CF48:  02 1C        ld      $28,$sx
CF4A:  2E 1D        pps     $29
CF4C:  77 B1 D0     cal     &HD0B1
CF4F:  F7           rtn   
CF50:  77 E7 DA     cal     &HDAE7
CF53:  77 0A D0     cal     &HD00A
CF56:  2E 1D        pps     $29
CF58:  02 1C        ld      $28,$sx
CF5A:  77 B1 D0     cal     &HD0B1
CF5D:  37 06 D0     jp      &HD006
CF60:  41 00 30     sbc     $0,&H30
CF63:  B0 06        jr      z,&HCF6A
CF65:  41 00 2F     sbc     $0,&H2F
CF68:  B1 12        jr      nc,&HCF7B
CF6A:  D6 00 89 1F  pre     ix,&H1F89
CF6E:  77 64 DA     cal     &HDA64
CF71:  02 1C        ld      $28,$sx
CF73:  2E 1D        pps     $29
CF75:  77 B1 D0     cal     &HD0B1
CF78:  37 06 D0     jp      &HD006
CF7B:  41 00 2F     sbc     $0,&H2F
CF7E:  B0 17        jr      z,&HCF96
CF80:  41 00 31     sbc     $0,&H31
CF83:  B0 12        jr      z,&HCF96
CF85:  41 00 36     sbc     $0,&H36
CF88:  B1 25        jr      nc,&HCFAE
CF8A:  D6 00 89 1F  pre     ix,&H1F89
CF8E:  77 64 DA     cal     &HDA64
CF91:  02 1C        ld      $28,$sx
CF93:  37 FE CF     jp      &HCFFE
CF96:  D6 00 89 1F  pre     ix,&H1F89
CF9A:  77 64 DA     cal     &HDA64
CF9D:  77 F6 DA     cal     &HDAF6
CFA0:  02 7C 13     ld      $28,$19
CFA3:  44 13 F0     anc     $19,&HF0
CFA6:  B0 57        jr      z,&HCFFE
CFA8:  42 1C 0F     ld      $28,&H0F
CFAB:  37 FE CF     jp      &HCFFE
CFAE:  41 00 4B     sbc     $0,&H4B
CFB1:  B0 0D        jr      z,&HCFBF
CFB3:  41 00 36     sbc     $0,&H36
CFB6:  B0 16        jr      z,&HCFCD
CFB8:  41 00 37     sbc     $0,&H37
CFBB:  B0 15        jr      z,&HCFD1
CFBD:  B7 1C        jr      &HCFDA
CFBF:  77 E7 DA     cal     &HDAE7
CFC2:  02 1C        ld      $28,$sx
CFC4:  D6 00 93 1F  pre     ix,&H1F93
CFC8:  77 F6 DA     cal     &HDAF6
CFCB:  B7 32        jr      &HCFFE
CFCD:  02 1C        ld      $28,$sx
CFCF:  B7 2E        jr      &HCFFE
CFD1:  02 1C        ld      $28,$sx
CFD3:  2E 1D        pps     $29
CFD5:  77 B1 D0     cal     &HD0B1
CFD8:  B7 2D        jr      &HD006
CFDA:  41 00 48     sbc     $0,&H48
CFDD:  B5 0C        jr      c,&HCFEA
CFDF:  41 00 4B     sbc     $0,&H4B
CFE2:  35 5D FD     jp      c,&HFD5D
CFE5:  41 00 56     sbc     $0,&H56
CFE8:  B1 09        jr      nc,&HCFF2
CFEA:  77 E7 DA     cal     &HDAE7
CFED:  77 0A D0     cal     &HD00A
CFF0:  B7 0D        jr      &HCFFE
CFF2:  77 E7 DA     cal     &HDAE7
CFF5:  D6 00 93 1F  pre     ix,&H1F93
CFF9:  77 F6 DA     cal     &HDAF6
CFFC:  02 1C        ld      $28,$sx
CFFE:  2E 1D        pps     $29
D000:  77 B1 D0     cal     &HD0B1
D003:  77 D4 DC     cal     &HDCD4
D006:  77 4F D9     cal     &HD94F
D009:  F7           rtn   
D00A:  D6 00 89 1F  pre     ix,&H1F89
D00E:  77 D7 DB     cal     &HDBD7
D011:  02 7D 13     ld      $29,$19
D014:  44 1D F0     anc     $29,&HF0
D017:  B0 04        jr      z,&HD01C
D019:  42 1D 0C     ld      $29,&H0C
D01C:  D6 00 93 1F  pre     ix,&H1F93
D020:  77 D7 DB     cal     &HDBD7
D023:  02 7C 13     ld      $28,$19
D026:  44 1C F0     anc     $28,&HF0
D029:  B0 04        jr      z,&HD02E
D02B:  42 1C 0C     ld      $28,&H0C
D02E:  01 1C        sbc     $28,$sx
D030:  30 24 FE     jp      z,&HFE24
D033:  01 1D        sbc     $29,$sx
D035:  30 24 FE     jp      z,&HFE24
D038:  89 40        sbw     $0,$sz
D03A:  02 60 1D     ld      $0,$29
D03D:  89 20        sbw     $0,$sy
D03F:  98 60        biuw    $0
D041:  98 60        biuw    $0
D043:  82 42        ldw     $2,$sz
D045:  98 60        biuw    $0
D047:  88 42        adw     $2,$sz
D049:  89 40        sbw     $0,$sz
D04B:  02 60 1C     ld      $0,$28
D04E:  89 20        sbw     $0,$sy
D050:  88 42        adw     $2,$sz
D052:  D1 00 3B 40  ldw     $0,&H403B
D056:  88 42        adw     $2,$sz
D058:  E6 03 40     phsm    $3,3
D05B:  77 71 9F     cal     &H9F71
D05E:  EE 01 40     ppsm    $1,3
D061:  96 42        pre     iz,$2
D063:  29 1C        ld      $28,(iz+$sx)
D065:  E6 02 40     phsm    $2,3
D068:  77 79 85     cal     &H8579
D06B:  EE 00 40     ppsm    $0,3
D06E:  04 7C 1C     anc     $28,$28
D071:  30 24 FE     jp      z,&HFE24
D074:  D6 00 93 1F  pre     ix,&H1F93
D078:  77 F6 DA     cal     &HDAF6
D07B:  02 7D 13     ld      $29,$19
D07E:  26 1C        phs     $28
D080:  77 A8 D7     cal     &HD7A8
D083:  2E 1C        pps     $28
D085:  77 A4 D0     cal     &HD0A4
D088:  A6 09        phsw    $9
D08A:  E6 07 E0     phsm    $7,8
D08D:  D6 00 89 1F  pre     ix,&H1F89
D091:  77 F6 DA     cal     &HDAF6
D094:  02 7D 13     ld      $29,$19
D097:  26 1C        phs     $28
D099:  77 A8 D7     cal     &HD7A8
D09C:  2E 1C        pps     $28
D09E:  EE 00 E0     ppsm    $0,8
D0A1:  AE 08        ppsw    $8
D0A3:  F7           rtn   
D0A4:  02 69 13     ld      $9,$19
D0A7:  C2 60 EA     ldm     $0,$10,8
D0AA:  02 68 12     ld      $8,$18
D0AD:  C2 74 78     ldm     $20,$24,4
D0B0:  F7           rtn   
D0B1:  A6 1D        phsw    $29
D0B3:  D6 00 A7 1F  pre     ix,&H1FA7
D0B7:  A0 1C        stw     $28,(ix+$sx)
D0B9:  D1 1C 75 D1  ldw     $28,&HD175
D0BD:  A6 1D        phsw    $29
D0BF:  E6 07 E0     phsm    $7,8
D0C2:  A8 1C        ldw     $28,(ix+$sx)
D0C4:  D1 06 04 00  ldw     $6,&H0004
D0C8:  41 1D 30     sbc     $29,&H30
D0CB:  B1 07        jr      nc,&HD0D3
D0CD:  D1 00 8C 48  ldw     $0,&H488C
D0D1:  B7 5D        jr      &HD12F
D0D3:  41 1D 38     sbc     $29,&H38
D0D6:  B1 07        jr      nc,&HD0DE
D0D8:  D1 00 C0 48  ldw     $0,&H48C0
D0DC:  B7 52        jr      &HD12F
D0DE:  41 1D 3B     sbc     $29,&H3B
D0E1:  B1 07        jr      nc,&HD0E9
D0E3:  D1 00 F4 48  ldw     $0,&H48F4
D0E7:  B7 47        jr      &HD12F
D0E9:  41 1D 3D     sbc     $29,&H3D
D0EC:  B1 07        jr      nc,&HD0F4
D0EE:  D1 00 2C 49  ldw     $0,&H492C
D0F2:  B7 3C        jr      &HD12F
D0F4:  41 1D 41     sbc     $29,&H41
D0F7:  B1 07        jr      nc,&HD0FF
D0F9:  D1 00 64 49  ldw     $0,&H4964
D0FD:  B7 31        jr      &HD12F
D0FF:  41 1D 45     sbc     $29,&H45
D102:  B1 07        jr      nc,&HD10A
D104:  D1 00 C4 49  ldw     $0,&H49C4
D108:  B7 26        jr      &HD12F
D10A:  41 1D 4C     sbc     $29,&H4C
D10D:  B1 07        jr      nc,&HD115
D10F:  D1 00 24 4A  ldw     $0,&H4A24
D113:  B7 1B        jr      &HD12F
D115:  41 1D 4F     sbc     $29,&H4F
D118:  B1 07        jr      nc,&HD120
D11A:  D1 00 74 4A  ldw     $0,&H4A74
D11E:  B7 10        jr      &HD12F
D120:  41 1D 52     sbc     $29,&H52
D123:  B1 07        jr      nc,&HD12B
D125:  D1 00 C4 4A  ldw     $0,&H4AC4
D129:  B7 05        jr      &HD12F
D12B:  D1 00 F8 4A  ldw     $0,&H4AF8
D12F:  E6 03 40     phsm    $3,3
D132:  77 71 9F     cal     &H9F71
D135:  EE 01 40     ppsm    $1,3
D138:  96 40        pre     iz,$0
D13A:  A9 02        ldw     $2,(iz+$sx)
D13C:  E6 02 40     phsm    $2,3
D13F:  77 79 85     cal     &H8579
D142:  EE 00 40     ppsm    $0,3
D145:  84 62 02     ancw    $2,$2
D148:  30 24 FE     jp      z,&HFE24
D14B:  81 7C 02     sbcw    $28,$2
D14E:  B0 05        jr      z,&HD154
D150:  88 E0 06 A4  adw     $0,$6,jr &HD0F7
D154:  D1 06 02 00  ldw     $6,&H0002
D158:  88 60 06     adw     $0,$6
D15B:  E6 03 40     phsm    $3,3
D15E:  77 71 9F     cal     &H9F71
D161:  EE 01 40     ppsm    $1,3
D164:  96 40        pre     iz,$0
D166:  A9 1C        ldw     $28,(iz+$sx)
D168:  E6 02 40     phsm    $2,3
D16B:  77 79 85     cal     &H8579
D16E:  EE 00 40     ppsm    $0,3
D171:  EE 00 E0     ppsm    $0,8
D174:  DE 1C        jp      $28
D176:  AE 1C        ppsw    $28
D178:  41 1D 38     sbc     $29,&H38
D17B:  B5 3B        jr      c,&HD1B7
D17D:  41 1D 3F     sbc     $29,&H3F
D180:  B5 17        jr      c,&HD198
D182:  41 1D 45     sbc     $29,&H45
D185:  B5 2E        jr      c,&HD1B4
D187:  41 1D 48     sbc     $29,&H48
D18A:  B5 0D        jr      c,&HD198
D18C:  41 1D 4B     sbc     $29,&H4B
D18F:  B5 27        jr      c,&HD1B7
D191:  B0 1D        jr      z,&HD1AF
D193:  41 1D 56     sbc     $29,&H56
D196:  B1 20        jr      nc,&HD1B7
D198:  41 1C 0F     sbc     $28,&H0F
D19B:  B0 0E        jr      z,&HD1AA
D19D:  41 1C F0     sbc     $28,&HF0
D1A0:  B0 09        jr      z,&HD1AA
D1A2:  41 1C FF     sbc     $28,&HFF
D1A5:  B0 04        jr      z,&HD1AA
D1A7:  02 73 1C     ld      $19,$28
D1AA:  41 1D 4B     sbc     $29,&H4B
D1AD:  B5 09        jr      c,&HD1B7
D1AF:  77 29 D7     cal     &HD729
D1B2:  B7 04        jr      &HD1B7
D1B4:  42 13 03     ld      $19,&H03
D1B7:  F7           rtn   
D1B8:  D6 00 7E 1F  pre     ix,&H1F7E
D1BC:  42 00 03     ld      $0,&H03
D1BF:  20 00        st      $0,(ix+$sx)
D1C1:  D6 00 7C 1F  pre     ix,&H1F7C
D1C5:  A8 00        ldw     $0,(ix+$sx)
D1C7:  88 20        adw     $0,$sy
D1C9:  88 20        adw     $0,$sy
D1CB:  96 00        pre     ix,$0
D1CD:  AA 04        ldiw    $4,(ix+$sx)
D1CF:  A8 00        ldw     $0,(ix+$sx)
D1D1:  41 05 05     sbc     $5,&H05
D1D4:  B4 18        jr      nz,&HD1ED
D1D6:  82 62 04     ldw     $2,$4
D1D9:  77 F4 D1     cal     &HD1F4
D1DC:  77 D4 DC     cal     &HDCD4
D1DF:  77 4F D9     cal     &HD94F
D1E2:  D6 00 7C 1F  pre     ix,&H1F7C
D1E6:  D1 02 04 00  ldw     $2,&H0004
D1EA:  BC 02        adw     (ix+$sx),$2
D1EC:  F7           rtn   
D1ED:  82 62 04     ldw     $2,$4
D1F0:  77 D1 D3     cal     &HD3D1
D1F3:  F7           rtn   
D1F4:  02 69 02     ld      $9,$2
D1F7:  02 03        ld      $3,$sx
D1F9:  49 02 65     sb      $2,&H65
D1FC:  A6 03        phsw    $3
D1FE:  89 66 06     sbw     $6,$6
D201:  98 62        biuw    $2
D203:  88 66 02     adw     $6,$2
D206:  98 62        biuw    $2
D208:  88 62 06     adw     $2,$6
D20B:  D1 04 CD 40  ldw     $4,&H40CD
D20F:  88 62 04     adw     $2,$4
D212:  AE 04        ppsw    $4
D214:  98 64        biuw    $4
D216:  D1 06 E2 4B  ldw     $6,&H4BE2
D21A:  88 64 06     adw     $4,$6
D21D:  E6 03 40     phsm    $3,3
D220:  77 71 9F     cal     &H9F71
D223:  EE 01 40     ppsm    $1,3
D226:  96 42        pre     iz,$2
D228:  A9 06        ldw     $6,(iz+$sx)
D22A:  96 44        pre     iz,$4
D22C:  A9 04        ldw     $4,(iz+$sx)
D22E:  E6 02 40     phsm    $2,3
D231:  77 79 85     cal     &H8579
D234:  EE 00 40     ppsm    $0,3
D237:  D6 00 A7 1F  pre     ix,&H1FA7
D23B:  20 06        st      $6,(ix+$sx)
D23D:  A6 05        phsw    $5
D23F:  02 08        ld      $8,$sx
D241:  44 07 40     anc     $7,&H40
D244:  B0 0A        jr      z,&HD24F
D246:  D6 00 41 20  pre     ix,&H2041
D24A:  20 09        st      $9,(ix+$sx)
D24C:  4C 07 BF     an      $7,&HBF
D24F:  44 07 80     anc     $7,&H80
D252:  B4 0A        jr      nz,&HD25D
D254:  81 60 07     sbcw    $0,$7
D257:  34 36 FE     jp      nz,&HFE36
D25A:  82 C4 0D     ldw     $4,$sz,jr &HD269
D25D:  4C 07 7F     an      $7,&H7F
D260:  81 60 07     sbcw    $0,$7
D263:  35 36 FE     jp      c,&HFE36
D266:  82 64 07     ldw     $4,$7
D269:  77 D7 D2     cal     &HD2D7
D26C:  02 6A 06     ld      $10,$6
D26F:  02 0B        ld      $11,$sx
D271:  77 0D DA     cal     &HDA0D
D274:  A6 0B        phsw    $11
D276:  77 9B D3     cal     &HD39B
D279:  D1 0A 06 00  ldw     $10,&H0006
D27D:  77 0D DA     cal     &HDA0D
D280:  AE 0A        ppsw    $10
D282:  A7 0B        phuw    $11
D284:  AE 00        ppsw    $0
D286:  D1 02 9F D2  ldw     $2,&HD29F
D28A:  A6 03        phsw    $3
D28C:  D6 00 7E 1F  pre     ix,&H1F7E
D290:  28 02        ld      $2,(ix+$sx)
D292:  41 02 03     sbc     $2,&H03
D295:  B0 08        jr      z,&HD29E
D297:  42 02 02     ld      $2,&H02
D29A:  20 02        st      $2,(ix+$sx)
D29C:  DE 00        jp      $0
D29E:  AE 02        ppsw    $2
D2A0:  77 A4 D2     cal     &HD2A4
D2A3:  F7           rtn   
D2A4:  D6 00 7E 1F  pre     ix,&H1F7E
D2A8:  02 02        ld      $2,$sx
D2AA:  20 02        st      $2,(ix+$sx)
D2AC:  D6 00 A7 1F  pre     ix,&H1FA7
D2B0:  28 13        ld      $19,(ix+$sx)
D2B2:  AF 02        ppuw    $2
D2B4:  9E 60        gre     us,$0
D2B6:  88 60 02     adw     $0,$2
D2B9:  96 60        pre     us,$0
D2BB:  77 51 DA     cal     &HDA51
D2BE:  D6 00 89 1F  pre     ix,&H1F89
D2C2:  42 02 02     ld      $2,&H02
D2C5:  22 02        sti     $2,(ix+$sx)
D2C7:  22 13        sti     $19,(ix+$sx)
D2C9:  D1 02 81 1F  ldw     $2,&H1F81
D2CD:  A0 02        stw     $2,(ix+$sx)
D2CF:  D6 00 89 1F  pre     ix,&H1F89
D2D3:  77 F6 DA     cal     &HDAF6
D2D6:  F7           rtn   
D2D7:  D1 06 A7 1F  ldw     $6,&H1FA7
D2DB:  D1 08 80 00  ldw     $8,&H0080
D2DF:  88 68 06     adw     $8,$6
D2E2:  96 08        pre     ix,$8
D2E4:  D1 08 02 00  ldw     $8,&H0002
D2E8:  88 62 08     adw     $2,$8
D2EB:  88 62 04     adw     $2,$4
D2EE:  89 66 06     sbw     $6,$6
D2F1:  84 40        ancw    $0,$sz
D2F3:  B0 4C        jr      z,&HD340
D2F5:  A6 01        phsw    $1
D2F7:  E6 07 E0     phsm    $7,8
D2FA:  9E 06        gre     ix,$6
D2FC:  A6 07        phsw    $7
D2FE:  D6 00 89 1F  pre     ix,&H1F89
D302:  77 64 DA     cal     &HDA64
D305:  77 F6 DA     cal     &HDAF6
D308:  AE 06        ppsw    $6
D30A:  96 06        pre     ix,$6
D30C:  EE 00 E0     ppsm    $0,8
D30F:  02 7D 13     ld      $29,$19
D312:  81 44        sbcw    $4,$sz
D314:  B1 05        jr      nc,&HD31A
D316:  02 FC 13 19  ld      $28,$19,jr &HD332
D31A:  E6 03 40     phsm    $3,3
D31D:  77 71 9F     cal     &H9F71
D320:  EE 01 40     ppsm    $1,3
D323:  96 42        pre     iz,$2
D325:  2D BC        ldd     $28,(iz-$sy)
D327:  9E 42        gre     iz,$2
D329:  E6 02 40     phsm    $2,3
D32C:  77 79 85     cal     &H8579
D32F:  EE 00 40     ppsm    $0,3
D332:  E6 05 60     phsm    $5,4
D335:  77 41 D3     cal     &HD341
D338:  EE 02 60     ppsm    $2,4
D33B:  AE 00        ppsw    $0
D33D:  89 A0 CE     sbw     $0,$sy,jr &HD30D
D340:  F7           rtn   
D341:  01 3C        sbc     $28,$sy
D343:  B4 05        jr      nz,&HD349
D345:  42 9C 03 09  ld      $28,&H03,jr &HD351
D349:  41 1C 02     sbc     $28,&H02
D34C:  B4 04        jr      nz,&HD351
D34E:  42 1C 04     ld      $28,&H04
D351:  02 73 1C     ld      $19,$28
D354:  A6 07        phsw    $7
D356:  9E 06        gre     ix,$6
D358:  A6 07        phsw    $7
D35A:  77 A8 D7     cal     &HD7A8
D35D:  AE 06        ppsw    $6
D35F:  96 06        pre     ix,$6
D361:  AE 06        ppsw    $6
D363:  41 13 05     sbc     $19,&H05
D366:  B5 26        jr      c,&HD38D
D368:  41 13 07     sbc     $19,&H07
D36B:  B1 0D        jr      nc,&HD379
D36D:  41 06 7D     sbc     $6,&H7D
D370:  B1 27        jr      nc,&HD398
D372:  E4 B2 60     stdm    $18,(ix-$sy),4
D375:  48 86 04 1F  ad      $6,&H04,jr &HD397
D379:  41 13 09     sbc     $19,&H09
D37C:  B1 10        jr      nc,&HD38D
D37E:  41 06 79     sbc     $6,&H79
D381:  B1 16        jr      nc,&HD398
D383:  77 7E F3     cal     &HF37E
D386:  E4 B1 E0     stdm    $17,(ix-$sy),8
D389:  48 86 08 0B  ad      $6,&H08,jr &HD397
D38D:  41 06 7F     sbc     $6,&H7F
D390:  B1 07        jr      nc,&HD398
D392:  A4 B0        stdw    $16,(ix-$sy)
D394:  48 06 02     ad      $6,&H02
D397:  F7           rtn   
D398:  37 3C FE     jp      &HFE3C
D39B:  E6 07 E0     phsm    $7,8
D39E:  D1 00 A7 1F  ldw     $0,&H1FA7
D3A2:  D1 02 80 00  ldw     $2,&H0080
D3A6:  88 42        adw     $2,$sz
D3A8:  96 02        pre     ix,$2
D3AA:  41 0A 08     sbc     $10,&H08
D3AD:  B5 0B        jr      c,&HD3B9
D3AF:  EC A7 E0     lddm    $7,(ix-$sy),8
D3B2:  E7 07 E0     phum    $7,8
D3B5:  49 8A 08 8E  sb      $10,&H08,jr &HD346
D3B9:  01 0A        sbc     $10,$sx
D3BB:  B0 09        jr      z,&HD3C5
D3BD:  AC A7        lddw    $7,(ix-$sy)
D3BF:  A7 07        phuw    $7
D3C1:  49 8A 02 8B  sb      $10,&H02,jr &HD34F
D3C5:  9E 60        gre     us,$0
D3C7:  D6 00 E4 1C  pre     ix,&H1CE4
D3CB:  A0 00        stw     $0,(ix+$sx)
D3CD:  EE 00 E0     ppsm    $0,8
D3D0:  F7           rtn   
D3D1:  A6 01        phsw    $1
D3D3:  42 00 02     ld      $0,&H02
D3D6:  42 13 12     ld      $19,&H12
D3D9:  82 78 02     ldw     $24,$2
D3DC:  77 3C DD     cal     &HDD3C
D3DF:  42 04 0B     ld      $4,&H0B
D3E2:  A8 65 04     ldw     $5,(ix+$4)
D3E5:  AE 00        ppsw    $0
D3E7:  81 60 05     sbcw    $0,$5
D3EA:  34 36 FE     jp      nz,&HFE36
D3ED:  42 04 05     ld      $4,&H05
D3F0:  A8 67 04     ldw     $7,(ix+$4)
D3F3:  A6 08        phsw    $8
D3F5:  42 04 0D     ld      $4,&H0D
D3F8:  A8 67 04     ldw     $7,(ix+$4)
D3FB:  9E 09        gre     ix,$9
D3FD:  A6 0A        phsw    $10
D3FF:  D1 09 A7 1F  ldw     $9,&H1FA7
D403:  D1 04 80 00  ldw     $4,&H0080
D407:  88 69 04     adw     $9,$4
D40A:  96 09        pre     ix,$9
D40C:  02 06        ld      $6,$sx
D40E:  01 00        sbc     $0,$sx
D410:  B0 39        jr      z,&HD44A
D412:  A6 08        phsw    $8
D414:  9E 02        gre     ix,$2
D416:  A6 03        phsw    $3
D418:  A6 01        phsw    $1
D41A:  E6 08 40     phsm    $8,3
D41D:  D6 00 89 1F  pre     ix,&H1F89
D421:  77 64 DA     cal     &HDA64
D424:  77 F6 DA     cal     &HDAF6
D427:  EE 06 40     ppsm    $6,3
D42A:  02 7D 13     ld      $29,$19
D42D:  AE 00        ppsw    $0
D42F:  77 D1 D4     cal     &HD4D1
D432:  96 07        pre     ix,$7
D434:  42 02 04     ld      $2,&H04
D437:  28 7C 02     ld      $28,(ix+$2)
D43A:  AE 02        ppsw    $2
D43C:  96 02        pre     ix,$2
D43E:  A6 01        phsw    $1
D440:  77 41 D3     cal     &HD341
D443:  AE 00        ppsw    $0
D445:  AE 07        ppsw    $7
D447:  09 A0 BB     sb      $0,$sy,jr &HD404
D44A:  D6 00 7E 1F  pre     ix,&H1F7E
D44E:  28 00        ld      $0,(ix+$sx)
D450:  41 00 03     sbc     $0,&H03
D453:  B0 57        jr      z,&HD4AB
D455:  02 6A 06     ld      $10,$6
D458:  02 0B        ld      $11,$sx
D45A:  77 0D DA     cal     &HDA0D
D45D:  A6 0B        phsw    $11
D45F:  77 9B D3     cal     &HD39B
D462:  D1 0A 0B 00  ldw     $10,&H000B
D466:  77 0D DA     cal     &HDA0D
D469:  77 3B DA     cal     &HDA3B
D46C:  AE 0A        ppsw    $10
D46E:  A7 0B        phuw    $11
D470:  D6 00 11 1D  pre     ix,&H1D11
D474:  28 00        ld      $0,(ix+$sx)
D476:  D6 00 12 1D  pre     ix,&H1D12
D47A:  A8 01        ldw     $1,(ix+$sx)
D47C:  E7 02 40     phum    $2,3
D47F:  D6 00 7A 1F  pre     ix,&H1F7A
D483:  A8 00        ldw     $0,(ix+$sx)
D485:  A7 01        phuw    $1
D487:  AE 00        ppsw    $0
D489:  A0 00        stw     $0,(ix+$sx)
D48B:  D6 00 7C 1F  pre     ix,&H1F7C
D48F:  A8 00        ldw     $0,(ix+$sx)
D491:  A6 01        phsw    $1
D493:  77 51 FB     cal     &HFB51
D496:  AE 00        ppsw    $0
D498:  D1 04 02 00  ldw     $4,&H0002
D49C:  89 60 04     sbw     $0,$4
D49F:  D6 00 7C 1F  pre     ix,&H1F7C
D4A3:  A0 00        stw     $0,(ix+$sx)
D4A5:  96 07        pre     ix,$7
D4A7:  77 90 CA     cal     &HCA90
D4AA:  F7           rtn   
D4AB:  02 00        ld      $0,$sx
D4AD:  20 00        st      $0,(ix+$sx)
D4AF:  AE 00        ppsw    $0
D4B1:  96 00        pre     ix,$0
D4B3:  68 13 04     ld      $19,(ix+&H04)
D4B6:  42 00 09     ld      $0,&H09
D4B9:  A8 58        ldw     $24,(ix+$sz)
D4BB:  CF 6A EA     xrm     $10,$10,8
D4BE:  77 D4 DC     cal     &HDCD4
D4C1:  77 4F D9     cal     &HD94F
D4C4:  D6 00 7C 1F  pre     ix,&H1F7C
D4C8:  D1 02 04 00  ldw     $2,&H0004
D4CC:  BC 02        adw     (ix+$sx),$2
D4CE:  AE 02        ppsw    $2
D4D0:  F7           rtn   
D4D1:  E6 06 C0     phsm    $6,7
D4D4:  89 65 05     sbw     $5,$5
D4D7:  96 07        pre     ix,$7
D4D9:  42 02 05     ld      $2,&H05
D4DC:  A0 65 02     stw     $5,(ix+$2)
D4DF:  01 20        sbc     $0,$sy
D4E1:  B0 26        jr      z,&HD508
D4E3:  68 03 04     ld      $3,(ix+&H04)
D4E6:  41 03 03     sbc     $3,&H03
D4E9:  B5 06        jr      c,&HD4F0
D4EB:  41 03 09     sbc     $3,&H09
D4EE:  B5 07        jr      c,&HD4F6
D4F0:  D1 03 02 00  ldw     $3,&H0002
D4F4:  B7 07        jr      &HD4FC
D4F6:  42 02 07     ld      $2,&H07
D4F9:  A8 63 02     ldw     $3,(ix+$2)
D4FC:  88 65 03     adw     $5,$3
D4FF:  42 02 0F     ld      $2,&H0F
D502:  A8 67 02     ldw     $7,(ix+$2)
D505:  09 A0 B0     sb      $0,$sy,jr &HD4B7
D508:  EE 00 C0     ppsm    $0,7
D50B:  F7           rtn   
D50C:  44 13 F0     anc     $19,&HF0
D50F:  B4 1A        jr      nz,&HD52A
D511:  41 13 0B     sbc     $19,&H0B
D514:  34 24 FE     jp      nz,&HFE24
D517:  D6 00 89 1F  pre     ix,&H1F89
D51B:  42 02 06     ld      $2,&H06
D51E:  A8 60 02     ldw     $0,(ix+$2)
D521:  84 40        ancw    $0,$sz
D523:  B0 06        jr      z,&HD52A
D525:  81 45        sbcw    $5,$sz
D527:  31 30 FE     jp      nc,&HFE30
D52A:  77 1D D8     cal     &HD81D
D52D:  A6 10        phsw    $16
D52F:  77 38 D5     cal     &HD538
D532:  AE 0F        ppsw    $15
D534:  77 74 D5     cal     &HD574
D537:  F7           rtn   
D538:  D6 00 89 1F  pre     ix,&H1F89
D53C:  77 F6 DA     cal     &HDAF6
D53F:  41 13 0B     sbc     $19,&H0B
D542:  B0 0F        jr      z,&HD552
D544:  44 13 F0     anc     $19,&HF0
D547:  30 24 FE     jp      z,&HFE24
D54A:  49 13 10     sb      $19,&H10
D54D:  41 13 0B     sbc     $19,&H0B
D550:  B4 1F        jr      nz,&HD570
D552:  96 18        pre     ix,$24
D554:  42 1D 04     ld      $29,&H04
D557:  28 73 1D     ld      $19,(ix+$29)
D55A:  42 1D 09     ld      $29,&H09
D55D:  A8 78 1D     ldw     $24,(ix+$29)
D560:  42 1D 0B     ld      $29,&H0B
D563:  A8 60 1D     ldw     $0,(ix+$29)
D566:  D6 00 89 1F  pre     ix,&H1F89
D56A:  42 1D 06     ld      $29,&H06
D56D:  A0 60 1D     stw     $0,(ix+$29)
D570:  77 74 D5     cal     &HD574
D573:  F7           rtn   
D574:  D6 00 89 1F  pre     ix,&H1F89
D578:  02 7D 13     ld      $29,$19
D57B:  4C 1D 0F     an      $29,&H0F
D57E:  41 1D 09     sbc     $29,&H09
D581:  B5 17        jr      c,&HD599
D583:  41 1D 0B     sbc     $29,&H0B
D586:  B0 0B        jr      z,&HD592
D588:  31 5D FD     jp      nc,&HFD5D
D58B:  42 00 04     ld      $0,&H04
D58E:  22 00        sti     $0,(ix+$sx)
D590:  B7 0D        jr      &HD59E
D592:  42 00 05     ld      $0,&H05
D595:  22 00        sti     $0,(ix+$sx)
D597:  B7 06        jr      &HD59E
D599:  42 00 02     ld      $0,&H02
D59C:  22 00        sti     $0,(ix+$sx)
D59E:  22 13        sti     $19,(ix+$sx)
D5A0:  A2 0F        stiw    $15,(ix+$sx)
D5A2:  A2 18        stiw    $24,(ix+$sx)
D5A4:  F7           rtn   
D5A5:  D6 00 89 1F  pre     ix,&H1F89
D5A9:  28 00        ld      $0,(ix+$sx)
D5AB:  01 20        sbc     $0,$sy
D5AD:  B0 0C        jr      z,&HD5BA
D5AF:  41 00 02     sbc     $0,&H02
D5B2:  B0 07        jr      z,&HD5BA
D5B4:  41 00 04     sbc     $0,&H04
D5B7:  34 24 FE     jp      nz,&HFE24
D5BA:  77 D7 DB     cal     &HDBD7
D5BD:  41 13 0B     sbc     $19,&H0B
D5C0:  30 24 FE     jp      z,&HFE24
D5C3:  44 13 E0     anc     $19,&HE0
D5C6:  34 24 FE     jp      nz,&HFE24
D5C9:  48 13 10     ad      $19,&H10
D5CC:  77 D4 DC     cal     &HDCD4
D5CF:  F7           rtn   
D5D0:  D6 00 89 1F  pre     ix,&H1F89
D5D4:  77 64 DA     cal     &HDA64
D5D7:  D6 00 89 1F  pre     ix,&H1F89
D5DB:  77 F6 DA     cal     &HDAF6
D5DE:  82 6F 1A     ldw     $15,$26
D5E1:  01 13        sbc     $19,$sx
D5E3:  30 24 FE     jp      z,&HFE24
D5E6:  44 13 F0     anc     $19,&HF0
D5E9:  B0 05        jr      z,&HD5EF
D5EB:  D1 0F 02 00  ldw     $15,&H0002
D5EF:  41 13 11     sbc     $19,&H11
D5F2:  B4 15        jr      nz,&HD608
D5F4:  D6 00 89 1F  pre     ix,&H1F89
D5F8:  28 00        ld      $0,(ix+$sx)
D5FA:  41 00 06     sbc     $0,&H06
D5FD:  B4 1B        jr      nz,&HD619
D5FF:  42 00 04     ld      $0,&H04
D602:  A8 4F        ldw     $15,(ix+$sz)
D604:  88 2F        adw     $15,$sy
D606:  B7 12        jr      &HD619
D608:  41 13 0B     sbc     $19,&H0B
D60B:  B4 0D        jr      nz,&HD619
D60D:  D6 00 89 1F  pre     ix,&H1F89
D611:  42 00 06     ld      $0,&H06
D614:  A8 45        ldw     $5,(ix+$sz)
D616:  77 B0 F6     cal     &HF6B0
D619:  42 13 03     ld      $19,&H03
D61C:  F7           rtn   
D61D:  D6 00 89 1F  pre     ix,&H1F89
D621:  77 64 DA     cal     &HDA64
D624:  D6 00 7C 1F  pre     ix,&H1F7C
D628:  A8 00        ldw     $0,(ix+$sx)
D62A:  88 20        adw     $0,$sy
D62C:  88 20        adw     $0,$sy
D62E:  96 00        pre     ix,$0
D630:  28 1C        ld      $28,(ix+$sx)
D632:  D6 00 89 1F  pre     ix,&H1F89
D636:  77 F6 DA     cal     &HDAF6
D639:  02 7D 13     ld      $29,$19
D63C:  01 1D        sbc     $29,$sx
D63E:  30 24 FE     jp      z,&HFE24
D641:  41 1C 0B     sbc     $28,&H0B
D644:  30 24 FE     jp      z,&HFE24
D647:  26 1C        phs     $28
D649:  77 A8 D7     cal     &HD7A8
D64C:  2E 13        pps     $19
D64E:  77 D4 DC     cal     &HDCD4
D651:  D1 00 02 00  ldw     $0,&H0002
D655:  D6 00 7C 1F  pre     ix,&H1F7C
D659:  BC 00        adw     (ix+$sx),$0
D65B:  F7           rtn   
D65C:  D6 00 89 1F  pre     ix,&H1F89
D660:  77 F6 DA     cal     &HDAF6
D663:  02 7C 13     ld      $28,$19
D666:  44 1C F0     anc     $28,&HF0
D669:  B0 04        jr      z,&HD66E
D66B:  42 1C 0F     ld      $28,&H0F
D66E:  89 40        sbw     $0,$sz
D670:  89 62 02     sbw     $2,$2
D673:  01 1C        sbc     $28,$sx
D675:  30 24 FE     jp      z,&HFE24
D678:  41 1C 03     sbc     $28,&H03
D67B:  B1 08        jr      nc,&HD684
D67D:  01 0F        sbc     $15,$sx
D67F:  B4 3D        jr      nz,&HD6BD
D681:  02 A0 3A     ld      $0,$sy,jr &HD6BD
D684:  41 1C 05     sbc     $28,&H05
D687:  B1 09        jr      nc,&HD691
D689:  81 6F 02     sbcw    $15,$2
D68C:  B4 30        jr      nz,&HD6BD
D68E:  02 A0 2D     ld      $0,$sy,jr &HD6BD
D691:  41 1C 07     sbc     $28,&H07
D694:  B1 0E        jr      nc,&HD6A3
D696:  81 6F 02     sbcw    $15,$2
D699:  B4 23        jr      nz,&HD6BD
D69B:  81 71 02     sbcw    $17,$2
D69E:  B4 1E        jr      nz,&HD6BD
D6A0:  02 A0 1B     ld      $0,$sy,jr &HD6BD
D6A3:  41 1C 09     sbc     $28,&H09
D6A6:  B1 09        jr      nc,&HD6B0
D6A8:  81 71 02     sbcw    $17,$2
D6AB:  B4 11        jr      nz,&HD6BD
D6AD:  02 A0 0E     ld      $0,$sy,jr &HD6BD
D6B0:  41 1C 0B     sbc     $28,&H0B
D6B3:  B0 AB        jr      z,&HD65F
D6B5:  35 24 FE     jp      c,&HFE24
D6B8:  41 1C 0F     sbc     $28,&H0F
D6BB:  B0 B3        jr      z,&HD66F
D6BD:  82 4F        ldw     $15,$sz
D6BF:  42 13 03     ld      $19,&H03
D6C2:  77 D4 DC     cal     &HDCD4
D6C5:  F7           rtn   
D6C6:  E6 03 60     phsm    $3,4
D6C9:  77 EA D6     cal     &HD6EA
D6CC:  EE 00 60     ppsm    $0,4
D6CF:  81 6F 02     sbcw    $15,$2
D6D2:  F4           rtn     nz
D6D3:  A6 03        phsw    $3
D6D5:  08 21        ad      $1,$sy
D6D7:  77 FE D6     cal     &HD6FE
D6DA:  AE 02        ppsw    $2
D6DC:  77 1A D7     cal     &HD71A
D6DF:  F7           rtn   
D6E0:  77 EA D6     cal     &HD6EA
D6E3:  82 62 0F     ldw     $2,$15
D6E6:  77 1A D7     cal     &HD71A
D6E9:  F7           rtn   
D6EA:  D6 00 89 1F  pre     ix,&H1F89
D6EE:  77 64 DA     cal     &HDA64
D6F1:  D6 00 89 1F  pre     ix,&H1F89
D6F5:  77 F6 DA     cal     &HDAF6
D6F8:  77 5C D6     cal     &HD65C
D6FB:  8F 2F        xrw     $15,$sy
D6FD:  F7           rtn   
D6FE:  D6 00 7C 1F  pre     ix,&H1F7C
D702:  82 42        ldw     $2,$sz
D704:  A8 00        ldw     $0,(ix+$sx)
D706:  D1 04 02 00  ldw     $4,&H0002
D70A:  88 60 04     adw     $0,$4
D70D:  35 5D FD     jp      c,&HFD5D
D710:  91 46        ldw     $6,($sz)
D712:  81 66 02     sbcw    $6,$2
D715:  B4 8C        jr      nz,&HD6A2
D717:  A0 00        stw     $0,(ix+$sx)
D719:  F7           rtn   
D71A:  D6 00 89 1F  pre     ix,&H1F89
D71E:  D1 00 03 03  ldw     $0,&H0303
D722:  E0 00 60     stm     $0,(ix+$sx),4
D725:  77 4F D9     cal     &HD94F
D728:  F7           rtn   
D729:  02 7D 13     ld      $29,$19
D72C:  D6 00 89 1F  pre     ix,&H1F89
D730:  28 00        ld      $0,(ix+$sx)
D732:  01 20        sbc     $0,$sy
D734:  B0 07        jr      z,&HD73C
D736:  41 00 02     sbc     $0,&H02
D739:  34 2A FE     jp      nz,&HFE2A
D73C:  E6 12 E0     phsm    $18,8
D73F:  26 0A        phs     $10
D741:  77 D7 DB     cal     &HDBD7
D744:  82 60 0F     ldw     $0,$15
D747:  EE 0A E0     ppsm    $10,8
D74A:  2E 12        pps     $18
D74C:  02 7C 13     ld      $28,$19
D74F:  41 1C 09     sbc     $28,&H09
D752:  B5 07        jr      c,&HD75A
D754:  41 1C 10     sbc     $28,&H10
D757:  35 2A FE     jp      c,&HFE2A
D75A:  A6 01        phsw    $1
D75C:  77 A8 D7     cal     &HD7A8
D75F:  AE 00        ppsw    $0
D761:  96 00        pre     ix,$0
D763:  41 1C 03     sbc     $28,&H03
D766:  B1 05        jr      nc,&HD76C
D768:  20 0F        st      $15,(ix+$sx)
D76A:  B7 3C        jr      &HD7A7
D76C:  41 1C 09     sbc     $28,&H09
D76F:  B0 06        jr      z,&HD776
D771:  41 1C 05     sbc     $28,&H05
D774:  B1 05        jr      nc,&HD77A
D776:  A0 0F        stw     $15,(ix+$sx)
D778:  B7 2E        jr      &HD7A7
D77A:  41 1C 07     sbc     $28,&H07
D77D:  B1 06        jr      nc,&HD784
D77F:  E0 0F 60     stm     $15,(ix+$sx),4
D782:  B7 24        jr      &HD7A7
D784:  26 12        phs     $18
D786:  E6 11 E0     phsm    $17,8
D789:  41 1C 07     sbc     $28,&H07
D78C:  B4 09        jr      nz,&HD796
D78E:  77 84 F3     cal     &HF384
D791:  E0 0F 60     stm     $15,(ix+$sx),4
D794:  B7 0D        jr      &HD7A2
D796:  41 1C 08     sbc     $28,&H08
D799:  34 5D FD     jp      nz,&HFD5D
D79C:  77 7E F3     cal     &HF37E
D79F:  E0 0A E0     stm     $10,(ix+$sx),8
D7A2:  EE 0A E0     ppsm    $10,8
D7A5:  2E 12        pps     $18
D7A7:  F7           rtn   
D7A8:  01 1D        sbc     $29,$sx
D7AA:  B0 5B        jr      z,&HD806
D7AC:  01 1C        sbc     $28,$sx
D7AE:  B0 57        jr      z,&HD806
D7B0:  41 1D 09     sbc     $29,&H09
D7B3:  B0 52        jr      z,&HD806
D7B5:  41 1D 0A     sbc     $29,&H0A
D7B8:  B5 06        jr      c,&HD7BF
D7BA:  B0 4B        jr      z,&HD806
D7BC:  42 1D 09     ld      $29,&H09
D7BF:  41 1C 0A     sbc     $28,&H0A
D7C2:  B5 04        jr      c,&HD7C7
D7C4:  42 1C 09     ld      $28,&H09
D7C7:  89 40        sbw     $0,$sz
D7C9:  02 60 1D     ld      $0,$29
D7CC:  89 20        sbw     $0,$sy
D7CE:  82 42        ldw     $2,$sz
D7D0:  98 60        biuw    $0
D7D2:  98 60        biuw    $0
D7D4:  98 60        biuw    $0
D7D6:  88 42        adw     $2,$sz
D7D8:  89 40        sbw     $0,$sz
D7DA:  02 60 1C     ld      $0,$28
D7DD:  89 20        sbw     $0,$sy
D7DF:  88 42        adw     $2,$sz
D7E1:  98 62        biuw    $2
D7E3:  D1 00 3E 4B  ldw     $0,&H4B3E
D7E7:  88 42        adw     $2,$sz
D7E9:  E6 03 40     phsm    $3,3
D7EC:  77 71 9F     cal     &H9F71
D7EF:  EE 01 40     ppsm    $1,3
D7F2:  96 42        pre     iz,$2
D7F4:  A9 02        ldw     $2,(iz+$sx)
D7F6:  E6 02 40     phsm    $2,3
D7F9:  77 79 85     cal     &H8579
D7FC:  EE 00 40     ppsm    $0,3
D7FF:  84 62 02     ancw    $2,$2
D802:  B0 03        jr      z,&HD806
D804:  DE 02        jp      $2
D806:  D6 00 7C 1F  pre     ix,&H1F7C
D80A:  D1 02 29 03  ldw     $2,&H0329
D80E:  A8 00        ldw     $0,(ix+$sx)
D810:  96 00        pre     ix,$0
D812:  A8 00        ldw     $0,(ix+$sx)
D814:  81 60 02     sbcw    $0,$2
D817:  30 36 FE     jp      z,&HFE36
D81A:  37 1E FE     jp      &HFE1E
D81D:  82 60 1A     ldw     $0,$26
D820:  77 6B F6     cal     &HF66B
D823:  F7           rtn   
D824:  A6 06        phsw    $6
D826:  A6 10        phsw    $16
D828:  AE 05        ppsw    $5
D82A:  AE 0F        ppsw    $15
D82C:  82 60 16     ldw     $0,$22
D82F:  02 73 09     ld      $19,$9
D832:  77 6B F6     cal     &HF66B
D835:  E6 17 60     phsm    $23,4
D838:  E6 1B 60     phsm    $27,4
D83B:  EE 14 60     ppsm    $20,4
D83E:  EE 18 60     ppsm    $24,4
D841:  F7           rtn   
D842:  82 60 1A     ldw     $0,$26
D845:  77 97 F6     cal     &HF697
D848:  F7           rtn   
D849:  01 73 09     sbc     $19,$9
D84C:  34 24 FE     jp      nz,&HFE24
D84F:  02 7C 13     ld      $28,$19
D852:  4C 1C 0F     an      $28,&H0F
D855:  41 1C 09     sbc     $28,&H09
D858:  B5 07        jr      c,&HD860
D85A:  81 78 14     sbcw    $24,$20
D85D:  34 24 FE     jp      nz,&HFE24
D860:  82 60 16     ldw     $0,$22
D863:  77 A7 F6     cal     &HF6A7
D866:  42 13 03     ld      $19,&H03
D869:  F7           rtn   
D86A:  77 69 F4     cal     &HF469
D86D:  77 0D FA     cal     &HFA0D
D870:  42 13 03     ld      $19,&H03
D873:  F7           rtn   
D874:  77 66 F4     cal     &HF466
D877:  77 0D FA     cal     &HFA0D
D87A:  42 13 04     ld      $19,&H04
D87D:  F7           rtn   
D87E:  77 69 F4     cal     &HF469
D881:  77 35 FA     cal     &HFA35
D884:  42 13 03     ld      $19,&H03
D887:  F7           rtn   
D888:  77 66 F4     cal     &HF466
D88B:  77 35 FA     cal     &HFA35
D88E:  42 13 04     ld      $19,&H04
D891:  F7           rtn   
D892:  D6 00 89 1F  pre     ix,&H1F89
D896:  77 F6 DA     cal     &HDAF6
D899:  77 DE D8     cal     &HD8DE
D89C:  77 29 D7     cal     &HD729
D89F:  F7           rtn   
D8A0:  D6 00 89 1F  pre     ix,&H1F89
D8A4:  77 F6 DA     cal     &HDAF6
D8A7:  26 12        phs     $18
D8A9:  E6 11 E0     phsm    $17,8
D8AC:  77 DE D8     cal     &HD8DE
D8AF:  77 29 D7     cal     &HD729
D8B2:  EE 0A E0     ppsm    $10,8
D8B5:  2E 12        pps     $18
D8B7:  F7           rtn   
D8B8:  D6 00 89 1F  pre     ix,&H1F89
D8BC:  77 F6 DA     cal     &HDAF6
D8BF:  77 16 D9     cal     &HD916
D8C2:  77 29 D7     cal     &HD729
D8C5:  F7           rtn   
D8C6:  D6 00 89 1F  pre     ix,&H1F89
D8CA:  77 F6 DA     cal     &HDAF6
D8CD:  26 12        phs     $18
D8CF:  E6 11 E0     phsm    $17,8
D8D2:  77 16 D9     cal     &HD916
D8D5:  77 29 D7     cal     &HD729
D8D8:  EE 0A E0     ppsm    $10,8
D8DB:  2E 12        pps     $18
D8DD:  F7           rtn   
D8DE:  41 13 03     sbc     $19,&H03
D8E1:  B1 09        jr      nc,&HD8EB
D8E3:  77 66 F4     cal     &HF466
D8E6:  77 3D FA     cal     &HFA3D
D8E9:  B7 2B        jr      &HD915
D8EB:  41 13 05     sbc     $19,&H05
D8EE:  B1 06        jr      nc,&HD8F5
D8F0:  77 3D FA     cal     &HFA3D
D8F3:  B7 21        jr      &HD915
D8F5:  41 13 07     sbc     $19,&H07
D8F8:  B1 06        jr      nc,&HD8FF
D8FA:  77 40 FA     cal     &HFA40
D8FD:  B7 17        jr      &HD915
D8FF:  41 13 09     sbc     $19,&H09
D902:  B1 06        jr      nc,&HD909
D904:  77 46 FA     cal     &HFA46
D907:  B7 0D        jr      &HD915
D909:  41 13 10     sbc     $19,&H10
D90C:  35 24 FE     jp      c,&HFE24
D90F:  82 65 1A     ldw     $5,$26
D912:  77 56 FA     cal     &HFA56
D915:  F7           rtn   
D916:  41 13 03     sbc     $19,&H03
D919:  B1 09        jr      nc,&HD923
D91B:  77 66 F4     cal     &HF466
D91E:  77 5A FA     cal     &HFA5A
D921:  B7 2B        jr      &HD94D
D923:  41 13 05     sbc     $19,&H05
D926:  B1 06        jr      nc,&HD92D
D928:  77 5A FA     cal     &HFA5A
D92B:  B7 21        jr      &HD94D
D92D:  41 13 07     sbc     $19,&H07
D930:  B1 06        jr      nc,&HD937
D932:  77 5D FA     cal     &HFA5D
D935:  B7 17        jr      &HD94D
D937:  41 13 09     sbc     $19,&H09
D93A:  B1 06        jr      nc,&HD941
D93C:  77 63 FA     cal     &HFA63
D93F:  B7 0D        jr      &HD94D
D941:  41 13 10     sbc     $19,&H10
D944:  35 24 FE     jp      c,&HFE24
D947:  82 65 1A     ldw     $5,$26
D94A:  77 73 FA     cal     &HFA73
D94D:  F7           rtn   
D94E:  F7           rtn   
D94F:  D6 00 89 1F  pre     ix,&H1F89
D953:  A8 00        ldw     $0,(ix+$sx)
D955:  01 20        sbc     $0,$sy
D957:  B4 12        jr      nz,&HD96A
D959:  D1 0A 03 00  ldw     $10,&H0003
D95D:  77 0D DA     cal     &HDA0D
D960:  E8 00 40     ldm     $0,(ix+$sx),3
D963:  E7 02 40     phum    $2,3
D966:  77 3B DA     cal     &HDA3B
D969:  F7           rtn   
D96A:  41 00 02     sbc     $0,&H02
D96D:  B4 12        jr      nz,&HD980
D96F:  D1 0A 04 00  ldw     $10,&H0004
D973:  77 0D DA     cal     &HDA0D
D976:  E8 00 60     ldm     $0,(ix+$sx),4
D979:  E7 03 60     phum    $3,4
D97C:  77 3B DA     cal     &HDA3B
D97F:  F7           rtn   
D980:  41 00 03     sbc     $0,&H03
D983:  34 E8 D9     jp      nz,&HD9E8
D986:  01 01        sbc     $1,$sx
D988:  B0 1C        jr      z,&HD9A5
D98A:  41 01 03     sbc     $1,&H03
D98D:  B1 12        jr      nc,&HD9A0
D98F:  D1 0A 03 00  ldw     $10,&H0003
D993:  77 0D DA     cal     &HDA0D
D996:  E8 00 40     ldm     $0,(ix+$sx),3
D999:  E7 02 40     phum    $2,3
D99C:  77 3B DA     cal     &HDA3B
D99F:  F7           rtn   
D9A0:  41 01 05     sbc     $1,&H05
D9A3:  B1 12        jr      nc,&HD9B6
D9A5:  D1 0A 04 00  ldw     $10,&H0004
D9A9:  77 0D DA     cal     &HDA0D
D9AC:  E8 00 60     ldm     $0,(ix+$sx),4
D9AF:  E7 03 60     phum    $3,4
D9B2:  77 3B DA     cal     &HDA3B
D9B5:  F7           rtn   
D9B6:  41 01 08     sbc     $1,&H08
D9B9:  B1 12        jr      nc,&HD9CC
D9BB:  D1 0A 06 00  ldw     $10,&H0006
D9BF:  77 0D DA     cal     &HDA0D
D9C2:  E8 00 A0     ldm     $0,(ix+$sx),6
D9C5:  E7 05 A0     phum    $5,6
D9C8:  77 3B DA     cal     &HDA3B
D9CB:  F7           rtn   
D9CC:  41 01 08     sbc     $1,&H08
D9CF:  B4 AB        jr      nz,&HD97B
D9D1:  D1 0A 0A 00  ldw     $10,&H000A
D9D5:  77 0D DA     cal     &HDA0D
D9D8:  EA 00 E0     ldim    $0,(ix+$sx),8
D9DB:  E8 08 20     ldm     $8,(ix+$sx),2
D9DE:  E7 09 20     phum    $9,2
D9E1:  E7 07 E0     phum    $7,8
D9E4:  77 3B DA     cal     &HDA3B
D9E7:  F7           rtn   
D9E8:  41 00 04     sbc     $0,&H04
D9EB:  B4 03        jr      nz,&HD9EF
D9ED:  B7 B3        jr      &HD9A1
D9EF:  41 00 05     sbc     $0,&H05
D9F2:  B4 12        jr      nz,&HDA05
D9F4:  D1 0A 08 00  ldw     $10,&H0008
D9F8:  77 0D DA     cal     &HDA0D
D9FB:  E8 00 E0     ldm     $0,(ix+$sx),8
D9FE:  E7 07 E0     phum    $7,8
DA01:  77 3B DA     cal     &HDA3B
DA04:  F7           rtn   
DA05:  41 00 06     sbc     $0,&H06
DA08:  34 5D FD     jp      nz,&HFD5D
DA0B:  B7 D1        jr      &HD9DD
DA0D:  E6 06 A0     phsm    $6,6
DA10:  9E 05        gre     ix,$5
DA12:  A6 06        phsw    $6
DA14:  D6 00 E4 1C  pre     ix,&H1CE4
DA18:  A8 01        ldw     $1,(ix+$sx)
DA1A:  D6 00 E2 1C  pre     ix,&H1CE2
DA1E:  A8 03        ldw     $3,(ix+$sx)
DA20:  AE 05        ppsw    $5
DA22:  96 05        pre     ix,$5
DA24:  D1 05 0C 00  ldw     $5,&H000C
DA28:  88 63 05     adw     $3,$5
DA2B:  89 61 03     sbw     $1,$3
DA2E:  35 56 FE     jp      c,&HFE56
DA31:  81 61 0A     sbcw    $1,$10
DA34:  35 56 FE     jp      c,&HFE56
DA37:  EE 01 A0     ppsm    $1,6
DA3A:  F7           rtn   
DA3B:  E6 03 60     phsm    $3,4
DA3E:  9E 02        gre     ix,$2
DA40:  D6 00 E4 1C  pre     ix,&H1CE4
DA44:  A8 00        ldw     $0,(ix+$sx)
DA46:  89 60 0A     sbw     $0,$10
DA49:  A0 00        stw     $0,(ix+$sx)
DA4B:  96 02        pre     ix,$2
DA4D:  EE 00 60     ppsm    $0,4
DA50:  F7           rtn   
DA51:  E6 03 60     phsm    $3,4
DA54:  9E 02        gre     ix,$2
DA56:  D6 00 E4 1C  pre     ix,&H1CE4
DA5A:  9E 60        gre     us,$0
DA5C:  A0 00        stw     $0,(ix+$sx)
DA5E:  96 02        pre     ix,$2
DA60:  EE 00 60     ppsm    $0,4
DA63:  F7           rtn   
DA64:  2F 00        ppu     $0
DA66:  01 20        sbc     $0,$sy
DA68:  35 5D FD     jp      c,&HFD5D
DA6B:  B4 09        jr      nz,&HDA75
DA6D:  EF 01 20     ppum    $1,2
DA70:  E0 00 40     stm     $0,(ix+$sx),3
DA73:  B7 66        jr      &HDADA
DA75:  41 00 02     sbc     $0,&H02
DA78:  B4 09        jr      nz,&HDA82
DA7A:  EF 01 40     ppum    $1,3
DA7D:  E0 00 60     stm     $0,(ix+$sx),4
DA80:  B7 59        jr      &HDADA
DA82:  41 00 03     sbc     $0,&H03
DA85:  B4 32        jr      nz,&HDAB8
DA87:  2F 01        ppu     $1
DA89:  01 01        sbc     $1,$sx
DA8B:  B0 0F        jr      z,&HDA9B
DA8D:  41 01 03     sbc     $1,&H03
DA90:  B1 05        jr      nc,&HDA96
DA92:  2F 02        ppu     $2
DA94:  B7 1C        jr      &HDAB1
DA96:  41 01 05     sbc     $1,&H05
DA99:  B1 05        jr      nc,&HDA9F
DA9B:  AF 02        ppuw    $2
DA9D:  B7 13        jr      &HDAB1
DA9F:  41 01 08     sbc     $1,&H08
DAA2:  B1 06        jr      nc,&HDAA9
DAA4:  EF 02 60     ppum    $2,4
DAA7:  B7 09        jr      &HDAB1
DAA9:  41 01 08     sbc     $1,&H08
DAAC:  B4 92        jr      nz,&HDA3F
DAAE:  EF 02 E0     ppum    $2,8
DAB1:  E2 00 E0     stim    $0,(ix+$sx),8
DAB4:  A0 08        stw     $8,(ix+$sx)
DAB6:  B7 23        jr      &HDADA
DAB8:  41 00 04     sbc     $0,&H04
DABB:  B4 09        jr      nz,&HDAC5
DABD:  EF 01 80     ppum    $1,5
DAC0:  E0 00 A0     stm     $0,(ix+$sx),6
DAC3:  B7 16        jr      &HDADA
DAC5:  41 00 05     sbc     $0,&H05
DAC8:  B4 09        jr      nz,&HDAD2
DACA:  EF 01 C0     ppum    $1,7
DACD:  E0 00 E0     stm     $0,(ix+$sx),8
DAD0:  B7 09        jr      &HDADA
DAD2:  41 00 06     sbc     $0,&H06
DAD5:  34 5D FD     jp      nz,&HFD5D
DAD8:  B7 9C        jr      &HDA75
DADA:  9E 60        gre     us,$0
DADC:  D6 00 E4 1C  pre     ix,&H1CE4
DAE0:  A0 00        stw     $0,(ix+$sx)
DAE2:  D6 00 89 1F  pre     ix,&H1F89
DAE6:  F7           rtn   
DAE7:  D6 00 93 1F  pre     ix,&H1F93
DAEB:  77 64 DA     cal     &HDA64
DAEE:  D6 00 89 1F  pre     ix,&H1F89
DAF2:  77 64 DA     cal     &HDA64
DAF5:  F7           rtn   
DAF6:  77 D7 DB     cal     &HDBD7
DAF9:  A6 1D        phsw    $29
DAFB:  96 0F        pre     ix,$15
DAFD:  01 13        sbc     $19,$sx
DAFF:  B4 0A        jr      nz,&HDB0A
DB01:  89 6F 0F     sbw     $15,$15
DB04:  89 7A 1A     sbw     $26,$26
DB07:  37 D4 DB     jp      &HDBD4
DB0A:  41 13 03     sbc     $19,&H03
DB0D:  B1 08        jr      nc,&HDB16
DB0F:  28 0F        ld      $15,(ix+$sx)
DB11:  82 3A        ldw     $26,$sy
DB13:  37 D4 DB     jp      &HDBD4
DB16:  41 13 05     sbc     $19,&H05
DB19:  B1 0A        jr      nc,&HDB24
DB1B:  A8 0F        ldw     $15,(ix+$sx)
DB1D:  D1 1A 02 00  ldw     $26,&H0002
DB21:  37 D4 DB     jp      &HDBD4
DB24:  41 13 07     sbc     $19,&H07
DB27:  B0 0D        jr      z,&HDB35
DB29:  B1 1B        jr      nc,&HDB45
DB2B:  E8 0F 60     ldm     $15,(ix+$sx),4
DB2E:  D1 1A 04 00  ldw     $26,&H0004
DB32:  37 D4 DB     jp      &HDBD4
DB35:  E8 0F 60     ldm     $15,(ix+$sx),4
DB38:  77 0B F4     cal     &HF40B
DB3B:  77 90 DC     cal     &HDC90
DB3E:  D1 1A 04 00  ldw     $26,&H0004
DB42:  37 D4 DB     jp      &HDBD4
DB45:  41 13 09     sbc     $19,&H09
DB48:  B1 11        jr      nc,&HDB5A
DB4A:  E8 0A E0     ldm     $10,(ix+$sx),8
DB4D:  77 76 F3     cal     &HF376
DB50:  77 90 DC     cal     &HDC90
DB53:  D1 1A 08 00  ldw     $26,&H0008
DB57:  37 D4 DB     jp      &HDBD4
DB5A:  41 13 0B     sbc     $19,&H0B
DB5D:  B1 0C        jr      nc,&HDB6A
DB5F:  96 18        pre     ix,$24
DB61:  42 1D 07     ld      $29,&H07
DB64:  AA 7A 1D     ldiw    $26,(ix+$29)
DB67:  37 D4 DB     jp      &HDBD4
DB6A:  41 13 0C     sbc     $19,&H0C
DB6D:  B1 0C        jr      nc,&HDB7A
DB6F:  96 18        pre     ix,$24
DB71:  42 1D 07     ld      $29,&H07
DB74:  AA 7A 1D     ldiw    $26,(ix+$29)
DB77:  37 D4 DB     jp      &HDBD4
DB7A:  41 13 11     sbc     $19,&H11
DB7D:  35 5D FD     jp      c,&HFD5D
DB80:  41 13 13     sbc     $19,&H13
DB83:  B1 08        jr      nc,&HDB8C
DB85:  A8 0F        ldw     $15,(ix+$sx)
DB87:  82 3A        ldw     $26,$sy
DB89:  37 D4 DB     jp      &HDBD4
DB8C:  41 13 15     sbc     $19,&H15
DB8F:  B1 0A        jr      nc,&HDB9A
DB91:  A8 0F        ldw     $15,(ix+$sx)
DB93:  D1 1A 02 00  ldw     $26,&H0002
DB97:  37 D4 DB     jp      &HDBD4
DB9A:  41 13 18     sbc     $19,&H18
DB9D:  B1 0A        jr      nc,&HDBA8
DB9F:  A8 0F        ldw     $15,(ix+$sx)
DBA1:  D1 1A 04 00  ldw     $26,&H0004
DBA5:  37 D4 DB     jp      &HDBD4
DBA8:  41 13 19     sbc     $19,&H19
DBAB:  B1 0A        jr      nc,&HDBB6
DBAD:  A8 0F        ldw     $15,(ix+$sx)
DBAF:  D1 1A 08 00  ldw     $26,&H0008
DBB3:  37 D4 DB     jp      &HDBD4
DBB6:  41 13 1C     sbc     $19,&H1C
DBB9:  B1 0D        jr      nc,&HDBC7
DBBB:  A8 0F        ldw     $15,(ix+$sx)
DBBD:  96 18        pre     ix,$24
DBBF:  42 1D 07     ld      $29,&H07
DBC2:  AA 7A 1D     ldiw    $26,(ix+$29)
DBC5:  B7 0E        jr      &HDBD4
DBC7:  41 13 21     sbc     $19,&H21
DBCA:  B5 06        jr      c,&HDBD1
DBCC:  41 13 2B     sbc     $19,&H2B
DBCF:  B5 BF        jr      c,&HDB8F
DBD1:  37 5D FD     jp      &HFD5D
DBD4:  AE 1C        ppsw    $28
DBD6:  F7           rtn   
DBD7:  A6 1D        phsw    $29
DBD9:  2A 13        ldi     $19,(ix+$sx)
DBDB:  01 33        sbc     $19,$sy
DBDD:  35 5D FD     jp      c,&HFD5D
DBE0:  B4 30        jr      nz,&HDC11
DBE2:  42 00 02     ld      $0,&H02
DBE5:  42 13 11     ld      $19,&H11
DBE8:  A8 18        ldw     $24,(ix+$sx)
DBEA:  77 3C DD     cal     &HDD3C
DBED:  9E 1C        gre     ix,$28
DBEF:  77 38 DC     cal     &HDC38
DBF2:  96 1C        pre     ix,$28
DBF4:  41 13 0B     sbc     $19,&H0B
DBF7:  B4 3D        jr      nz,&HDC35
DBF9:  E6 02 40     phsm    $2,3
DBFC:  42 02 0B     ld      $2,&H0B
DBFF:  A8 60 02     ldw     $0,(ix+$2)
DC02:  D6 00 89 1F  pre     ix,&H1F89
DC06:  42 02 06     ld      $2,&H06
DC09:  A0 60 02     stw     $0,(ix+$2)
DC0C:  EE 00 40     ppsm    $0,3
DC0F:  B7 25        jr      &HDC35
DC11:  41 13 02     sbc     $19,&H02
DC14:  B4 07        jr      nz,&HDC1C
DC16:  2A 13        ldi     $19,(ix+$sx)
DC18:  A8 0F        ldw     $15,(ix+$sx)
DC1A:  B7 1A        jr      &HDC35
DC1C:  41 13 03     sbc     $19,&H03
DC1F:  B4 07        jr      nz,&HDC27
DC21:  2A 13        ldi     $19,(ix+$sx)
DC23:  9E 0F        gre     ix,$15
DC25:  B7 0F        jr      &HDC35
DC27:  41 13 06     sbc     $19,&H06
DC2A:  B0 8A        jr      z,&HDBB5
DC2C:  31 5D FD     jp      nc,&HFD5D
DC2F:  2A 13        ldi     $19,(ix+$sx)
DC31:  AA 0F        ldiw    $15,(ix+$sx)
DC33:  AA 18        ldiw    $24,(ix+$sx)
DC35:  AE 1C        ppsw    $28
DC37:  F7           rtn   
DC38:  E6 02 40     phsm    $2,3
DC3B:  42 1A 03     ld      $26,&H03
DC3E:  2A 62 1A     ldi     $2,(ix+$26)
DC41:  41 02 04     sbc     $2,&H04
DC44:  B0 06        jr      z,&HDC4B
DC46:  41 02 05     sbc     $2,&H05
DC49:  B4 3A        jr      nz,&HDC84
DC4B:  9E 00        gre     ix,$0
DC4D:  A6 01        phsw    $1
DC4F:  D6 00 7F 1F  pre     ix,&H1F7F
DC53:  A8 0F        ldw     $15,(ix+$sx)
DC55:  AE 00        ppsw    $0
DC57:  96 00        pre     ix,$0
DC59:  2A 13        ldi     $19,(ix+$sx)
DC5B:  AA 00        ldiw    $0,(ix+$sx)
DC5D:  AA 1A        ldiw    $26,(ix+$sx)
DC5F:  AA 18        ldiw    $24,(ix+$sx)
DC61:  41 02 04     sbc     $2,&H04
DC64:  B0 07        jr      z,&HDC6C
DC66:  89 4F        sbw     $15,$sz
DC68:  89 EF 1A 21  sbw     $15,$26,jr &HDC8C
DC6C:  D1 02 0B 00  ldw     $2,&H000B
DC70:  88 6F 02     adw     $15,$2
DC73:  88 4F        adw     $15,$sz
DC75:  41 13 0B     sbc     $19,&H0B
DC78:  B4 13        jr      nz,&HDC8C
DC7A:  96 18        pre     ix,$24
DC7C:  68 13 04     ld      $19,(ix+&H04)
DC7F:  48 13 10     ad      $19,&H10
DC82:  B7 09        jr      &HDC8C
DC84:  2A 13        ldi     $19,(ix+$sx)
DC86:  AA 0F        ldiw    $15,(ix+$sx)
DC88:  AA 1A        ldiw    $26,(ix+$sx)
DC8A:  AA 18        ldiw    $24,(ix+$sx)
DC8C:  EE 00 40     ppsm    $0,3
DC8F:  F7           rtn   
DC90:  E6 04 80     phsm    $4,5
DC93:  41 12 02     sbc     $18,&H02
DC96:  B5 0B        jr      c,&HDCA2
DC98:  41 12 05     sbc     $18,&H05
DC9B:  B5 2B        jr      c,&HDCC7
DC9D:  41 12 07     sbc     $18,&H07
DCA0:  B1 26        jr      nc,&HDCC7
DCA2:  9F 03        gre     ss,$3
DCA4:  E6 11 E0     phsm    $17,8
DCA7:  42 02 07     ld      $2,&H07
DCAA:  2E 00        pps     $0
DCAC:  02 01        ld      $1,$sx
DCAE:  9A 20        diuw    $0
DCB0:  41 00 A0     sbc     $0,&HA0
DCB3:  B1 11        jr      nc,&HDCC5
DCB5:  41 01 0A     sbc     $1,&H0A
DCB8:  B1 0C        jr      nc,&HDCC5
DCBA:  09 22        sb      $2,$sy
DCBC:  B1 93        jr      nc,&HDC50
DCBE:  EE 00 80     ppsm    $0,5
DCC1:  54 40 00     pfl     &H00
DCC4:  F7           rtn   
DCC5:  97 03        pre     ss,$3
DCC7:  CF 6A EA     xrm     $10,$10,8
DCCA:  0F 72 12     xr      $18,$18
DCCD:  EE 00 80     ppsm    $0,5
DCD0:  54 40 40     pfl     &H40
DCD3:  F7           rtn   
DCD4:  41 13 09     sbc     $19,&H09
DCD7:  B1 24        jr      nc,&HDCFC
DCD9:  42 00 03     ld      $0,&H03
DCDC:  02 61 13     ld      $1,$19
DCDF:  41 13 07     sbc     $19,&H07
DCE2:  B0 07        jr      z,&HDCEA
DCE4:  B1 10        jr      nc,&HDCF5
DCE6:  C2 E2 6F 49  ldm     $2,$15,4,jr &HDD32
DCEA:  A6 01        phsw    $1
DCEC:  77 84 F3     cal     &HF384
DCEF:  AE 00        ppsw    $0
DCF1:  C2 E2 6F 3E  ldm     $2,$15,4,jr &HDD32
DCF5:  77 7E F3     cal     &HF37E
DCF8:  C2 E2 EA 37  ldm     $2,$10,8,jr &HDD32
DCFC:  02 60 13     ld      $0,$19
DCFF:  4C 00 0F     an      $0,&H0F
DD02:  41 00 09     sbc     $0,&H09
DD05:  B1 0B        jr      nc,&HDD11
DD07:  42 00 03     ld      $0,&H03
DD0A:  02 61 13     ld      $1,$19
DD0D:  82 E2 0F 22  ldw     $2,$15,jr &HDD32
DD11:  41 00 0B     sbc     $0,&H0B
DD14:  B5 11        jr      c,&HDD26
DD16:  34 5D FD     jp      nz,&HFD5D
DD19:  D6 00 89 1F  pre     ix,&H1F89
DD1D:  42 00 06     ld      $0,&H06
DD20:  A8 46        ldw     $6,(ix+$sz)
DD22:  42 80 05 04  ld      $0,&H05,jr &HDD29
DD26:  42 00 04     ld      $0,&H04
DD29:  02 61 13     ld      $1,$19
DD2C:  82 62 0F     ldw     $2,$15
DD2F:  82 64 18     ldw     $4,$24
DD32:  D6 00 89 1F  pre     ix,&H1F89
DD36:  A2 00        stiw    $0,(ix+$sx)
DD38:  E0 02 E0     stm     $2,(ix+$sx),8
DD3B:  F7           rtn   
DD3C:  E6 10 E0     phsm    $16,8
DD3F:  02 50        ld      $16,$sz
DD41:  42 11 10     ld      $17,&H10
DD44:  41 13 21     sbc     $19,&H21
DD47:  B0 06        jr      z,&HDD4E
DD49:  41 13 31     sbc     $19,&H31
DD4C:  B4 04        jr      nz,&HDD51
DD4E:  02 71 13     ld      $17,$19
DD51:  D6 00 70 1F  pre     ix,&H1F70
DD55:  A0 18        stw     $24,(ix+$sx)
DD57:  77 A6 C8     cal     &HC8A6
DD5A:  31 BE FD     jp      nc,&HFDBE
DD5D:  42 09 03     ld      $9,&H03
DD60:  28 6A 09     ld      $10,(ix+$9)
DD63:  01 0A        sbc     $10,$sx
DD65:  B0 17        jr      z,&HDD7D
DD67:  41 0A 02     sbc     $10,&H02
DD6A:  B0 12        jr      z,&HDD7D
DD6C:  41 0A 04     sbc     $10,&H04
DD6F:  B0 0D        jr      z,&HDD7D
DD71:  41 0A 05     sbc     $10,&H05
DD74:  B0 08        jr      z,&HDD7D
DD76:  77 53 C9     cal     &HC953
DD79:  B1 A0        jr      nc,&HDD1A
DD7B:  B7 9F        jr      &HDD1B
DD7D:  68 00 00     ld      $0,(ix+&H00)
DD80:  01 60 13     sbc     $0,$19
DD83:  B4 05        jr      nz,&HDD89
DD85:  EE 09 E0     ppsm    $9,8
DD88:  F7           rtn   
DD89:  41 13 12     sbc     $19,&H12
DD8C:  30 CA FD     jp      z,&HFDCA
DD8F:  37 D0 FD     jp      &HFDD0
DD92:  82 B1 05     ldw     $17,$sy,jr &HDD99
DD95:  D1 11 42 20  ldw     $17,&H2042
DD99:  77 51 FB     cal     &HFB51
DD9C:  D6 40 81 1F  pre     iz,&H1F81
DDA0:  D1 00 FF FF  ldw     $0,&HFFFF
DDA4:  A1 00        stw     $0,(iz+$sx)
DDA6:  01 31        sbc     $17,$sy
DDA8:  B4 06        jr      nz,&HDDAF
DDAA:  77 D8 FC     cal     &HFCD8
DDAD:  A9 51        ldw     $17,(iz+$sz)
DDAF:  42 0C 80     ld      $12,&H80
DDB2:  77 A0 EE     cal     &HEEA0
DDB5:  77 BF A4     cal     &HA4BF
DDB8:  B5 09        jr      c,&HDDC2
DDBA:  D6 40 81 1F  pre     iz,&H1F81
DDBE:  21 10        st      $16,(iz+$sx)
DDC0:  21 3F        st      $31,(iz+$sy)
DDC2:  77 F8 EE     cal     &HEEF8
DDC5:  77 66 FB     cal     &HFB66
DDC8:  F7           rtn   
DDC9:  82 31        ldw     $17,$sy
DDCB:  42 86 09 08  ld      $6,&H09,jr &HDDD6
DDCF:  D1 11 46 20  ldw     $17,&H2046
DDD3:  42 06 06     ld      $6,&H06
DDD6:  77 51 FB     cal     &HFB51
DDD9:  D6 40 81 1F  pre     iz,&H1F81
DDDD:  D1 00 FF FF  ldw     $0,&HFFFF
DDE1:  A1 00        stw     $0,(iz+$sx)
DDE3:  D6 40 1B 1E  pre     iz,&H1E1B
DDE7:  21 06        st      $6,(iz+$sx)
DDE9:  01 31        sbc     $17,$sy
DDEB:  B4 07        jr      nz,&HDDF3
DDED:  77 7A EE     cal     &HEE7A
DDF0:  82 71 14     ldw     $17,$20
DDF3:  02 0C        ld      $12,$sx
DDF5:  77 A0 EE     cal     &HEEA0
DDF8:  77 7A EE     cal     &HEE7A
DDFB:  02 70 14     ld      $16,$20
DDFE:  77 01 A5     cal     &HA501
DE01:  D6 40 81 1F  pre     iz,&H1F81
DE05:  21 10        st      $16,(iz+$sx)
DE07:  21 3F        st      $31,(iz+$sy)
DE09:  77 F8 EE     cal     &HEEF8
DE0C:  77 66 FB     cal     &HFB66
DE0F:  F7           rtn   
DE10:  82 31        ldw     $17,$sy
DE12:  42 86 0B 08  ld      $6,&H0B,jr &HDE1D
DE16:  D1 11 42 20  ldw     $17,&H2042
DE1A:  42 06 06     ld      $6,&H06
DE1D:  77 51 FB     cal     &HFB51
DE20:  D6 40 81 1F  pre     iz,&H1F81
DE24:  D1 00 00 00  ldw     $0,&H0000
DE28:  A1 00        stw     $0,(iz+$sx)
DE2A:  D6 40 1B 1E  pre     iz,&H1E1B
DE2E:  21 06        st      $6,(iz+$sx)
DE30:  01 31        sbc     $17,$sy
DE32:  B0 07        jr      z,&HDE3A
DE34:  D1 04 00 00  ldw     $4,&H0000
DE38:  B7 12        jr      &HDE4B
DE3A:  77 7A EE     cal     &HEE7A
DE3D:  82 71 14     ldw     $17,$20
DE40:  77 7A EE     cal     &HEE7A
DE43:  84 74 14     ancw    $20,$20
DE46:  B0 0D        jr      z,&HDE54
DE48:  82 64 14     ldw     $4,$20
DE4B:  42 0C 80     ld      $12,&H80
DE4E:  77 A0 EE     cal     &HEEA0
DE51:  77 73 DF     cal     &HDF73
DE54:  77 F8 EE     cal     &HEEF8
DE57:  77 66 FB     cal     &HFB66
DE5A:  F7           rtn   
DE5B:  82 31        ldw     $17,$sy
DE5D:  42 86 09 08  ld      $6,&H09,jr &HDE68
DE61:  D1 11 46 20  ldw     $17,&H2046
DE65:  42 06 06     ld      $6,&H06
DE68:  77 51 FB     cal     &HFB51
DE6B:  D6 40 81 1F  pre     iz,&H1F81
DE6F:  D1 00 FF FF  ldw     $0,&HFFFF
DE73:  A1 00        stw     $0,(iz+$sx)
DE75:  D6 40 1B 1E  pre     iz,&H1E1B
DE79:  21 06        st      $6,(iz+$sx)
DE7B:  D1 00 1A 1E  ldw     $0,&H1E1A
DE7F:  01 31        sbc     $17,$sy
DE81:  B0 04        jr      z,&HDE86
DE83:  10 DF 09     st      $31,($sz),jr &HDE8E
DE86:  77 7A EE     cal     &HEE7A
DE89:  82 71 14     ldw     $17,$20
DE8C:  10 5E        st      $30,($sz)
DE8E:  02 0C        ld      $12,$sx
DE90:  77 A0 EE     cal     &HEEA0
DE93:  77 C0 DF     cal     &HDFC0
DE96:  77 F8 EE     cal     &HEEF8
DE99:  77 66 FB     cal     &HFB66
DE9C:  F7           rtn   
DE9D:  82 31        ldw     $17,$sy
DE9F:  02 A0 0C     ld      $0,$sy,jr &HDEAD
DEA2:  82 31        ldw     $17,$sy
DEA4:  02 80 07     ld      $0,$sx,jr &HDEAD
DEA7:  D1 11 46 20  ldw     $17,&H2046
DEAB:  02 00        ld      $0,$sx
DEAD:  D6 40 1A 1E  pre     iz,&H1E1A
DEB1:  21 00        st      $0,(iz+$sx)
DEB3:  77 51 FB     cal     &HFB51
DEB6:  D6 40 81 1F  pre     iz,&H1F81
DEBA:  D1 00 FF FF  ldw     $0,&HFFFF
DEBE:  A1 00        stw     $0,(iz+$sx)
DEC0:  D6 40 1B 1E  pre     iz,&H1E1B
DEC4:  42 00 06     ld      $0,&H06
DEC7:  21 00        st      $0,(iz+$sx)
DEC9:  01 31        sbc     $17,$sy
DECB:  B4 0F        jr      nz,&HDEDB
DECD:  77 7A EE     cal     &HEE7A
DED0:  82 71 14     ldw     $17,$20
DED3:  D6 40 1A 1E  pre     iz,&H1E1A
DED7:  3B 1F        sbc     (iz+$sx),$31
DED9:  B4 06        jr      nz,&HDEE0
DEDB:  02 0C        ld      $12,$sx
DEDD:  77 A0 EE     cal     &HEEA0
DEE0:  77 F3 DF     cal     &HDFF3
DEE3:  D6 40 1A 1E  pre     iz,&H1E1A
DEE7:  3B 1F        sbc     (iz+$sx),$31
DEE9:  70 F8 EE     cal     z,&HEEF8
DEEC:  77 66 FB     cal     &HFB66
DEEF:  F7           rtn   
DEF0:  82 31        ldw     $17,$sy
DEF2:  02 A0 0C     ld      $0,$sy,jr &HDF00
DEF5:  82 31        ldw     $17,$sy
DEF7:  02 80 07     ld      $0,$sx,jr &HDF00
DEFA:  D1 11 42 20  ldw     $17,&H2042
DEFE:  02 00        ld      $0,$sx
DF00:  D6 40 1A 1E  pre     iz,&H1E1A
DF04:  4E 00 10     or      $0,&H10
DF07:  21 00        st      $0,(iz+$sx)
DF09:  77 51 FB     cal     &HFB51
DF0C:  D6 40 81 1F  pre     iz,&H1F81
DF10:  D1 00 FF FF  ldw     $0,&HFFFF
DF14:  A1 00        stw     $0,(iz+$sx)
DF16:  D6 40 1B 1E  pre     iz,&H1E1B
DF1A:  42 00 06     ld      $0,&H06
DF1D:  21 00        st      $0,(iz+$sx)
DF1F:  01 31        sbc     $17,$sy
DF21:  B4 11        jr      nz,&HDF33
DF23:  77 7A EE     cal     &HEE7A
DF26:  82 71 14     ldw     $17,$20
DF29:  D6 40 1A 1E  pre     iz,&H1E1A
DF2D:  29 00        ld      $0,(iz+$sx)
DF2F:  04 20        anc     $0,$sy
DF31:  B4 07        jr      nz,&HDF39
DF33:  42 0C 80     ld      $12,&H80
DF36:  77 A0 EE     cal     &HEEA0
DF39:  77 4E E7     cal     &HE74E
DF3C:  D6 40 1A 1E  pre     iz,&H1E1A
DF40:  29 00        ld      $0,(iz+$sx)
DF42:  04 20        anc     $0,$sy
DF44:  70 F8 EE     cal     z,&HEEF8
DF47:  77 66 FB     cal     &HFB66
DF4A:  F7           rtn   
DF4B:  77 51 FB     cal     &HFB51
DF4E:  D6 40 81 1F  pre     iz,&H1F81
DF52:  D1 00 FF FF  ldw     $0,&HFFFF
DF56:  A1 00        stw     $0,(iz+$sx)
DF58:  77 D8 FC     cal     &HFCD8
DF5B:  A9 51        ldw     $17,(iz+$sz)
DF5D:  42 0C FF     ld      $12,&HFF
DF60:  77 A0 EE     cal     &HEEA0
DF63:  77 92 A5     cal     &HA592
DF66:  D6 40 81 1F  pre     iz,&H1F81
DF6A:  BD 1E        adw     (iz+$sx),$30
DF6C:  77 F8 EE     cal     &HEEF8
DF6F:  77 66 FB     cal     &HFB66
DF72:  F7           rtn   
DF73:  77 7A EE     cal     &HEE7A
DF76:  82 62 14     ldw     $2,$20
DF79:  A6 03        phsw    $3
DF7B:  D1 00 01 00  ldw     $0,&H0001
DF7F:  81 44        sbcw    $4,$sz
DF81:  B0 32        jr      z,&HDFB4
DF83:  A6 05        phsw    $5
DF85:  77 BF A4     cal     &HA4BF
DF88:  AE 04        ppsw    $4
DF8A:  B1 09        jr      nc,&HDF94
DF8C:  81 20        sbcw    $0,$sy
DF8E:  B4 25        jr      nz,&HDFB4
DF90:  AE 02        ppsw    $2
DF92:  B7 2C        jr      &HDFBF
DF94:  10 70 02     st      $16,($2)
DF97:  41 10 0A     sbc     $16,&H0A
DF9A:  B0 12        jr      z,&HDFAD
DF9C:  41 10 0D     sbc     $16,&H0D
DF9F:  B4 08        jr      nz,&HDFA8
DFA1:  96 51        pre     iz,$17
DFA3:  7B 1F 03     sbc     (iz+&H03),$31
DFA6:  B0 06        jr      z,&HDFAD
DFA8:  88 22        adw     $2,$sy
DFAA:  88 A0 AD     adw     $0,$sy,jr &HDF59
DFAD:  84 64 04     ancw    $4,$4
DFB0:  B0 03        jr      z,&HDFB4
DFB2:  88 22        adw     $2,$sy
DFB4:  10 7F 02     st      $31,($2)
DFB7:  AE 02        ppsw    $2
DFB9:  D6 40 81 1F  pre     iz,&H1F81
DFBD:  A1 02        stw     $2,(iz+$sx)
DFBF:  F7           rtn   
DFC0:  77 7A EE     cal     &HEE7A
DFC3:  82 62 14     ldw     $2,$20
DFC6:  11 70 02     ld      $16,($2)
DFC9:  01 10        sbc     $16,$sx
DFCB:  B0 10        jr      z,&HDFDC
DFCD:  91 60 02     ldw     $0,($2)
DFD0:  02 50        ld      $16,$sz
DFD2:  77 01 A5     cal     &HA501
DFD5:  01 01        sbc     $1,$sx
DFD7:  B0 04        jr      z,&HDFDC
DFD9:  88 A2 8E     adw     $2,$sy,jr &HDF69
DFDC:  D6 40 1A 1E  pre     iz,&H1E1A
DFE0:  3B 1F        sbc     (iz+$sx),$31
DFE2:  B4 07        jr      nz,&HDFEA
DFE4:  42 10 0A     ld      $16,&H0A
DFE7:  77 01 A5     cal     &HA501
DFEA:  D6 40 81 1F  pre     iz,&H1F81
DFEE:  21 10        st      $16,(iz+$sx)
DFF0:  21 3F        st      $31,(iz+$sy)
DFF2:  F7           rtn   
DFF3:  D6 40 08 1D  pre     iz,&H1D08
DFF7:  21 1F        st      $31,(iz+$sx)
DFF9:  21 3F        st      $31,(iz+$sy)
DFFB:  D6 40 58 21  pre     iz,&H2158
DFFF:  A1 11        stw     $17,(iz+$sx)
E001:  77 7A EE     cal     &HEE7A
E004:  82 60 14     ldw     $0,$20
E007:  96 00        pre     ix,$0
E009:  2A 10        ldi     $16,(ix+$sx)
E00B:  9E 00        gre     ix,$0
E00D:  01 10        sbc     $16,$sx
E00F:  B0 30        jr      z,&HE040
E011:  41 10 25     sbc     $16,&H25
E014:  B4 26        jr      nz,&HE03B
E016:  28 10        ld      $16,(ix+$sx)
E018:  41 10 25     sbc     $16,&H25
E01B:  B0 1B        jr      z,&HE037
E01D:  77 5C E0     cal     &HE05C
E020:  9E 00        gre     ix,$0
E022:  01 08        sbc     $8,$sx
E024:  B0 98        jr      z,&HDFBD
E026:  A6 01        phsw    $1
E028:  D1 00 2F E0  ldw     $0,&HE02F
E02C:  A6 01        phsw    $1
E02E:  DE 18        jp      $24
E030:  77 4A E6     cal     &HE64A
E033:  AE 00        ppsw    $0
E035:  B7 AF        jr      &HDFE5
E037:  2A 10        ldi     $16,(ix+$sx)
E039:  9E 00        gre     ix,$0
E03B:  77 23 E7     cal     &HE723
E03E:  B7 B8        jr      &HDFF7
E040:  D6 40 1A 1E  pre     iz,&H1E1A
E044:  3B 1F        sbc     (iz+$sx),$31
E046:  74 23 E7     cal     nz,&HE723
E049:  D6 40 08 1D  pre     iz,&H1D08
E04D:  A9 00        ldw     $0,(iz+$sx)
E04F:  D6 40 81 1F  pre     iz,&H1F81
E053:  A1 00        stw     $0,(iz+$sx)
E055:  D6 40 58 21  pre     iz,&H2158
E059:  A9 11        ldw     $17,(iz+$sx)
E05B:  F7           rtn   
E05C:  02 01        ld      $1,$sx
E05E:  42 00 2D     ld      $0,&H2D
E061:  3A 00        sbc     (ix+$sx),$0
E063:  B4 0A        jr      nz,&HE06E
E065:  2A 10        ldi     $16,(ix+$sx)
E067:  3A 00        sbc     (ix+$sx),$0
E069:  B0 85        jr      z,&HDFEF
E06B:  4E 01 80     or      $1,&H80
E06E:  42 00 30     ld      $0,&H30
E071:  3A 00        sbc     (ix+$sx),$0
E073:  B0 05        jr      z,&HE079
E075:  4E 81 20 05  or      $1,&H20,jr &HE07D
E079:  0E 41        or      $1,$sz
E07B:  2A 10        ldi     $16,(ix+$sx)
E07D:  D6 40 16 1D  pre     iz,&H1D16
E081:  21 01        st      $1,(iz+$sx)
E083:  D1 0F 00 00  ldw     $15,&H0000
E087:  77 FC ED     cal     &HEDFC
E08A:  D6 40 18 1E  pre     iz,&H1E18
E08E:  A1 0F        stw     $15,(iz+$sx)
E090:  D1 0F FF FF  ldw     $15,&HFFFF
E094:  42 00 2E     ld      $0,&H2E
E097:  3A 00        sbc     (ix+$sx),$0
E099:  B4 08        jr      nz,&HE0A2
E09B:  2A 00        ldi     $0,(ix+$sx)
E09D:  88 2F        adw     $15,$sy
E09F:  77 FC ED     cal     &HEDFC
E0A2:  D6 40 5C 21  pre     iz,&H215C
E0A6:  A1 0F        stw     $15,(iz+$sx)
E0A8:  02 08        ld      $8,$sx
E0AA:  42 00 6C     ld      $0,&H6C
E0AD:  3A 00        sbc     (ix+$sx),$0
E0AF:  B4 06        jr      nz,&HE0B6
E0B1:  2A 10        ldi     $16,(ix+$sx)
E0B3:  4E 08 80     or      $8,&H80
E0B6:  2A 10        ldi     $16,(ix+$sx)
E0B8:  0E 68 10     or      $8,$16
E0BB:  41 10 64     sbc     $16,&H64
E0BE:  B0 09        jr      z,&HE0C8
E0C0:  41 10 75     sbc     $16,&H75
E0C3:  B4 0A        jr      nz,&HE0CE
E0C5:  4C 08 7F     an      $8,&H7F
E0C8:  D1 18 61 E1  ldw     $24,&HE161
E0CC:  B7 14        jr      &HE0E1
E0CE:  41 10 6F     sbc     $16,&H6F
E0D1:  B0 0B        jr      z,&HE0DD
E0D3:  41 10 78     sbc     $16,&H78
E0D6:  B0 06        jr      z,&HE0DD
E0D8:  41 10 58     sbc     $16,&H58
E0DB:  B4 1D        jr      nz,&HE0F9
E0DD:  D1 18 98 E1  ldw     $24,&HE198
E0E1:  D6 40 5C 21  pre     iz,&H215C
E0E5:  D1 00 FF FF  ldw     $0,&HFFFF
E0E9:  BB 00        sbcw    (iz+$sx),$0
E0EB:  B0 09        jr      z,&HE0F5
E0ED:  D1 00 00 00  ldw     $0,&H0000
E0F1:  BB 00        sbcw    (iz+$sx),$0
E0F3:  B4 6C        jr      nz,&HE160
E0F5:  A1 1E        stw     $30,(iz+$sx)
E0F7:  B7 68        jr      &HE160
E0F9:  4C 08 7F     an      $8,&H7F
E0FC:  41 10 66     sbc     $16,&H66
E0FF:  B0 15        jr      z,&HE115
E101:  41 10 65     sbc     $16,&H65
E104:  B0 10        jr      z,&HE115
E106:  41 10 45     sbc     $16,&H45
E109:  B0 0B        jr      z,&HE115
E10B:  41 10 67     sbc     $16,&H67
E10E:  B0 06        jr      z,&HE115
E110:  41 10 47     sbc     $16,&H47
E113:  B4 27        jr      nz,&HE13B
E115:  D1 18 EC E1  ldw     $24,&HE1EC
E119:  D6 40 5C 21  pre     iz,&H215C
E11D:  D1 00 FF FF  ldw     $0,&HFFFF
E121:  BB 00        sbcw    (iz+$sx),$0
E123:  B4 07        jr      nz,&HE12B
E125:  D1 00 06 00  ldw     $0,&H0006
E129:  B7 0D        jr      &HE137
E12B:  D1 00 FF 7F  ldw     $0,&H7FFF
E12F:  BB 00        sbcw    (iz+$sx),$0
E131:  B5 2E        jr      c,&HE160
E133:  D1 00 00 00  ldw     $0,&H0000
E137:  A1 00        stw     $0,(iz+$sx)
E139:  B7 26        jr      &HE160
E13B:  D6 40 16 1D  pre     iz,&H1D16
E13F:  29 00        ld      $0,(iz+$sx)
E141:  4C 00 EF     an      $0,&HEF
E144:  21 00        st      $0,(iz+$sx)
E146:  41 10 63     sbc     $16,&H63
E149:  B4 07        jr      nz,&HE151
E14B:  D1 18 35 E2  ldw     $24,&HE235
E14F:  B7 10        jr      &HE160
E151:  41 10 73     sbc     $16,&H73
E154:  B4 07        jr      nz,&HE15C
E156:  D1 18 41 E2  ldw     $24,&HE241
E15A:  B7 05        jr      &HE160
E15C:  28 B0        ld      $16,(ix-$sy)
E15E:  02 08        ld      $8,$sx
E160:  F7           rtn   
E161:  77 7A EE     cal     &HEE7A
E164:  82 6F 14     ldw     $15,$20
E167:  44 08 80     anc     $8,&H80
E16A:  B4 10        jr      nz,&HE17B
E16C:  41 08 64     sbc     $8,&H64
E16F:  B4 06        jr      nz,&HE176
E171:  77 AD F4     cal     &HF4AD
E174:  B7 1C        jr      &HE191
E176:  77 B5 F4     cal     &HF4B5
E179:  B7 17        jr      &HE191
E17B:  4C 08 7F     an      $8,&H7F
E17E:  77 7A EE     cal     &HEE7A
E181:  82 71 14     ldw     $17,$20
E184:  41 08 64     sbc     $8,&H64
E187:  B4 06        jr      nz,&HE18E
E189:  77 E1 F4     cal     &HF4E1
E18C:  B7 04        jr      &HE191
E18E:  77 21 F5     cal     &HF521
E191:  02 69 12     ld      $9,$18
E194:  77 ED E3     cal     &HE3ED
E197:  F7           rtn   
E198:  77 7A EE     cal     &HEE7A
E19B:  82 6F 14     ldw     $15,$20
E19E:  D1 11 00 00  ldw     $17,&H0000
E1A2:  44 08 80     anc     $8,&H80
E1A5:  B0 0A        jr      z,&HE1B0
E1A7:  4C 08 7F     an      $8,&H7F
E1AA:  77 7A EE     cal     &HEE7A
E1AD:  82 71 14     ldw     $17,$20
E1B0:  D6 40 19 1D  pre     iz,&H1D19
E1B4:  42 02 FF     ld      $2,&HFF
E1B7:  23 02        sti     $2,(iz+$sx)
E1B9:  23 1F        sti     $31,(iz+$sx)
E1BB:  23 1F        sti     $31,(iz+$sx)
E1BD:  41 08 6F     sbc     $8,&H6F
E1C0:  B4 06        jr      nz,&HE1C7
E1C2:  77 6E E2     cal     &HE26E
E1C5:  B7 04        jr      &HE1CA
E1C7:  77 BC E2     cal     &HE2BC
E1CA:  D6 40 5C 21  pre     iz,&H215C
E1CE:  A9 02        ldw     $2,(iz+$sx)
E1D0:  81 62 00     sbcw    $2,$0
E1D3:  B5 11        jr      c,&HE1E5
E1D5:  89 62 00     sbw     $2,$0
E1D8:  44 03 80     anc     $3,&H80
E1DB:  B4 09        jr      nz,&HE1E5
E1DD:  A9 00        ldw     $0,(iz+$sx)
E1DF:  D6 40 1A 1D  pre     iz,&H1D1A
E1E3:  A1 02        stw     $2,(iz+$sx)
E1E5:  D6 40 17 1D  pre     iz,&H1D17
E1E9:  A1 00        stw     $0,(iz+$sx)
E1EB:  F7           rtn   
E1EC:  77 7A EE     cal     &HEE7A
E1EF:  82 6A 14     ldw     $10,$20
E1F2:  77 7A EE     cal     &HEE7A
E1F5:  82 6C 14     ldw     $12,$20
E1F8:  77 7A EE     cal     &HEE7A
E1FB:  82 6E 14     ldw     $14,$20
E1FE:  77 7A EE     cal     &HEE7A
E201:  82 70 14     ldw     $16,$20
E204:  77 76 F3     cal     &HF376
E207:  77 90 DC     cal     &HDC90
E20A:  B1 06        jr      nc,&HE211
E20C:  77 0A E6     cal     &HE60A
E20F:  B7 24        jr      &HE234
E211:  02 60 08     ld      $0,$8
E214:  4E 00 20     or      $0,&H20
E217:  41 00 67     sbc     $0,&H67
E21A:  B0 16        jr      z,&HE231
E21C:  02 69 12     ld      $9,$18
E21F:  77 AD E3     cal     &HE3AD
E222:  41 08 66     sbc     $8,&H66
E225:  B4 06        jr      nz,&HE22C
E227:  77 ED E3     cal     &HE3ED
E22A:  B7 09        jr      &HE234
E22C:  77 16 E5     cal     &HE516
E22F:  B7 04        jr      &HE234
E231:  77 04 E3     cal     &HE304
E234:  F7           rtn   
E235:  77 7A EE     cal     &HEE7A
E238:  D6 40 17 1D  pre     iz,&H1D17
E23C:  A3 1E        stiw    $30,(iz+$sx)
E23E:  A1 14        stw     $20,(iz+$sx)
E240:  F7           rtn   
E241:  77 7A EE     cal     &HEE7A
E244:  D6 40 19 1D  pre     iz,&H1D19
E248:  A1 14        stw     $20,(iz+$sx)
E24A:  96 14        pre     ix,$20
E24C:  D1 00 00 00  ldw     $0,&H0000
E250:  2A 10        ldi     $16,(ix+$sx)
E252:  01 10        sbc     $16,$sx
E254:  B0 04        jr      z,&HE259
E256:  88 A0 88     adw     $0,$sy,jr &HE1E0
E259:  D6 40 5C 21  pre     iz,&H215C
E25D:  A9 02        ldw     $2,(iz+$sx)
E25F:  81 62 00     sbcw    $2,$0
E262:  B1 04        jr      nc,&HE267
E264:  82 60 02     ldw     $0,$2
E267:  D6 40 17 1D  pre     iz,&H1D17
E26B:  A1 00        stw     $0,(iz+$sx)
E26D:  F7           rtn   
E26E:  D1 00 00 00  ldw     $0,&H0000
E272:  42 03 02     ld      $3,&H02
E275:  02 0E        ld      $14,$sx
E277:  98 6F        biuw    $15
E279:  98 31        rouw    $17
E27B:  18 2E        rou     $14
E27D:  09 23        sb      $3,$sy
E27F:  B4 89        jr      nz,&HE209
E281:  4E 0E 30     or      $14,&H30
E284:  41 0E 30     sbc     $14,&H30
E287:  B0 05        jr      z,&HE28D
E289:  23 0E        sti     $14,(iz+$sx)
E28B:  88 20        adw     $0,$sy
E28D:  42 02 0A     ld      $2,&H0A
E290:  42 03 03     ld      $3,&H03
E293:  02 0E        ld      $14,$sx
E295:  98 6F        biuw    $15
E297:  98 31        rouw    $17
E299:  18 2E        rou     $14
E29B:  09 23        sb      $3,$sy
E29D:  B4 89        jr      nz,&HE227
E29F:  4E 0E 30     or      $14,&H30
E2A2:  09 22        sb      $2,$sy
E2A4:  B0 10        jr      z,&HE2B5
E2A6:  41 0E 30     sbc     $14,&H30
E2A9:  B4 06        jr      nz,&HE2B0
E2AB:  84 60 00     ancw    $0,$0
E2AE:  B0 9F        jr      z,&HE24E
E2B0:  23 0E        sti     $14,(iz+$sx)
E2B2:  88 A0 A4     adw     $0,$sy,jr &HE258
E2B5:  23 0E        sti     $14,(iz+$sx)
E2B7:  88 20        adw     $0,$sy
E2B9:  21 1F        st      $31,(iz+$sx)
E2BB:  F7           rtn   
E2BC:  D1 00 00 00  ldw     $0,&H0000
E2C0:  42 02 08     ld      $2,&H08
E2C3:  42 03 04     ld      $3,&H04
E2C6:  02 0E        ld      $14,$sx
E2C8:  98 6F        biuw    $15
E2CA:  98 31        rouw    $17
E2CC:  18 2E        rou     $14
E2CE:  09 23        sb      $3,$sy
E2D0:  B4 89        jr      nz,&HE25A
E2D2:  41 0E 0A     sbc     $14,&H0A
E2D5:  B5 11        jr      c,&HE2E7
E2D7:  49 0E 09     sb      $14,&H09
E2DA:  4E 0E 40     or      $14,&H40
E2DD:  02 63 08     ld      $3,$8
E2E0:  4C 03 20     an      $3,&H20
E2E3:  0E EE 03 04  or      $14,$3,jr &HE2EA
E2E7:  4E 0E 30     or      $14,&H30
E2EA:  09 22        sb      $2,$sy
E2EC:  B0 10        jr      z,&HE2FD
E2EE:  41 0E 30     sbc     $14,&H30
E2F1:  B4 06        jr      nz,&HE2F8
E2F3:  84 60 00     ancw    $0,$0
E2F6:  B0 B4        jr      z,&HE2AB
E2F8:  23 0E        sti     $14,(iz+$sx)
E2FA:  88 A0 B9     adw     $0,$sy,jr &HE2B5
E2FD:  23 0E        sti     $14,(iz+$sx)
E2FF:  88 20        adw     $0,$sy
E301:  21 1F        st      $31,(iz+$sx)
E303:  F7           rtn   
E304:  E6 11 E0     phsm    $17,8
E307:  77 F2 E5     cal     &HE5F2
E30A:  82 60 0A     ldw     $0,$10
E30D:  EE 0A E0     ppsm    $10,8
E310:  01 12        sbc     $18,$sx
E312:  B0 10        jr      z,&HE323
E314:  41 12 05     sbc     $18,&H05
E317:  B0 0B        jr      z,&HE323
E319:  D6 40 5C 21  pre     iz,&H215C
E31D:  BB 00        sbcw    (iz+$sx),$0
E31F:  B5 1A        jr      c,&HE33A
E321:  B7 0A        jr      &HE32C
E323:  01 00        sbc     $0,$sx
E325:  B0 06        jr      z,&HE32C
E327:  41 00 60     sbc     $0,&H60
E32A:  B5 0F        jr      c,&HE33A
E32C:  42 08 66     ld      $8,&H66
E32F:  02 69 12     ld      $9,$18
E332:  77 AD E3     cal     &HE3AD
E335:  77 ED E3     cal     &HE3ED
E338:  B7 0D        jr      &HE346
E33A:  4C 08 FD     an      $8,&HFD
E33D:  02 69 12     ld      $9,$18
E340:  77 AD E3     cal     &HE3AD
E343:  77 16 E5     cal     &HE516
E346:  D6 40 17 1D  pre     iz,&H1D17
E34A:  AB 00        ldiw    $0,(iz+$sx)
E34C:  D1 06 00 00  ldw     $6,&H0000
E350:  2B 10        ldi     $16,(iz+$sx)
E352:  41 10 FF     sbc     $16,&HFF
E355:  B4 05        jr      nz,&HE35B
E357:  2B 30        ldi     $16,(iz+$sy)
E359:  B7 8A        jr      &HE2E4
E35B:  41 10 2E     sbc     $16,&H2E
E35E:  B0 0A        jr      z,&HE369
E360:  88 26        adw     $6,$sy
E362:  81 60 06     sbcw    $0,$6
E365:  B4 96        jr      nz,&HE2FC
E367:  B7 44        jr      &HE3AC
E369:  29 10        ld      $16,(iz+$sx)
E36B:  41 10 FF     sbc     $16,&HFF
E36E:  B4 16        jr      nz,&HE385
E370:  9E 44        gre     iz,$4
E372:  2B 10        ldi     $16,(iz+$sx)
E374:  89 20        sbw     $0,$sy
E376:  AB 02        ldiw    $2,(iz+$sx)
E378:  89 60 02     sbw     $0,$2
E37B:  E9 0A 80     ldm     $10,(iz+$sx),5
E37E:  96 44        pre     iz,$4
E380:  E1 AA 80     stm     $10,(iz-$sy),5
E383:  B7 22        jr      &HE3A6
E385:  88 26        adw     $6,$sy
E387:  2B 10        ldi     $16,(iz+$sx)
E389:  41 10 FF     sbc     $16,&HFF
E38C:  B0 0A        jr      z,&HE397
E38E:  88 26        adw     $6,$sy
E390:  81 60 06     sbcw    $0,$6
E393:  B4 8D        jr      nz,&HE321
E395:  B7 16        jr      &HE3AC
E397:  9E 44        gre     iz,$4
E399:  AB 02        ldiw    $2,(iz+$sx)
E39B:  89 60 02     sbw     $0,$2
E39E:  E9 0A 80     ldm     $10,(iz+$sx),5
E3A1:  96 44        pre     iz,$4
E3A3:  E1 AA 80     stm     $10,(iz-$sy),5
E3A6:  D6 40 17 1D  pre     iz,&H1D17
E3AA:  A1 00        stw     $0,(iz+$sx)
E3AC:  F7           rtn   
E3AD:  D6 40 5C 21  pre     iz,&H215C
E3B1:  A9 00        ldw     $0,(iz+$sx)
E3B3:  04 61 01     anc     $1,$1
E3B6:  B4 35        jr      nz,&HE3EC
E3B8:  44 00 80     anc     $0,&H80
E3BB:  B4 30        jr      nz,&HE3EC
E3BD:  1B 40        inv     $0
E3BF:  41 08 66     sbc     $8,&H66
E3C2:  B0 20        jr      z,&HE3E3
E3C4:  E6 11 E0     phsm    $17,8
E3C7:  77 F2 E5     cal     &HE5F2
E3CA:  01 12        sbc     $18,$sx
E3CC:  B0 0A        jr      z,&HE3D7
E3CE:  41 12 05     sbc     $18,&H05
E3D1:  B0 05        jr      z,&HE3D7
E3D3:  08 E0 11 0A  ad      $0,$17,jr &HE3E0
E3D7:  42 07 64     ld      $7,&H64
E3DA:  09 67 11     sb      $7,$17
E3DD:  09 60 07     sb      $0,$7
E3E0:  EE 0A E0     ppsm    $10,8
E3E3:  02 47        ld      $7,$sz
E3E5:  26 08        phs     $8
E3E7:  77 74 17     cal     &H1774
E3EA:  2E 08        pps     $8
E3EC:  F7           rtn   
E3ED:  77 D0 09     cal     &H09D0
E3F0:  D6 40 86 1D  pre     iz,&H1D86
E3F4:  E3 0A A0     stim    $10,(iz+$sx),6
E3F7:  D6 40 96 1D  pre     iz,&H1D96
E3FB:  E3 13 A0     stim    $19,(iz+$sx),6
E3FE:  D6 00 19 1D  pre     ix,&H1D19
E402:  D1 00 00 00  ldw     $0,&H0000
E406:  41 09 05     sbc     $9,&H05
E409:  B5 08        jr      c,&HE412
E40B:  42 02 2D     ld      $2,&H2D
E40E:  22 02        sti     $2,(ix+$sx)
E410:  88 20        adw     $0,$sy
E412:  42 02 FF     ld      $2,&HFF
E415:  22 02        sti     $2,(ix+$sx)
E417:  9E 04        gre     ix,$4
E419:  22 1F        sti     $31,(ix+$sx)
E41B:  22 1F        sti     $31,(ix+$sx)
E41D:  4E 10 30     or      $16,&H30
E420:  22 10        sti     $16,(ix+$sx)
E422:  88 20        adw     $0,$sy
E424:  82 26        ldw     $6,$sy
E426:  D6 40 8C 1D  pre     iz,&H1D8C
E42A:  42 03 02     ld      $3,&H02
E42D:  77 F2 E5     cal     &HE5F2
E430:  2D AF        ldd     $15,(iz-$sy)
E432:  42 02 02     ld      $2,&H02
E435:  01 11        sbc     $17,$sx
E437:  B0 32        jr      z,&HE46A
E439:  A6 01        phsw    $1
E43B:  D1 00 0D 00  ldw     $0,&H000D
E43F:  81 46        sbcw    $6,$sz
E441:  AE 00        ppsw    $0
E443:  B1 16        jr      nc,&HE45A
E445:  02 10        ld      $16,$sx
E447:  9A 2F        diuw    $15
E449:  4E 10 30     or      $16,&H30
E44C:  22 10        sti     $16,(ix+$sx)
E44E:  88 20        adw     $0,$sy
E450:  88 26        adw     $6,$sy
E452:  09 31        sb      $17,$sy
E454:  09 22        sb      $2,$sy
E456:  B4 A2        jr      nz,&HE3F9
E458:  B7 A9        jr      &HE402
E45A:  01 11        sbc     $17,$sx
E45C:  B0 0D        jr      z,&HE46A
E45E:  42 10 30     ld      $16,&H30
E461:  22 10        sti     $16,(ix+$sx)
E463:  88 20        adw     $0,$sy
E465:  88 26        adw     $6,$sy
E467:  09 B1 8F     sb      $17,$sy,jr &HE3F8
E46A:  09 23        sb      $3,$sy
E46C:  B0 77        jr      z,&HE4E4
E46E:  41 08 66     sbc     $8,&H66
E471:  B0 1D        jr      z,&HE48F
E473:  D6 40 5C 21  pre     iz,&H215C
E477:  BB 06        sbcw    (iz+$sx),$6
E479:  35 0D E5     jp      c,&HE50D
E47C:  BF 06        sbw     (iz+$sx),$6
E47E:  A9 06        ldw     $6,(iz+$sx)
E480:  44 07 80     anc     $7,&H80
E483:  34 0D E5     jp      nz,&HE50D
E486:  96 44        pre     iz,$4
E488:  A1 06        stw     $6,(iz+$sx)
E48A:  88 60 06     adw     $0,$6
E48D:  B7 7F        jr      &HE50D
E48F:  D6 40 5C 21  pre     iz,&H215C
E493:  BB 1E        sbcw    (iz+$sx),$30
E495:  B5 77        jr      c,&HE50D
E497:  42 10 2E     ld      $16,&H2E
E49A:  22 10        sti     $16,(ix+$sx)
E49C:  88 20        adw     $0,$sy
E49E:  D1 06 00 00  ldw     $6,&H0000
E4A2:  02 71 1A     ld      $17,$26
E4A5:  77 F2 E5     cal     &HE5F2
E4A8:  01 3B        sbc     $27,$sy
E4AA:  B0 20        jr      z,&HE4CB
E4AC:  41 1B 06     sbc     $27,&H06
E4AF:  B0 1B        jr      z,&HE4CB
E4B1:  01 1A        sbc     $26,$sx
E4B3:  B0 17        jr      z,&HE4CB
E4B5:  42 04 63     ld      $4,&H63
E4B8:  09 64 11     sb      $4,$17
E4BB:  42 10 30     ld      $16,&H30
E4BE:  01 04        sbc     $4,$sx
E4C0:  B0 0A        jr      z,&HE4CB
E4C2:  22 10        sti     $16,(ix+$sx)
E4C4:  88 20        adw     $0,$sy
E4C6:  88 26        adw     $6,$sy
E4C8:  09 A4 8C     sb      $4,$sy,jr &HE456
E4CB:  4E 19 30     or      $25,&H30
E4CE:  22 19        sti     $25,(ix+$sx)
E4D0:  88 20        adw     $0,$sy
E4D2:  88 26        adw     $6,$sy
E4D4:  D6 40 9C 1D  pre     iz,&H1D9C
E4D8:  41 11 0D     sbc     $17,&H0D
E4DB:  35 30 E4     jp      c,&HE430
E4DE:  42 11 0C     ld      $17,&H0C
E4E1:  37 30 E4     jp      &HE430
E4E4:  28 B0        ld      $16,(ix-$sy)
E4E6:  41 10 30     sbc     $16,&H30
E4E9:  B4 08        jr      nz,&HE4F2
E4EB:  2C B0        ldd     $16,(ix-$sy)
E4ED:  89 26        sbw     $6,$sy
E4EF:  89 A0 8D     sbw     $0,$sy,jr &HE47E
E4F2:  42 02 FF     ld      $2,&HFF
E4F5:  22 02        sti     $2,(ix+$sx)
E4F7:  D1 04 00 00  ldw     $4,&H0000
E4FB:  D6 40 5C 21  pre     iz,&H215C
E4FF:  BB 06        sbcw    (iz+$sx),$6
E501:  B5 09        jr      c,&HE50B
E503:  A9 04        ldw     $4,(iz+$sx)
E505:  89 64 06     sbw     $4,$6
E508:  88 60 04     adw     $0,$4
E50B:  A2 04        stiw    $4,(ix+$sx)
E50D:  20 1F        st      $31,(ix+$sx)
E50F:  D6 00 17 1D  pre     ix,&H1D17
E513:  A0 00        stw     $0,(ix+$sx)
E515:  F7           rtn   
E516:  D6 40 86 1D  pre     iz,&H1D86
E51A:  E3 0A A0     stim    $10,(iz+$sx),6
E51D:  D6 00 19 1D  pre     ix,&H1D19
E521:  D1 00 00 00  ldw     $0,&H0000
E525:  41 09 05     sbc     $9,&H05
E528:  B5 08        jr      c,&HE531
E52A:  42 02 2D     ld      $2,&H2D
E52D:  22 02        sti     $2,(ix+$sx)
E52F:  88 20        adw     $0,$sy
E531:  4E 10 30     or      $16,&H30
E534:  22 10        sti     $16,(ix+$sx)
E536:  88 20        adw     $0,$sy
E538:  D6 40 5C 21  pre     iz,&H215C
E53C:  BB 1E        sbcw    (iz+$sx),$30
E53E:  B5 54        jr      c,&HE593
E540:  42 10 2E     ld      $16,&H2E
E543:  22 10        sti     $16,(ix+$sx)
E545:  88 20        adw     $0,$sy
E547:  D6 40 8C 1D  pre     iz,&H1D8C
E54B:  42 03 06     ld      $3,&H06
E54E:  2D AF        ldd     $15,(iz-$sy)
E550:  42 02 02     ld      $2,&H02
E553:  02 10        ld      $16,$sx
E555:  9A 2F        diuw    $15
E557:  4E 10 30     or      $16,&H30
E55A:  22 10        sti     $16,(ix+$sx)
E55C:  88 20        adw     $0,$sy
E55E:  09 22        sb      $2,$sy
E560:  B4 8E        jr      nz,&HE4EF
E562:  09 23        sb      $3,$sy
E564:  B4 97        jr      nz,&HE4FC
E566:  D1 06 0C 00  ldw     $6,&H000C
E56A:  28 B0        ld      $16,(ix-$sy)
E56C:  41 10 30     sbc     $16,&H30
E56F:  B4 08        jr      nz,&HE578
E571:  2C B0        ldd     $16,(ix-$sy)
E573:  89 26        sbw     $6,$sy
E575:  89 A0 8D     sbw     $0,$sy,jr &HE504
E578:  42 02 FF     ld      $2,&HFF
E57B:  22 02        sti     $2,(ix+$sx)
E57D:  D1 04 00 00  ldw     $4,&H0000
E581:  D6 40 5C 21  pre     iz,&H215C
E585:  BB 06        sbcw    (iz+$sx),$6
E587:  B5 09        jr      c,&HE591
E589:  A9 04        ldw     $4,(iz+$sx)
E58B:  89 64 06     sbw     $4,$6
E58E:  88 60 04     adw     $0,$4
E591:  A2 04        stiw    $4,(ix+$sx)
E593:  02 70 08     ld      $16,$8
E596:  4C 10 20     an      $16,&H20
E599:  4E 10 45     or      $16,&H45
E59C:  22 10        sti     $16,(ix+$sx)
E59E:  88 20        adw     $0,$sy
E5A0:  42 10 2B     ld      $16,&H2B
E5A3:  01 32        sbc     $18,$sy
E5A5:  B0 27        jr      z,&HE5CD
E5A7:  41 12 06     sbc     $18,&H06
E5AA:  B0 22        jr      z,&HE5CD
E5AC:  01 11        sbc     $17,$sx
E5AE:  B0 1E        jr      z,&HE5CD
E5B0:  77 F2 E5     cal     &HE5F2
E5B3:  D1 03 64 00  ldw     $3,&H0064
E5B7:  89 63 0A     sbw     $3,$10
E5BA:  02 0E        ld      $14,$sx
E5BC:  02 0F        ld      $15,$sx
E5BE:  02 10        ld      $16,$sx
E5C0:  A6 01        phsw    $1
E5C2:  77 B4 0A     cal     &H0AB4
E5C5:  AE 00        ppsw    $0
E5C7:  02 71 0E     ld      $17,$14
E5CA:  42 10 2D     ld      $16,&H2D
E5CD:  22 10        sti     $16,(ix+$sx)
E5CF:  88 20        adw     $0,$sy
E5D1:  02 6F 11     ld      $15,$17
E5D4:  02 10        ld      $16,$sx
E5D6:  9A 2F        diuw    $15
E5D8:  4E 10 30     or      $16,&H30
E5DB:  22 10        sti     $16,(ix+$sx)
E5DD:  88 20        adw     $0,$sy
E5DF:  4C 11 0F     an      $17,&H0F
E5E2:  4E 11 30     or      $17,&H30
E5E5:  22 11        sti     $17,(ix+$sx)
E5E7:  88 20        adw     $0,$sy
E5E9:  20 1F        st      $31,(ix+$sx)
E5EB:  D6 00 17 1D  pre     ix,&H1D17
E5EF:  A0 00        stw     $0,(ix+$sx)
E5F1:  F7           rtn   
E5F2:  02 0A        ld      $10,$sx
E5F4:  02 0B        ld      $11,$sx
E5F6:  02 0E        ld      $14,$sx
E5F8:  02 0F        ld      $15,$sx
E5FA:  02 10        ld      $16,$sx
E5FC:  02 6F 11     ld      $15,$17
E5FF:  9A 2F        diuw    $15
E601:  02 31        ld      $17,$sy
E603:  77 DC 0A     cal     &H0ADC
E606:  02 71 0A     ld      $17,$10
E609:  F7           rtn   
E60A:  77 71 9F     cal     &H9F71
E60D:  D6 40 47 42  pre     iz,&H4247
E611:  D6 00 19 1D  pre     ix,&H1D19
E615:  D1 03 00 00  ldw     $3,&H0000
E619:  2B 02        ldi     $2,(iz+$sx)
E61B:  22 02        sti     $2,(ix+$sx)
E61D:  01 02        sbc     $2,$sx
E61F:  B0 04        jr      z,&HE624
E621:  88 A3 8A     adw     $3,$sy,jr &HE5AD
E624:  77 79 85     cal     &H8579
E627:  D6 40 16 1D  pre     iz,&H1D16
E62B:  42 02 20     ld      $2,&H20
E62E:  23 02        sti     $2,(iz+$sx)
E630:  A1 03        stw     $3,(iz+$sx)
E632:  42 08 63     ld      $8,&H63
E635:  D6 40 5C 21  pre     iz,&H215C
E639:  D1 00 FF FF  ldw     $0,&HFFFF
E63D:  A1 00        stw     $0,(iz+$sx)
E63F:  D6 40 18 1E  pre     iz,&H1E18
E643:  D1 00 00 00  ldw     $0,&H0000
E647:  A1 00        stw     $0,(iz+$sx)
E649:  F7           rtn   
E64A:  D6 40 16 1D  pre     iz,&H1D16
E64E:  29 00        ld      $0,(iz+$sx)
E650:  02 42        ld      $2,$sz
E652:  4C 00 7F     an      $0,&H7F
E655:  23 00        sti     $0,(iz+$sx)
E657:  AB 03        ldiw    $3,(iz+$sx)
E659:  29 09        ld      $9,(iz+$sx)
E65B:  9E 45        gre     iz,$5
E65D:  D6 40 18 1E  pre     iz,&H1E18
E661:  A9 00        ldw     $0,(iz+$sx)
E663:  81 63 00     sbcw    $3,$0
E666:  B5 04        jr      c,&HE66B
E668:  02 82 52     ld      $2,$sx,jr &HE6BC
E66B:  89 60 03     sbw     $0,$3
E66E:  44 01 80     anc     $1,&H80
E671:  B0 04        jr      z,&HE676
E673:  02 82 47     ld      $2,$sx,jr &HE6BC
E676:  44 02 80     anc     $2,&H80
E679:  B4 42        jr      nz,&HE6BC
E67B:  D6 40 16 1D  pre     iz,&H1D16
E67F:  29 10        ld      $16,(iz+$sx)
E681:  41 08 63     sbc     $8,&H63
E684:  B0 26        jr      z,&HE6AB
E686:  41 08 73     sbc     $8,&H73
E689:  B0 21        jr      z,&HE6AB
E68B:  41 09 2D     sbc     $9,&H2D
E68E:  B4 1C        jr      nz,&HE6AB
E690:  41 10 30     sbc     $16,&H30
E693:  B4 17        jr      nz,&HE6AB
E695:  02 70 09     ld      $16,$9
E698:  E6 06 40     phsm    $6,3
E69B:  77 23 E7     cal     &HE723
E69E:  EE 04 40     ppsm    $4,3
E6A1:  88 25        adw     $5,$sy
E6A3:  89 23        sbw     $3,$sy
E6A5:  D6 40 16 1D  pre     iz,&H1D16
E6A9:  29 10        ld      $16,(iz+$sx)
E6AB:  E6 06 40     phsm    $6,3
E6AE:  84 60 00     ancw    $0,$0
E6B1:  B0 07        jr      z,&HE6B9
E6B3:  77 23 E7     cal     &HE723
E6B6:  89 A0 8A     sbw     $0,$sy,jr &HE642
E6B9:  EE 04 40     ppsm    $4,3
E6BC:  E6 02 40     phsm    $2,3
E6BF:  41 08 73     sbc     $8,&H73
E6C2:  B4 05        jr      nz,&HE6C8
E6C4:  96 45        pre     iz,$5
E6C6:  A9 05        ldw     $5,(iz+$sx)
E6C8:  84 63 03     ancw    $3,$3
E6CB:  B0 40        jr      z,&HE70C
E6CD:  96 45        pre     iz,$5
E6CF:  2B 10        ldi     $16,(iz+$sx)
E6D1:  41 10 FF     sbc     $16,&HFF
E6D4:  B4 29        jr      nz,&HE6FE
E6D6:  41 08 63     sbc     $8,&H63
E6D9:  B0 24        jr      z,&HE6FE
E6DB:  41 08 73     sbc     $8,&H73
E6DE:  B0 1F        jr      z,&HE6FE
E6E0:  AB 00        ldiw    $0,(iz+$sx)
E6E2:  9E 45        gre     iz,$5
E6E4:  A6 06        phsw    $6
E6E6:  42 10 30     ld      $16,&H30
E6E9:  84 60 00     ancw    $0,$0
E6EC:  B0 0D        jr      z,&HE6FA
E6EE:  26 04        phs     $4
E6F0:  77 23 E7     cal     &HE723
E6F3:  2E 04        pps     $4
E6F5:  89 20        sbw     $0,$sy
E6F7:  89 A3 90     sbw     $3,$sy,jr &HE689
E6FA:  AE 05        ppsw    $5
E6FC:  B7 B5        jr      &HE6B2
E6FE:  9E 45        gre     iz,$5
E700:  E6 06 40     phsm    $6,3
E703:  77 23 E7     cal     &HE723
E706:  EE 04 40     ppsm    $4,3
E709:  89 A3 C3     sbw     $3,$sy,jr &HE6CE
E70C:  EE 00 40     ppsm    $0,3
E70F:  44 02 80     anc     $2,&H80
E712:  B0 0F        jr      z,&HE722
E714:  42 10 20     ld      $16,&H20
E717:  84 60 00     ancw    $0,$0
E71A:  B0 07        jr      z,&HE722
E71C:  77 23 E7     cal     &HE723
E71F:  89 A0 8A     sbw     $0,$sy,jr &HE6AB
E722:  F7           rtn   
E723:  A6 01        phsw    $1
E725:  D6 00 58 21  pre     ix,&H2158
E729:  A8 11        ldw     $17,(ix+$sx)
E72B:  D6 40 1A 1E  pre     iz,&H1E1A
E72F:  3B 1F        sbc     (iz+$sx),$31
E731:  B4 0A        jr      nz,&HE73C
E733:  26 08        phs     $8
E735:  77 01 A5     cal     &HA501
E738:  2E 08        pps     $8
E73A:  B7 0A        jr      &HE745
E73C:  10 70 11     st      $16,($17)
E73F:  BC 1E        adw     (ix+$sx),$30
E741:  01 10        sbc     $16,$sx
E743:  B0 07        jr      z,&HE74B
E745:  D6 40 08 1D  pre     iz,&H1D08
E749:  BD 1E        adw     (iz+$sx),$30
E74B:  AE 00        ppsw    $0
E74D:  F7           rtn   
E74E:  D6 40 08 1D  pre     iz,&H1D08
E752:  21 1F        st      $31,(iz+$sx)
E754:  21 3F        st      $31,(iz+$sy)
E756:  D6 40 58 21  pre     iz,&H2158
E75A:  A1 11        stw     $17,(iz+$sx)
E75C:  77 7A EE     cal     &HEE7A
E75F:  82 60 14     ldw     $0,$20
E762:  96 00        pre     ix,$0
E764:  2A 10        ldi     $16,(ix+$sx)
E766:  9E 00        gre     ix,$0
E768:  02 28        ld      $8,$sy
E76A:  41 10 25     sbc     $16,&H25
E76D:  B4 4E        jr      nz,&HE7BC
E76F:  28 10        ld      $16,(ix+$sx)
E771:  41 10 25     sbc     $16,&H25
E774:  B0 43        jr      z,&HE7B8
E776:  77 28 E8     cal     &HE828
E779:  9E 00        gre     ix,$0
E77B:  01 08        sbc     $8,$sx
E77D:  B0 96        jr      z,&HE714
E77F:  D6 40 18 1E  pre     iz,&H1E18
E783:  A9 02        ldw     $2,(iz+$sx)
E785:  84 62 02     ancw    $2,$2
E788:  B0 A7        jr      z,&HE730
E78A:  44 03 80     anc     $3,&H80
E78D:  B4 1C        jr      nz,&HE7AA
E78F:  A1 1E        stw     $30,(iz+$sx)
E791:  D6 40 17 1D  pre     iz,&H1D17
E795:  21 1F        st      $31,(iz+$sx)
E797:  A6 01        phsw    $1
E799:  D1 00 A3 E7  ldw     $0,&HE7A3
E79D:  A6 01        phsw    $1
E79F:  82 60 02     ldw     $0,$2
E7A2:  DE 18        jp      $24
E7A4:  AE 00        ppsw    $0
E7A6:  B5 6E        jr      c,&HE815
E7A8:  B7 C7        jr      &HE770
E7AA:  77 4B ED     cal     &HED4B
E7AD:  D6 40 0E 1D  pre     iz,&H1D0E
E7B1:  21 10        st      $16,(iz+$sx)
E7B3:  77 80 ED     cal     &HED80
E7B6:  B7 D5        jr      &HE78C
E7B8:  2A 10        ldi     $16,(ix+$sx)
E7BA:  9E 00        gre     ix,$0
E7BC:  01 10        sbc     $16,$sx
E7BE:  B0 56        jr      z,&HE815
E7C0:  26 08        phs     $8
E7C2:  26 10        phs     $16
E7C4:  77 4B ED     cal     &HED4B
E7C7:  2E 0E        pps     $14
E7C9:  2E 08        pps     $8
E7CB:  B5 49        jr      c,&HE815
E7CD:  01 08        sbc     $8,$sx
E7CF:  B0 0D        jr      z,&HE7DD
E7D1:  26 10        phs     $16
E7D3:  02 70 0E     ld      $16,$14
E7D6:  77 35 B4     cal     &HB435
E7D9:  2E 10        pps     $16
E7DB:  B5 11        jr      c,&HE7ED
E7DD:  01 6E 10     sbc     $14,$16
E7E0:  B0 FF        jr      z,&HE7E0
E7E2:  D6 40 0E 1D  pre     iz,&H1D0E
E7E6:  21 10        st      $16,(iz+$sx)
E7E8:  77 80 ED     cal     &HED80
E7EB:  B7 29        jr      &HE815
E7ED:  77 35 B4     cal     &HB435
E7F0:  B5 06        jr      c,&HE7F7
E7F2:  77 7C B4     cal     &HB47C
E7F5:  B0 08        jr      z,&HE7FE
E7F7:  77 4B ED     cal     &HED4B
E7FA:  B5 1A        jr      c,&HE815
E7FC:  B7 90        jr      &HE78D
E7FE:  D6 40 0E 1D  pre     iz,&H1D0E
E802:  21 10        st      $16,(iz+$sx)
E804:  77 80 ED     cal     &HED80
E807:  96 00        pre     ix,$0
E809:  2A 10        ldi     $16,(ix+$sx)
E80B:  77 35 B4     cal     &HB435
E80E:  B5 86        jr      c,&HE795
E810:  9E 00        gre     ix,$0
E812:  37 68 E7     jp      &HE768
E815:  D6 40 08 1D  pre     iz,&H1D08
E819:  A9 00        ldw     $0,(iz+$sx)
E81B:  D6 40 81 1F  pre     iz,&H1F81
E81F:  A1 00        stw     $0,(iz+$sx)
E821:  D6 40 58 21  pre     iz,&H2158
E825:  A9 11        ldw     $17,(iz+$sx)
E827:  F7           rtn   
E828:  D6 40 5C 21  pre     iz,&H215C
E82C:  A1 1E        stw     $30,(iz+$sx)
E82E:  42 00 2A     ld      $0,&H2A
E831:  3A 00        sbc     (ix+$sx),$0
E833:  B4 05        jr      nz,&HE839
E835:  2A 10        ldi     $16,(ix+$sx)
E837:  BF 1E        sbw     (iz+$sx),$30
E839:  D1 0F 01 80  ldw     $15,&H8001
E83D:  77 FC ED     cal     &HEDFC
E840:  D6 40 18 1E  pre     iz,&H1E18
E844:  A1 0F        stw     $15,(iz+$sx)
E846:  02 01        ld      $1,$sx
E848:  42 00 6C     ld      $0,&H6C
E84B:  3A 00        sbc     (ix+$sx),$0
E84D:  B4 06        jr      nz,&HE854
E84F:  2A 10        ldi     $16,(ix+$sx)
E851:  42 01 80     ld      $1,&H80
E854:  2A 08        ldi     $8,(ix+$sx)
E856:  4E 08 20     or      $8,&H20
E859:  41 08 64     sbc     $8,&H64
E85C:  B0 08        jr      z,&HE865
E85E:  41 08 75     sbc     $8,&H75
E861:  B4 09        jr      nz,&HE86B
E863:  02 01        ld      $1,$sx
E865:  D1 18 D8 E8  ldw     $24,&HE8D8
E869:  B7 4C        jr      &HE8B6
E86B:  41 08 6F     sbc     $8,&H6F
E86E:  B0 06        jr      z,&HE875
E870:  41 08 78     sbc     $8,&H78
E873:  B4 07        jr      nz,&HE87B
E875:  D1 18 06 E9  ldw     $24,&HE906
E879:  B7 3C        jr      &HE8B6
E87B:  42 00 66     ld      $0,&H66
E87E:  3A A0        sbc     (ix-$sy),$0
E880:  B0 0B        jr      z,&HE88C
E882:  41 08 65     sbc     $8,&H65
E885:  B0 06        jr      z,&HE88C
E887:  41 08 67     sbc     $8,&H67
E88A:  B4 07        jr      nz,&HE892
E88C:  D1 18 43 E9  ldw     $24,&HE943
E890:  B7 25        jr      &HE8B6
E892:  02 01        ld      $1,$sx
E894:  41 08 63     sbc     $8,&H63
E897:  B4 15        jr      nz,&HE8AD
E899:  D1 18 EF E9  ldw     $24,&HE9EF
E89D:  D6 40 18 1E  pre     iz,&H1E18
E8A1:  D1 02 01 80  ldw     $2,&H8001
E8A5:  BB 02        sbcw    (iz+$sx),$2
E8A7:  B4 20        jr      nz,&HE8C8
E8A9:  A1 1E        stw     $30,(iz+$sx)
E8AB:  B7 1C        jr      &HE8C8
E8AD:  41 08 73     sbc     $8,&H73
E8B0:  B4 22        jr      nz,&HE8D3
E8B2:  D1 18 55 EA  ldw     $24,&HEA55
E8B6:  D6 40 18 1E  pre     iz,&H1E18
E8BA:  D1 02 01 80  ldw     $2,&H8001
E8BE:  BB 02        sbcw    (iz+$sx),$2
E8C0:  B4 07        jr      nz,&HE8C8
E8C2:  D1 02 FF 7F  ldw     $2,&H7FFF
E8C6:  A1 02        stw     $2,(iz+$sx)
E8C8:  D6 40 16 1D  pre     iz,&H1D16
E8CC:  0E 61 08     or      $1,$8
E8CF:  21 01        st      $1,(iz+$sx)
E8D1:  B7 05        jr      &HE8D7
E8D3:  28 B0        ld      $16,(ix-$sy)
E8D5:  02 08        ld      $8,$sx
E8D7:  F7           rtn   
E8D8:  77 07 EB     cal     &HEB07
E8DB:  B5 29        jr      c,&HE905
E8DD:  74 37 EB     cal     nz,&HEB37
E8E0:  1C 40        gfl     $0
E8E2:  26 00        phs     $0
E8E4:  D6 40 18 1E  pre     iz,&H1E18
E8E8:  D1 00 03 00  ldw     $0,&H0003
E8EC:  BB 00        sbcw    (iz+$sx),$0
E8EE:  B1 05        jr      nc,&HE8F4
E8F0:  21 1F        st      $31,(iz+$sx)
E8F2:  B7 0B        jr      &HE8FE
E8F4:  D6 40 18 1D  pre     iz,&H1D18
E8F8:  77 AC 07     cal     &H07AC
E8FB:  77 7E EB     cal     &HEB7E
E8FE:  77 17 ED     cal     &HED17
E901:  2E 00        pps     $0
E903:  14 40        pfl     $0
E905:  F7           rtn   
E906:  77 07 EB     cal     &HEB07
E909:  B5 38        jr      c,&HE942
E90B:  74 37 EB     cal     nz,&HEB37
E90E:  1C 40        gfl     $0
E910:  26 00        phs     $0
E912:  D6 40 18 1E  pre     iz,&H1E18
E916:  D1 00 03 00  ldw     $0,&H0003
E91A:  BB 00        sbcw    (iz+$sx),$0
E91C:  B1 05        jr      nc,&HE922
E91E:  21 1F        st      $31,(iz+$sx)
E920:  B7 1A        jr      &HE93B
E922:  D6 40 16 1D  pre     iz,&H1D16
E926:  29 00        ld      $0,(iz+$sx)
E928:  4C 00 7F     an      $0,&H7F
E92B:  41 00 6F     sbc     $0,&H6F
E92E:  B4 06        jr      nz,&HE935
E930:  77 F5 EB     cal     &HEBF5
E933:  B7 04        jr      &HE938
E935:  77 1C EC     cal     &HEC1C
E938:  77 4B EC     cal     &HEC4B
E93B:  77 17 ED     cal     &HED17
E93E:  2E 00        pps     $0
E940:  14 40        pfl     $0
E942:  F7           rtn   
E943:  77 07 EB     cal     &HEB07
E946:  35 EE E9     jp      c,&HE9EE
E949:  B0 45        jr      z,&HE98F
E94B:  A6 07        phsw    $7
E94D:  77 4B ED     cal     &HED4B
E950:  AE 06        ppsw    $6
E952:  B5 39        jr      c,&HE98C
E954:  77 4B B4     cal     &HB44B
E957:  B0 08        jr      z,&HE960
E959:  41 10 2E     sbc     $16,&H2E
E95C:  B0 1D        jr      z,&HE97A
E95E:  B7 28        jr      &HE987
E960:  77 24 B1     cal     &HB124
E963:  88 26        adw     $6,$sy
E965:  81 60 06     sbcw    $0,$6
E968:  B4 9E        jr      nz,&HE907
E96A:  B7 19        jr      &HE984
E96C:  A6 07        phsw    $7
E96E:  77 4B ED     cal     &HED4B
E971:  AE 06        ppsw    $6
E973:  B5 18        jr      c,&HE98C
E975:  77 4B B4     cal     &HB44B
E978:  B4 0E        jr      nz,&HE987
E97A:  77 24 B1     cal     &HB124
E97D:  88 26        adw     $6,$sy
E97F:  81 60 06     sbcw    $0,$6
E982:  B4 97        jr      nz,&HE91A
E984:  14 DF 09     pfl     $31,jr &HE98F
E987:  77 86 EC     cal     &HEC86
E98A:  B7 04        jr      &HE98F
E98C:  54 40 40     pfl     &H40
E98F:  1C 40        gfl     $0
E991:  26 00        phs     $0
E993:  D6 40 18 1E  pre     iz,&H1E18
E997:  D1 00 03 00  ldw     $0,&H0003
E99B:  BB 00        sbcw    (iz+$sx),$0
E99D:  B1 05        jr      nc,&HE9A3
E99F:  21 1F        st      $31,(iz+$sx)
E9A1:  B7 45        jr      &HE9E7
E9A3:  D6 40 18 1D  pre     iz,&H1D18
E9A7:  77 AC 07     cal     &H07AC
E9AA:  D6 40 16 1D  pre     iz,&H1D16
E9AE:  A9 00        ldw     $0,(iz+$sx)
E9B0:  41 01 2D     sbc     $1,&H2D
E9B3:  B4 08        jr      nz,&HE9BC
E9B5:  26 00        phs     $0
E9B7:  77 23 FA     cal     &HFA23
E9BA:  2E 00        pps     $0
E9BC:  44 00 80     anc     $0,&H80
E9BF:  B4 11        jr      nz,&HE9D1
E9C1:  77 84 F3     cal     &HF384
E9C4:  D6 40 17 1D  pre     iz,&H1D17
E9C8:  E3 0F 60     stim    $15,(iz+$sx),4
E9CB:  D1 00 04 00  ldw     $0,&H0004
E9CF:  B7 0F        jr      &HE9DF
E9D1:  77 7E F3     cal     &HF37E
E9D4:  D6 40 17 1D  pre     iz,&H1D17
E9D8:  E3 0A E0     stim    $10,(iz+$sx),8
E9DB:  D1 00 08 00  ldw     $0,&H0008
E9DF:  21 1F        st      $31,(iz+$sx)
E9E1:  D6 40 18 1E  pre     iz,&H1E18
E9E5:  A1 00        stw     $0,(iz+$sx)
E9E7:  77 17 ED     cal     &HED17
E9EA:  2E 00        pps     $0
E9EC:  14 40        pfl     $0
E9EE:  F7           rtn   
E9EF:  D6 40 5C 21  pre     iz,&H215C
E9F3:  BB 1E        sbcw    (iz+$sx),$30
E9F5:  B5 0A        jr      c,&HEA00
E9F7:  77 7A EE     cal     &HEE7A
E9FA:  D6 40 5A 21  pre     iz,&H215A
E9FE:  A1 14        stw     $20,(iz+$sx)
EA00:  D1 06 00 00  ldw     $6,&H0000
EA04:  A6 07        phsw    $7
EA06:  77 4B ED     cal     &HED4B
EA09:  AE 06        ppsw    $6
EA0B:  B5 0E        jr      c,&HEA1A
EA0D:  77 E2 EA     cal     &HEAE2
EA10:  88 26        adw     $6,$sy
EA12:  81 60 06     sbcw    $0,$6
EA15:  B4 92        jr      nz,&HE9A8
EA17:  14 DF 04     pfl     $31,jr &HEA1D
EA1A:  54 40 40     pfl     &H40
EA1D:  1C 40        gfl     $0
EA1F:  D6 40 18 1E  pre     iz,&H1E18
EA23:  BB 1E        sbcw    (iz+$sx),$30
EA25:  B0 2C        jr      z,&HEA52
EA27:  26 00        phs     $0
EA29:  D6 40 18 1E  pre     iz,&H1E18
EA2D:  A1 06        stw     $6,(iz+$sx)
EA2F:  D6 40 5C 21  pre     iz,&H215C
EA33:  BB 1E        sbcw    (iz+$sx),$30
EA35:  B5 10        jr      c,&HEA46
EA37:  81 66 1E     sbcw    $6,$30
EA3A:  B5 0B        jr      c,&HEA46
EA3C:  D6 40 08 1D  pre     iz,&H1D08
EA40:  BD 1E        adw     (iz+$sx),$30
EA42:  B4 0D        jr      nz,&HEA50
EA44:  B7 09        jr      &HEA4E
EA46:  D6 40 08 1D  pre     iz,&H1D08
EA4A:  B9 1E        adcw    (iz+$sx),$30
EA4C:  B4 03        jr      nz,&HEA50
EA4E:  BD 1E        adw     (iz+$sx),$30
EA50:  2E 00        pps     $0
EA52:  14 40        pfl     $0
EA54:  F7           rtn   
EA55:  D6 40 5C 21  pre     iz,&H215C
EA59:  BB 1E        sbcw    (iz+$sx),$30
EA5B:  B5 0A        jr      c,&HEA66
EA5D:  77 7A EE     cal     &HEE7A
EA60:  D6 40 5A 21  pre     iz,&H215A
EA64:  A1 14        stw     $20,(iz+$sx)
EA66:  77 4B ED     cal     &HED4B
EA69:  B5 36        jr      c,&HEAA0
EA6B:  77 35 B4     cal     &HB435
EA6E:  B5 89        jr      c,&HE9F8
EA70:  D1 06 00 00  ldw     $6,&H0000
EA74:  B7 1E        jr      &HEA93
EA76:  A6 07        phsw    $7
EA78:  77 4B ED     cal     &HED4B
EA7B:  AE 06        ppsw    $6
EA7D:  B5 22        jr      c,&HEAA0
EA7F:  77 35 B4     cal     &HB435
EA82:  B1 10        jr      nc,&HEA93
EA84:  D6 40 0E 1D  pre     iz,&H1D0E
EA88:  21 10        st      $16,(iz+$sx)
EA8A:  A6 07        phsw    $7
EA8C:  77 80 ED     cal     &HED80
EA8F:  AE 06        ppsw    $6
EA91:  B7 0B        jr      &HEA9D
EA93:  77 E2 EA     cal     &HEAE2
EA96:  88 26        adw     $6,$sy
EA98:  81 60 06     sbcw    $0,$6
EA9B:  B4 A6        jr      nz,&HEA42
EA9D:  14 DF 04     pfl     $31,jr &HEAA3
EAA0:  54 40 40     pfl     &H40
EAA3:  1C 40        gfl     $0
EAA5:  D6 40 18 1E  pre     iz,&H1E18
EAA9:  BB 1E        sbcw    (iz+$sx),$30
EAAB:  B0 33        jr      z,&HEADF
EAAD:  26 00        phs     $0
EAAF:  02 10        ld      $16,$sx
EAB1:  77 E2 EA     cal     &HEAE2
EAB4:  88 26        adw     $6,$sy
EAB6:  D6 40 18 1E  pre     iz,&H1E18
EABA:  A1 06        stw     $6,(iz+$sx)
EABC:  D6 40 5C 21  pre     iz,&H215C
EAC0:  BB 1E        sbcw    (iz+$sx),$30
EAC2:  B5 10        jr      c,&HEAD3
EAC4:  81 66 1E     sbcw    $6,$30
EAC7:  B5 0B        jr      c,&HEAD3
EAC9:  D6 40 08 1D  pre     iz,&H1D08
EACD:  BD 1E        adw     (iz+$sx),$30
EACF:  B4 0D        jr      nz,&HEADD
EAD1:  B7 09        jr      &HEADB
EAD3:  D6 40 08 1D  pre     iz,&H1D08
EAD7:  B9 1E        adcw    (iz+$sx),$30
EAD9:  B4 03        jr      nz,&HEADD
EADB:  BD 1E        adw     (iz+$sx),$30
EADD:  2E 00        pps     $0
EADF:  14 40        pfl     $0
EAE1:  F7           rtn   
EAE2:  A6 01        phsw    $1
EAE4:  D6 40 5C 21  pre     iz,&H215C
EAE8:  BB 1E        sbcw    (iz+$sx),$30
EAEA:  B5 19        jr      c,&HEB04
EAEC:  D6 40 5A 21  pre     iz,&H215A
EAF0:  A9 00        ldw     $0,(iz+$sx)
EAF2:  96 40        pre     iz,$0
EAF4:  23 10        sti     $16,(iz+$sx)
EAF6:  9E 40        gre     iz,$0
EAF8:  D6 40 5A 21  pre     iz,&H215A
EAFC:  A1 00        stw     $0,(iz+$sx)
EAFE:  D6 40 18 1E  pre     iz,&H1E18
EB02:  BD 1E        adw     (iz+$sx),$30
EB04:  AE 00        ppsw    $0
EB06:  F7           rtn   
EB07:  77 4B ED     cal     &HED4B
EB0A:  B5 2B        jr      c,&HEB36
EB0C:  77 35 B4     cal     &HB435
EB0F:  B5 89        jr      c,&HEA99
EB11:  41 10 2B     sbc     $16,&H2B
EB14:  B0 17        jr      z,&HEB2C
EB16:  41 10 2D     sbc     $16,&H2D
EB19:  B0 12        jr      z,&HEB2C
EB1B:  D6 40 0E 1D  pre     iz,&H1D0E
EB1F:  21 10        st      $16,(iz+$sx)
EB21:  77 80 ED     cal     &HED80
EB24:  D1 06 00 00  ldw     $6,&H0000
EB28:  42 90 2B 03  ld      $16,&H2B,jr &HEB2E
EB2C:  82 26        ldw     $6,$sy
EB2E:  77 24 B1     cal     &HB124
EB31:  14 5F        pfl     $31
EB33:  81 60 06     sbcw    $0,$6
EB36:  F7           rtn   
EB37:  A6 07        phsw    $7
EB39:  77 4B ED     cal     &HED4B
EB3C:  AE 06        ppsw    $6
EB3E:  B5 3B        jr      c,&HEB7A
EB40:  D6 40 16 1D  pre     iz,&H1D16
EB44:  29 08        ld      $8,(iz+$sx)
EB46:  4C 08 7F     an      $8,&H7F
EB49:  41 08 78     sbc     $8,&H78
EB4C:  B4 06        jr      nz,&HEB53
EB4E:  77 A8 B4     cal     &HB4A8
EB51:  B7 0E        jr      &HEB60
EB53:  41 08 6F     sbc     $8,&H6F
EB56:  B4 06        jr      nz,&HEB5D
EB58:  77 97 B4     cal     &HB497
EB5B:  B7 04        jr      &HEB60
EB5D:  77 4B B4     cal     &HB44B
EB60:  B4 0D        jr      nz,&HEB6E
EB62:  77 24 B1     cal     &HB124
EB65:  88 26        adw     $6,$sy
EB67:  81 60 06     sbcw    $0,$6
EB6A:  B0 0C        jr      z,&HEB77
EB6C:  B7 B6        jr      &HEB23
EB6E:  D6 40 0E 1D  pre     iz,&H1D0E
EB72:  21 10        st      $16,(iz+$sx)
EB74:  77 80 ED     cal     &HED80
EB77:  14 DF 04     pfl     $31,jr &HEB7D
EB7A:  54 40 40     pfl     &H40
EB7D:  F7           rtn   
EB7E:  D6 40 16 1D  pre     iz,&H1D16
EB82:  A9 00        ldw     $0,(iz+$sx)
EB84:  77 B4 ED     cal     &HEDB4
EB87:  02 48        ld      $8,$sz
EB89:  4C 08 7F     an      $8,&H7F
EB8C:  44 00 80     anc     $0,&H80
EB8F:  B4 2E        jr      nz,&HEBBE
EB91:  26 01        phs     $1
EB93:  41 08 75     sbc     $8,&H75
EB96:  B0 10        jr      z,&HEBA7
EB98:  77 68 F5     cal     &HF568
EB9B:  2E 01        pps     $1
EB9D:  41 01 2D     sbc     $1,&H2D
EBA0:  B4 13        jr      nz,&HEBB4
EBA2:  77 0D FA     cal     &HFA0D
EBA5:  B7 0E        jr      &HEBB4
EBA7:  77 68 F5     cal     &HF568
EBAA:  2E 01        pps     $1
EBAC:  41 01 2D     sbc     $1,&H2D
EBAF:  B4 04        jr      nz,&HEBB4
EBB1:  77 0D FA     cal     &HFA0D
EBB4:  D1 11 00 00  ldw     $17,&H0000
EBB8:  D1 00 02 00  ldw     $0,&H0002
EBBC:  B7 28        jr      &HEBE5
EBBE:  26 01        phs     $1
EBC0:  41 08 75     sbc     $8,&H75
EBC3:  B0 10        jr      z,&HEBD4
EBC5:  77 68 F5     cal     &HF568
EBC8:  2E 01        pps     $1
EBCA:  41 01 2D     sbc     $1,&H2D
EBCD:  B4 13        jr      nz,&HEBE1
EBCF:  77 10 FA     cal     &HFA10
EBD2:  B7 0E        jr      &HEBE1
EBD4:  77 68 F5     cal     &HF568
EBD7:  2E 01        pps     $1
EBD9:  41 01 2D     sbc     $1,&H2D
EBDC:  B4 04        jr      nz,&HEBE1
EBDE:  77 10 FA     cal     &HFA10
EBE1:  D1 00 04 00  ldw     $0,&H0004
EBE5:  D6 40 17 1D  pre     iz,&H1D17
EBE9:  02 13        ld      $19,$sx
EBEB:  E1 0F 80     stm     $15,(iz+$sx),5
EBEE:  D6 40 18 1E  pre     iz,&H1E18
EBF2:  A1 00        stw     $0,(iz+$sx)
EBF4:  F7           rtn   
EBF5:  D6 40 18 1D  pre     iz,&H1D18
EBF9:  D1 0F 00 00  ldw     $15,&H0000
EBFD:  D1 11 00 00  ldw     $17,&H0000
EC01:  2B 00        ldi     $0,(iz+$sx)
EC03:  01 00        sbc     $0,$sx
EC05:  B0 15        jr      z,&HEC1B
EC07:  02 01        ld      $1,$sx
EC09:  41 01 03     sbc     $1,&H03
EC0C:  B0 08        jr      z,&HEC15
EC0E:  98 6F        biuw    $15
EC10:  98 31        rouw    $17
EC12:  08 A1 8B     ad      $1,$sy,jr &HEB9F
EC15:  4C 00 07     an      $0,&H07
EC18:  0E CF 99     or      $15,$sz,jr &HEBB3
EC1B:  F7           rtn   
EC1C:  D6 40 18 1D  pre     iz,&H1D18
EC20:  D1 0F 00 00  ldw     $15,&H0000
EC24:  D1 11 00 00  ldw     $17,&H0000
EC28:  2B 00        ldi     $0,(iz+$sx)
EC2A:  01 00        sbc     $0,$sx
EC2C:  B0 1D        jr      z,&HEC4A
EC2E:  02 01        ld      $1,$sx
EC30:  41 01 04     sbc     $1,&H04
EC33:  B0 08        jr      z,&HEC3C
EC35:  98 6F        biuw    $15
EC37:  98 31        rouw    $17
EC39:  08 A1 8B     ad      $1,$sy,jr &HEBC6
EC3C:  44 00 40     anc     $0,&H40
EC3F:  B0 04        jr      z,&HEC44
EC41:  48 00 09     ad      $0,&H09
EC44:  4C 00 0F     an      $0,&H0F
EC47:  0E CF A1     or      $15,$sz,jr &HEBEA
EC4A:  F7           rtn   
EC4B:  D6 40 16 1D  pre     iz,&H1D16
EC4F:  A9 00        ldw     $0,(iz+$sx)
EC51:  44 00 80     anc     $0,&H80
EC54:  B4 15        jr      nz,&HEC6A
EC56:  41 01 2D     sbc     $1,&H2D
EC59:  B4 04        jr      nz,&HEC5E
EC5B:  77 0D FA     cal     &HFA0D
EC5E:  D1 11 00 00  ldw     $17,&H0000
EC62:  02 13        ld      $19,$sx
EC64:  D1 00 02 00  ldw     $0,&H0002
EC68:  B7 0F        jr      &HEC78
EC6A:  41 01 2D     sbc     $1,&H2D
EC6D:  B4 04        jr      nz,&HEC72
EC6F:  77 10 FA     cal     &HFA10
EC72:  02 13        ld      $19,$sx
EC74:  D1 00 04 00  ldw     $0,&H0004
EC78:  D6 40 17 1D  pre     iz,&H1D17
EC7C:  E1 0F 80     stm     $15,(iz+$sx),5
EC7F:  D6 40 18 1E  pre     iz,&H1E18
EC83:  A1 00        stw     $0,(iz+$sx)
EC85:  F7           rtn   
EC86:  02 05        ld      $5,$sx
EC88:  D6 40 18 1E  pre     iz,&H1E18
EC8C:  D1 02 03 00  ldw     $2,&H0003
EC90:  BB 02        sbcw    (iz+$sx),$2
EC92:  B5 5D        jr      c,&HECF0
EC94:  B4 10        jr      nz,&HECA5
EC96:  D6 00 18 1D  pre     ix,&H1D18
EC9A:  42 02 2E     ld      $2,&H2E
EC9D:  3A 02        sbc     (ix+$sx),$2
EC9F:  B4 05        jr      nz,&HECA5
ECA1:  21 1F        st      $31,(iz+$sx)
ECA3:  B7 4C        jr      &HECF0
ECA5:  41 10 45     sbc     $16,&H45
ECA8:  B0 06        jr      z,&HECAF
ECAA:  41 10 65     sbc     $16,&H65
ECAD:  B4 42        jr      nz,&HECF0
ECAF:  77 24 B1     cal     &HB124
ECB2:  88 26        adw     $6,$sy
ECB4:  81 60 06     sbcw    $0,$6
ECB7:  B0 58        jr      z,&HED10
ECB9:  77 4B ED     cal     &HED4B
ECBC:  B5 56        jr      c,&HED13
ECBE:  02 05        ld      $5,$sx
ECC0:  41 10 2B     sbc     $16,&H2B
ECC3:  B0 06        jr      z,&HECCA
ECC5:  41 10 2D     sbc     $16,&H2D
ECC8:  B4 14        jr      nz,&HECDD
ECCA:  77 24 B1     cal     &HB124
ECCD:  88 26        adw     $6,$sy
ECCF:  81 60 06     sbcw    $0,$6
ECD2:  B0 3D        jr      z,&HED10
ECD4:  26 05        phs     $5
ECD6:  77 4B ED     cal     &HED4B
ECD9:  2E 05        pps     $5
ECDB:  B5 37        jr      c,&HED13
ECDD:  77 4B B4     cal     &HB44B
ECE0:  B4 0F        jr      nz,&HECF0
ECE2:  77 24 B1     cal     &HB124
ECE5:  08 25        ad      $5,$sy
ECE7:  88 26        adw     $6,$sy
ECE9:  81 60 06     sbcw    $0,$6
ECEC:  B0 0C        jr      z,&HECF9
ECEE:  B7 9B        jr      &HEC8A
ECF0:  D6 40 0E 1D  pre     iz,&H1D0E
ECF4:  21 10        st      $16,(iz+$sx)
ECF6:  77 80 ED     cal     &HED80
ECF9:  41 05 03     sbc     $5,&H03
ECFC:  B5 13        jr      c,&HED10
ECFE:  D6 40 18 1E  pre     iz,&H1E18
ED02:  A1 1E        stw     $30,(iz+$sx)
ED04:  42 10 2B     ld      $16,&H2B
ED07:  77 24 B1     cal     &HB124
ED0A:  42 10 30     ld      $16,&H30
ED0D:  77 24 B1     cal     &HB124
ED10:  14 DF 04     pfl     $31,jr &HED16
ED13:  54 40 40     pfl     &H40
ED16:  F7           rtn   
ED17:  D6 40 5C 21  pre     iz,&H215C
ED1B:  BB 1E        sbcw    (iz+$sx),$30
ED1D:  B5 22        jr      c,&HED40
ED1F:  77 7A EE     cal     &HEE7A
ED22:  D6 40 18 1E  pre     iz,&H1E18
ED26:  BB 1E        sbcw    (iz+$sx),$30
ED28:  B5 17        jr      c,&HED40
ED2A:  82 60 14     ldw     $0,$20
ED2D:  D1 02 17 1D  ldw     $2,&H1D17
ED31:  A9 04        ldw     $4,(iz+$sx)
ED33:  77 4C 01     cal     &H014C
ED36:  D6 40 08 1D  pre     iz,&H1D08
ED3A:  BD 1E        adw     (iz+$sx),$30
ED3C:  B4 0D        jr      nz,&HED4A
ED3E:  B7 09        jr      &HED48
ED40:  D6 40 08 1D  pre     iz,&H1D08
ED44:  B9 1E        adcw    (iz+$sx),$30
ED46:  B4 03        jr      nz,&HED4A
ED48:  BD 1E        adw     (iz+$sx),$30
ED4A:  F7           rtn   
ED4B:  A6 01        phsw    $1
ED4D:  D6 00 58 21  pre     ix,&H2158
ED51:  A8 11        ldw     $17,(ix+$sx)
ED53:  D6 40 1A 1E  pre     iz,&H1E1A
ED57:  29 00        ld      $0,(iz+$sx)
ED59:  04 20        anc     $0,$sy
ED5B:  B4 08        jr      nz,&HED64
ED5D:  77 BF A4     cal     &HA4BF
ED60:  B5 0F        jr      c,&HED70
ED62:  B7 0A        jr      &HED6D
ED64:  11 70 11     ld      $16,($17)
ED67:  01 10        sbc     $16,$sx
ED69:  B0 06        jr      z,&HED70
ED6B:  BC 1E        adw     (ix+$sx),$30
ED6D:  14 DF 0E     pfl     $31,jr &HED7D
ED70:  D6 40 08 1D  pre     iz,&H1D08
ED74:  BB 1E        sbcw    (iz+$sx),$30
ED76:  B1 03        jr      nc,&HED7A
ED78:  BF 1E        sbw     (iz+$sx),$30
ED7A:  54 40 40     pfl     &H40
ED7D:  AE 00        ppsw    $0
ED7F:  F7           rtn   
ED80:  A6 01        phsw    $1
ED82:  D6 40 1A 1E  pre     iz,&H1E1A
ED86:  29 01        ld      $1,(iz+$sx)
ED88:  04 21        anc     $1,$sy
ED8A:  B4 20        jr      nz,&HEDAB
ED8C:  D6 40 58 21  pre     iz,&H2158
ED90:  A9 11        ldw     $17,(iz+$sx)
ED92:  96 51        pre     iz,$17
ED94:  69 00 03     ld      $0,(iz+&H03)
ED97:  41 00 07     sbc     $0,&H07
ED9A:  B4 0B        jr      nz,&HEDA6
ED9C:  D6 00 0E 1D  pre     ix,&H1D0E
EDA0:  22 3E        sti     $30,(ix+$sy)
EDA2:  20 10        st      $16,(ix+$sx)
EDA4:  B7 0C        jr      &HEDB1
EDA6:  77 59 A5     cal     &HA559
EDA9:  B7 07        jr      &HEDB1
EDAB:  D6 00 58 21  pre     ix,&H2158
EDAF:  BE 1E        sbw     (ix+$sx),$30
EDB1:  AE 00        ppsw    $0
EDB3:  F7           rtn   
EDB4:  A6 01        phsw    $1
EDB6:  44 00 80     anc     $0,&H80
EDB9:  B4 16        jr      nz,&HEDD0
EDBB:  D1 00 00 00  ldw     $0,&H0000
EDBF:  82 42        ldw     $2,$sz
EDC1:  42 04 36     ld      $4,&H36
EDC4:  42 05 55     ld      $5,&H55
EDC7:  42 06 06     ld      $6,&H06
EDCA:  42 07 04     ld      $7,&H04
EDCD:  02 A8 1A     ld      $8,$sy,jr &HEDE9
EDD0:  02 00        ld      $0,$sx
EDD2:  42 01 60     ld      $1,&H60
EDD5:  42 02 29     ld      $2,&H29
EDD8:  42 03 67     ld      $3,&H67
EDDB:  42 04 49     ld      $4,&H49
EDDE:  42 05 29     ld      $5,&H29
EDE1:  42 06 04     ld      $6,&H04
EDE4:  42 07 09     ld      $7,&H09
EDE7:  02 28        ld      $8,$sy
EDE9:  E6 08 E0     phsm    $8,8
EDEC:  77 72 0A     cal     &H0A72
EDEF:  EE 01 E0     ppsm    $1,8
EDF2:  B5 06        jr      c,&HEDF9
EDF4:  02 00        ld      $0,$sx
EDF6:  77 8B 16     cal     &H168B
EDF9:  AE 00        ppsw    $0
EDFB:  F7           rtn   
EDFC:  D6 40 17 1D  pre     iz,&H1D17
EE00:  A6 10        phsw    $16
EE02:  2A 10        ldi     $16,(ix+$sx)
EE04:  77 4B B4     cal     &HB44B
EE07:  B4 05        jr      nz,&HEE0D
EE09:  23 10        sti     $16,(iz+$sx)
EE0B:  B7 8A        jr      &HED96
EE0D:  21 1F        st      $31,(iz+$sx)
EE0F:  2C B0        ldd     $16,(ix-$sy)
EE11:  AE 0F        ppsw    $15
EE13:  D6 40 17 1D  pre     iz,&H1D17
EE17:  3B 1F        sbc     (iz+$sx),$31
EE19:  B0 5F        jr      z,&HEE79
EE1B:  9E 00        gre     ix,$0
EE1D:  A6 01        phsw    $1
EE1F:  D6 40 17 1D  pre     iz,&H1D17
EE23:  77 AC 07     cal     &H07AC
EE26:  D6 40 1A 1E  pre     iz,&H1E1A
EE2A:  29 13        ld      $19,(iz+$sx)
EE2C:  42 04 35     ld      $4,&H35
EE2F:  44 13 10     anc     $19,&H10
EE32:  B0 03        jr      z,&HEE36
EE34:  08 24        ad      $4,$sy
EE36:  42 05 55     ld      $5,&H55
EE39:  42 06 06     ld      $6,&H06
EE3C:  42 07 04     ld      $7,&H04
EE3F:  02 28        ld      $8,$sy
EE41:  D1 00 00 00  ldw     $0,&H0000
EE45:  82 42        ldw     $2,$sz
EE47:  E6 08 E0     phsm    $8,8
EE4A:  77 72 0A     cal     &H0A72
EE4D:  EE 01 E0     ppsm    $1,8
EE50:  B5 13        jr      c,&HEE64
EE52:  44 13 10     anc     $19,&H10
EE55:  B4 05        jr      nz,&HEE5B
EE57:  82 EF 02 1B  ldw     $15,$2,jr &HEE75
EE5B:  26 13        phs     $19
EE5D:  02 00        ld      $0,$sx
EE5F:  77 8B 16     cal     &H168B
EE62:  2E 13        pps     $19
EE64:  77 68 F5     cal     &HF568
EE67:  44 13 10     anc     $19,&H10
EE6A:  B0 0A        jr      z,&HEE75
EE6C:  44 10 80     anc     $16,&H80
EE6F:  B0 05        jr      z,&HEE75
EE71:  D1 0F 00 80  ldw     $15,&H8000
EE75:  AE 00        ppsw    $0
EE77:  96 00        pre     ix,$0
EE79:  F7           rtn   
EE7A:  E6 03 60     phsm    $3,4
EE7D:  D6 40 7F 1F  pre     iz,&H1F7F
EE81:  A9 02        ldw     $2,(iz+$sx)
EE83:  D6 40 1B 1E  pre     iz,&H1E1B
EE87:  29 00        ld      $0,(iz+$sx)
EE89:  42 01 02     ld      $1,&H02
EE8C:  04 20        anc     $0,$sy
EE8E:  B4 05        jr      nz,&HEE94
EE90:  3D 01        ad      (iz+$sx),$1
EE92:  B7 05        jr      &HEE98
EE94:  3F 01        sb      (iz+$sx),$1
EE96:  09 20        sb      $0,$sy
EE98:  96 42        pre     iz,$2
EE9A:  A9 54        ldw     $20,(iz+$sz)
EE9C:  EE 00 60     ppsm    $0,4
EE9F:  F7           rtn   
EEA0:  84 71 11     ancw    $17,$17
EEA3:  30 62 FE     jp      z,&HFE62
EEA6:  82 62 11     ldw     $2,$17
EEA9:  D1 00 42 20  ldw     $0,&H2042
EEAD:  89 42        sbw     $2,$sz
EEAF:  35 62 FE     jp      c,&HFE62
EEB2:  D1 00 0D 00  ldw     $0,&H000D
EEB6:  81 42        sbcw    $2,$sz
EEB8:  31 62 FE     jp      nc,&HFE62
EEBB:  44 02 03     anc     $2,&H03
EEBE:  34 62 FE     jp      nz,&HFE62
EEC1:  11 60 11     ld      $0,($17)
EEC4:  01 00        sbc     $0,$sx
EEC6:  34 62 FE     jp      nz,&HFE62
EEC9:  77 E8 EE     cal     &HEEE8
EECC:  41 0C FF     sbc     $12,&HFF
EECF:  F0           rtn     z
EED0:  96 51        pre     iz,$17
EED2:  29 20        ld      $0,(iz+$sy)
EED4:  4C 00 03     an      $0,&H03
EED7:  41 00 03     sbc     $0,&H03
EEDA:  F0           rtn     z
EEDB:  04 20        anc     $0,$sy
EEDD:  1C 40        gfl     $0
EEDF:  4C 00 80     an      $0,&H80
EEE2:  01 4C        sbc     $12,$sz
EEE4:  34 62 FE     jp      nz,&HFE62
EEE7:  F7           rtn   
EEE8:  96 51        pre     iz,$17
EEEA:  A9 20        ldw     $0,(iz+$sy)
EEEC:  D6 00 52 20  pre     ix,&H2052
EEF0:  A0 00        stw     $0,(ix+$sx)
EEF2:  4E 00 20     or      $0,&H20
EEF5:  21 20        st      $0,(iz+$sy)
EEF7:  F7           rtn   
EEF8:  D6 00 52 20  pre     ix,&H2052
EEFC:  A8 00        ldw     $0,(ix+$sx)
EEFE:  96 51        pre     iz,$17
EF00:  A9 22        ldw     $2,(iz+$sy)
EF02:  4C 02 DF     an      $2,&HDF
EF05:  8E 42        orw     $2,$sz
EF07:  A1 22        stw     $2,(iz+$sy)
EF09:  F7           rtn   
EF0A:  D6 40 42 20  pre     iz,&H2042
EF0E:  42 01 50     ld      $1,&H50
EF11:  42 00 FF     ld      $0,&HFF
EF14:  23 00        sti     $0,(iz+$sx)
EF16:  09 21        sb      $1,$sy
EF18:  B4 85        jr      nz,&HEE9E
EF1A:  F7           rtn   
EF1B:  D6 40 54 20  pre     iz,&H2054
EF1F:  21 1F        st      $31,(iz+$sx)
EF21:  21 3F        st      $31,(iz+$sy)
EF23:  D6 40 56 20  pre     iz,&H2056
EF27:  21 1F        st      $31,(iz+$sx)
EF29:  F7           rtn   
EF2A:  89 40        sbw     $0,$sz
EF2C:  D6 00 12 1D  pre     ix,&H1D12
EF30:  A0 00        stw     $0,(ix+$sx)
EF32:  D6 00 F3 1C  pre     ix,&H1CF3
EF36:  20 1F        st      $31,(ix+$sx)
EF38:  D6 00 2A 20  pre     ix,&H202A
EF3C:  A8 00        ldw     $0,(ix+$sx)
EF3E:  97 00        pre     ss,$0
EF40:  D6 00 2C 20  pre     ix,&H202C
EF44:  A8 00        ldw     $0,(ix+$sx)
EF46:  96 60        pre     us,$0
EF48:  37 29 A1     jp      &HA129
EF4B:  37 5C FE     jp      &HFE5C
EF4E:  9F 00        gre     ss,$0
EF50:  D6 00 32 20  pre     ix,&H2032
EF54:  A0 00        stw     $0,(ix+$sx)
EF56:  9E 60        gre     us,$0
EF58:  D6 00 34 20  pre     ix,&H2034
EF5C:  A0 00        stw     $0,(ix+$sx)
EF5E:  D6 00 3E 20  pre     ix,&H203E
EF62:  20 1E        st      $30,(ix+$sx)
EF64:  37 F4 A6     jp      &HA6F4
EF67:  D6 00 32 20  pre     ix,&H2032
EF6B:  A8 02        ldw     $2,(ix+$sx)
EF6D:  97 02        pre     ss,$2
EF6F:  D6 00 34 20  pre     ix,&H2034
EF73:  A8 02        ldw     $2,(ix+$sx)
EF75:  96 62        pre     us,$2
EF77:  D6 00 3E 20  pre     ix,&H203E
EF7B:  20 1F        st      $31,(ix+$sx)
EF7D:  F7           rtn   
EF7E:  77 51 FB     cal     &HFB51
EF81:  D6 40 81 1F  pre     iz,&H1F81
EF85:  D1 00 00 00  ldw     $0,&H0000
EF89:  A1 00        stw     $0,(iz+$sx)
EF8B:  77 D8 FC     cal     &HFCD8
EF8E:  A9 48        ldw     $8,(iz+$sz)
EF90:  77 FA EF     cal     &HEFFA
EF93:  B5 07        jr      c,&HEF9B
EF95:  D6 40 81 1F  pre     iz,&H1F81
EF99:  A1 06        stw     $6,(iz+$sx)
EF9B:  77 66 FB     cal     &HFB66
EF9E:  F7           rtn   
EF9F:  77 51 FB     cal     &HFB51
EFA2:  D6 40 81 1F  pre     iz,&H1F81
EFA6:  D1 00 00 00  ldw     $0,&H0000
EFAA:  A1 00        stw     $0,(iz+$sx)
EFAC:  77 D8 FC     cal     &HFCD8
EFAF:  AB 45        ldiw    $5,(iz+$sz)
EFB1:  A9 0F        ldw     $15,(iz+$sx)
EFB3:  77 30 0A     cal     &H0A30
EFB6:  B5 1B        jr      c,&HEFD2
EFB8:  82 48        ldw     $8,$sz
EFBA:  77 FA EF     cal     &HEFFA
EFBD:  B5 14        jr      c,&HEFD2
EFBF:  82 60 06     ldw     $0,$6
EFC2:  82 62 08     ldw     $2,$8
EFC5:  A6 07        phsw    $7
EFC7:  77 57 01     cal     &H0157
EFCA:  AE 06        ppsw    $6
EFCC:  D6 40 81 1F  pre     iz,&H1F81
EFD0:  A1 06        stw     $6,(iz+$sx)
EFD2:  77 66 FB     cal     &HFB66
EFD5:  F7           rtn   
EFD6:  77 51 FB     cal     &HFB51
EFD9:  D6 40 81 1F  pre     iz,&H1F81
EFDD:  D1 00 FF FF  ldw     $0,&HFFFF
EFE1:  A1 00        stw     $0,(iz+$sx)
EFE3:  77 D8 FC     cal     &HFCD8
EFE6:  A9 46        ldw     $6,(iz+$sz)
EFE8:  77 8F F0     cal     &HF08F
EFEB:  B5 0A        jr      c,&HEFF6
EFED:  77 C7 F0     cal     &HF0C7
EFF0:  D6 40 81 1F  pre     iz,&H1F81
EFF4:  BD 1E        adw     (iz+$sx),$30
EFF6:  77 66 FB     cal     &HFB66
EFF9:  F7           rtn   
EFFA:  84 68 08     ancw    $8,$8
EFFD:  B4 03        jr      nz,&HF001
EFFF:  82 28        ldw     $8,$sy
F001:  D6 00 DA 1C  pre     ix,&H1CDA
F005:  A8 00        ldw     $0,(ix+$sx)
F007:  96 00        pre     ix,$0
F009:  D6 40 3F 20  pre     iz,&H203F
F00D:  BB 00        sbcw    (iz+$sx),$0
F00F:  B4 09        jr      nz,&HF019
F011:  D6 40 E2 1C  pre     iz,&H1CE2
F015:  A9 06        ldw     $6,(iz+$sx)
F017:  B7 28        jr      &HF040
F019:  D1 06 27 20  ldw     $6,&H2027
F01D:  91 66 06     ldw     $6,($6)
F020:  A8 02        ldw     $2,(ix+$sx)
F022:  89 62 06     sbw     $2,$6
F025:  B4 13        jr      nz,&HF039
F027:  AA 06        ldiw    $6,(ix+$sx)
F029:  AA 04        ldiw    $4,(ix+$sx)
F02B:  88 66 04     adw     $6,$4
F02E:  9E 00        gre     ix,$0
F030:  BB 00        sbcw    (iz+$sx),$0
F032:  B0 0D        jr      z,&HF040
F034:  A8 02        ldw     $2,(ix+$sx)
F036:  89 62 06     sbw     $2,$6
F039:  81 62 08     sbcw    $2,$8
F03C:  B5 96        jr      c,&HEFD3
F03E:  B7 15        jr      &HF054
F040:  D6 40 E4 1C  pre     iz,&H1CE4
F044:  A9 02        ldw     $2,(iz+$sx)
F046:  89 62 06     sbw     $2,$6
F049:  81 62 08     sbcw    $2,$8
F04C:  B5 0C        jr      c,&HF059
F04E:  D6 40 E2 1C  pre     iz,&H1CE2
F052:  BD 08        adw     (iz+$sx),$8
F054:  77 5A F0     cal     &HF05A
F057:  14 5F        pfl     $31
F059:  F7           rtn   
F05A:  D6 40 3F 20  pre     iz,&H203F
F05E:  A9 02        ldw     $2,(iz+$sx)
F060:  96 02        pre     ix,$2
F062:  D1 04 04 00  ldw     $4,&H0004
F066:  BD 04        adw     (iz+$sx),$4
F068:  D1 04 DC 1C  ldw     $4,&H1CDC
F06C:  91 64 04     ldw     $4,($4)
F06F:  BB 04        sbcw    (iz+$sx),$4
F071:  31 06 FE     jp      nc,&HFE06
F074:  81 42        sbcw    $2,$sz
F076:  B0 13        jr      z,&HF08A
F078:  A9 04        ldw     $4,(iz+$sx)
F07A:  96 44        pre     iz,$4
F07C:  AC A3        lddw    $3,(ix-$sy)
F07E:  A5 A3        stdw    $3,(iz-$sy)
F080:  AC A3        lddw    $3,(ix-$sy)
F082:  A5 A3        stdw    $3,(iz-$sy)
F084:  9E 02        gre     ix,$2
F086:  81 42        sbcw    $2,$sz
F088:  B4 8D        jr      nz,&HF016
F08A:  A2 06        stiw    $6,(ix+$sx)
F08C:  A0 08        stw     $8,(ix+$sx)
F08E:  F7           rtn   
F08F:  D6 40 27 20  pre     iz,&H2027
F093:  BB 06        sbcw    (iz+$sx),$6
F095:  B0 0D        jr      z,&HF0A3
F097:  B1 2B        jr      nc,&HF0C3
F099:  D6 40 E4 1C  pre     iz,&H1CE4
F09D:  BB 06        sbcw    (iz+$sx),$6
F09F:  B0 23        jr      z,&HF0C3
F0A1:  B5 21        jr      c,&HF0C3
F0A3:  D6 40 DA 1C  pre     iz,&H1CDA
F0A7:  A9 00        ldw     $0,(iz+$sx)
F0A9:  D1 04 04 00  ldw     $4,&H0004
F0AD:  D6 40 3F 20  pre     iz,&H203F
F0B1:  BB 00        sbcw    (iz+$sx),$0
F0B3:  B0 0F        jr      z,&HF0C3
F0B5:  91 42        ldw     $2,($sz)
F0B7:  81 66 02     sbcw    $6,$2
F0BA:  B0 05        jr      z,&HF0C0
F0BC:  88 E0 04 8E  adw     $0,$4,jr &HF04D
F0C0:  14 DF 04     pfl     $31,jr &HF0C6
F0C3:  54 40 40     pfl     &H40
F0C6:  F7           rtn   
F0C7:  96 00        pre     ix,$0
F0C9:  D1 04 04 00  ldw     $4,&H0004
F0CD:  88 60 04     adw     $0,$4
F0D0:  D6 40 3F 20  pre     iz,&H203F
F0D4:  BB 00        sbcw    (iz+$sx),$0
F0D6:  B4 0F        jr      nz,&HF0E6
F0D8:  E8 E0 64     ldm     $0,(ix-$4),4
F0DB:  88 60 02     adw     $0,$2
F0DE:  D6 40 E2 1C  pre     iz,&H1CE2
F0E2:  A1 00        stw     $0,(iz+$sx)
F0E4:  B7 11        jr      &HF0F6
F0E6:  A9 04        ldw     $4,(iz+$sx)
F0E8:  96 40        pre     iz,$0
F0EA:  EB 00 60     ldim    $0,(iz+$sx),4
F0ED:  E2 00 60     stim    $0,(ix+$sx),4
F0F0:  9E 40        gre     iz,$0
F0F2:  81 44        sbcw    $4,$sz
F0F4:  B4 8B        jr      nz,&HF080
F0F6:  9E 00        gre     ix,$0
F0F8:  D6 40 3F 20  pre     iz,&H203F
F0FC:  A1 00        stw     $0,(iz+$sx)
F0FE:  D6 40 DA 1C  pre     iz,&H1CDA
F102:  BB 00        sbcw    (iz+$sx),$0
F104:  B4 0D        jr      nz,&HF112
F106:  D6 40 27 20  pre     iz,&H2027
F10A:  A9 00        ldw     $0,(iz+$sx)
F10C:  D6 40 E2 1C  pre     iz,&H1CE2
F110:  A1 00        stw     $0,(iz+$sx)
F112:  F7           rtn   
F113:  77 51 FB     cal     &HFB51
F116:  77 CC FC     cal     &HFCCC
F119:  A8 40        ldw     $0,(ix+$sz)
F11B:  96 00        pre     ix,$0
F11D:  89 62 02     sbw     $2,$2
F120:  2A 04        ldi     $4,(ix+$sx)
F122:  01 04        sbc     $4,$sx
F124:  B0 04        jr      z,&HF129
F126:  88 A2 88     adw     $2,$sy,jr &HF0B0
F129:  D6 00 81 1F  pre     ix,&H1F81
F12D:  A0 02        stw     $2,(ix+$sx)
F12F:  77 66 FB     cal     &HFB66
F132:  F7           rtn   
F133:  77 51 FB     cal     &HFB51
F136:  77 CC FC     cal     &HFCCC
F139:  42 00 08     ld      $0,&H08
F13C:  A8 40        ldw     $0,(ix+$sz)
F13E:  96 40        pre     iz,$0
F140:  42 00 06     ld      $0,&H06
F143:  A8 40        ldw     $0,(ix+$sz)
F145:  D6 00 81 1F  pre     ix,&H1F81
F149:  A0 00        stw     $0,(ix+$sx)
F14B:  96 00        pre     ix,$0
F14D:  2B 00        ldi     $0,(iz+$sx)
F14F:  22 00        sti     $0,(ix+$sx)
F151:  01 00        sbc     $0,$sx
F153:  B4 87        jr      nz,&HF0DB
F155:  77 66 FB     cal     &HFB66
F158:  F7           rtn   
F159:  77 51 FB     cal     &HFB51
F15C:  77 CC FC     cal     &HFCCC
F15F:  42 00 08     ld      $0,&H08
F162:  A8 40        ldw     $0,(ix+$sz)
F164:  96 40        pre     iz,$0
F166:  42 00 06     ld      $0,&H06
F169:  A8 40        ldw     $0,(ix+$sz)
F16B:  D6 00 81 1F  pre     ix,&H1F81
F16F:  A0 00        stw     $0,(ix+$sx)
F171:  96 00        pre     ix,$0
F173:  2A 00        ldi     $0,(ix+$sx)
F175:  01 00        sbc     $0,$sx
F177:  B4 85        jr      nz,&HF0FD
F179:  2C A0        ldd     $0,(ix-$sy)
F17B:  2B 00        ldi     $0,(iz+$sx)
F17D:  22 00        sti     $0,(ix+$sx)
F17F:  01 00        sbc     $0,$sx
F181:  B4 87        jr      nz,&HF109
F183:  77 66 FB     cal     &HFB66
F186:  F7           rtn   
F187:  77 51 FB     cal     &HFB51
F18A:  77 CC FC     cal     &HFCCC
F18D:  AA 40        ldiw    $0,(ix+$sz)
F18F:  96 40        pre     iz,$0
F191:  A8 00        ldw     $0,(ix+$sx)
F193:  96 00        pre     ix,$0
F195:  89 62 02     sbw     $2,$2
F198:  2A 00        ldi     $0,(ix+$sx)
F19A:  2B 01        ldi     $1,(iz+$sx)
F19C:  01 41        sbc     $1,$sz
F19E:  B5 09        jr      c,&HF1A8
F1A0:  B4 0A        jr      nz,&HF1AB
F1A2:  01 01        sbc     $1,$sx
F1A4:  B0 09        jr      z,&HF1AE
F1A6:  B7 8F        jr      &HF136
F1A8:  89 A2 04     sbw     $2,$sy,jr &HF1AE
F1AB:  88 A2 01     adw     $2,$sy,jr &HF1AE
F1AE:  D6 00 81 1F  pre     ix,&H1F81
F1B2:  A0 02        stw     $2,(ix+$sx)
F1B4:  77 66 FB     cal     &HFB66
F1B7:  F7           rtn   
F1B8:  77 51 FB     cal     &HFB51
F1BB:  77 CC FC     cal     &HFCCC
F1BE:  AA 42        ldiw    $2,(ix+$sz)
F1C0:  A8 00        ldw     $0,(ix+$sx)
F1C2:  96 02        pre     ix,$2
F1C4:  9E 02        gre     ix,$2
F1C6:  2A 01        ldi     $1,(ix+$sx)
F1C8:  01 41        sbc     $1,$sz
F1CA:  B0 08        jr      z,&HF1D3
F1CC:  01 01        sbc     $1,$sx
F1CE:  B4 8B        jr      nz,&HF15A
F1D0:  89 62 02     sbw     $2,$2
F1D3:  D6 00 81 1F  pre     ix,&H1F81
F1D7:  A0 02        stw     $2,(ix+$sx)
F1D9:  77 66 FB     cal     &HFB66
F1DC:  F7           rtn   
F1DD:  77 51 FB     cal     &HFB51
F1E0:  77 CC FC     cal     &HFCCC
F1E3:  A8 4F        ldw     $15,(ix+$sz)
F1E5:  44 10 80     anc     $16,&H80
F1E8:  B0 04        jr      z,&HF1ED
F1EA:  77 0D FA     cal     &HFA0D
F1ED:  D6 00 81 1F  pre     ix,&H1F81
F1F1:  A0 0F        stw     $15,(ix+$sx)
F1F3:  77 66 FB     cal     &HFB66
F1F6:  F7           rtn   
F1F7:  77 51 FB     cal     &HFB51
F1FA:  CF 60 E0     xrm     $0,$0,8
F1FD:  D6 00 81 1F  pre     ix,&H1F81
F201:  E0 00 E0     stm     $0,(ix+$sx),8
F204:  77 CC FC     cal     &HFCCC
F207:  42 00 0E     ld      $0,&H0E
F20A:  E8 4A E0     ldm     $10,(ix+$sz),8
F20D:  77 76 F3     cal     &HF376
F210:  02 60 0A     ld      $0,$10
F213:  C2 61 EB     ldm     $1,$11,8
F216:  42 09 06     ld      $9,&H06
F219:  E8 6A E9     ldm     $10,(ix+$9),8
F21C:  77 76 F3     cal     &HF376
F21F:  77 2E 09     cal     &H092E
F222:  77 1D 06     cal     &H061D
F225:  77 7E F3     cal     &HF37E
F228:  D6 00 81 1F  pre     ix,&H1F81
F22C:  E0 0A E0     stm     $10,(ix+$sx),8
F22F:  77 66 FB     cal     &HFB66
F232:  F7           rtn   
F233:  77 51 FB     cal     &HFB51
F236:  77 CC FC     cal     &HFCCC
F239:  A8 40        ldw     $0,(ix+$sz)
F23B:  D1 02 03 00  ldw     $2,&H0003
F23F:  81 60 02     sbcw    $0,$2
F242:  31 42 FE     jp      nc,&HFE42
F245:  D6 00 32 11  pre     ix,&H1132
F249:  20 00        st      $0,(ix+$sx)
F24B:  77 66 FB     cal     &HFB66
F24E:  F7           rtn   
F24F:  77 51 FB     cal     &HFB51
F252:  D6 00 81 1F  pre     ix,&H1F81
F256:  CF 6A EA     xrm     $10,$10,8
F259:  E0 0A E0     stm     $10,(ix+$sx),8
F25C:  77 CC FC     cal     &HFCCC
F25F:  E8 4A E0     ldm     $10,(ix+$sz),8
F262:  77 76 F3     cal     &HF376
F265:  D6 00 41 20  pre     ix,&H2041
F269:  28 00        ld      $0,(ix+$sx)
F26B:  41 00 67     sbc     $0,&H67
F26E:  B4 07        jr      nz,&HF276
F270:  77 74 08     cal     &H0874
F273:  37 0D F3     jp      &HF30D
F276:  41 00 68     sbc     $0,&H68
F279:  B4 07        jr      nz,&HF281
F27B:  77 3C 08     cal     &H083C
F27E:  37 0D F3     jp      &HF30D
F281:  41 00 69     sbc     $0,&H69
F284:  B4 07        jr      nz,&HF28C
F286:  77 05 08     cal     &H0805
F289:  37 0D F3     jp      &HF30D
F28C:  41 00 6B     sbc     $0,&H6B
F28F:  B4 06        jr      nz,&HF296
F291:  77 72 08     cal     &H0872
F294:  B7 78        jr      &HF30D
F296:  41 00 6C     sbc     $0,&H6C
F299:  B4 06        jr      nz,&HF2A0
F29B:  77 78 08     cal     &H0878
F29E:  B7 6E        jr      &HF30D
F2A0:  41 00 6D     sbc     $0,&H6D
F2A3:  B4 06        jr      nz,&HF2AA
F2A5:  77 E1 08     cal     &H08E1
F2A8:  B7 64        jr      &HF30D
F2AA:  41 00 6E     sbc     $0,&H6E
F2AD:  B4 06        jr      nz,&HF2B4
F2AF:  77 DF 08     cal     &H08DF
F2B2:  B7 5A        jr      &HF30D
F2B4:  41 00 6F     sbc     $0,&H6F
F2B7:  B4 06        jr      nz,&HF2BE
F2B9:  77 E3 08     cal     &H08E3
F2BC:  B7 50        jr      &HF30D
F2BE:  41 00 71     sbc     $0,&H71
F2C1:  B4 06        jr      nz,&HF2C8
F2C3:  77 83 14     cal     &H1483
F2C6:  B7 46        jr      &HF30D
F2C8:  41 00 7A     sbc     $0,&H7A
F2CB:  B4 06        jr      nz,&HF2D2
F2CD:  77 7F 14     cal     &H147F
F2D0:  B7 3C        jr      &HF30D
F2D2:  41 00 7B     sbc     $0,&H7B
F2D5:  B4 06        jr      nz,&HF2DC
F2D7:  77 6D 06     cal     &H066D
F2DA:  B7 32        jr      &HF30D
F2DC:  41 00 7C     sbc     $0,&H7C
F2DF:  B4 06        jr      nz,&HF2E6
F2E1:  77 87 14     cal     &H1487
F2E4:  B7 28        jr      &HF30D
F2E6:  41 00 7E     sbc     $0,&H7E
F2E9:  B4 06        jr      nz,&HF2F0
F2EB:  77 8E 14     cal     &H148E
F2EE:  B7 1E        jr      &HF30D
F2F0:  41 00 80     sbc     $0,&H80
F2F3:  B4 06        jr      nz,&HF2FA
F2F5:  77 8A 14     cal     &H148A
F2F8:  B7 14        jr      &HF30D
F2FA:  41 00 81     sbc     $0,&H81
F2FD:  B4 06        jr      nz,&HF304
F2FF:  77 92 14     cal     &H1492
F302:  B7 0A        jr      &HF30D
F304:  41 00 8A     sbc     $0,&H8A
F307:  34 5D FD     jp      nz,&HFD5D
F30A:  77 07 08     cal     &H0807
F30D:  77 7E F3     cal     &HF37E
F310:  D6 00 81 1F  pre     ix,&H1F81
F314:  E0 0A E0     stm     $10,(ix+$sx),8
F317:  77 66 FB     cal     &HFB66
F31A:  F7           rtn   
F31B:  77 51 FB     cal     &HFB51
F31E:  77 CC FC     cal     &HFCCC
F321:  A8 40        ldw     $0,(ix+$sz)
F323:  D1 02 02 00  ldw     $2,&H0002
F327:  81 60 02     sbcw    $0,$2
F32A:  31 42 FE     jp      nc,&HFE42
F32D:  81 60 1E     sbcw    $0,$30
F330:  B0 06        jr      z,&HF337
F332:  77 BA 33     cal     &H33BA
F335:  B7 04        jr      &HF33A
F337:  77 B3 33     cal     &H33B3
F33A:  77 66 FB     cal     &HFB66
F33D:  F7           rtn   
F33E:  77 91 29     cal     &H2991
F341:  77 DF 2A     cal     &H2ADF
F344:  F7           rtn   
F345:  77 51 FB     cal     &HFB51
F348:  77 CC FC     cal     &HFCCC
F34B:  E8 40 60     ldm     $0,(ix+$sz),4
F34E:  D1 04 20 00  ldw     $4,&H0020
F352:  81 60 04     sbcw    $0,$4
F355:  31 42 FE     jp      nc,&HFE42
F358:  D1 04 08 00  ldw     $4,&H0008
F35C:  81 62 04     sbcw    $2,$4
F35F:  31 42 FE     jp      nc,&HFE42
F362:  1A 22        diu     $2
F364:  18 62        biu     $2
F366:  0E 60 02     or      $0,$2
F369:  D6 00 01 11  pre     ix,&H1101
F36D:  20 00        st      $0,(ix+$sx)
F36F:  77 6A 95     cal     &H956A
F372:  77 66 FB     cal     &HFB66
F375:  F7           rtn   
F376:  02 12        ld      $18,$sx
F378:  DA 30 40     dium    $16,3
F37B:  1A 10        did     $16
F37D:  F7           rtn   
F37E:  1A 30        diu     $16
F380:  DA 12 40     didm    $18,3
F383:  F7           rtn   
F384:  89 6A 0A     sbw     $10,$10
F387:  81 71 0A     sbcw    $17,$10
F38A:  B0 79        jr      z,&HF404
F38C:  02 6C 0D     ld      $12,$13
F38F:  4C 0C 0F     an      $12,&H0F
F392:  41 0C 05     sbc     $12,&H05
F395:  B5 21        jr      c,&HF3B7
F397:  D1 00 10 00  ldw     $0,&H0010
F39B:  89 62 02     sbw     $2,$2
F39E:  C8 4D 60     adbm    $13,$sz,4
F3A1:  41 10 10     sbc     $16,&H10
F3A4:  B5 12        jr      c,&HF3B7
F3A6:  DA 10 60     didm    $16,4
F3A9:  82 20        ldw     $0,$sy
F3AB:  8A 51        adbw    $17,$sz
F3AD:  41 12 02     sbc     $18,&H02
F3B0:  B0 53        jr      z,&HF404
F3B2:  41 12 07     sbc     $18,&H07
F3B5:  B0 4E        jr      z,&HF404
F3B7:  02 6A 11     ld      $10,$17
F3BA:  02 0B        ld      $11,$sx
F3BC:  01 32        sbc     $18,$sy
F3BE:  B0 0B        jr      z,&HF3CA
F3C0:  41 12 06     sbc     $18,&H06
F3C3:  B0 06        jr      z,&HF3CA
F3C5:  02 0A        ld      $10,$sx
F3C7:  0B 6A 11     sbb     $10,$17
F3CA:  41 0A 10     sbc     $10,&H10
F3CD:  B5 08        jr      c,&HF3D6
F3CF:  4B 0A 10     sbb     $10,&H10
F3D2:  48 8B 0A 8B  ad      $11,&H0A,jr &HF360
F3D6:  08 6B 0A     ad      $11,$10
F3D9:  41 0B 40     sbc     $11,&H40
F3DC:  B1 27        jr      nc,&HF404
F3DE:  01 32        sbc     $18,$sy
F3E0:  B4 05        jr      nz,&HF3E6
F3E2:  4E 8B 40 12  or      $11,&H40,jr &HF3F7
F3E6:  41 12 05     sbc     $18,&H05
F3E9:  B4 05        jr      nz,&HF3EF
F3EB:  4E 8B 80 09  or      $11,&H80,jr &HF3F7
F3EF:  41 12 06     sbc     $18,&H06
F3F2:  B4 04        jr      nz,&HF3F7
F3F4:  4E 0B C0     or      $11,&HC0
F3F7:  02 72 0B     ld      $18,$11
F3FA:  DA 2D 80     dium    $13,5
F3FD:  DA 2D 80     dium    $13,5
F400:  DA 2D 80     dium    $13,5
F403:  F7           rtn   
F404:  89 6F 0F     sbw     $15,$15
F407:  89 71 11     sbw     $17,$17
F40A:  F7           rtn   
F40B:  01 12        sbc     $18,$sx
F40D:  B0 54        jr      z,&HF462
F40F:  02 0E        ld      $14,$sx
F411:  DA 11 80     didm    $17,5
F414:  DA 11 80     didm    $17,5
F417:  DA 11 80     didm    $17,5
F41A:  02 6A 12     ld      $10,$18
F41D:  4C 0A 3F     an      $10,&H3F
F420:  41 0A 0A     sbc     $10,&H0A
F423:  B5 08        jr      c,&HF42C
F425:  49 0A 0A     sb      $10,&H0A
F428:  4A 91 10 8B  adb     $17,&H10,jr &HF3B6
F42C:  0A 71 0A     adb     $17,$10
F42F:  44 12 40     anc     $18,&H40
F432:  B4 09        jr      nz,&HF43C
F434:  02 0A        ld      $10,$sx
F436:  0B 6A 11     sbb     $10,$17
F439:  02 71 0A     ld      $17,$10
F43C:  4C 12 C0     an      $18,&HC0
F43F:  B0 1B        jr      z,&HF45B
F441:  41 12 40     sbc     $18,&H40
F444:  B4 05        jr      nz,&HF44A
F446:  42 92 01 12  ld      $18,&H01,jr &HF45B
F44A:  41 12 80     sbc     $18,&H80
F44D:  B4 05        jr      nz,&HF453
F44F:  42 92 05 09  ld      $18,&H05,jr &HF45B
F453:  41 12 C0     sbc     $18,&HC0
F456:  B4 04        jr      nz,&HF45B
F458:  42 12 06     ld      $18,&H06
F45B:  89 6A 0A     sbw     $10,$10
F45E:  09 6C 0C     sb      $12,$12
F461:  F7           rtn   
F462:  CF 6A EA     xrm     $10,$10,8
F465:  F7           rtn   
F466:  02 10        ld      $16,$sx
F468:  F7           rtn   
F469:  44 0F 80     anc     $15,&H80
F46C:  B0 05        jr      z,&HF472
F46E:  42 90 FF 03  ld      $16,&HFF,jr &HF474
F472:  02 10        ld      $16,$sx
F474:  F7           rtn   
F475:  44 0F 80     anc     $15,&H80
F478:  B0 0A        jr      z,&HF483
F47A:  42 10 FF     ld      $16,&HFF
F47D:  D1 11 FF FF  ldw     $17,&HFFFF
F481:  B7 06        jr      &HF488
F483:  02 10        ld      $16,$sx
F485:  89 71 11     sbw     $17,$17
F488:  F7           rtn   
F489:  77 69 F4     cal     &HF469
F48C:  77 97 0A     cal     &H0A97
F48F:  F7           rtn   
F490:  02 10        ld      $16,$sx
F492:  89 71 11     sbw     $17,$17
F495:  F7           rtn   
F496:  77 66 F4     cal     &HF466
F499:  77 AD F4     cal     &HF4AD
F49C:  F7           rtn   
F49D:  F7           rtn   
F49E:  44 10 80     anc     $16,&H80
F4A1:  B0 07        jr      z,&HF4A9
F4A3:  D1 11 FF FF  ldw     $17,&HFFFF
F4A7:  B7 04        jr      &HF4AC
F4A9:  89 71 11     sbw     $17,$17
F4AC:  F7           rtn   
F4AD:  77 97 0A     cal     &H0A97
F4B0:  F7           rtn   
F4B1:  89 71 11     sbw     $17,$17
F4B4:  F7           rtn   
F4B5:  89 6A 0A     sbw     $10,$10
F4B8:  89 6C 0C     sbw     $12,$12
F4BB:  89 63 03     sbw     $3,$3
F4BE:  81 6F 03     sbcw    $15,$3
F4C1:  B0 15        jr      z,&HF4D7
F4C3:  82 63 0F     ldw     $3,$15
F4C6:  77 B2 0A     cal     &H0AB2
F4C9:  D1 11 04 01  ldw     $17,&H0104
F4CD:  44 10 0F     anc     $16,&H0F
F4D0:  F4           rtn     nz
F4D1:  DA 2E 40     dium    $14,3
F4D4:  0B B1 89     sbb     $17,$sy,jr &HF45F
F4D7:  89 6E 0E     sbw     $14,$14
F4DA:  89 70 10     sbw     $16,$16
F4DD:  09 72 12     sb      $18,$18
F4E0:  F7           rtn   
F4E1:  A6 12        phsw    $18
F4E3:  77 B5 F4     cal     &HF4B5
F4E6:  AE 03        ppsw    $3
F4E8:  89 40        sbw     $0,$sz
F4EA:  81 43        sbcw    $3,$sz
F4EC:  F0           rtn     z
F4ED:  E6 1D E0     phsm    $29,8
F4F0:  E6 15 40     phsm    $21,3
F4F3:  26 12        phs     $18
F4F5:  E6 11 E0     phsm    $17,8
F4F8:  82 6F 03     ldw     $15,$3
F4FB:  77 97 0A     cal     &H0A97
F4FE:  02 00        ld      $0,$sx
F500:  89 61 01     sbw     $1,$1
F503:  D1 03 00 36  ldw     $3,&H3600
F507:  D1 05 55 06  ldw     $5,&H0655
F50B:  D1 07 04 01  ldw     $7,&H0104
F50F:  77 07 06     cal     &H0607
F512:  EE 00 E0     ppsm    $0,8
F515:  2E 08        pps     $8
F517:  77 DA 05     cal     &H05DA
F51A:  EE 13 40     ppsm    $19,3
F51D:  EE 16 E0     ppsm    $22,8
F520:  F7           rtn   
F521:  A6 12        phsw    $18
F523:  77 B5 F4     cal     &HF4B5
F526:  AE 03        ppsw    $3
F528:  89 40        sbw     $0,$sz
F52A:  81 43        sbcw    $3,$sz
F52C:  F0           rtn     z
F52D:  E6 1D E0     phsm    $29,8
F530:  E6 15 40     phsm    $21,3
F533:  26 12        phs     $18
F535:  E6 11 E0     phsm    $17,8
F538:  82 6F 03     ldw     $15,$3
F53B:  77 B5 F4     cal     &HF4B5
F53E:  02 00        ld      $0,$sx
F540:  89 61 01     sbw     $1,$1
F543:  D1 03 00 36  ldw     $3,&H3600
F547:  D1 05 55 06  ldw     $5,&H0655
F54B:  D1 07 04 01  ldw     $7,&H0104
F54F:  77 07 06     cal     &H0607
F552:  EE 00 E0     ppsm    $0,8
F555:  2E 08        pps     $8
F557:  77 DA 05     cal     &H05DA
F55A:  EE 13 40     ppsm    $19,3
F55D:  EE 16 E0     ppsm    $22,8
F560:  F7           rtn   
F561:  77 68 F5     cal     &HF568
F564:  77 66 F4     cal     &HF466
F567:  F7           rtn   
F568:  E6 1D E0     phsm    $29,8
F56B:  E6 15 40     phsm    $21,3
F56E:  CF 40 E0     xrm     $0,$sz,8
F571:  09 68 08     sb      $8,$8
F574:  77 72 0A     cal     &H0A72
F577:  B1 06        jr      nc,&HF57E
F579:  77 25 0A     cal     &H0A25
F57C:  02 20        ld      $0,$sy
F57E:  26 00        phs     $0
F580:  02 00        ld      $0,$sx
F582:  D1 01 60 29  ldw     $1,&H2960
F586:  D1 03 67 49  ldw     $3,&H4967
F58A:  D1 05 29 04  ldw     $5,&H0429
F58E:  D1 07 09 01  ldw     $7,&H0109
F592:  E6 07 E0     phsm    $7,8
F595:  26 08        phs     $8
F597:  77 8B 16     cal     &H168B
F59A:  2E 08        pps     $8
F59C:  EE 00 E0     ppsm    $0,8
F59F:  2E 00        pps     $0
F5A1:  18 40        bid     $0
F5A3:  B1 10        jr      nc,&HF5B4
F5A5:  77 D0 09     cal     &H09D0
F5A8:  01 30        sbc     $16,$sy
F5AA:  B5 09        jr      c,&HF5B4
F5AC:  02 00        ld      $0,$sx
F5AE:  77 D4 05     cal     &H05D4
F5B1:  77 25 0A     cal     &H0A25
F5B4:  77 D0 09     cal     &H09D0
F5B7:  26 12        phs     $18
F5B9:  E6 11 E0     phsm    $17,8
F5BC:  02 00        ld      $0,$sx
F5BE:  89 61 01     sbw     $1,$1
F5C1:  D1 03 00 36  ldw     $3,&H3600
F5C5:  D1 05 55 06  ldw     $5,&H0655
F5C9:  D1 07 04 01  ldw     $7,&H0104
F5CD:  77 46 06     cal     &H0646
F5D0:  77 D0 09     cal     &H09D0
F5D3:  02 00        ld      $0,$sx
F5D5:  89 61 01     sbw     $1,$1
F5D8:  D1 03 00 68  ldw     $3,&H6800
F5DC:  D1 05 27 03  ldw     $5,&H0327
F5E0:  D1 07 04 01  ldw     $7,&H0104
F5E4:  77 72 0A     cal     &H0A72
F5E7:  02 09        ld      $9,$sx
F5E9:  B5 07        jr      c,&HF5F1
F5EB:  77 8B 16     cal     &H168B
F5EE:  42 09 80     ld      $9,&H80
F5F1:  26 09        phs     $9
F5F3:  77 C5 0A     cal     &H0AC5
F5F6:  2E 09        pps     $9
F5F8:  0E 70 09     or      $16,$9
F5FB:  82 60 0F     ldw     $0,$15
F5FE:  EE 0A E0     ppsm    $10,8
F601:  2E 12        pps     $18
F603:  A6 01        phsw    $1
F605:  02 00        ld      $0,$sx
F607:  89 61 01     sbw     $1,$1
F60A:  D1 03 00 36  ldw     $3,&H3600
F60E:  D1 05 55 06  ldw     $5,&H0655
F612:  D1 07 04 01  ldw     $7,&H0104
F616:  77 8B 16     cal     &H168B
F619:  77 D0 09     cal     &H09D0
F61C:  02 00        ld      $0,$sx
F61E:  89 61 01     sbw     $1,$1
F621:  D1 03 00 68  ldw     $3,&H6800
F625:  D1 05 27 03  ldw     $5,&H0327
F629:  D1 07 04 01  ldw     $7,&H0104
F62D:  77 72 0A     cal     &H0A72
F630:  02 09        ld      $9,$sx
F632:  B5 07        jr      c,&HF63A
F634:  77 8B 16     cal     &H168B
F637:  42 09 80     ld      $9,&H80
F63A:  26 09        phs     $9
F63C:  77 C5 0A     cal     &H0AC5
F63F:  2E 00        pps     $0
F641:  0E 50        or      $16,$sz
F643:  AE 11        ppsw    $17
F645:  EE 13 40     ppsm    $19,3
F648:  EE 16 E0     ppsm    $22,8
F64B:  F7           rtn   
F64C:  88 6F 05     adw     $15,$5
F64F:  F7           rtn   
F650:  88 6F 05     adw     $15,$5
F653:  B1 03        jr      nc,&HF657
F655:  88 31        adw     $17,$sy
F657:  88 71 07     adw     $17,$7
F65A:  F7           rtn   
F65B:  E6 1D E0     phsm    $29,8
F65E:  E6 15 40     phsm    $21,3
F661:  77 17 10     cal     &H1017
F664:  EE 13 40     ppsm    $19,3
F667:  EE 16 E0     ppsm    $22,8
F66A:  F7           rtn   
F66B:  A6 10        phsw    $16
F66D:  82 4F        ldw     $15,$sz
F66F:  77 C0 F6     cal     &HF6C0
F672:  AE 05        ppsw    $5
F674:  77 4C F6     cal     &HF64C
F677:  F7           rtn   
F678:  89 6F 05     sbw     $15,$5
F67B:  F7           rtn   
F67C:  89 6F 05     sbw     $15,$5
F67F:  B1 03        jr      nc,&HF683
F681:  89 31        sbw     $17,$sy
F683:  89 71 07     sbw     $17,$7
F686:  F7           rtn   
F687:  E6 1D E0     phsm    $29,8
F68A:  E6 15 40     phsm    $21,3
F68D:  77 40 10     cal     &H1040
F690:  EE 13 40     ppsm    $19,3
F693:  EE 16 E0     ppsm    $22,8
F696:  F7           rtn   
F697:  A6 10        phsw    $16
F699:  82 4F        ldw     $15,$sz
F69B:  77 C0 F6     cal     &HF6C0
F69E:  82 65 0F     ldw     $5,$15
F6A1:  AE 0F        ppsw    $15
F6A3:  77 78 F6     cal     &HF678
F6A6:  F7           rtn   
F6A7:  77 78 F6     cal     &HF678
F6AA:  82 45        ldw     $5,$sz
F6AC:  77 71 F7     cal     &HF771
F6AF:  F7           rtn   
F6B0:  77 CA F6     cal     &HF6CA
F6B3:  26 00        phs     $0
F6B5:  77 C0 F6     cal     &HF6C0
F6B8:  2E 00        pps     $0
F6BA:  01 00        sbc     $0,$sx
F6BC:  F0           rtn     z
F6BD:  9B 0F        cmpw    $15
F6BF:  F7           rtn   
F6C0:  89 71 11     sbw     $17,$17
F6C3:  89 67 07     sbw     $7,$7
F6C6:  77 35 F7     cal     &HF735
F6C9:  F7           rtn   
F6CA:  44 06 80     anc     $6,&H80
F6CD:  B0 06        jr      z,&HF6D4
F6CF:  9B 05        cmpw    $5
F6D1:  02 A0 03     ld      $0,$sy,jr &HF6D6
F6D4:  02 00        ld      $0,$sx
F6D6:  44 10 80     anc     $16,&H80
F6D9:  B0 06        jr      z,&HF6E0
F6DB:  9B 0F        cmpw    $15
F6DD:  0F A0 03     xr      $0,$sy,jr &HF6E2
F6E0:  0F 00        xr      $0,$sx
F6E2:  F7           rtn   
F6E3:  77 01 F7     cal     &HF701
F6E6:  26 00        phs     $0
F6E8:  77 35 F7     cal     &HF735
F6EB:  2E 00        pps     $0
F6ED:  01 00        sbc     $0,$sx
F6EF:  F0           rtn     z
F6F0:  D1 02 00 00  ldw     $2,&H0000
F6F4:  81 6F 02     sbcw    $15,$2
F6F7:  B0 06        jr      z,&HF6FE
F6F9:  9B 0F        cmpw    $15
F6FB:  9B 51        invw    $17
F6FD:  F7           rtn   
F6FE:  9B 11        cmpw    $17
F700:  F7           rtn   
F701:  44 08 80     anc     $8,&H80
F704:  B0 15        jr      z,&HF71A
F706:  02 20        ld      $0,$sy
F708:  89 62 02     sbw     $2,$2
F70B:  81 65 02     sbcw    $5,$2
F70E:  B0 07        jr      z,&HF716
F710:  9B 05        cmpw    $5
F712:  9B 47        invw    $7
F714:  B7 07        jr      &HF71C
F716:  9B 07        cmpw    $7
F718:  B7 03        jr      &HF71C
F71A:  02 00        ld      $0,$sx
F71C:  44 12 80     anc     $18,&H80
F71F:  B0 12        jr      z,&HF732
F721:  0F 20        xr      $0,$sy
F723:  81 6F 02     sbcw    $15,$2
F726:  B0 07        jr      z,&HF72E
F728:  9B 0F        cmpw    $15
F72A:  9B 51        invw    $17
F72C:  B7 07        jr      &HF734
F72E:  9B 11        cmpw    $17
F730:  B7 03        jr      &HF734
F732:  0F 00        xr      $0,$sx
F734:  F7           rtn   
F735:  C2 60 6F     ldm     $0,$15,4
F738:  89 6F 0F     sbw     $15,$15
F73B:  89 71 11     sbw     $17,$17
F73E:  89 6A 0A     sbw     $10,$10
F741:  81 65 0A     sbcw    $5,$10
F744:  B4 05        jr      nz,&HF74A
F746:  81 67 0A     sbcw    $7,$10
F749:  F0           rtn     z
F74A:  04 25        anc     $5,$sy
F74C:  B0 0A        jr      z,&HF757
F74E:  88 4F        adw     $15,$sz
F750:  B1 03        jr      nc,&HF754
F752:  88 31        adw     $17,$sy
F754:  88 71 02     adw     $17,$2
F757:  98 60        biuw    $0
F759:  98 22        rouw    $2
F75B:  98 48        bidw    $8
F75D:  98 06        rodw    $6
F75F:  B7 A2        jr      &HF702
F761:  E6 1D E0     phsm    $29,8
F764:  E6 15 40     phsm    $21,3
F767:  77 20 10     cal     &H1020
F76A:  EE 13 40     ppsm    $19,3
F76D:  EE 16 E0     ppsm    $22,8
F770:  F7           rtn   
F771:  77 CA F6     cal     &HF6CA
F774:  26 00        phs     $0
F776:  77 81 F7     cal     &HF781
F779:  2E 00        pps     $0
F77B:  01 00        sbc     $0,$sx
F77D:  F0           rtn     z
F77E:  9B 0F        cmpw    $15
F780:  F7           rtn   
F781:  89 40        sbw     $0,$sz
F783:  81 45        sbcw    $5,$sz
F785:  B0 0B        jr      z,&HF791
F787:  89 71 11     sbw     $17,$17
F78A:  89 67 07     sbw     $7,$7
F78D:  77 B1 F7     cal     &HF7B1
F790:  F7           rtn   
F791:  37 68 FE     jp      &HFE68
F794:  77 01 F7     cal     &HF701
F797:  26 00        phs     $0
F799:  77 B1 F7     cal     &HF7B1
F79C:  2E 00        pps     $0
F79E:  01 00        sbc     $0,$sx
F7A0:  F0           rtn     z
F7A1:  89 62 02     sbw     $2,$2
F7A4:  81 6F 02     sbcw    $15,$2
F7A7:  B0 06        jr      z,&HF7AE
F7A9:  9B 0F        cmpw    $15
F7AB:  9B 51        invw    $17
F7AD:  F7           rtn   
F7AE:  9B 11        cmpw    $17
F7B0:  F7           rtn   
F7B1:  89 40        sbw     $0,$sz
F7B3:  81 45        sbcw    $5,$sz
F7B5:  B4 05        jr      nz,&HF7BB
F7B7:  81 47        sbcw    $7,$sz
F7B9:  B0 5F        jr      z,&HF819
F7BB:  E6 1D E0     phsm    $29,8
F7BE:  E6 15 40     phsm    $21,3
F7C1:  C2 6A 6F     ldm     $10,$15,4
F7C4:  89 6F 0F     sbw     $15,$15
F7C7:  89 71 11     sbw     $17,$17
F7CA:  81 6C 07     sbcw    $12,$7
F7CD:  B5 44        jr      c,&HF812
F7CF:  B4 06        jr      nz,&HF7D6
F7D1:  81 6A 05     sbcw    $10,$5
F7D4:  B5 3D        jr      c,&HF812
F7D6:  C2 60 65     ldm     $0,$5,4
F7D9:  82 33        ldw     $19,$sy
F7DB:  89 75 15     sbw     $21,$21
F7DE:  44 03 80     anc     $3,&H80
F7E1:  B4 1C        jr      nz,&HF7FE
F7E3:  98 60        biuw    $0
F7E5:  98 22        rouw    $2
F7E7:  98 73        biuw    $19
F7E9:  98 35        rouw    $21
F7EB:  81 6C 02     sbcw    $12,$2
F7EE:  B5 07        jr      c,&HF7F6
F7F0:  B4 93        jr      nz,&HF784
F7F2:  81 4A        sbcw    $10,$sz
F7F4:  B1 97        jr      nc,&HF78C
F7F6:  98 43        bidw    $3
F7F8:  98 01        rodw    $1
F7FA:  98 56        bidw    $22
F7FC:  98 14        rodw    $20
F7FE:  88 6F 13     adw     $15,$19
F801:  B1 03        jr      nc,&HF805
F803:  88 31        adw     $17,$sy
F805:  88 71 15     adw     $17,$21
F808:  89 4A        sbw     $10,$sz
F80A:  B1 03        jr      nc,&HF80E
F80C:  89 2C        sbw     $12,$sy
F80E:  89 EC 02 C7  sbw     $12,$2,jr &HF7D8
F812:  EE 13 40     ppsm    $19,3
F815:  EE 16 E0     ppsm    $22,8
F818:  F7           rtn   
F819:  37 68 FE     jp      &HFE68
F81C:  A6 14        phsw    $20
F81E:  89 73 13     sbw     $19,$19
F821:  81 67 13     sbcw    $7,$19
F824:  B0 13        jr      z,&HF838
F826:  E6 1D E0     phsm    $29,8
F829:  E6 15 40     phsm    $21,3
F82C:  77 28 10     cal     &H1028
F82F:  EE 13 40     ppsm    $19,3
F832:  EE 16 E0     ppsm    $22,8
F835:  AE 13        ppsw    $19
F837:  F7           rtn   
F838:  37 68 FE     jp      &HFE68
F83B:  A6 10        phsw    $16
F83D:  A6 06        phsw    $6
F83F:  77 71 F7     cal     &HF771
F842:  AE 05        ppsw    $5
F844:  77 B0 F6     cal     &HF6B0
F847:  82 65 0F     ldw     $5,$15
F84A:  AE 0F        ppsw    $15
F84C:  77 78 F6     cal     &HF678
F84F:  F7           rtn   
F850:  A6 10        phsw    $16
F852:  A6 06        phsw    $6
F854:  77 81 F7     cal     &HF781
F857:  AE 05        ppsw    $5
F859:  77 C0 F6     cal     &HF6C0
F85C:  82 65 0F     ldw     $5,$15
F85F:  AE 0F        ppsw    $15
F861:  77 78 F6     cal     &HF678
F864:  F7           rtn   
F865:  E6 12 60     phsm    $18,4
F868:  E6 08 60     phsm    $8,4
F86B:  77 94 F7     cal     &HF794
F86E:  EE 05 60     ppsm    $5,4
F871:  77 E3 F6     cal     &HF6E3
F874:  C2 65 6F     ldm     $5,$15,4
F877:  EE 0F 60     ppsm    $15,4
F87A:  77 7C F6     cal     &HF67C
F87D:  F7           rtn   
F87E:  E6 12 60     phsm    $18,4
F881:  E6 08 60     phsm    $8,4
F884:  77 B1 F7     cal     &HF7B1
F887:  EE 05 60     ppsm    $5,4
F88A:  77 35 F7     cal     &HF735
F88D:  C2 65 6F     ldm     $5,$15,4
F890:  EE 0F 60     ppsm    $15,4
F893:  77 7C F6     cal     &HF67C
F896:  F7           rtn   
F897:  81 6F 05     sbcw    $15,$5
F89A:  B0 05        jr      z,&HF8A0
F89C:  89 EF 0F 03  sbw     $15,$15,jr &HF8A2
F8A0:  82 2F        ldw     $15,$sy
F8A2:  F7           rtn   
F8A3:  81 71 07     sbcw    $17,$7
F8A6:  B4 09        jr      nz,&HF8B0
F8A8:  81 6F 05     sbcw    $15,$5
F8AB:  B4 04        jr      nz,&HF8B0
F8AD:  82 AF 04     ldw     $15,$sy,jr &HF8B3
F8B0:  89 6F 0F     sbw     $15,$15
F8B3:  89 71 11     sbw     $17,$17
F8B6:  F7           rtn   
F8B7:  77 72 0A     cal     &H0A72
F8BA:  B0 05        jr      z,&HF8C0
F8BC:  89 EF 0F 03  sbw     $15,$15,jr &HF8C2
F8C0:  82 2F        ldw     $15,$sy
F8C2:  89 71 11     sbw     $17,$17
F8C5:  F7           rtn   
F8C6:  48 10 80     ad      $16,&H80
F8C9:  48 06 80     ad      $6,&H80
F8CC:  77 D0 F8     cal     &HF8D0
F8CF:  F7           rtn   
F8D0:  81 6F 05     sbcw    $15,$5
F8D3:  B5 05        jr      c,&HF8D9
F8D5:  89 EF 0F 03  sbw     $15,$15,jr &HF8DB
F8D9:  82 2F        ldw     $15,$sy
F8DB:  F7           rtn   
F8DC:  48 08 80     ad      $8,&H80
F8DF:  48 12 80     ad      $18,&H80
F8E2:  77 E6 F8     cal     &HF8E6
F8E5:  F7           rtn   
F8E6:  81 71 07     sbcw    $17,$7
F8E9:  B5 0C        jr      c,&HF8F6
F8EB:  B4 06        jr      nz,&HF8F2
F8ED:  81 6F 05     sbcw    $15,$5
F8F0:  B5 05        jr      c,&HF8F6
F8F2:  89 EF 0F 03  sbw     $15,$15,jr &HF8F8
F8F6:  82 2F        ldw     $15,$sy
F8F8:  89 71 11     sbw     $17,$17
F8FB:  F7           rtn   
F8FC:  77 72 0A     cal     &H0A72
F8FF:  B5 05        jr      c,&HF905
F901:  89 EF 0F 03  sbw     $15,$15,jr &HF907
F905:  82 2F        ldw     $15,$sy
F907:  89 71 11     sbw     $17,$17
F90A:  F7           rtn   
F90B:  48 10 80     ad      $16,&H80
F90E:  48 06 80     ad      $6,&H80
F911:  77 15 F9     cal     &HF915
F914:  F7           rtn   
F915:  81 65 0F     sbcw    $5,$15
F918:  B5 05        jr      c,&HF91E
F91A:  89 EF 0F 03  sbw     $15,$15,jr &HF920
F91E:  82 2F        ldw     $15,$sy
F920:  F7           rtn   
F921:  48 08 80     ad      $8,&H80
F924:  48 12 80     ad      $18,&H80
F927:  77 2B F9     cal     &HF92B
F92A:  F7           rtn   
F92B:  81 67 11     sbcw    $7,$17
F92E:  B5 0C        jr      c,&HF93B
F930:  B4 06        jr      nz,&HF937
F932:  81 65 0F     sbcw    $5,$15
F935:  B5 05        jr      c,&HF93B
F937:  89 EF 0F 03  sbw     $15,$15,jr &HF93D
F93B:  82 2F        ldw     $15,$sy
F93D:  89 71 11     sbw     $17,$17
F940:  F7           rtn   
F941:  77 72 0A     cal     &H0A72
F944:  B5 06        jr      c,&HF94B
F946:  B0 04        jr      z,&HF94B
F948:  82 AF 04     ldw     $15,$sy,jr &HF94E
F94B:  89 6F 0F     sbw     $15,$15
F94E:  89 71 11     sbw     $17,$17
F951:  F7           rtn   
F952:  81 6F 05     sbcw    $15,$5
F955:  B4 05        jr      nz,&HF95B
F957:  89 EF 0F 03  sbw     $15,$15,jr &HF95D
F95B:  82 2F        ldw     $15,$sy
F95D:  F7           rtn   
F95E:  81 71 07     sbcw    $17,$7
F961:  B4 0A        jr      nz,&HF96C
F963:  81 6F 05     sbcw    $15,$5
F966:  B4 05        jr      nz,&HF96C
F968:  89 EF 0F 03  sbw     $15,$15,jr &HF96E
F96C:  82 2F        ldw     $15,$sy
F96E:  89 71 11     sbw     $17,$17
F971:  F7           rtn   
F972:  77 72 0A     cal     &H0A72
F975:  B4 05        jr      nz,&HF97B
F977:  89 EF 0F 03  sbw     $15,$15,jr &HF97D
F97B:  82 2F        ldw     $15,$sy
F97D:  89 71 11     sbw     $17,$17
F980:  F7           rtn   
F981:  48 10 80     ad      $16,&H80
F984:  48 06 80     ad      $6,&H80
F987:  77 8B F9     cal     &HF98B
F98A:  F7           rtn   
F98B:  81 65 0F     sbcw    $5,$15
F98E:  B5 04        jr      c,&HF993
F990:  82 AF 04     ldw     $15,$sy,jr &HF996
F993:  89 6F 0F     sbw     $15,$15
F996:  F7           rtn   
F997:  48 08 80     ad      $8,&H80
F99A:  48 12 80     ad      $18,&H80
F99D:  77 A1 F9     cal     &HF9A1
F9A0:  F7           rtn   
F9A1:  81 67 11     sbcw    $7,$17
F9A4:  B5 0B        jr      c,&HF9B0
F9A6:  B4 06        jr      nz,&HF9AD
F9A8:  81 65 0F     sbcw    $5,$15
F9AB:  B5 04        jr      c,&HF9B0
F9AD:  82 AF 04     ldw     $15,$sy,jr &HF9B3
F9B0:  89 6F 0F     sbw     $15,$15
F9B3:  89 71 11     sbw     $17,$17
F9B6:  F7           rtn   
F9B7:  77 72 0A     cal     &H0A72
F9BA:  B5 07        jr      c,&HF9C2
F9BC:  B0 05        jr      z,&HF9C2
F9BE:  89 EF 0F 03  sbw     $15,$15,jr &HF9C4
F9C2:  82 2F        ldw     $15,$sy
F9C4:  89 71 11     sbw     $17,$17
F9C7:  F7           rtn   
F9C8:  48 10 80     ad      $16,&H80
F9CB:  48 06 80     ad      $6,&H80
F9CE:  77 D2 F9     cal     &HF9D2
F9D1:  F7           rtn   
F9D2:  81 6F 05     sbcw    $15,$5
F9D5:  B5 04        jr      c,&HF9DA
F9D7:  82 AF 04     ldw     $15,$sy,jr &HF9DD
F9DA:  89 6F 0F     sbw     $15,$15
F9DD:  F7           rtn   
F9DE:  48 08 80     ad      $8,&H80
F9E1:  48 12 80     ad      $18,&H80
F9E4:  77 E8 F9     cal     &HF9E8
F9E7:  F7           rtn   
F9E8:  81 71 07     sbcw    $17,$7
F9EB:  B5 0B        jr      c,&HF9F7
F9ED:  B4 06        jr      nz,&HF9F4
F9EF:  81 6F 05     sbcw    $15,$5
F9F2:  B5 04        jr      c,&HF9F7
F9F4:  82 AF 04     ldw     $15,$sy,jr &HF9FA
F9F7:  89 6F 0F     sbw     $15,$15
F9FA:  89 71 11     sbw     $17,$17
F9FD:  F7           rtn   
F9FE:  77 72 0A     cal     &H0A72
FA01:  B5 04        jr      c,&HFA06
FA03:  82 AF 04     ldw     $15,$sy,jr &HFA09
FA06:  89 6F 0F     sbw     $15,$15
FA09:  89 71 11     sbw     $17,$17
FA0C:  F7           rtn   
FA0D:  9B 0F        cmpw    $15
FA0F:  F7           rtn   
FA10:  A6 01        phsw    $1
FA12:  89 40        sbw     $0,$sz
FA14:  81 4F        sbcw    $15,$sz
FA16:  B0 07        jr      z,&HFA1E
FA18:  9B 0F        cmpw    $15
FA1A:  9B 51        invw    $17
FA1C:  B7 03        jr      &HFA20
FA1E:  9B 11        cmpw    $17
FA20:  AE 00        ppsw    $0
FA22:  F7           rtn   
FA23:  89 40        sbw     $0,$sz
FA25:  89 62 02     sbw     $2,$2
FA28:  89 64 04     sbw     $4,$4
FA2B:  02 26        ld      $6,$sy
FA2D:  D1 07 00 06  ldw     $7,&H0600
FA31:  77 61 F7     cal     &HF761
FA34:  F7           rtn   
FA35:  9B 4F        invw    $15
FA37:  F7           rtn   
FA38:  9B 4F        invw    $15
FA3A:  9B 51        invw    $17
FA3C:  F7           rtn   
FA3D:  88 2F        adw     $15,$sy
FA3F:  F7           rtn   
FA40:  88 2F        adw     $15,$sy
FA42:  F1           rtn     nc
FA43:  88 31        adw     $17,$sy
FA45:  F7           rtn   
FA46:  E6 1D E0     phsm    $29,8
FA49:  E6 15 40     phsm    $21,3
FA4C:  77 3B 10     cal     &H103B
FA4F:  EE 13 40     ppsm    $19,3
FA52:  EE 16 E0     ppsm    $22,8
FA55:  F7           rtn   
FA56:  88 6F 05     adw     $15,$5
FA59:  F7           rtn   
FA5A:  89 2F        sbw     $15,$sy
FA5C:  F7           rtn   
FA5D:  89 2F        sbw     $15,$sy
FA5F:  F1           rtn     nc
FA60:  89 31        sbw     $17,$sy
FA62:  F7           rtn   
FA63:  E6 1D E0     phsm    $29,8
FA66:  E6 15 40     phsm    $21,3
FA69:  77 36 10     cal     &H1036
FA6C:  EE 13 40     ppsm    $19,3
FA6F:  EE 16 E0     ppsm    $22,8
FA72:  F7           rtn   
FA73:  89 6F 05     sbw     $15,$5
FA76:  F7           rtn   
FA77:  8E 6F 05     orw     $15,$5
FA7A:  F7           rtn   
FA7B:  CE 6F 65     orm     $15,$5,4
FA7E:  F7           rtn   
FA7F:  8C 6F 05     anw     $15,$5
FA82:  F7           rtn   
FA83:  CC 6F 65     anm     $15,$5,4
FA86:  F7           rtn   
FA87:  8F 6F 05     xrw     $15,$5
FA8A:  F7           rtn   
FA8B:  CF 6F 65     xrm     $15,$5,4
FA8E:  F7           rtn   
FA8F:  A6 01        phsw    $1
FA91:  D1 00 11 00  ldw     $0,&H0011
FA95:  81 45        sbcw    $5,$sz
FA97:  B5 04        jr      c,&HFA9C
FA99:  42 05 10     ld      $5,&H10
FA9C:  09 25        sb      $5,$sy
FA9E:  B5 11        jr      c,&HFAB0
FAA0:  44 10 80     anc     $16,&H80
FAA3:  B4 05        jr      nz,&HFAA9
FAA5:  98 50        bidw    $16
FAA7:  B7 8C        jr      &HFA34
FAA9:  54 40 40     pfl     &H40
FAAC:  98 10        rodw    $16
FAAE:  B7 93        jr      &HFA42
FAB0:  AE 00        ppsw    $0
FAB2:  F7           rtn   
FAB3:  A6 01        phsw    $1
FAB5:  D1 00 11 00  ldw     $0,&H0011
FAB9:  81 45        sbcw    $5,$sz
FABB:  B5 04        jr      c,&HFAC0
FABD:  42 05 10     ld      $5,&H10
FAC0:  09 25        sb      $5,$sy
FAC2:  B5 05        jr      c,&HFAC8
FAC4:  98 50        bidw    $16
FAC6:  B7 87        jr      &HFA4E
FAC8:  AE 00        ppsw    $0
FACA:  F7           rtn   
FACB:  A6 01        phsw    $1
FACD:  89 40        sbw     $0,$sz
FACF:  81 47        sbcw    $7,$sz
FAD1:  B4 09        jr      nz,&HFADB
FAD3:  D1 00 21 00  ldw     $0,&H0021
FAD7:  81 45        sbcw    $5,$sz
FAD9:  B5 04        jr      c,&HFADE
FADB:  42 05 20     ld      $5,&H20
FADE:  09 25        sb      $5,$sy
FAE0:  B5 15        jr      c,&HFAF6
FAE2:  44 12 80     anc     $18,&H80
FAE5:  B4 07        jr      nz,&HFAED
FAE7:  98 52        bidw    $18
FAE9:  98 10        rodw    $16
FAEB:  B7 8E        jr      &HFA7A
FAED:  54 40 40     pfl     &H40
FAF0:  98 12        rodw    $18
FAF2:  98 10        rodw    $16
FAF4:  B7 97        jr      &HFA8C
FAF6:  AE 00        ppsw    $0
FAF8:  F7           rtn   
FAF9:  A6 01        phsw    $1
FAFB:  89 40        sbw     $0,$sz
FAFD:  81 47        sbcw    $7,$sz
FAFF:  B4 09        jr      nz,&HFB09
FB01:  D1 00 21 00  ldw     $0,&H0021
FB05:  81 45        sbcw    $5,$sz
FB07:  B5 04        jr      c,&HFB0C
FB09:  42 05 20     ld      $5,&H20
FB0C:  09 25        sb      $5,$sy
FB0E:  B5 07        jr      c,&HFB16
FB10:  98 52        bidw    $18
FB12:  98 10        rodw    $16
FB14:  B7 89        jr      &HFA9E
FB16:  AE 00        ppsw    $0
FB18:  F7           rtn   
FB19:  A6 01        phsw    $1
FB1B:  D1 00 11 00  ldw     $0,&H0011
FB1F:  81 45        sbcw    $5,$sz
FB21:  B5 04        jr      c,&HFB26
FB23:  42 05 10     ld      $5,&H10
FB26:  09 25        sb      $5,$sy
FB28:  B5 05        jr      c,&HFB2E
FB2A:  98 6F        biuw    $15
FB2C:  B7 87        jr      &HFAB4
FB2E:  AE 00        ppsw    $0
FB30:  F7           rtn   
FB31:  A6 01        phsw    $1
FB33:  89 40        sbw     $0,$sz
FB35:  81 47        sbcw    $7,$sz
FB37:  B4 09        jr      nz,&HFB41
FB39:  D1 00 21 00  ldw     $0,&H0021
FB3D:  81 45        sbcw    $5,$sz
FB3F:  B5 04        jr      c,&HFB44
FB41:  42 05 20     ld      $5,&H20
FB44:  09 25        sb      $5,$sy
FB46:  B5 07        jr      c,&HFB4E
FB48:  98 6F        biuw    $15
FB4A:  98 31        rouw    $17
FB4C:  B7 89        jr      &HFAD6
FB4E:  AE 00        ppsw    $0
FB50:  F7           rtn   
FB51:  AE 00        ppsw    $0
FB53:  AE 02        ppsw    $2
FB55:  A7 03        phuw    $3
FB57:  D6 00 7F 1F  pre     ix,&H1F7F
FB5B:  A8 02        ldw     $2,(ix+$sx)
FB5D:  A7 03        phuw    $3
FB5F:  9E 62        gre     us,$2
FB61:  A0 02        stw     $2,(ix+$sx)
FB63:  A6 01        phsw    $1
FB65:  F7           rtn   
FB66:  AE 00        ppsw    $0
FB68:  D6 00 7F 1F  pre     ix,&H1F7F
FB6C:  A8 02        ldw     $2,(ix+$sx)
FB6E:  96 62        pre     us,$2
FB70:  AF 02        ppuw    $2
FB72:  A0 02        stw     $2,(ix+$sx)
FB74:  AF 02        ppuw    $2
FB76:  A6 03        phsw    $3
FB78:  A6 01        phsw    $1
FB7A:  F7           rtn   
FB7B:  2A 00        ldi     $0,(ix+$sx)
FB7D:  01 00        sbc     $0,$sx
FB7F:  B0 05        jr      z,&HFB85
FB81:  23 00        sti     $0,(iz+$sx)
FB83:  B7 89        jr      &HFB0D
FB85:  21 1F        st      $31,(iz+$sx)
FB87:  F7           rtn   
FB88:  26 13        phs     $19
FB8A:  4C 13 0F     an      $19,&H0F
FB8D:  01 33        sbc     $19,$sy
FB8F:  B4 07        jr      nz,&HFB97
FB91:  D1 0F 5A 42  ldw     $15,&H425A
FB95:  B7 38        jr      &HFBCE
FB97:  41 13 03     sbc     $19,&H03
FB9A:  B4 07        jr      nz,&HFBA2
FB9C:  D1 0F 60 42  ldw     $15,&H4260
FBA0:  B7 2D        jr      &HFBCE
FBA2:  41 13 04     sbc     $19,&H04
FBA5:  B4 0E        jr      nz,&HFBB4
FBA7:  D1 0F 6B 42  ldw     $15,&H426B
FBAB:  77 78 9F     cal     &H9F78
FBAE:  D1 0F 60 42  ldw     $15,&H4260
FBB2:  B7 1B        jr      &HFBCE
FBB4:  41 13 05     sbc     $19,&H05
FBB7:  B4 07        jr      nz,&HFBBF
FBB9:  D1 0F 65 42  ldw     $15,&H4265
FBBD:  B7 10        jr      &HFBCE
FBBF:  41 13 07     sbc     $19,&H07
FBC2:  B4 07        jr      nz,&HFBCA
FBC4:  D1 0F 75 42  ldw     $15,&H4275
FBC8:  B7 05        jr      &HFBCE
FBCA:  D1 0F 7C 42  ldw     $15,&H427C
FBCE:  77 78 9F     cal     &H9F78
FBD1:  2E 13        pps     $19
FBD3:  4C 13 F0     an      $19,&HF0
FBD6:  B0 08        jr      z,&HFBDF
FBD8:  D1 0F 84 42  ldw     $15,&H4284
FBDC:  77 78 9F     cal     &H9F78
FBDF:  F7           rtn   
FBE0:  96 0F        pre     ix,$15
FBE2:  44 13 F0     anc     $19,&HF0
FBE5:  B0 23        jr      z,&HFC09
FBE7:  A8 11        ldw     $17,(ix+$sx)
FBE9:  42 0E 05     ld      $14,&H05
FBEC:  09 2E        sb      $14,$sy
FBEE:  F0           rtn     z
FBEF:  89 73 13     sbw     $19,$19
FBF2:  DA 30 60     dium    $16,4
FBF5:  02 70 13     ld      $16,$19
FBF8:  41 10 0A     sbc     $16,&H0A
FBFB:  B1 05        jr      nc,&HFC01
FBFD:  48 90 30 04  ad      $16,&H30,jr &HFC04
FC01:  48 10 37     ad      $16,&H37
FC04:  77 E2 93     cal     &H93E2
FC07:  B7 9C        jr      &HFBA4
FC09:  4C 13 0F     an      $19,&H0F
FC0C:  01 33        sbc     $19,$sy
FC0E:  B4 08        jr      nz,&HFC17
FC10:  28 0F        ld      $15,(ix+$sx)
FC12:  77 89 F4     cal     &HF489
FC15:  B7 39        jr      &HFC4F
FC17:  41 13 03     sbc     $19,&H03
FC1A:  B4 08        jr      nz,&HFC23
FC1C:  A8 0F        ldw     $15,(ix+$sx)
FC1E:  77 AD F4     cal     &HF4AD
FC21:  B7 2D        jr      &HFC4F
FC23:  41 13 04     sbc     $19,&H04
FC26:  B4 08        jr      nz,&HFC2F
FC28:  A8 0F        ldw     $15,(ix+$sx)
FC2A:  77 B5 F4     cal     &HF4B5
FC2D:  B7 21        jr      &HFC4F
FC2F:  41 13 05     sbc     $19,&H05
FC32:  B4 09        jr      nz,&HFC3C
FC34:  E8 0F 60     ldm     $15,(ix+$sx),4
FC37:  77 E1 F4     cal     &HF4E1
FC3A:  B7 14        jr      &HFC4F
FC3C:  41 13 07     sbc     $19,&H07
FC3F:  B4 09        jr      nz,&HFC49
FC41:  E8 0F 60     ldm     $15,(ix+$sx),4
FC44:  77 0B F4     cal     &HF40B
FC47:  B7 07        jr      &HFC4F
FC49:  EA 0A E0     ldim    $10,(ix+$sx),8
FC4C:  77 76 F3     cal     &HF376
FC4F:  77 A7 13     cal     &H13A7
FC52:  11 60 0F     ld      $0,($15)
FC55:  41 00 20     sbc     $0,&H20
FC58:  B4 05        jr      nz,&HFC5E
FC5A:  88 2F        adw     $15,$sy
FC5C:  09 31        sb      $17,$sy
FC5E:  96 4F        pre     iz,$15
FC60:  01 11        sbc     $17,$sx
FC62:  B0 0A        jr      z,&HFC6D
FC64:  2B 10        ldi     $16,(iz+$sx)
FC66:  77 E2 93     cal     &H93E2
FC69:  09 31        sb      $17,$sy
FC6B:  B7 8C        jr      &HFBF8
FC6D:  F7           rtn   
FC6E:  77 51 FB     cal     &HFB51
FC71:  77 D8 FC     cal     &HFCD8
FC74:  A9 51        ldw     $17,(iz+$sz)
FC76:  42 0C FF     ld      $12,&HFF
FC79:  77 A0 EE     cal     &HEEA0
FC7C:  77 F8 EE     cal     &HEEF8
FC7F:  96 51        pre     iz,$17
FC81:  A9 20        ldw     $0,(iz+$sy)
FC83:  4C 00 CF     an      $0,&HCF
FC86:  21 20        st      $0,(iz+$sy)
FC88:  77 66 FB     cal     &HFB66
FC8B:  F7           rtn   
FC8C:  77 51 FB     cal     &HFB51
FC8F:  77 B0 FC     cal     &HFCB0
FC92:  28 02        ld      $2,(ix+$sx)
FC94:  16 60        pst     ua,$0
FC96:  02 03        ld      $3,$sx
FC98:  D6 00 81 1F  pre     ix,&H1F81
FC9C:  A0 02        stw     $2,(ix+$sx)
FC9E:  77 66 FB     cal     &HFB66
FCA1:  F7           rtn   
FCA2:  77 51 FB     cal     &HFB51
FCA5:  77 B0 FC     cal     &HFCB0
FCA8:  20 02        st      $2,(ix+$sx)
FCAA:  16 60        pst     ua,$0
FCAC:  77 66 FB     cal     &HFB66
FCAF:  F7           rtn   
FCB0:  77 CC FC     cal     &HFCCC
FCB3:  AA 40        ldiw    $0,(ix+$sz)
FCB5:  77 C2 FC     cal     &HFCC2
FCB8:  A8 02        ldw     $2,(ix+$sx)
FCBA:  96 00        pre     ix,$0
FCBC:  1E 60        gst     ua,$0
FCBE:  56 60 74     pst     ua,&H74
FCC1:  F7           rtn   
FCC2:  42 01 FF     ld      $1,&HFF
FCC5:  4C 00 F7     an      $0,&HF7
FCC8:  4E 00 F0     or      $0,&HF0
FCCB:  F7           rtn   
FCCC:  D6 00 7F 1F  pre     ix,&H1F7F
FCD0:  A8 00        ldw     $0,(ix+$sx)
FCD2:  96 00        pre     ix,$0
FCD4:  42 00 06     ld      $0,&H06
FCD7:  F7           rtn   
FCD8:  D6 40 7F 1F  pre     iz,&H1F7F
FCDC:  A9 00        ldw     $0,(iz+$sx)
FCDE:  96 40        pre     iz,$0
FCE0:  B7 8D        jr      &HFC6E
FCE2:  37 BE FD     jp      &HFDBE
FCE5:  D6 40 1E 43  pre     iz,&H431E
FCE9:  B7 77        jr      &HFD61
FCEB:  D6 40 2F 43  pre     iz,&H432F
FCEF:  B7 71        jr      &HFD61
FCF1:  D6 40 42 43  pre     iz,&H4342
FCF5:  B7 6B        jr      &HFD61
FCF7:  D6 40 52 43  pre     iz,&H4352
FCFB:  B7 65        jr      &HFD61
FCFD:  D6 40 64 43  pre     iz,&H4364
FD01:  B7 5F        jr      &HFD61
FD03:  D6 40 81 43  pre     iz,&H4381
FD07:  B7 59        jr      &HFD61
FD09:  D6 40 90 43  pre     iz,&H4390
FD0D:  B7 53        jr      &HFD61
FD0F:  D6 40 A0 43  pre     iz,&H43A0
FD13:  B7 4D        jr      &HFD61
FD15:  D6 40 B5 43  pre     iz,&H43B5
FD19:  B7 47        jr      &HFD61
FD1B:  D6 40 CA 43  pre     iz,&H43CA
FD1F:  B7 41        jr      &HFD61
FD21:  D6 40 D6 43  pre     iz,&H43D6
FD25:  B7 3B        jr      &HFD61
FD27:  D6 40 E5 43  pre     iz,&H43E5
FD2B:  B7 35        jr      &HFD61
FD2D:  D6 40 FB 43  pre     iz,&H43FB
FD31:  B7 2F        jr      &HFD61
FD33:  D6 40 09 44  pre     iz,&H4409
FD37:  B7 29        jr      &HFD61
FD39:  D6 40 1B 44  pre     iz,&H441B
FD3D:  B7 23        jr      &HFD61
FD3F:  D6 40 2C 44  pre     iz,&H442C
FD43:  B7 1D        jr      &HFD61
FD45:  D6 40 3D 44  pre     iz,&H443D
FD49:  B7 17        jr      &HFD61
FD4B:  D6 40 4C 44  pre     iz,&H444C
FD4F:  B7 11        jr      &HFD61
FD51:  D6 40 62 44  pre     iz,&H4462
FD55:  B7 0B        jr      &HFD61
FD57:  D6 40 77 44  pre     iz,&H4477
FD5B:  B7 05        jr      &HFD61
FD5D:  D6 40 84 44  pre     iz,&H4484
FD61:  37 72 FE     jp      &HFE72
FD64:  D6 40 97 44  pre     iz,&H4497
FD68:  B7 88        jr      &HFCF1
FD6A:  D6 40 A8 44  pre     iz,&H44A8
FD6E:  B7 8E        jr      &HFCFD
FD70:  D6 40 B9 44  pre     iz,&H44B9
FD74:  B7 94        jr      &HFD09
FD76:  D6 40 C7 44  pre     iz,&H44C7
FD7A:  B7 9A        jr      &HFD15
FD7C:  D6 40 DA 44  pre     iz,&H44DA
FD80:  B7 A0        jr      &HFD21
FD82:  D6 40 F1 44  pre     iz,&H44F1
FD86:  B7 A6        jr      &HFD2D
FD88:  D6 40 01 45  pre     iz,&H4501
FD8C:  B7 AC        jr      &HFD39
FD8E:  D6 40 1A 45  pre     iz,&H451A
FD92:  B7 B2        jr      &HFD45
FD94:  D6 40 30 45  pre     iz,&H4530
FD98:  B7 B8        jr      &HFD51
FD9A:  D6 40 47 45  pre     iz,&H4547
FD9E:  B7 BE        jr      &HFD5D
FDA0:  D6 40 55 45  pre     iz,&H4555
FDA4:  B7 C4        jr      &HFD69
FDA6:  D6 40 6A 45  pre     iz,&H456A
FDAA:  B7 CA        jr      &HFD75
FDAC:  D6 40 80 45  pre     iz,&H4580
FDB0:  B7 D0        jr      &HFD81
FDB2:  D6 40 93 45  pre     iz,&H4593
FDB6:  B7 D6        jr      &HFD8D
FDB8:  D6 40 AB 45  pre     iz,&H45AB
FDBC:  B7 DC        jr      &HFD99
FDBE:  D6 40 C1 45  pre     iz,&H45C1
FDC2:  B7 47        jr      &HFE0A
FDC4:  D6 40 CC 45  pre     iz,&H45CC
FDC8:  B7 41        jr      &HFE0A
FDCA:  D6 40 D7 45  pre     iz,&H45D7
FDCE:  B7 3B        jr      &HFE0A
FDD0:  D6 40 E7 45  pre     iz,&H45E7
FDD4:  B7 35        jr      &HFE0A
FDD6:  D6 40 F7 45  pre     iz,&H45F7
FDDA:  B7 2F        jr      &HFE0A
FDDC:  D6 40 07 46  pre     iz,&H4607
FDE0:  B7 29        jr      &HFE0A
FDE2:  D6 40 15 46  pre     iz,&H4615
FDE6:  B7 23        jr      &HFE0A
FDE8:  D6 40 24 46  pre     iz,&H4624
FDEC:  B7 1D        jr      &HFE0A
FDEE:  D6 40 36 46  pre     iz,&H4636
FDF2:  B7 17        jr      &HFE0A
FDF4:  D6 40 4E 46  pre     iz,&H464E
FDF8:  B7 11        jr      &HFE0A
FDFA:  D6 40 5E 46  pre     iz,&H465E
FDFE:  B7 0B        jr      &HFE0A
FE00:  D6 40 77 46  pre     iz,&H4677
FE04:  B7 05        jr      &HFE0A
FE06:  D6 40 88 46  pre     iz,&H4688
FE0A:  B7 67        jr      &HFE72
FE0C:  D6 40 99 46  pre     iz,&H4699
FE10:  B7 61        jr      &HFE72
FE12:  D6 40 AB 46  pre     iz,&H46AB
FE16:  B7 5B        jr      &HFE72
FE18:  D6 40 BB 46  pre     iz,&H46BB
FE1C:  B7 55        jr      &HFE72
FE1E:  D6 40 D2 46  pre     iz,&H46D2
FE22:  B7 4F        jr      &HFE72
FE24:  D6 40 E6 46  pre     iz,&H46E6
FE28:  B7 49        jr      &HFE72
FE2A:  D6 40 F7 46  pre     iz,&H46F7
FE2E:  B7 43        jr      &HFE72
FE30:  D6 40 07 47  pre     iz,&H4707
FE34:  B7 3D        jr      &HFE72
FE36:  D6 40 16 47  pre     iz,&H4716
FE3A:  B7 37        jr      &HFE72
FE3C:  D6 40 2D 47  pre     iz,&H472D
FE40:  B7 31        jr      &HFE72
FE42:  D6 40 A3 47  pre     iz,&H47A3
FE46:  B7 2B        jr      &HFE72
FE48:  D6 40 44 47  pre     iz,&H4744
FE4C:  D6 00 12 1D  pre     ix,&H1D12
FE50:  89 40        sbw     $0,$sz
FE52:  A0 00        stw     $0,(ix+$sx)
FE54:  B7 1D        jr      &HFE72
FE56:  D6 40 55 47  pre     iz,&H4755
FE5A:  B7 17        jr      &HFE72
FE5C:  D6 40 65 47  pre     iz,&H4765
FE60:  B7 11        jr      &HFE72
FE62:  D6 40 6C 47  pre     iz,&H476C
FE66:  B7 0B        jr      &HFE72
FE68:  D6 40 84 47  pre     iz,&H4784
FE6C:  B7 05        jr      &HFE72
FE6E:  D6 40 B5 47  pre     iz,&H47B5
FE72:  D6 00 39 17  pre     ix,&H1739
FE76:  20 1F        st      $31,(ix+$sx)
FE78:  77 23 03     cal     &H0323
FE7B:  77 71 9F     cal     &H9F71
FE7E:  29 00        ld      $0,(iz+$sx)
FE80:  D6 00 29 20  pre     ix,&H2029
FE84:  20 00        st      $0,(ix+$sx)
FE86:  77 79 85     cal     &H8579
FE89:  D6 00 F3 1C  pre     ix,&H1CF3
FE8D:  28 00        ld      $0,(ix+$sx)
FE8F:  41 00 02     sbc     $0,&H02
FE92:  B4 01        jr      nz,&HFE94
FE94:  9E 40        gre     iz,$0
FE96:  A6 01        phsw    $1
FE98:  77 80 9F     cal     &H9F80
FE9B:  D6 00 F3 1C  pre     ix,&H1CF3
FE9F:  28 00        ld      $0,(ix+$sx)
FEA1:  01 00        sbc     $0,$sx
FEA3:  74 FF FE     cal     nz,&HFEFF
FEA6:  D6 00 29 20  pre     ix,&H2029
FEAA:  42 00 FE     ld      $0,&HFE
FEAD:  3A 00        sbc     (ix+$sx),$0
FEAF:  70 3A FF     cal     z,&HFF3A
FEB2:  D6 00 29 20  pre     ix,&H2029
FEB6:  42 00 FD     ld      $0,&HFD
FEB9:  3A 00        sbc     (ix+$sx),$0
FEBB:  70 60 FF     cal     z,&HFF60
FEBE:  AE 0F        ppsw    $15
FEC0:  88 2F        adw     $15,$sy
FEC2:  77 78 9F     cal     &H9F78
FEC5:  D6 00 F3 1C  pre     ix,&H1CF3
FEC9:  3A 1E        sbc     (ix+$sx),$30
FECB:  B4 07        jr      nz,&HFED3
FECD:  D1 00 E8 1C  ldw     $0,&H1CE8
FED1:  10 5E        st      $30,($sz)
FED3:  D6 00 F3 1C  pre     ix,&H1CF3
FED7:  20 1F        st      $31,(ix+$sx)
FED9:  D6 00 F1 1C  pre     ix,&H1CF1
FEDD:  20 1F        st      $31,(ix+$sx)
FEDF:  D6 00 F2 1C  pre     ix,&H1CF2
FEE3:  20 1F        st      $31,(ix+$sx)
FEE5:  D6 00 2A 20  pre     ix,&H202A
FEE9:  A8 00        ldw     $0,(ix+$sx)
FEEB:  97 00        pre     ss,$0
FEED:  D6 00 2C 20  pre     ix,&H202C
FEF1:  A8 00        ldw     $0,(ix+$sx)
FEF3:  96 60        pre     us,$0
FEF5:  37 29 A1     jp      &HA129
FEF8:  01 00        sbc     $0,$sx
FEFA:  B0 01        jr      z,&HFEFC
FEFC:  37 1A CC     jp      &HCC1A
FEFF:  42 10 28     ld      $16,&H28
FF02:  77 E2 93     cal     &H93E2
FF05:  77 20 FF     cal     &HFF20
FF08:  42 10 29     ld      $16,&H29
FF0B:  77 E2 93     cal     &H93E2
FF0E:  42 10 20     ld      $16,&H20
FF11:  77 E2 93     cal     &H93E2
FF14:  42 10 3A     ld      $16,&H3A
FF17:  77 E2 93     cal     &H93E2
FF1A:  42 10 20     ld      $16,&H20
FF1D:  37 E2 93     jp      &H93E2
FF20:  D6 00 12 1D  pre     ix,&H1D12
FF24:  A8 0F        ldw     $15,(ix+$sx)
FF26:  77 B5 F4     cal     &HF4B5
FF29:  77 A7 13     cal     &H13A7
FF2C:  88 2F        adw     $15,$sy
FF2E:  96 4F        pre     iz,$15
FF30:  09 31        sb      $17,$sy
FF32:  F0           rtn     z
FF33:  2B 10        ldi     $16,(iz+$sx)
FF35:  77 E2 93     cal     &H93E2
FF38:  B7 89        jr      &HFEC2
FF3A:  42 10 27     ld      $16,&H27
FF3D:  77 E2 93     cal     &H93E2
FF40:  D6 00 70 1F  pre     ix,&H1F70
FF44:  A8 0F        ldw     $15,(ix+$sx)
FF46:  96 0F        pre     ix,$15
FF48:  D1 00 04 00  ldw     $0,&H0004
FF4C:  88 4F        adw     $15,$sz
FF4E:  28 31        ld      $17,(ix+$sy)
FF50:  77 D5 97     cal     &H97D5
FF53:  42 10 27     ld      $16,&H27
FF56:  77 E2 93     cal     &H93E2
FF59:  42 10 20     ld      $16,&H20
FF5C:  77 E2 93     cal     &H93E2
FF5F:  F7           rtn   
FF60:  D6 00 7C 1F  pre     ix,&H1F7C
FF64:  A8 00        ldw     $0,(ix+$sx)
FF66:  91 52        ldw     $18,($sz)
FF68:  41 13 03     sbc     $19,&H03
FF6B:  B0 0B        jr      z,&HFF77
FF6D:  41 13 08     sbc     $19,&H08
FF70:  B5 6A        jr      c,&HFFDB
FF72:  41 13 0F     sbc     $19,&H0F
FF75:  B1 65        jr      nc,&HFFDB
FF77:  42 10 27     ld      $16,&H27
FF7A:  77 E2 93     cal     &H93E2
FF7D:  41 13 03     sbc     $19,&H03
FF80:  B4 0C        jr      nz,&HFF8D
FF82:  41 12 36     sbc     $18,&H36
FF85:  B4 1B        jr      nz,&HFFA1
FF87:  D1 0F 17 43  ldw     $15,&H4317
FF8B:  B7 10        jr      &HFF9C
FF8D:  41 13 0A     sbc     $19,&H0A
FF90:  B1 07        jr      nc,&HFF98
FF92:  D1 0F 11 43  ldw     $15,&H4311
FF96:  B7 05        jr      &HFF9C
FF98:  D1 0F 14 43  ldw     $15,&H4314
FF9C:  77 78 9F     cal     &H9F78
FF9F:  B7 2F        jr      &HFFCF
FFA1:  49 12 29     sb      $18,&H29
FFA4:  02 73 12     ld      $19,$18
FFA7:  18 72        biu     $18
FFA9:  08 72 13     ad      $18,$19
FFAC:  09 73 13     sb      $19,$19
FFAF:  D1 00 87 42  ldw     $0,&H4287
FFB3:  88 60 12     adw     $0,$18
FFB6:  96 40        pre     iz,$0
FFB8:  77 71 9F     cal     &H9F71
FFBB:  42 11 03     ld      $17,&H03
FFBE:  2B 10        ldi     $16,(iz+$sx)
FFC0:  41 10 20     sbc     $16,&H20
FFC3:  B0 08        jr      z,&HFFCC
FFC5:  77 E2 93     cal     &H93E2
FFC8:  09 31        sb      $17,$sy
FFCA:  B4 8D        jr      nz,&HFF58
FFCC:  77 79 85     cal     &H8579
FFCF:  42 10 27     ld      $16,&H27
FFD2:  77 E2 93     cal     &H93E2
FFD5:  42 10 20     ld      $16,&H20
FFD8:  77 E2 93     cal     &H93E2
FFDB:  F7           rtn   
FFDC:  D6 00 34 11  pre     ix,&H1134
FFE0:  28 10        ld      $16,(ix+$sx)
FFE2:  41 10 02     sbc     $16,&H02
FFE5:  B4 0F        jr      nz,&HFFF5
FFE7:  D6 00 F2 1C  pre     ix,&H1CF2
FFEB:  28 00        ld      $0,(ix+$sx)
FFED:  44 00 80     anc     $0,&H80
FFF0:  B0 04        jr      z,&HFFF5
FFF2:  42 10 08     ld      $16,&H08
FFF5:  D6 00 60 4C  pre     ix,&H4C60
FFF9:  77 62 9F     cal     &H9F62
FFFC:  F7           rtn   
FFFD:  37 1F 53     jp      &H531F
```