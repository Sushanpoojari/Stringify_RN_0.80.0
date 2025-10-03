import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import colors from '../../../constants/colors';

const Tags = ({ tags }) => {
  const [showAll, setShowAll] = useState(false);

  // Limit tags to 4 unless "showAll" is true
  const displayedTags = showAll ? tags : tags.slice(0, 4);

  return (
    <View>
      <View style={styles.tagsContainer}>
        {displayedTags.map((item, index) => (
          <View
            key={index}
            style={styles.tag}
          >
            <Text style={styles.tagText}>
              {String(item).charAt(0).toUpperCase() + String(item).slice(1)}
            </Text>
          </View>
        ))}
      </View>

      {/* Show More / Show Less button */}
      {tags.length > 4 && (
        <TouchableOpacity
          onPress={() => setShowAll(!showAll)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {showAll ? 'Show less' : 'Show more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(Tags);

const styles = StyleSheet.create({
  tagsContainer: {
    flexDirection: 'row',
    flexWrap:'wrap',
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#e3f6ffff',
    padding: 5,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    color: colors.PRIMARY,
    marginRight: 5,
  },
  button: {
    marginTop: 5,
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.PRIMARY,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
});
