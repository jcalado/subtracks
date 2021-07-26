import { ListableItem } from '@app/models/music'
import { currentTrackAtom } from '@app/state/trackplayer'
import colors from '@app/styles/colors'
import font from '@app/styles/font'
import { useNavigation } from '@react-navigation/native'
import { useAtomValue } from 'jotai/utils'
import React, { useState } from 'react'
import { GestureResponderEvent, StyleSheet, Text, View } from 'react-native'
import IconFA from 'react-native-vector-icons/FontAwesome'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import IconMat from 'react-native-vector-icons/MaterialIcons'
import CoverArt from './CoverArt'
import PressableOpacity from './PressableOpacity'

const TitleTextSong = React.memo<{
  id: string
  title?: string
}>(({ id, title }) => {
  const currentTrack = useAtomValue(currentTrackAtom)
  const playing = currentTrack?.id === id

  return (
    <View style={styles.textLine}>
      {playing ? <IconFA5 name="play" size={10} color={colors.accent} style={styles.playingIcon} /> : <></>}
      <Text style={[styles.title, { color: playing ? colors.accent : colors.text.primary }]}>{title}</Text>
    </View>
  )
})

const TitleText = React.memo<{
  title?: string
}>(({ title }) => {
  return (
    <View style={styles.textLine}>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
})

const ListItem: React.FC<{
  item: ListableItem
  onPress?: (event: GestureResponderEvent) => void
  showArt?: boolean
  showStar?: boolean
  listStyle?: 'big' | 'small'
  subtitle?: string
}> = ({ item, onPress, showArt, showStar, subtitle, listStyle }) => {
  const [starred, setStarred] = useState(false)
  const navigation = useNavigation()

  showStar = showStar === undefined ? true : showStar
  listStyle = listStyle || 'small'

  const artSource = item.itemType === 'artist' ? { artistId: item.id } : { coverArt: item.coverArt }
  const sizeStyle = listStyle === 'big' ? bigStyles : smallStyles

  if (!onPress) {
    switch (item.itemType) {
      case 'album':
        onPress = () => navigation.navigate('AlbumView', { id: item.id, title: item.name })
        break
      case 'artist':
        onPress = () => navigation.navigate('ArtistView', { id: item.id, title: item.name })
        break
      case 'playlist':
        onPress = () => navigation.navigate('PlaylistView', { id: item.id, title: item.name })
        break
    }
  }

  if (!subtitle) {
    switch (item.itemType) {
      case 'song':
      case 'album':
        subtitle = item.artist
        break
      case 'playlist':
        subtitle = item.comment
        break
    }
  }

  return (
    <View style={[styles.container, sizeStyle.container]}>
      <PressableOpacity onPress={onPress} style={styles.item}>
        {showArt ? <CoverArt {...artSource} style={{ ...styles.art, ...sizeStyle.art }} resizeMode="cover" /> : <></>}
        <View style={styles.text}>
          {item.itemType === 'song' ? (
            <TitleTextSong id={item.id} title={item.title} />
          ) : (
            <TitleText title={item.name} />
          )}
          {subtitle ? (
            <View style={styles.textLine}>
              {starred ? (
                <IconMat
                  name="file-download-done"
                  size={17}
                  color={colors.text.secondary}
                  style={styles.downloadedIcon}
                />
              ) : (
                <></>
              )}
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
          ) : (
            <></>
          )}
        </View>
      </PressableOpacity>
      <View style={styles.controls}>
        {showStar ? (
          <PressableOpacity onPress={() => setStarred(!starred)} style={styles.controlItem}>
            {starred ? (
              <IconFA name="star" size={26} color={colors.accent} />
            ) : (
              <IconFA name="star-o" size={26} color={colors.text.secondary} />
            )}
          </PressableOpacity>
        ) : (
          <></>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  art: {
    marginRight: 10,
  },
  text: {
    flex: 1,
  },
  textLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontFamily: font.semiBold,
    color: colors.text.primary,
  },
  playingIcon: {
    marginRight: 5,
    marginLeft: 1,
  },
  downloadedIcon: {
    marginRight: 2,
    marginLeft: -3,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: font.regular,
    color: colors.text.secondary,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlItem: {
    marginLeft: 16,
  },
})

const smallStyles = StyleSheet.create({
  container: {
    minHeight: 50,
  },
  art: {
    height: 50,
    width: 50,
  },
})

const bigStyles = StyleSheet.create({
  container: {
    minHeight: 70,
  },
  art: {
    height: 70,
    width: 70,
  },
})

export default React.memo(ListItem)