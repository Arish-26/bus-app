import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  useWindowDimensions,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import {
  loadBuses,
  saveBuses,
  hasDetails,
  Bus,
  DEFAULT_BUS_IMG,
  UserSession,
  getSavedSession,
  saveSession,
  clearSession,
} from '@/utils/storage';
import BusModal from '@/components/BusModal';
import LoginScreen from '@/components/LoginScreen';

export default function HomeScreen() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'filled' | 'empty'>('all');

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view');

  const { width } = useWindowDimensions();
  const numColumns = width > 500 ? 4 : 3;

  // Load User Session & Bus Data
  useEffect(() => {
    async function init() {
      const savedSession = await getSavedSession();
      if (savedSession) {
        setSession(savedSession);
      }
      setCheckingSession(false);
    }
    init();
  }, []);

  const fetchBuses = useCallback(async () => {
    try {
      const data = await loadBuses();
      setBuses(data);
    } catch (err) {
      console.error('Error fetching buses:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchBuses();
    }
  }, [session, fetchBuses]);

  const handleLogin = async (newSession: UserSession) => {
    setSession(newSession);
    await saveSession(newSession);
  };

  const handleLogout = async () => {
    const doLogout = async () => {
      await clearSession();
      setSession(null);
    };

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm('Are you sure you want to log out?')) {
        await doLogout();
      }
    } else {
      Alert.alert('Logout', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: doLogout,
        },
      ]);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBuses();
  };

  const handleOpenBus = (bus: Bus) => {
    setSelectedBus(bus);
    setModalMode('view');
    setModalVisible(true);
  };

  const handleOpenAdd = () => {
    let nextNum = 1;
    const taken = new Set(buses.map((b) => b.number));
    while (taken.has(nextNum)) nextNum++;

    setSelectedBus({ number: nextNum, driver: '', contact: '98765 43210', route: '', photo: '' });
    setModalMode('add');
    setModalVisible(true);
  };

  const handleSaveBus = async (updatedBus: Bus) => {
    let updatedList: Bus[];
    const existsIndex = buses.findIndex((b) => b.number === updatedBus.number);

    if (existsIndex >= 0) {
      updatedList = [...buses];
      updatedList[existsIndex] = updatedBus;
    } else {
      updatedList = [...buses, updatedBus];
    }

    updatedList.sort((a, b) => a.number - b.number);

    setBuses(updatedList);
    await saveBuses(updatedList);
    setModalVisible(false);
  };

  const handleDeleteBus = async (busNumber: number) => {
    const updatedList = buses.filter((b) => b.number !== busNumber);
    setBuses(updatedList);
    await saveBuses(updatedList);
    setModalVisible(false);
  };

  if (checkingSession) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFC93C" />
      </View>
    );
  }

  // Show Login Screen if no active session
  if (!session) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Filtered bus list
  const filteredBuses = buses.filter((bus) => {
    const filled = hasDetails(bus);
    if (filterMode === 'filled' && !filled) return false;
    if (filterMode === 'empty' && filled) return false;

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      String(bus.number).includes(query) ||
      bus.driver.toLowerCase().includes(query) ||
      bus.route.toLowerCase().includes(query) ||
      bus.contact.includes(query)
    );
  });

  const totalFilled = buses.filter(hasDetails).length;

  const renderTile = ({ item }: { item: Bus }) => {
    const filled = hasDetails(item);
    const bgImage = item.photo ? { uri: item.photo } : DEFAULT_BUS_IMG;

    return (
      <TouchableOpacity
        style={styles.tileWrapper}
        activeOpacity={0.8}
        onPress={() => handleOpenBus(item)}
      >
        <ImageBackground source={bgImage} style={styles.tileImage} imageStyle={styles.tileImgStyle}>
          <View style={styles.tileOverlay}>
            <View style={styles.tileHeader}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.number}</Text>
              </View>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: filled ? '#22C55E' : '#94A3B8' },
                ]}
              />
            </View>
            {item.route ? (
              <Text style={styles.tileRouteSnippet} numberOfLines={1}>
                {item.route}
              </Text>
            ) : null}
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#182645" />

      {/* College & App Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.collegeName}>
              SHANMUGA INDUSTRIES ARTS &amp; SCIENCE COLLEGE
            </Text>
            <Text style={styles.appTitle}>
              Campus <Text style={styles.amberText}>Bus</Text> Tracker
            </Text>
          </View>

          {/* User Session & Logout */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>Logout ðŸšª</Text>
          </TouchableOpacity>
        </View>

        {/* User Identity Bar */}
        <View style={styles.sessionBar}>
          <Text style={styles.sessionBarText}>
            ðŸ‘¤ {session.role === 'admin' ? 'Admin Mode:' : 'Student Roll #:'}{' '}
            <Text style={styles.boldAmber}>{session.identifier}</Text>
          </Text>
        </View>

        {/* Stats bar */}
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>
            ðŸšŒ Total: <Text style={styles.boldText}>{buses.length}</Text>
          </Text>
          <Text style={styles.statsText}>
            âœ… Routes: <Text style={styles.boldText}>{totalFilled}</Text>
          </Text>
          <Text style={styles.statsText}>
            âš ï¸ Pending: <Text style={styles.boldText}>{buses.length - totalFilled}</Text>
          </Text>
        </View>
      </View>

      {/* Control Panel: Search & Filter Tabs */}
      <View style={styles.controlPanel}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>ðŸ”</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search bus number, driver, or location..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearch}>âœ•</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[styles.filterTab, filterMode === 'all' && styles.filterTabActive]}
            onPress={() => setFilterMode('all')}
          >
            <Text
              style={[
                styles.filterTabText,
                filterMode === 'all' && styles.filterTabTextActive,
              ]}
            >
              All ({buses.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, filterMode === 'filled' && styles.filterTabActive]}
            onPress={() => setFilterMode('filled')}
          >
            <Text
              style={[
                styles.filterTabText,
                filterMode === 'filled' && styles.filterTabTextActive,
              ]}
            >
              On File ({totalFilled})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, filterMode === 'empty' && styles.filterTabActive]}
            onPress={() => setFilterMode('empty')}
          >
            <Text
              style={[
                styles.filterTabText,
                filterMode === 'empty' && styles.filterTabTextActive,
              ]}
            >
              Needs Info ({buses.length - totalFilled})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bus Grid */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FFC93C" />
          <Text style={styles.loadingText}>Loading Campus Bus Directory...</Text>
        </View>
      ) : (
        <FlatList
          key={numColumns}
          data={filteredBuses}
          keyExtractor={(item) => String(item.number)}
          numColumns={numColumns}
          contentContainerStyle={styles.gridContainer}
          renderItem={renderTile}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFC93C" />
          }
          ListEmptyComponent={
            <View style={styles.emptyListContainer}>
              <Text style={styles.emptyListTitle}>No buses found</Text>
              <Text style={styles.emptyListSub}>
                Try searching for a different bus number or location.
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Add Bus Button - ONLY FOR ADMIN */}
      {session.role === 'admin' && (
        <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={handleOpenAdd}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      {/* View/Edit/Add Bus Modal */}
      <BusModal
        visible={modalVisible}
        bus={selectedBus}
        mode={modalMode}
        userRole={session.role}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveBus}
        onDelete={handleDeleteBus}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F3EC',
  },
  header: {
    backgroundColor: '#182645',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 4,
    borderBottomColor: '#FFC93C',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  collegeName: {
    color: '#B9C2DC',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  amberText: {
    color: '#FFC93C',
  },
  logoutBtn: {
    backgroundColor: 'rgba(255, 201, 60, 0.15)',
    borderWidth: 1,
    borderColor: '#FFC93C',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutBtnText: {
    color: '#FFC93C',
    fontSize: 12,
    fontWeight: '700',
  },
  sessionBar: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  sessionBarText: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  boldAmber: {
    color: '#FFC93C',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statsText: {
    color: '#E2E8F0',
    fontSize: 12,
  },
  boldText: {
    fontWeight: '700',
    color: '#FFC93C',
  },
  controlPanel: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },
  clearSearch: {
    fontSize: 16,
    color: '#94A3B8',
    padding: 4,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#182645',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterTabTextActive: {
    color: '#FFC93C',
  },
  gridContainer: {
    paddingHorizontal: 10,
    paddingBottom: 80,
    gap: 10,
  },
  tileWrapper: {
    flex: 1,
    margin: 5,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E1DCCF',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#182645',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  tileImgStyle: {
    borderRadius: 12,
  },
  tileOverlay: {
    flex: 1,
    backgroundColor: 'rgba(24, 38, 69, 0.45)',
    padding: 8,
    justifyContent: 'space-between',
  },
  tileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(24, 38, 69, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  tileRouteSnippet: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 'auto',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F6F3EC',
  },
  loadingText: {
    color: '#182645',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyListContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyListTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#182645',
  },
  emptyListSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#182645',
    borderWidth: 2,
    borderColor: '#FFC93C',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  fabText: {
    color: '#FFC93C',
    fontSize: 32,
    fontWeight: '400',
    lineHeight: 34,
  },
});

