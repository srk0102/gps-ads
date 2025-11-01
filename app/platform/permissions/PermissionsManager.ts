import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export type PermissionName = 'camera' | 'location' | 'storage';

const permissionMap: Record<PermissionName, string> = {
  camera: Platform.select({
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
    default: ''
  })!,
  location: Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    default: ''
  })!,
  storage: Platform.select({
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    default: ''
  })!
};

export class PermissionsManager {
  public async ensure(permission: PermissionName): Promise<boolean> {
    const target = permissionMap[permission];
    const status = await check(target);
    if (status === RESULTS.GRANTED) {
      return true;
    }
    const result = await request(target);
    return result === RESULTS.GRANTED;
  }
}
