import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Bus, DEFAULT_BUS_IMG } from '@/utils/storage';

interface BusModalProps {
  visible: boolean;
  bus: Bus | null;
  mode: 'view' | 'edit' | 'add';
  onClose: () => void;
  onSave: (updatedBus: Bus) => void;
  onDelete?: (busNumber: number) => void;
}

export default function BusModal({
  visible,
  bus,
  mode: initialMode,
  onClose,
  onSave,
  onDelete,
}: BusModalProps) {
  const [mode, setMode] = useState<'view' | 'edit' | 'add'>(initialMode);
  const [busNumber, setBusNumber] = useState<string>('');
  const [driver, setDriver] = useState('');
  const [contact, setContact] = useState('');
  const [route, setRoute] = useState('');
  const [photo, setPhoto] = useState('');
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    if (bus) {
      setBusNumber(String(bus.number));
      setDriver(bus.driver || '');
      setContact(bus.contact || '');
      setRoute(bus.route || '');
      setPhoto(bus.photo || '');
    } else {
      setBusNumber('');
      setDriver('');
      setContact('');
      setRoute('');
      setPhoto('');
    }
  }, [bus, initialMode, visible]);

  if (!visible) return null;

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'Permission to access gallery is required!');
        return;
      }

      setLoadingImage(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.base64) {
          setPhoto(`data:image/jpeg;base64,${asset.base64}`);
        } else {
          setPhoto(asset.uri);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to select photo.');
    } finally {
      setLoadingImage(false);
    }
  };

  const handleCall = () => {
    if (!contact) return;
    const cleanNum = contact.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanNum}`).catch(() => {
      Alert.alert('Error', 'Unable to initiate call on this device.');
    });
  };

  const handleSave = () => {
    const num = parseInt(busNumber.trim(), 10);
    if (isNaN(num) || num <= 0) {
      Alert.alert('Invalid Number', 'Please enter a valid bus number.');
      return;
    }

    const updated: Bus = {
      number: num,
      driver: driver.trim(),
      contact: contact.trim(),
      route: route.trim(),
      photo: photo.trim(),
    };

    onSave(updated);
  };

  const handleDelete = () => {
    if (!bus || !onDelete) return;
    const confirmDelete = () => onDelete(bus.number);

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(`Remove Bus ${bus.number} from the directory?`)) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        'Remove Bus',
        `Are you sure you want to remove Bus ${bus.number} from the directory?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: confirmDelete,
          },
        ]
      );
    }
  };

  const imageSource = photo ? { uri: photo } : DEFAULT_BUS_IMG;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleGroup}>
              <Text style={styles.headerTitle}>
                {mode === 'add'
                  ? 'Add New Bus'
                  : mode === 'edit'
                  ? `Edit Bus ${busNumber}`
                  : `Bus ${busNumber}`}
              </Text>
              {mode === 'view' && route ? (
                <Text style={styles.headerSub}>{route}</Text>
              ) : null}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 24 }}>
            {/* Bus Photo Banner */}
            <View style={styles.imageContainer}>
              <Image source={imageSource} style={styles.bannerImage} resizeMode="cover" />
              {loadingImage && (
                <View style={styles.imageLoadingOverlay}>
                  <ActivityIndicator size="large" color="#FFC93C" />
                </View>
              )}
            </View>

            {mode === 'view' ? (
              /* VIEW MODE */
              <View style={styles.viewSection}>
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Driver Name</Text>
                  <Text style={styles.fieldValue}>
                    {driver || <Text style={styles.emptyText}>Not assigned</Text>}
                  </Text>
                </View>

                <View style={styles.fieldRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Contact Number</Text>
                    <Text style={styles.fieldValue}>
                      {contact || <Text style={styles.emptyText}>Not provided</Text>}
                    </Text>
                  </View>
                  {contact ? (
                    <TouchableOpacity style={styles.callButton} onPress={handleCall}>
                      <Text style={styles.callButtonText}>📞 Call Driver</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Route Location (Start ➔ Campus)</Text>
                  <Text style={styles.fieldValue}>
                    {route || <Text style={styles.emptyText}>No route details</Text>}
                  </Text>
                </View>

                {/* Actions available to all users */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => setMode('edit')}
                  >
                    <Text style={styles.primaryButtonText}>Edit Bus Details</Text>
                  </TouchableOpacity>
                </View>

                {onDelete && (
                  <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteButtonText}>Remove this Bus</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              /* EDIT / ADD MODE (ADMIN) */
              <View style={styles.formSection}>
                {mode === 'add' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Bus Number</Text>
                    <TextInput
                      style={styles.input}
                      value={busNumber}
                      onChangeText={setBusNumber}
                      keyboardType="number-pad"
                      placeholder="e.g. 51"
                      placeholderTextColor="#999"
                    />
                  </View>
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Driver Name</Text>
                  <TextInput
                    style={styles.input}
                    value={driver}
                    onChangeText={setDriver}
                    placeholder="e.g. R. Kumar"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Contact Number</Text>
                  <TextInput
                    style={styles.input}
                    value={contact}
                    onChangeText={setContact}
                    keyboardType="phone-pad"
                    placeholder="e.g. 98765 43210"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Route Location (Start ➔ Campus)</Text>
                  <TextInput
                    style={styles.input}
                    value={route}
                    onChangeText={setRoute}
                    placeholder="e.g. Polur ➔ Campus"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Bus Photo</Text>
                  <View style={styles.photoActions}>
                    <TouchableOpacity style={styles.photoPickBtn} onPress={handlePickImage}>
                      <Text style={styles.photoPickBtnText}>📷 Select Photo</Text>
                    </TouchableOpacity>
                    {photo ? (
                      <TouchableOpacity
                        style={styles.photoRemoveBtn}
                        onPress={() => setPhoto('')}
                      >
                        <Text style={styles.photoRemoveBtnText}>Remove</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
                    <Text style={styles.primaryButtonText}>
                      {mode === 'add' ? 'Add Bus' : 'Save Changes'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      if (mode === 'add') onClose();
                      else setMode('view');
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '88%',
    minHeight: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#182645',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerTitleGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFC93C',
  },
  headerSub: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeBtn: {
    padding: 8,
  },
  closeBtnText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  imageLoadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewSection: {
    gap: 14,
  },
  fieldRow: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#94A3B8',
  },
  callButton: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  formSection: {
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: '#0F172A',
  },
  photoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  photoPickBtn: {
    backgroundColor: '#182645',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  photoPickBtnText: {
    color: '#FFC93C',
    fontWeight: '600',
    fontSize: 13,
  },
  photoRemoveBtn: {
    paddingVertical: 8,
  },
  photoRemoveBtnText: {
    color: '#DC2626',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#182645',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '600',
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
