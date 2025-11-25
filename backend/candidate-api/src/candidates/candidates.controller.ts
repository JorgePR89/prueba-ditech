import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';

@Controller('candidates')
export class CandidatesController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadCandidate(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
    @Body('surname') surname: string,
  ) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const [row] = data;

    const result = {
      name,
      surname,
      seniority: (row?.[0] as string) ?? null,
      years: (row?.[1] as number) ?? null,
      availability:
        typeof row?.[2] === 'string'
          ? row[2].toLowerCase() === 'true' || row[2] === '1'
          : !!row?.[2],
    };

    return result;
  }
}
