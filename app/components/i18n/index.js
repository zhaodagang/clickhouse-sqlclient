/* International configuration */
export default {
  en: {
    query: {
      launch: 'launch',
      db_setting: {
        btn_set: 'Database Settings',
        popup_win: {
          title: 'Database configuration',
          http: 'Host:Port',
          user: 'User',
          pass: 'Pass',
          cancel_btn: 'Cancel',
          ok_btn: 'Ok'
        },
        notice_success: {
          message: 'Yeah!',
          description: 'Your are connected to the best of database in the world, reload in 3, 2, 1...'
        },
        notice_error: {
          message: 'Oh god...',
          description: 'Connection refused, try again.'
        },
        notification: {
          data: {
            message: 'Wow!',
            description: {
              elapsed: 'Elapsed',
              read: 'and read',
              row: 'rows with'
            }
          },
          nodata: {
            message: 'Nice!',
            description: 'Your command running ok.'
          }

        },
        key_shortcut: {
          name: 'Keyboard Shortcuts',
          query: 'Launch query'
        },
        database: {
          name: 'Databases',
          notification: {
            error: {
              message: 'Ops...',
              description: 'Check your database!'
            },
            success: {
              message: 'Refreshed!'
            }

          }
        }

      },
      tab_panel: {
        table: 'Table View',
        json: 'JSON Result',
        chart: 'chart review',
        sequence: 'chart sequence'
      },
      modal: {
        btn_ok: 'ok',
        btn_cancel: 'cancel'
      }

    }
  },
  zh: {
    query: {
      launch: '运行',
      db_setting: {
        btn_set: '数据库配置',
        popup_win: {
          title: '数据库配置',
          http: '主机:接口',
          user: '用户',
          pass: '密码',
          cancel_btn: '取消',
          ok_btn: '确定'
        },
        notice_success: {
          message: '正确!',
          description: '你的连接到世界上最好的数据库,重新加载3 2 1...'
        },
        notice_error: {
          message: '错误',
          description: '连接拒绝,再试一次.'
        },
        notification: {
          data: {
            message: '哇!',
            description: {
              elapsed: '消耗',
              read: '且读',
              row: '行用'
            }
          },
          nodata: {
            message: '好!',
            description: '命令运行正常.'
          }
        },
        key_shortcut: {
          name: '快捷键',
          query: '运行查询'
        },
        database: {
          name: '数据库',
          notification: {
            error: {
              message: '错误...',
              description: '检查你的数据库!'
            },
            success: {
              message: '恢复!'
            }

          }
        }
      },
      tab_panel: {
        table: '表格',
        json: 'JSON结果',
        chart: '趋势图',
        sequence: '时序图'
      },
      modal: {
        btn_ok: '确定',
        btn_cancel: '取消'
      }
    }
  }
};
