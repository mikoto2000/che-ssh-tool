# che-ssh-tool

Eclipse Che の SSH 鍵を管理するツール。

主に mikoto2000/che-editor-vim: Eclipse Che Vim editor plugin. での使用を想定して実装中。


## Usage:

### キーペア生成

```sh
che-ssh-tool generate KEY_NAME
```

### キーペア削除

```sh
che-ssh-tool delete KEY_NAME
```

### キー一覧表示

```sh
che-ssh-tool list
```

### キー情報表示

```sh
che-ssh-tool show KEY_NAME
```
