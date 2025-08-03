import { useAuth } from "../context/AuthContext";

interface MenuPermission {
  name: string;
  canEdit: boolean;
  canDelete: boolean;
}

interface Permissions {
  allowedMenus: MenuPermission[];
}

const menuNames = ["user", "membership", "transaction"] as const;

type MenuName = (typeof menuNames)[number];

type RawPermissionMap = {
  [menuName in MenuName]: {
    canEdit: boolean;
    canDelete: boolean;
  };
};

const rawRolePermissions: Record<string, RawPermissionMap> = {
  OWNER: {
    user: { canEdit: true, canDelete: true },
    membership: { canEdit: true, canDelete: true },
    transaction: { canEdit: true, canDelete: true },
  },
  ADMIN: {
    user: { canEdit: true, canDelete: true },
    membership: { canEdit: true, canDelete: false },
    transaction: { canEdit: false, canDelete: true },
  },
  CASHIER: {
    user: { canEdit: false, canDelete: false },
    membership: { canEdit: false, canDelete: false },
    transaction: { canEdit: false, canDelete: false },
  },
  SPV: {
    user: { canEdit: true, canDelete: false },
    membership: { canEdit: true, canDelete: true },
    transaction: { canEdit: true, canDelete: true },
  },
};

export const rolePermissions: Record<string, Permissions> = Object.fromEntries(
  Object.entries(rawRolePermissions).map(([role, menus]) => [
    role,
    {
      allowedMenus: Object.entries(menus).map(([name, perms]) => ({
        name,
        ...perms,
      })),
    },
  ])
);

export const useRole = (menu: string) => {
  const { user } = useAuth();
  const roleName = user?.role_name?.toUpperCase() || "CASHIER";

  const permissions = rolePermissions[roleName];

  if (!permissions) {
    return { canEdit: false, canDelete: false };
  }

  const allowedMenu = permissions.allowedMenus.find((m) => m.name === menu);

  return {
    canEdit: allowedMenu?.canEdit ?? false,
    canDelete: allowedMenu?.canDelete ?? false,
  };
};
