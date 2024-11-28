// 设置confirm组件
function setConfirmModal(modalInstance, modal) {
  const defaultPrefixCls = "mapgis-ui-modal";
  const btnDefaultPrefixCls = "mapgis-ui-btn";

  const typeCallback = modalInstance["confirm"];
  modal["confirm"] = function(config) {
    const { props: okButtonProps = {} } = config.okButtonProps || {};
    const { props: cancelButtonProps = {} } = config.cancelButtonProps || {};
    return typeCallback({
      ...config,
      prefixCls: config.prefixCls || defaultPrefixCls,
      okButtonProps: {
        ...config.okButtonProps,
        props: {
          ...okButtonProps,
          prefixCls: okButtonProps.prefixCls || btnDefaultPrefixCls
        }
      },
      cancelButtonProps: {
        ...config.cancelButtonProps,
        props: {
          ...cancelButtonProps,
          prefixCls: cancelButtonProps.prefixCls || btnDefaultPrefixCls
        }
      }
    });
  };
  return modal["confirm"];
}

// 设置message组件
function setMessage(messageInstance) {
  const defaultPrefixCls = "mapgis-ui-message";
  const configCallback = messageInstance.config;
  configCallback({ prefixCls: defaultPrefixCls });
  messageInstance.config = function(options) {
    if (options.prefixCls && options.prefixCls !== defaultPrefixCls) {
      messageInstance.destroy();
    }
    configCallback({
      ...options,
      prefixCls: options.prefixCls || defaultPrefixCls
    });
  };
  return messageInstance;
}

export { setConfirmModal, setMessage };
