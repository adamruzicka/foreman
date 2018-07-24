import React from 'react';
import PropTypes from 'prop-types';

import AIX from './icons/AIX.png';
import Altlinux from './icons/Altlinux.png';
import Archlinux from './icons/Archlinux.png';
import Centos from './icons/Centos.png';
import CoreOS from './icons/CoreOS.png';
import Darwin from './icons/Darwin.png';
import Debian from './icons/Debian.png';
import Fedora from './icons/Fedora.png';
import FreeBSD from './icons/FreeBSD.png';
import Gentoo from './icons/Gentoo.png';
import Junos from './icons/Junos.png';
import NXOS from './icons/NXOS.png';
import OracleLinux from './icons/OracleLinux.png';
import Puppet from './icons/Puppet.png';
import RancherOS from './icons/RancherOS.png';
import Redhat from './icons/Redhat.png';
import Scientific from './icons/Scientific.png';
import SLC from './icons/SLC.png';
import Solaris from './icons/Solaris.png';
import Suse from './icons/Suse.png';
import Ubuntu from './icons/Ubuntu.png';
import Windows from './icons/Windows.png';
import XenServer from './icons/XenServer.png';

const mapping = {
  'aix': AIX,
  'altlinux': Altlinux,
  'archlinux': Archlinux,
  'centos': Centos,
  'CoreOS|ContainerLinux|Container Linux': CoreOS,
  'darwin': Darwin,
  'fedora': Fedora,
  'FreeBSD': FreeBSD,
  'gentoo': Gentoo,
  'Junos': Junos,
  'NXOS': NXOS,
  'OracleLinux': OracleLinux,
  'RancherOS': RancherOS,
  'scientific': Scientific,
  'SLC': SLC,
  'solaris|sunos': Solaris,
  'ubuntu': Ubuntu,
  'XenServer': XenServer,
};

const findOsIcon = (name, family, size) => {
  for (var re in mapping) {
    if (name.match(new RegExp(re, 'i'))) {
      return <img src={mapping[re]} alt={family} size={size} />
    }
  }
  return emptyIcon(family);
};

const emptyIcon = (family) => {
  return family == null ? <div/> : <div>{ family }</div>;
}

const OsIcon = ({ name, family, size }) => {
  if (name == null) {
    return emptyIcon(family);
  } else {
    return findOsIcon(name, family, size);
  }
};

OsIcon.propTypes = {
  name: PropTypes.string,
  family: PropTypes.string,
  size: PropTypes.string,
}

export default OsIcon;
