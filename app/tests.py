from config.wsgi import *
from core.security.models import *
from django.contrib.auth.models import Permission
from core.pos.models import *

dashboard = Dashboard()
dashboard.name = 'Polariss'
dashboard.icon = 'fas fa-shopping-cart'
dashboard.layout = 2
dashboard.card = ' '
dashboard.navbar = 'navbar-dark navbar-primary'
dashboard.brand_logo = ' '
dashboard.sidebar = 'sidebar-light-primary'
dashboard.save()

company = Company()
company.name = 'RESTAURANTE'
company.ruc = '000000000000001'
company.email = 'restaurante@gmail.com'
company.phone = '0000001'
company.mobile = '123456789'
company.desc = 'Venta de comida marina'
company.website = 'restauranteXD.com'
company.address = 'Jr. Ucayali SN'
company.igv = 18.00
company.save()

type = ModuleType()
type.name = 'Seguridad'
type.icon = 'fas fa-lock'
type.save()
print('insertado {}'.format(type.name))

module = Module()
module.moduletype_id = 1
module.name = 'Tipos de Módulos'
module.url = '/security/module/type/'
module.is_active = True
module.is_vertical = True
module.is_visible = True
module.icon = 'fas fa-door-open'
module.description = 'Permite administrar los tipos de módulos del sistema'
module.save()
for p in Permission.objects.filter(content_type__model=ModuleType._meta.label.split('.')[1].lower()):
    module.permits.add(p)
print('insertado {}'.format(module.name))

module = Module()
module.moduletype_id = 1
module.name = 'Módulos'
module.url = '/security/module/'
module.is_active = True
module.is_vertical = True
module.is_visible = True
module.icon = 'fas fa-th-large'
module.description = 'Permite administrar los módulos del sistema'
module.save()
for p in Permission.objects.filter(content_type__model=Module._meta.label.split('.')[1].lower()):
    module.permits.add(p)
print('insertado {}'.format(module.name))

module = Module()
module.moduletype_id = 1
module.name = 'Grupos'
module.url = '/security/group/'
module.is_active = True
module.is_vertical = True
module.is_visible = True
module.icon = 'fas fa-users'
module.description = 'Permite administrar los grupos de usuarios del sistema'
module.save()
for p in Permission.objects.filter(content_type__model=Group._meta.label.split('.')[1].lower()):
    module.permits.add(p)
print('insertado {}'.format(module.name))

module = Module()
module.moduletype_id = 1
module.name = 'Respaldos'
module.url = '/security/database/backups/'
module.is_active = True
module.is_vertical = True
module.is_visible = True
module.icon = 'fas fa-database'
module.description = 'Permite administrar los respaldos de base de datos'
module.save()
for p in Permission.objects.filter(content_type__model=DatabaseBackups._meta.label.split('.')[1].lower()):
    module.permits.add(p)
print('insertado {}'.format(module.name))

module = Module()
module.moduletype_id = 1
module.name = 'Conf. Dashboard'
module.url = '/security/dashboard/update/'
module.is_active = True
module.is_vertical = True
module.is_visible = True
module.icon = 'fas fa-tools'
module.description = 'Permite configurar los datos de la plantilla'
module.save()
print('insertado {}'.format(module.name))

module = Module()
module.moduletype_id = 1
module.name = 'Accesos'
module.url = '/security/access/users/'
module.is_active = True
module.is_vertical = True
module.is_visible = True
module.icon = 'fas fa-user-secret'
module.description = 'Permite administrar los accesos de los usuarios'
module.save()
for p in Permission.objects.filter(content_type__model=AccessUsers._meta.label.split('.')[1].lower()):
    module.permits.add(p)
print('insertado {}'.format(module.name))

module = Module()
module.moduletype_id = 1
module.name = 'Usuarios'
module.url = '/user/'
module.is_active = True
module.is_vertical = True
module.is_visible = True
module.icon = 'fas fa-user'
module.description = 'Permite administrar a los administradores del sistema'
module.save()
for p in Permission.objects.filter(content_type__model=User._meta.label.split('.')[1].lower()):
    module.permits.add(p)
print('insertado {}'.format(module.name))

type = ModuleType()
type.name = 'Restaurante'
type.icon = 'fas fa-utensils'#working
type.save()
print('insertado {}'.format(type.name))

module = Module()
module.moduletype_id = 2
module.name = 'Categorías'
module.url = '/pos/scm/category/'
module.is_active = True
module.is_vertical = True
module.is_visible = True
module.icon = 'fas fa-table'#working
module.description = 'Permite administrar las categorías de los productos'
module.save()
for p in Permission.objects.filter(content_type__model=Category._meta.label.split('.')[1].lower()):
    module.permits.add(p)
print('insertado {}'.format(module.name))

module = Module()
module.moduletype_id = 2
module.name = 'Productos'
module.url = '/pos/scm/product/'
module.is_active = True
module.is_vertical = True
module.is_visible = True
module.icon = "fas fa-drumstick-bite"
module.description = 'Permite administrar los productos del sistema'
module.save()
for p in Permission.objects.filter(content_type__model=Product._meta.label.split('.')[1].lower()):
    module.permits.add(p)
print('insertado {}'.format(module.name))


module = Module()
module.moduletype_id = 2
module.name = 'Mesas'
module.url = '/pos/scm/mesa/'
module.is_active = True
module.is_vertical = True
module.is_visible = True
module.icon = 'fas fa-concierge-bell'#working
module.description = 'Permite administrar las mesas del restaurante y hacer pedidos en el local'
module.save()
for p in Permission.objects.filter(content_type__model=Mesa._meta.label.split('.')[1].lower()):
    module.permits.add(p)
print('insertado {}'.format(module.name))


