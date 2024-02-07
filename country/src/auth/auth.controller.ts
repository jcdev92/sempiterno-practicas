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
import { RoleService } from './services/role/role.service';
import { PermissionService } from './services';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
  ) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('role')
  @Auth(ValidPermissions.administrator)
  getRoles() {
    return this.roleService.getRoles();
  }

  @Get('role/:term')
  @Auth(ValidPermissions.administrator)
  getRolesByTerm(@Param('term') term: string) {
    return this.roleService.findRole(term);
  }

  @Post('role')
  @Auth(ValidPermissions.administrator)
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Patch('role/:term')
  @Auth(ValidPermissions.administrator)
  updateRole(
    @Param('term') term: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.updateRole(updateRoleDto, term);
  }

  @Delete('role/:id')
  @Auth(ValidPermissions.administrator)
  deleteRole(@Param('id') id: number) {
    return this.roleService.deleteRole(id);
  }

  @Get('permissions')
  @Auth(ValidPermissions.administrator)
  getPermissions() {
    return this.permissionService.getPermissions();
  }
}
