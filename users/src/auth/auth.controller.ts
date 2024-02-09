import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateRoleDto,
  CreateUserDto,
  LoginUserDto,
  UpdateRoleDto,
} from './dto';
import { Auth } from './decorators';
import { ValidPermissions } from './interfaces';
import { RolePermissionService } from './services/role/role-permission.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rolePermissionService: RolePermissionService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'User register',
    description:
      'Yo can register a user, and by default it have the "user" role with the "read" permission only',
  })
  @ApiResponse({ status: 201, description: 'User was created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Logged in' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized, check credentials' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('role')
  @ApiOperation({
    summary:
      'An user with administrator permission can get all the roles availables',
    description:
      'An user with administrator permission can get all the roles availables',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 401, description: 'Unauthorized, token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Auth(ValidPermissions.administrator)
  getRoles() {
    return this.rolePermissionService.getRoles();
  }

  @Get('role/:term')
  @ApiOperation({
    summary: 'An user with administrator permission can get a specific role',
    description:
      'An user with administrator permission can get a specific role',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 401, description: 'Unauthorized, token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 404, description: 'role not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Auth(ValidPermissions.administrator)
  getRolesByTerm(@Param('term') term: string) {
    return this.rolePermissionService.findRole(term);
  }

  @Post('role')
  @ApiOperation({
    summary:
      'An user with administrator permission can create a role and assing permissions to it',
    description:
      'An user with administrator permission can create a role and assing permissions to it',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Role created!' })
  @ApiResponse({ status: 401, description: 'Unauthorized, token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Auth(ValidPermissions.administrator)
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolePermissionService.createRole(createRoleDto);
  }

  @Patch('role/:term')
  @ApiOperation({
    summary:
      'An user with administrator permission can update a role and assing permissions to it',
    description:
      'An user with administrator permission can update a role and assing permissions to it',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Role updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized, token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 404, description: 'role not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Auth(ValidPermissions.administrator)
  updateRole(
    @Param('term') term: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolePermissionService.updateRole(updateRoleDto, term);
  }

  @Delete('role/:id')
  @ApiOperation({
    summary: 'An user with administrator permission can delete a role',
    description: 'An user with administrator permission can delete a role',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Role deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized, token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 404, description: 'role not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Auth(ValidPermissions.administrator)
  deleteRole(@Param('id') id: number) {
    return this.rolePermissionService.deleteRole(id);
  }

  @Get('permissions')
  @ApiOperation({
    summary:
      'An user with administrator permission can see all of the permissions available',
    description:
      'An user with administrator permission can see all of the permissions available',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 401, description: 'Unauthorized, token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Auth(ValidPermissions.administrator)
  getPermissions() {
    return this.rolePermissionService.getPermissions();
  }
}