module = Module()
module.moduletype_id = 2
module.name = 'Órdenes'
module.url = '/pos/scm/orders/'
module.is_active = True
module.is_vertical = True
module.is_visible = True
module.icon = 'fas fa-clipboard'#working
module.description = 'Permite administrar los pedidos hechos desde las mesas'
module.save()
for p in Permission.objects.filter(content_type__model=Sale._meta.label.split('.')[1].lower()):
    module.permits.add(p)
print('insertado {}'.format(module.name))


type = ModuleType()
type.name = 'Administrativo'
type.icon = 'fas fa-hand-holding-usd'
type.save()
print('insertado {}'.format(type.name))

module = Module()
module.moduletype_id = 3
module.name = 'Clientes'
module.url = '/pos/crm/client/'
module.is_active = True
module.is_vertical = True
module.is_visible = True
module.icon = 'fas fa-user-friends'
module.description = 'Permite administrar los clientes del sistema'
module.save()
for p in Permission.objects.filter(content_type__model=Client._meta.label.split('.')[1].lower()):
    module.permits.add(p)
print('insertado {}'.format(module.name))

module = Module()
module.moduletype_id = 3
module.name = 'Ventas'
module.url = '/pos/crm/sale/admin/'
module.is_active = True
module.is_vertical = True
module.is_visible = True
module.icon = 'fas fa-shopping-cart'
module.description = 'Permite administrar las ventas de los productos'
module.save()
for p in Permission.objects.filter(content_type__model=Sale._meta.label.split('.')[1].lower()):
    module.permits.add(p)
print('insertado {}'.format(module.name))

module = Module()
module.moduletype_id = 3
module.name = 'Cuentas por cobrar'
module.url = '/pos/frm/ctas/collect/'
module.is_active = True
module.is_vertical = True
module.is_visible = True
module.icon = 'fas fa-funnel-dollar'
module.description = 'Permite administrar las cuentas por cobrar de los clientes'
module.save()
for p in Permission.objects.filter(content_type__model=CtasCollect._meta.label.split('.')[1].lower()):
    module.permits.add(p)
print('insertado {}'.format(module.name))


module = Module()
module.name = 'Ventas'
module.url = '/pos/crm/sale/client/'
module.is_active = True
module.is_vertical = False
module.is_visible = True
module.icon = 'fas fa-shopping-cart'
module.description = 'Permite administrar las ventas de los productos'
module.save()
print('insertado {}'.format(module.name))


type = ModuleType()
type.name = 'Reportes'
type.icon = 'fas fa-chart-pie'
type.save()
print('insertado {}'.format(type.name))

module = Module()
module.moduletype_id = 4
module.name = 'Ventas'
module.url = '/reports/sale/'
module.is_active = True
module.is_vertical = True
module.is_visible = True
module.icon = 'fas fa-chart-bar'
module.description = 'Permite ver los reportes de las ventas'
module.save()
print('insertado {}'.format(module.name))


module = Module()
module.moduletype_id = 4
module.name = 'Cuentas por Cobrar'
module.url = '/reports/ctas/collect/'
module.is_active = True
module.is_vertical = True
module.is_visible = True
module.icon = 'fas fa-chart-bar'
module.description = 'Permite ver los reportes de las cuentas por cobrar'
module.save()
print('insertado {}'.format(module.name))


module = Module()
module.name = 'Cambiar password'
module.url = '/user/update/password/'
module.is_active = True
module.is_vertical = False
module.is_visible = True
module.icon = 'fas fa-key'
module.description = 'Permite cambiar tu password de tu cuenta'
module.save()
print('insertado {}'.format(module.name))

module = Module()
module.name = 'Editar perfil'
module.url = '/user/update/profile/'
module.is_active = True
module.is_vertical = False
module.is_visible = True
module.icon = 'fas fa-user'
module.description = 'Permite cambiar la información de tu cuenta'
module.save()
print('insertado {}'.format(module.name))

module = Module()
module.name = 'Editar perfil'
module.url = '/pos/crm/client/update/profile/'
module.is_active = True
module.is_vertical = False
module.is_visible = True
module.icon = 'fas fa-user'
module.description = 'Permite cambiar la información de tu cuenta'
module.save()
print('insertado {}'.format(module.name))

module = Module()
module.name = 'Compañia'
module.url = '/pos/crm/company/update/'
module.is_active = True
module.is_vertical = False
module.is_visible = True
module.icon = 'fas fa-building'
module.description = 'Permite gestionar la información de la compañia'
module.save()
print('insertado {}'.format(module.name))

group = Group()
group.name = 'Administrador'
group.save()
print('insertado {}'.format(group.name))
for m in Module.objects.filter().exclude(url__in=['/pos/crm/client/update/profile/', '/pos/crm/sale/client/']):
    gm = GroupModule()
    gm.module = m
    gm.group = group
    gm.save()
    for perm in m.permits.all():
        group.permissions.add(perm)
        grouppermission = GroupPermission()
        grouppermission.module_id = m.id
        grouppermission.group_id = group.id
        grouppermission.permission_id = perm.id
        grouppermission.save()

group = Group()
group.name = 'Cliente'
group.save()
print('insertado {}'.format(group.name))
for m in Module.objects.filter(url__in=['/pos/crm/client/update/profile/', '/pos/crm/sale/client/', '/user/update/password/']).exclude():
    gm = GroupModule()
    gm.module = m
    gm.group = group
    gm.save()

u = User()
u.first_name = 'Cristhian'
u.last_name = 'Chancha Calderon'
u.username = 'admin'
u.dni = '10462002039'
u.email = 'naihtsircnaihtsirc@gmail.com'
u.is_active = True
u.is_superuser = True
u.is_staff = True
u.set_password('Enyaeslamejor12')
u.save()
group = Group.objects.get(pk=1)
u.groups.add(group)
