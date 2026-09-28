import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface AdminUnlockModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminUnlockModal({
  visible,
  onClose,
  onSuccess,
}: AdminUnlockModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (!visible) return null;

  const handleUnlock = () => {
    if (code.trim().toLowerCase() === 'batman') {
      setCode('');
      setError('');
      onSuccess();
    } else {
      setError('Incorrect secret admin code. Please try again.');
    }
  };

  const handleCancel = () => {
    setCode('');
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>🔒 Admin Access Unlock</Text>
              <TouchableOpacity onPress={handleCancel} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.body}>
              <Text style={styles.label}>Enter Secret Admin Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter secret code"
                placeholderTextColor="#94A3B8"
                value={code}
                onChangeText={(text) => {
                  setCode(text);
                  setError('');
                }}
                secureTextEntry
                autoCapitalize="none"
                autoFocus
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.unlockBtn} activeOpacity={0.85} onPress={handleUnlock}>
                  <Text style={styles.unlockBtnText}>Unlock Admin Mode</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  keyboardView: {
    width: '100%',
    maxWidth: 400,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    backgroundColor: '#182645',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
    borderBottomColor: '#FFC93C',
  },
  headerTitle: {
    color: '#FFC93C',
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    padding: 20,
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  unlockBtn: {
    flex: 1,
    backgroundColor: '#182645',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFC93C',
  },
  unlockBtnText: {
    color: '#FFC93C',
    fontSize: 14,
    fontWeight: '700',
  },
  cancelBtn: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
});
