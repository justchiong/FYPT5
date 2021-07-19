// +build amd64 arm64 arm64be ppc64 ppc64le mips64 mips64le s390x sparc64
// +build gc
// +build go1.4

package main

import (
	"strconv"
)

func testIntSink64() {
	{
		parsed, err := strconv.ParseInt("3456", 10, 64)
		if err != nil {
			panic(err)
		}
		_ = int(parsed)  // OK
		_ = uint(parsed) // OK
	}
	{
		parsed, err := strconv.ParseUint("3456", 10, 64)
		if err != nil {
			panic(err)
		}
		_ = int(parsed)  // OK
		_ = uint(parsed) // OK
	}
}
