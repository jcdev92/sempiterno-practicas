import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../auth/dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/auth/entities';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidPermissions } from 'src/auth/interfaces';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'An user with read permission can get all users',
    description: 'An user with read permission can get all users',
  })
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized, token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    type: Number,
    required: false,
  })
  @Auth(ValidPermissions.read)
  findAll(
    @Query() paginationDto: PaginationDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @GetUser() user: User,
  ) {
    return this.userService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({
    summary: 'An user with read permission can get a specific user',
    description: 'An user with read permission can get a specific user',
  })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized, token not valid' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @Auth(ValidPermissions.read)
  findOne(
    @Param('term') term: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @GetUser() user: User,
  ) {
    return this.userService.findOne(term);
  }

  @Get('role/:term')
  @ApiOperation({
    summary:
      'An user with administrator permission can get a specific user with their respective roles and permissions',
    description:
      'An user with administrator permission can get a specific user with their respective roles and permissions',
  })
  @ApiResponse({ status: 200, description: 'User with role found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized, token not valid' })
  @ApiResponse({ status: 404, description: 'User with role not found' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @Auth(ValidPermissions.administrator)
  findOneWithRolesAndPermissions(
    @Param('term') term: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @GetUser() user: User,
  ) {
    return this.userService.findOneWithRolesAndPermissions(term);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'An user with write permission can update a user',
    description: 'An user with write permission can update a user',
  })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized, token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Auth(ValidPermissions.write)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @GetUser() user: User,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'An user with delete permission can delete a user',
    description: 'An user with delete permission can delete a user',
  })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized, token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Auth(ValidPermissions.delete)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @GetUser() user: User,
  ) {
    return this.userService.remove(id);
  }
}
