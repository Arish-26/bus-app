import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { UserSession } from '@/utils/storage';

interface LoginScreenProps {
  onLogin: (session: UserSession) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [identifier, setIdentifier] = useState('');

  const handleLoginSubmit = () => {
    const trimmed = identifier.trim();

    if (!trimmed) {
      if (role === 'student') {
        Alert.alert('Roll Number Required', 'Please enter your student Roll Number.');
      } else {
        Alert.alert('Admin Name Required', 'Please enter your secret Admin Name.');
      }
      return;
    }

    if (role === 'student') {
      // Validate roll number range: 20924U48001 to 20924U48036
      const suffix = trimmed.toUpperCase().match(/^20924U48(\d+)$/);
      const rollNum = suffix ? parseInt(suffix[1], 10) : NaN;
      if (!trimmed.toUpperCase().startsWith('20924U48') || isNaN(rollNum) || rollNum < 1 || rollNum > 36) {
        Alert.alert(
          'Access Denied',
          'Invalid Student Roll Number. Allowed roll numbers are from 20924U48001 to 20924U48036.'
        );
        return;
      }
    } else {
      // Validate secret admin name: "batman"
      if (trimmed.toLowerCase() !== 'batman') {
        Alert.alert(
          'Access Denied',
          'Invalid Admin Secret Name. Access is restricted to authorized admin.'
        );
        return;
      }
    }

    onLogin({
      role,
      identifier: role === 'admin' ? 'batman' : trimmed.toUpperCase(),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#182645" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.cardContainer}>
          {/* Header Banner */}
          <View style={styles.headerBanner}>
            <Text style={styles.collegeSub}>SHANMUGA INDUSTRIES ARTS &amp; SCIENCE COLLEGE</Text>
            <Text style={styles.collegeLocation}>Tiruvannamalai - 606 601</Text>
            <Text style={styles.appTitle}>
              Campus <Text style={styles.amberText}>Bus</Text> Tracker
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Select Login Role</Text>

            {/* Role Switcher */}
            <View style={styles.roleTabs}>
              <TouchableOpacity
                style={[styles.roleTab, role === 'student' && styles.roleTabActive]}
                onPress={() => {
                  setRole('student');
                  setIdentifier('');
                }}
              >
                <Text
                  style={[
                    styles.roleTabText,
                    role === 'student' && styles.roleTabTextActive,
                  ]}
                >
                  🎓 Student
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleTab, role === 'admin' && styles.roleTabActive]}
                onPress={() => {
                  setRole('admin');
                  setIdentifier('');
                }}
              >
                <Text
                  style={[
                    styles.roleTabText,
                    role === 'admin' && styles.roleTabTextActive,
                  ]}
                >
                  🛠️ Admin
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input Field */}
            {role === 'student' ? (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Student Roll Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 20924U48001"
                  placeholderTextColor="#94A3B8"
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="characters"
                  maxLength={12}
                />
                <Text style={styles.inputHint}>Valid range: 20924U48001 to 20924U48036</Text>
              </View>
            ) : (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Admin Secret Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter secret admin name"
                  placeholderTextColor="#94A3B8"
                  value={identifier}
                  onChangeText={setIdentifier}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity style={styles.loginBtn} activeOpacity={0.85} onPress={handleLoginSubmit}>
              <Text style={styles.loginBtnText}>
                {role === 'student' ? 'View Bus Directory' : 'Admin Login'}
              </Text>
            </TouchableOpacity>

            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>
                {role === 'student'
                  ? 'ℹ️ Students can view all 50 bus details, routes & call drivers.'
                  : '⚡ Admin can edit bus driver details, add new buses & remove buses.'}
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#182645',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  headerBanner: {
    backgroundColor: '#182645',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#FFC93C',
  },
  collegeSub: {
    color: '#FFC93C',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  collegeLocation: {
    color: '#B9C2DC',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 8,
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  amberText: {
    color: '#FFC93C',
  },
  formContainer: {
    padding: 24,
    gap: 16,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#182645',
    textAlign: 'center',
  },
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  roleTabActive: {
    backgroundColor: '#182645',
  },
  roleTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  roleTabTextActive: {
    color: '#FFC93C',
  },
  inputGroup: {
    gap: 6,
    marginTop: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
  },
  inputHint: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
  },
  loginBtn: {
    backgroundColor: '#182645',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FFC93C',
  },
  loginBtnText: {
    color: '#FFC93C',
    fontSize: 16,
    fontWeight: '800',
  },
  infoBadge: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
  },
  infoBadgeText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    textAlign: 'center',
  },
});
