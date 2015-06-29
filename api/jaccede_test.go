/**
 * Copyright 2015 Etienne Membrives <etienne@membrives.fr>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

package api

import (
	"net/url"
	"testing"
	"time"
)

func TestHMAC(t *testing.T) {
	var client JaccedeClient = NewClient()
	url, err := url.Parse("http://api.jaccede.com/v3/places/search/?offset=0&limit=30&longitude=2.0803939&latitude=48.7176771&distance=20&cat_id=27&lang=fr")
	if err != nil {
		panic(err)
	}
	header := client.computeHeader(url, time.Unix(1357990992162, 0))
	if header.Get("x-jaccedeapi-timestamp") != "1357990992162" {
		t.Errorf("x-jaccedeapi-timestamp is %q.",
			header.Get("x-jaccedeapi-timestamp"))
	}

	if header.Get("Authorization") != "JACCEDEAPI 84e36cfa-cdcc-11e4-b5a3-fefdb24f8291:Y2VhYzVhMzg4YzE3NjVkYjNhYzhlNGQzODRjZWJjN2ViYzNjZTM4YQ==" {
		t.Errorf("Authorization is %q.",
			header.Get("Authorization"))
	}
}
