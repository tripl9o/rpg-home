import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Shield, Sword, Star } from 'lucide-react-native';

interface CharacterAvatarProps {
  level: number;
  className: string;
  rank: string;
  attributes: {
    strength: number;
    endurance: number;
    agility: number;
    discipline: number;
  };
  onPress?: () => void;
}

export default function CharacterAvatar({
  level,
  className,
  rank,
  attributes,
  onPress,
}: CharacterAvatarProps) {
  const getClassIcon = (className: string) => {
    switch (className.toLowerCase()) {
      case 'fitness paladin':
        return Shield;
      case 'strength warrior':
        return Sword;
      case 'endurance runner':
        return Star;
      default:
        return Shield;
    }
  };

  const getClassColor = (className: string) => {
    switch (className.toLowerCase()) {
      case 'fitness paladin':
        return ['#6B46C1', '#8B5CF6'];
      case 'strength warrior':
        return ['#EF4444', '#F87171'];
      case 'endurance runner':
        return ['#10B981', '#34D399'];
      default:
        return ['#6B46C1', '#8B5CF6'];
    }
  };

  const getRankIcon = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'champion':
      case 'master':
        return Crown;
      default:
        return null;
    }
  };

  const ClassIcon = getClassIcon(className);
  const RankIcon = getRankIcon(rank);
  const classColors = getClassColor(className);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <LinearGradient
        colors={classColors}
        style={styles.avatarContainer}
      >
        {/* Character Icon */}
        <View style={styles.characterIcon}>
          <ClassIcon size={32} color="white" />
        </View>

        {/* Level Badge */}
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{level}</Text>
        </View>

        {/* Rank Icon */}
        {RankIcon && (
          <View style={styles.rankIcon}>
            <RankIcon size={16} color="#F59E0B" />
          </View>
        )}
      </LinearGradient>

      {/* Character Info */}
      <View style={styles.characterInfo}>
        <Text style={styles.className}>{className}</Text>
        <Text style={styles.rank}>{rank}</Text>
        
        {/* Attribute Bars */}
        <View style={styles.attributesContainer}>
          {Object.entries(attributes).map(([attr, value]) => (
            <View key={attr} style={styles.attributeRow}>
              <Text style={styles.attributeLabel}>
                {attr.charAt(0).toUpperCase()}
              </Text>
              <View style={styles.attributeBar}>
                <View 
                  style={[
                    styles.attributeFill, 
                    { 
                      width: `${value}%`,
                      backgroundColor: getAttributeColor(attr)
                    }
                  ]} 
                />
              </View>
              <Text style={styles.attributeValue}>{value}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const getAttributeColor = (attribute: string) => {
  switch (attribute) {
    case 'strength':
      return '#EF4444';
    case 'endurance':
      return '#10B981';
    case 'agility':
      return '#3B82F6';
    case 'discipline':
      return '#8B5CF6';
    default:
      return '#6B7280';
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 16,
  },
  characterIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rankIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterInfo: {
    flex: 1,
  },
  className: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  rank: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  attributesContainer: {
    gap: 6,
  },
  attributeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attributeLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    width: 16,
  },
  attributeBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    marginHorizontal: 8,
  },
  attributeFill: {
    height: '100%',
    borderRadius: 2,
  },
  attributeValue: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    width: 24,
    textAlign: 'right',
  },
});